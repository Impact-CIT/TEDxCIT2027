import { connectDB } from '../config/db.js';
import AnonymousVoice from '../models/AnonymousVoice.js';
import store from '../models/store.js';
import SPEAK_CONFIG from '../config/speakConfig.js';
import { sanitizeInput, hashClientIp, EMAIL_REGEX, PHONE_REGEX } from '../utils/security.js';

export async function submitAnonymousVoice(req, res, next) {
  try {
    // 1. Bot Honeypot Check (hidden field in frontend)
    if (req.body.website_url_hp || req.body._hp) {
      console.warn('[AnonymousVoice] Honeypot triggered. Silently rejecting bot.');
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your submission has been received.',
      });
    }

    // 2. Check Registration Deadline
    const deadline = new Date(SPEAK_CONFIG.anonymousVoicesDeadline);
    const now = new Date();
    if (now > deadline) {
      return res.status(403).json({
        success: false,
        error: 'REGISTRATIONS_CLOSED',
        message: `Registrations for Anonymous Voices closed on ${SPEAK_CONFIG.anonymousVoicesDeadlineFormatted}.`,
      });
    }

    // 3. Extract and Sanitize Fields
    const email = sanitizeInput(req.body.email)?.toLowerCase();
    const fullName = sanitizeInput(req.body.fullName);
    const contactNumber = sanitizeInput(req.body.contactNumber);
    const communicationEmail = sanitizeInput(req.body.communicationEmail)?.toLowerCase();
    const socialLinks = sanitizeInput(req.body.socialLinks);
    const institution = sanitizeInput(req.body.institution);
    const graduationYear = sanitizeInput(req.body.graduationYear);
    const department = sanitizeInput(req.body.department);
    const section = sanitizeInput(req.body.section);

    const talkTitle = sanitizeInput(req.body.talkTitle);
    const coreMessage = sanitizeInput(req.body.coreMessage);
    const uniquePerspective = sanitizeInput(req.body.uniquePerspective);
    const visionBridge = sanitizeInput(req.body.visionBridge);
    const themeRelevance = sanitizeInput(req.body.themeRelevance);
    const criticismResponse = sanitizeInput(req.body.criticismResponse);
    const talkStructure = sanitizeInput(req.body.talkStructure);

    // 4. Validate Submitter Fields
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid email address is required.',
      });
    }

    if (!fullName) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Full Name is required.',
      });
    }

    if (!contactNumber || !PHONE_REGEX.test(contactNumber.replace(/[\s-]/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid 10-digit Indian contact number is required.',
      });
    }

    if (!communicationEmail || !EMAIL_REGEX.test(communicationEmail)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid communication email is required.',
      });
    }

    if (!socialLinks) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'LinkedIn and social media profile links are required.',
      });
    }

    if (!SPEAK_CONFIG.institutions.includes(institution)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Institution must be Chennai Institute of Technology or CITAR.',
      });
    }

    if (!SPEAK_CONFIG.graduationYears.includes(graduationYear)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Please select a valid graduation year (2027, 2028, 2029, 2030).',
      });
    }

    if (!SPEAK_CONFIG.departments.includes(department)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Please select a valid department from the CIT list.',
      });
    }

    if (!section) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Section is required.',
      });
    }

    // 5. Validate Talk Fields
    if (!talkTitle) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Title of your talk is required.',
      });
    }

    if (!coreMessage) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Core message description is required.',
      });
    }

    if (!uniquePerspective) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Unique personal perspective description is required.',
      });
    }

    if (!visionBridge) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Vision bridging description is required.',
      });
    }

    if (!themeRelevance) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Relevance to "The Untapped" theme description is required.',
      });
    }

    if (!criticismResponse) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Criticism response description is required.',
      });
    }

    if (!talkStructure) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Talk structure description is required.',
      });
    }

    // 6. Handle Recorded Speech (File Upload or Shareable Link)
    let recordedSpeechType = 'link';
    let recordedSpeechUrl = sanitizeInput(req.body.recordedSpeechUrl);
    let recordedSpeechMeta = {
      originalName: null,
      size: null,
      mimeType: null,
    };

    if (req.file) {
      recordedSpeechType = 'upload';
      recordedSpeechUrl = `/uploads/${req.file.filename}`;
      recordedSpeechMeta = {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      };
    } else if (!recordedSpeechUrl) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Please provide either a shareable link (Drive/YouTube) or upload a 3-5 minute video file.',
      });
    }

    // 7. Ensure DB connection & check for duplicate submission by email
    const dbConn = await connectDB().catch(() => null);

    const submissionData = {
      email,
      fullName,
      contactNumber,
      communicationEmail,
      socialLinks,
      institution,
      graduationYear,
      department,
      section,
      talkTitle,
      coreMessage,
      uniquePerspective,
      visionBridge,
      themeRelevance,
      criticismResponse,
      talkStructure,
      recordedSpeechType,
      recordedSpeechUrl,
      recordedSpeechMeta,
      status: 'submitted',
      submissionMeta: {
        ipHash: hashClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
      },
    };

    if (dbConn) {
      // Check duplicate submission
      const existing = await AnonymousVoice.findOne({ email }).lean();
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'ALREADY_SUBMITTED',
          message: 'A submission has already been received from this email address. Each student may only apply once.',
        });
      }

      const created = await AnonymousVoice.create(submissionData);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your submission for Anonymous Voices has been received.',
        data: {
          id: created._id,
          fullName: created.fullName,
          email: created.email,
          talkTitle: created.talkTitle,
          createdAt: created.createdAt,
        },
      });
    } else {
      // In-Memory Fallback
      const existing = store.findAnonymousVoiceByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'ALREADY_SUBMITTED',
          message: 'A submission has already been received from this email address. Each student may only apply once.',
        });
      }

      const created = store.addAnonymousVoice(submissionData);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your submission for Anonymous Voices has been received.',
        data: {
          id: created._id,
          fullName: created.fullName,
          email: created.email,
          talkTitle: created.talkTitle,
          createdAt: created.createdAt,
        },
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'ALREADY_SUBMITTED',
        message: 'A submission has already been received from this email address. Each student may only apply once.',
      });
    }
    next(err);
  }
}

export default {
  submitAnonymousVoice,
};

