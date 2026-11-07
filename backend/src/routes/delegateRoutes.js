import express from 'express';
import {
  getPasses,
  registerDelegate,
  verifyPayment,
  getRegistrationStatus,
  listAllDelegates,
} from '../controllers/delegateRegistrationController.js';

const router = express.Router();

// Get list of passes & test pricing (Student ₹100, Professional ₹200)
router.get('/passes', getPasses);

// Create registration & initiate Razorpay order
router.post('/register', registerDelegate);

// Verify Razorpay payment signature & confirm pass
router.post('/verify-payment', verifyPayment);

// Get registration details by ID or Order ID
router.get('/registration/:id', getRegistrationStatus);

// Admin: view all registered delegates
router.get('/all', listAllDelegates);

export default router;

