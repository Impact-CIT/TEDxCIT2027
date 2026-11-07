import express from 'express';
import { submitAnonymousVoice } from '../controllers/anonymousVoiceController.js';
import { submitSpeakerNomination } from '../controllers/speakerNominationController.js';
import {
  requireAdminAuth,
  getAdminSubmissions,
  updateSubmissionStatus,
} from '../controllers/adminController.js';
import { submissionRateLimiter } from '../middleware/rateLimiter.js';
import SPEAK_CONFIG from '../config/speakConfig.js';
import { formatRegistrationDeadline, getRegistrationDeadlines, saveRegistrationDeadlines } from '../services/registrationDeadlines.js';

const router = express.Router();

/**
 * GET /api/speak/config
 * Returns public configuration (deadlines, theme, department lists, etc.)
 */
router.get('/speak/config', async (req, res, next) => {
  try {
    const deadlines = await getRegistrationDeadlines();
    const now = new Date();
    res.status(200).json({
      success: true,
      data: {
        theme: SPEAK_CONFIG.theme,
        eventDate: SPEAK_CONFIG.eventDate,
        anonymousVoicesDeadline: deadlines.anonymousVoicesDeadline,
        anonymousVoicesDeadlineFormatted: formatRegistrationDeadline(deadlines.anonymousVoicesDeadline),
        isAnonymousVoicesOpen: now <= new Date(deadlines.anonymousVoicesDeadline),
        speakerNominationDeadline: deadlines.speakerNominationDeadline,
        speakerNominationDeadlineFormatted: formatRegistrationDeadline(deadlines.speakerNominationDeadline),
        isSpeakerNominationOpen: !deadlines.speakerNominationDeadline
          || now <= new Date(deadlines.speakerNominationDeadline),
        institutions: SPEAK_CONFIG.institutions,
        graduationYears: SPEAK_CONFIG.graduationYears,
        departments: SPEAK_CONFIG.departments,
        contacts: SPEAK_CONFIG.contacts,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/anonymous-voices
 * Rate limited, requires a shareable video link
 */
router.post('/anonymous-voices', submissionRateLimiter, submitAnonymousVoice);

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
router.patch('/admin/deadlines', requireAdminAuth, async (req, res, next) => {
  try {
    const deadlines = await saveRegistrationDeadlines(req.body);
    res.status(200).json({ success: true, data: deadlines });
  } catch (err) {
    if (err instanceof Error && err.message.includes('must be a valid date')) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: err.message,
      });
    }
    next(err);
  }
});

export default router;
