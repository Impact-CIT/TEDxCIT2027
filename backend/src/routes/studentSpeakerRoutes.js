import express from 'express';
import { applyStudentSpeaker, listStudentSpeakerApplications } from '../controllers/studentSpeakerRegistrationController.js';

const router = express.Router();

router.post('/apply', applyStudentSpeaker);
router.get('/applications', listStudentSpeakerApplications);

export default router;

