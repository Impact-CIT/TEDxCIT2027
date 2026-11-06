import express from 'express';
import { applySpeaker, listSpeakerApplications } from '../controllers/speakerRegistrationController.js';

const router = express.Router();

router.post('/apply', applySpeaker);
router.get('/applications', listSpeakerApplications);

export default router;

