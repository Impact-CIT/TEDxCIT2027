import 'dotenv/config';
import crypto from 'crypto';
import razorpayService from '../services/razorpayService.js';
import store from '../models/store.js';
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
      key_id: razorpayService.keyId,
      keyId: razorpayService.keyId,
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

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id,
      payment_id,
      ...(registration && { registrationId: registration.id, status: 'PAID' }),
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
