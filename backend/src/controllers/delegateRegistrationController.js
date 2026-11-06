import { getPassById, getAvailablePasses } from '../config/pricing.js';
import store from '../models/store.js';
import razorpayService from '../services/razorpayService.js';

/**
 * Controller for Delegate Registration and Razorpay Payment Integration
 */

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Clean phone validation (at least 10 digits)
const PHONE_REGEX = /^[0-9+()\-\s]{10,15}$/;

/**
 * GET /api/delegates/passes
 * Return available delegate pass options with pricing & benefits
 */
export async function getPasses(req, res, next) {
  try {
    const passes = getAvailablePasses();
    return res.status(200).json({
      success: true,
      data: passes,
      meta: {
        currency: 'INR',
        note: 'Delegate passes for TEDxCIT 2027: UNTAPPED'
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/delegates/register
 * Initiates registration and creates Razorpay Order
 */
export async function registerDelegate(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      passType,
      institution,
      designation,
      city,
      rollNo
    } = req.body;

    // 1. Mandatory Fields Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Full Name is required',
      });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid Email address is required',
      });
    }

    if (!phone || !PHONE_REGEX.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid Contact Phone Number (at least 10 digits) is required',
      });
    }

    if (!passType) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Pass type is required. Choose either "student" or "professional"',
      });
    }

    // 2. Validate Pass Selection & Backend-enforced pricing
    const pass = getPassById(passType);
    if (!pass) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PASS_TYPE',
        message: `Invalid pass type: "${passType}". Valid options are: "student", "professional"`,
      });
    }

    // 3. Generate Receipt identifier
    const receipt = `rcpt_${pass.id}_${Date.now()}`;

    // 4. Create Razorpay Order with backend-calculated amount (Paise)
    const order = await razorpayService.createOrder({
      amountInPaise: pass.amountInPaise,
      currency: pass.currency,
      receipt,
      notes: {
        attendeeName: name.trim(),
        attendeeEmail: email.trim().toLowerCase(),
        passCategory: pass.category,
        passName: pass.name,
        institution: institution?.trim() || 'N/A',
      },
    });

    // 5. Store pending registration in database
    const registration = store.createRegistration({
      name,
      email,
      phone,
      passType: pass.id,
      passName: pass.name,
      institution,
      designation,
      city,
      rollNo,
      amount: pass.price,
      amountInPaise: pass.amountInPaise,
      currency: pass.currency,
      receipt,
      orderId: order.orderId,
    });

    // 6. Return Razorpay checkout payload for frontend
    return res.status(201).json({
      success: true,
      message: 'Registration initiated successfully. Proceed to Razorpay checkout.',
      data: {
        registrationId: registration.id,
        orderId: order.orderId,
        amount: order.amount, // in paise (e.g. 10000 for ₹100, 20000 for ₹200)
        amountInRupees: pass.price,
        currency: order.currency,
        keyId: order.keyId,
        isMock: order.isMock,
        pass: {
          id: pass.id,
          name: pass.name,
          category: pass.category,
          price: pass.price,
        },
        prefill: {
          name: registration.name,
          email: registration.email,
          contact: registration.phone,
        },
        theme: {
          color: '#FF2B25', // TED Crimson Red
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/delegates/verify-payment
 * Cryptographically verifies Razorpay payment signature and confirms registration
 */
export async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
    } = req.body;

    const orderId = razorpay_order_id || req.body.orderId;
    const paymentId = razorpay_payment_id || req.body.paymentId;
    const signature = razorpay_signature || req.body.signature;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PAYMENT_FIELDS',
        message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required for verification',
      });
    }

    // 1. Verify cryptographic signature
    const verification = razorpayService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!verification.isValid) {
      store.markPaymentFailed(orderId, {
        reason: verification.reason || 'Cryptographic signature mismatch',
        paymentId,
      });

      return res.status(400).json({
        success: false,
        error: 'PAYMENT_VERIFICATION_FAILED',
        message: 'Payment verification failed: Signature authenticity check failed.',
        details: verification.reason,
      });
    }

    // 2. Mark registration as PAID
    const registration = store.markPaymentSuccess(orderId, {
      paymentId,
      signature,
      paymentMethod: 'RAZORPAY',
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'REGISTRATION_NOT_FOUND',
        message: `No registration found associated with order ID: ${orderId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Your TEDxCIT 2027 Delegate Pass is confirmed.',
      data: {
        registrationId: registration.id,
        orderId: registration.orderId,
        paymentId: registration.paymentId,
        status: registration.status,
        passType: registration.passType,
        passName: registration.passName,
        attendee: {
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          institution: registration.institution,
        },
        amountPaid: registration.amount,
        currency: registration.currency,
        confirmedAt: registration.confirmedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/delegates/registration/:id
 * Retrieve registration and payment status
 */
export async function getRegistrationStatus(req, res, next) {
  try {
    const { id } = req.params;
    let registration = store.getRegistrationById(id);

    // If not found by registration ID, check if orderId was passed
    if (!registration) {
      registration = store.getRegistrationByOrderId(id);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Registration not found for identifier: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/delegates/all
 * Internal/admin listing of all registered delegates
 */
export async function listAllDelegates(req, res, next) {
  try {
    const all = store.getAllRegistrations();
    return res.status(200).json({
      success: true,
      total: all.length,
      data: all,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/webhook
 * Razorpay Webhook listener for background payment reconciliation
 */
export async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body);

    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.order?.entity?.id;

      if (orderId) {
        store.markPaymentSuccess(orderId, {
          paymentId: paymentEntity?.id,
          paymentMethod: paymentEntity?.method,
        });
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        store.markPaymentFailed(orderId, {
          reason: paymentEntity?.error_description || 'Payment failed',
          paymentId: paymentEntity?.id,
        });
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[Razorpay Webhook Error]:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
}

