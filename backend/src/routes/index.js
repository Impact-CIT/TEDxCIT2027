import express from 'express';
import speakFlowRoutes from './speakFlowRoutes.js';

const router = express.Router();

// Anonymous Voices, Speaker Nominations, registration settings, and admin review.
router.use('/', speakFlowRoutes);

export default router;

