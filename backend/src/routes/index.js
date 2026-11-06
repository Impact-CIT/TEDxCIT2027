import express from 'express';
import delegateRoutes from './delegateRoutes.js';
import speakerRoutes from './speakerRoutes.js';
import studentSpeakerRoutes from './studentSpeakerRoutes.js';
import {
  registerDelegate,
  verifyPayment,
  getPasses,
  handleWebhook,
} from '../controllers/delegateRegistrationController.js';

const router = express.Router();

// 1. Delegate & Registration Routes
router.use('/delegates', delegateRoutes);

// 2. Direct Payment Convenience Aliases (for easy frontend integration)
const paymentRouter = express.Router();
paymentRouter.get('/passes', getPasses);
paymentRouter.post('/create-order', registerDelegate);
paymentRouter.post('/verify-payment', verifyPayment);
paymentRouter.post('/webhook', handleWebhook);
router.use('/payment', paymentRouter);

// 3. Speaker Applications
router.use('/speakers', speakerRoutes);

// 4. Student Speaker Applications
router.use('/student-speakers', studentSpeakerRoutes);

export default router;

