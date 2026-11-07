import express from 'express';
import delegateRoutes from './delegateRoutes.js';
import speakerRoutes from './speakerRoutes.js';
import studentSpeakerRoutes from './studentSpeakerRoutes.js';
import {
  registerDelegate,
  getPasses,
  handleWebhook,
} from '../controllers/delegateRegistrationController.js';
import {
  createOrder,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

// 1. Direct Standard Razorpay Web Checkout Endpoints
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

// 2. Delegate & Registration Routes
router.use('/delegates', delegateRoutes);

// 3. Direct Payment Convenience Aliases (for easy frontend integration)
const paymentRouter = express.Router();
paymentRouter.get('/passes', getPasses);
paymentRouter.post('/create-order', createOrder);
paymentRouter.post('/verify-payment', verifyPayment);
paymentRouter.post('/webhook', handleWebhook);
router.use('/payment', paymentRouter);

// 3. Speaker Applications
router.use('/speakers', speakerRoutes);

// 4. Student Speaker Applications
router.use('/student-speakers', studentSpeakerRoutes);

export default router;

