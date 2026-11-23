import 'dotenv/config';
import crypto from 'crypto';
import razorpayService from '../services/razorpayService.js';
import { connectDB } from '../config/db.js';
import store from '../models/store.js';
import Delegate from '../models/Delegate.js';
import { getPassById } from '../config/pricing.js';

/**
 * Standard Razorpay Checkout Controller
 * Implements:
 * 1. POST /api/create-order
 * 2. POST /api/verify-payment
 */

/**
 * POST /api/create-order
 * Creates a Razorpay order
 * Request body: { amount (in paise, >= 100), currency, receipt, notes }
 * or { passType, ... }
 */
export async function createOrder(req, res) {
  try {
    let { amount, currency = 'INR', receipt, notes = {} } = req.body;

    // If amount is not provided directly, check if passType was supplied
    if (amount === undefined || amount === null) {
      if (req.body.passType) {
        const pass = getPassById(req.body.passType);
        if (pass) {
          amount = pass.amountInPaise;
          notes.passCategory = pass.category;
          notes.passName = pass.name;
        }
      }
    }

    // Validation: amount is required and must be at least 100 paise (1 INR)
    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Amount in paise is required and must be a valid number',
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_AMOUNT',
        message: 'Amount must be at least 100 paise (₹1.00)',
      });
    }

    // Default receipt generator if not provided
    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    // Call Razorpay Order Creation API
    const order = await razorpayService.createOrder({
      amountInPaise: Math.round(amount),
      currency: currency.toUpperCase(),
      receipt: orderReceipt,
      notes,
    });

    // Return standard Razorpay order payload
    const orderId = order.order_id || order.orderId;
    const responsePayload = {
      order_id: orderId,
      orderId: orderId,
      amount: order.amount,
      currency: order.currency,
      key_id: order.key_id || order.keyId || razorpayService.keyId,
      keyId: order.keyId || order.key_id || razorpayService.keyId,
      receipt: order.receipt,
    };

    return res.status(201).json({
      success: true,
      ...responsePayload,
      data: responsePayload,
    });
  } catch (err) {
    console.error('[PaymentController] createOrder Error:', err);

    // Auth error handling (401)
    if (err.statusCode === 401 || err.message?.toLowerCase().includes('authentication') || err.message?.toLowerCase().includes('auth')) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Razorpay API authentication failed. Check your API credentials.',
      });
    }

    // Validation error (400)
    if (err.statusCode === 400) {
      return res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: err.message,
      });
    }

    // Razorpay API or server error (500)
    return res.status(500).json({
      success: false,
      error: 'ORDER_CREATION_FAILED',
      message: err.message || 'Failed to create Razorpay order',
    });
  }
}

/**
 * POST /api/verify-payment
 * Cryptographically verifies Razorpay payment signature
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyPayment(req, res) {
  try {
    const order_id = req.body.razorpay_order_id || req.body.order_id || req.body.orderId;
    const payment_id = req.body.razorpay_payment_id || req.body.payment_id || req.body.paymentId;
    const signature = req.body.razorpay_signature || req.body.signature;

    // Validate presence of all three fields
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required',
      });
    }

    // Cryptographic HMAC-SHA256 verification
    const verification = razorpayService.verifyPaymentSignature({
      orderId: order_id,
      paymentId: payment_id,
      signature: signature,
    });

    if (!verification.isValid) {
      // Signature mismatch: do NOT mark as paid, return 400
      store.markPaymentFailed(order_id, {
        reason: 'Signature mismatch / authenticity check failed',
        paymentId: payment_id,
      });

      try {
        await connectDB();
        await Delegate.findOneAndUpdate(
          { orderId: order_id },
          { $set: { status: 'FAILED', paymentId: payment_id, updatedAt: new Date() } }
        );
      } catch (dbErr) {
        console.warn('[PaymentController] MongoDB fail update note:', dbErr.message);
      }

      return res.status(400).json({
        success: false,
        error: 'SIGNATURE_MISMATCH',
        message: 'Signature verification failed. The payment could not be authenticated.',
      });
    }

    // Signature matches: mark payment successful in store if order exists
    const registration = store.markPaymentSuccess(order_id, {
      paymentId: payment_id,
      signature: signature,
      paymentMethod: 'RAZORPAY_STANDARD',
    });

    let dbDelegate = null;
    try {
      await connectDB();

      const isStudent = (req.body.passType || registration?.passType) === 'student';
      const delegateDoc = {
        registrationId: req.body.registrationId || registration?.id || `REG-${Date.now().toString(36).toUpperCase()}`,
        passType: req.body.passType || registration?.passType || 'student',
        passName: req.body.passName || registration?.passName || (isStudent ? 'Student Delegate Pass' : 'Professional Delegate Pass'),
        name: (req.body.name || registration?.name || 'Delegate Attendee').trim(),
        email: (req.body.email || registration?.email || 'attendee@tedxcit.com').trim().toLowerCase(),
        phone: (req.body.phone || registration?.phone || '0000000000').trim(),
        linkedin: (req.body.linkedin || registration?.linkedin || null)?.trim() || null,
        attendedBefore: (req.body.attendedBefore || registration?.attendedBefore || 'No') === 'Yes' ? 'Yes' : 'No',
        heardAbout: (req.body.heardAbout || registration?.heardAbout || null)?.trim() || null,
        declaration: true,
        collegeName: isStudent ? (req.body.collegeName || registration?.collegeName || null)?.trim() || null : null,
        department: isStudent ? (req.body.department || registration?.department || null)?.trim() || null : null,
        yearOfStudy: isStudent ? (req.body.yearOfStudy || registration?.yearOfStudy || null)?.trim() || null : null,
        section: isStudent ? (req.body.section || registration?.section || null)?.trim() || null : null,
        organisationName: !isStudent ? (req.body.organisationName || registration?.organisationName || null)?.trim() || null : null,
        jobDesignation: !isStudent ? (req.body.jobDesignation || registration?.jobDesignation || null)?.trim() || null : null,
        industryDomain: !isStudent ? (req.body.industryDomain || registration?.industryDomain || null)?.trim() || null : null,
        experienceYears: !isStudent ? (req.body.experienceYears || registration?.experienceYears || null)?.trim() || null : null,
        amount: Number(req.body.amount || registration?.amount || (isStudent ? 100 : 200)),
        amountInPaise: Number(req.body.amountInPaise || registration?.amountInPaise || (isStudent ? 10000 : 20000)),
        currency: req.body.currency || registration?.currency || 'INR',
        receipt: req.body.receipt || registration?.receipt || `rcpt_${Date.now()}`,
        orderId: order_id,
        paymentId: payment_id,
        paymentSignature: signature,
        status: 'PAID',
        paymentMethod: 'RAZORPAY_STANDARD',
        updatedAt: new Date(),
      };

      dbDelegate = await Delegate.findOneAndUpdate(
        { orderId: order_id },
        { $set: delegateDoc, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );

      console.log('[PaymentController] Successfully saved PAID delegate to MongoDB Atlas:', dbDelegate.registrationId);
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'test') {
        console.warn('[PaymentController] Test DB note:', dbErr.message);
      } else {
        console.error('[PaymentController] CRITICAL MongoDB paid update error:', dbErr);
        throw dbErr;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id,
      payment_id,
      registrationId: dbDelegate?.registrationId || registration?.id,
      status: 'PAID',
    });
  } catch (err) {
    console.error('[PaymentController] verifyPayment Error:', err);
    return res.status(500).json({
      success: false,
      error: 'VERIFICATION_ERROR',
      message: err.message || 'An error occurred during payment verification',
    });
  }
}
