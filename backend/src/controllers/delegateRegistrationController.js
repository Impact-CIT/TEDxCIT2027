import { getPassById, getAvailablePasses } from '../config/pricing.js';
import store from '../models/store.js';
import razorpayService from '../services/razorpayService.js';

/**
 * Controller for Delegate Registration and Razorpay Payment Integration
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        note: 'Delegate passes for TEDxCIT 2027: UNTAPPED',
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/delegates/register
 * Initiates registration with strict pass-specific fields and creates Razorpay Order
 */
export async function registerDelegate(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      linkedin,
      passType,
      attendedBefore,
      heardAbout,
      declaration,

      // Student Delegate specific fields
      collegeName,
      department,
      yearOfStudy,
      section,

      // Professional Delegate specific fields
      organisationName,
      jobDesignation,
      industryDomain,
      experienceYears,
    } = req.body;

    // 1. Mandatory Common Fields Validation
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
        message: 'A valid Mobile Number (at least 10 digits) is required',
      });
    }

    if (!passType) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Pass type is required. Choose either "student" or "professional"',
      });
    }

    // 2. Declaration check
    if (!declaration || declaration === false || declaration === 'false') {
      return res.status(400).json({
        success: false,
        error: 'DECLARATION_REQUIRED',
        message: 'You must confirm the declaration: "I confirm that the information provided is accurate."',
      });
    }

    // 3. Validate Pass Selection
    const pass = getPassById(passType);
    if (!pass) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PASS_TYPE',
        message: `Invalid pass type: "${passType}". Valid options are: "student", "professional"`,
      });
    }

    // 4. Pass-Specific Field Validations
    if (pass.id === 'student') {
      if (!collegeName || !collegeName.trim()) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'College Name is required for Student Delegates',
        });
      }
      if (!department || !department.trim()) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Department is required for Student Delegates',
        });
      }
      if (!yearOfStudy || !yearOfStudy.trim()) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Year of Study is required for Student Delegates',
        });
      }
    } else if (pass.id === 'professional') {
      if (!organisationName || !organisationName.trim()) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Organisation Name is required for Professional Delegates',
        });
      }
      if (!jobDesignation || !jobDesignation.trim()) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Job Designation is required for Professional Delegates',
        });
      }
    }

    // 5. Generate Receipt identifier
    const receipt = `rcpt_${pass.id}_${Date.now()}`;

    // 6. Create Razorpay Order with backend-enforced price in paise
    const order = await razorpayService.createOrder({
      amountInPaise: pass.amountInPaise,
      currency: pass.currency,
      receipt,
      notes: {
        attendeeName: name.trim(),
        attendeeEmail: email.trim().toLowerCase(),
        passCategory: pass.category,
        passName: pass.name,
        institutionOrOrg: (pass.id === 'student' ? collegeName : organisationName) || 'N/A',
      },
    });

    // 7. Store delegate registration
    const registration = store.createRegistration({
      name,
      email,
      phone,
      linkedin,
      passType: pass.id,
      passName: pass.name,
      attendedBefore: attendedBefore || 'No',
      heardAbout,
      declaration: Boolean(declaration),

      // Student fields
      collegeName,
      department,
      yearOfStudy,
      section,

      // Professional fields
      organisationName,
      jobDesignation,
      industryDomain,
      experienceYears,

      amount: pass.price,
      amountInPaise: pass.amountInPaise,
      currency: pass.currency,
      receipt,
      orderId: order.orderId,
    });

    // 8. Return response
    return res.status(201).json({
      success: true,
      message: 'Registration initiated successfully. Proceed to Razorpay checkout.',
      data: {
        registrationId: registration.id,
        orderId: order.orderId,
        amount: order.amount, // in paise (10000 for student ₹100, 20000 for pro ₹200)
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
          color: '#FF2B25',
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
          linkedin: registration.linkedin,
          ...(registration.passType === 'student'
            ? {
                collegeName: registration.collegeName,
                department: registration.department,
                yearOfStudy: registration.yearOfStudy,
                section: registration.section,
              }
            : {
                organisationName: registration.organisationName,
                jobDesignation: registration.jobDesignation,
                industryDomain: registration.industryDomain,
                experienceYears: registration.experienceYears,
              }),
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
