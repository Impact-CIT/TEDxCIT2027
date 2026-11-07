import express from 'express';
import { submitAnonymousVoice } from '../controllers/anonymousVoiceController.js';
import { submitSpeakerNomination } from '../controllers/speakerNominationController.js';
import {
  requireAdminAuth,
  getAdminSubmissions,
  updateSubmissionStatus,
} from '../controllers/adminController.js';
import { videoUpload } from '../middleware/uploadMiddleware.js';
import { submissionRateLimiter } from '../middleware/rateLimiter.js';
import SPEAK_CONFIG from '../config/speakConfig.js';

const router = express.Router();

/**
 * GET /api/speak/config
 * Returns public configuration (deadlines, theme, department lists, etc.)
 */
router.get('/speak/config', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      theme: SPEAK_CONFIG.theme,
      eventDate: SPEAK_CONFIG.eventDate,
      anonymousVoicesDeadline: SPEAK_CONFIG.anonymousVoicesDeadline,
      anonymousVoicesDeadlineFormatted: SPEAK_CONFIG.anonymousVoicesDeadlineFormatted,
      isAnonymousVoicesOpen: new Date() <= new Date(SPEAK_CONFIG.anonymousVoicesDeadline),
      institutions: SPEAK_CONFIG.institutions,
      graduationYears: SPEAK_CONFIG.graduationYears,
      departments: SPEAK_CONFIG.departments,
      maxVideoSizeMB: SPEAK_CONFIG.maxVideoSizeMB,
      contacts: SPEAK_CONFIG.contacts,
    },
  });
});

/**
 * POST /api/anonymous-voices
 * Rate limited, with optional video file upload or shareable link
 */
router.post(
  '/anonymous-voices',
  submissionRateLimiter,
  videoUpload.single('videoFile'),
  submitAnonymousVoice
);

/**
 * POST /api/speaker-nominations
 * Rate limited, with self nomination or nominee details
 */
router.post('/speaker-nominations', submissionRateLimiter, submitSpeakerNomination);

/**
 * Admin Endpoints (Protected by Admin Secret / Password)
 */
router.get('/admin/submissions', requireAdminAuth, getAdminSubmissions);
router.patch('/admin/submissions/:type/:id/status', requireAdminAuth, updateSubmissionStatus);

export default router;
