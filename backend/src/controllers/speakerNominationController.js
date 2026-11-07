import { connectDB } from '../config/db.js';
import SpeakerNomination from '../models/SpeakerNomination.js';
import store from '../models/store.js';
import { formatRegistrationDeadline, getRegistrationDeadlines } from '../services/registrationDeadlines.js';
import { sanitizeInput, hashClientIp, EMAIL_REGEX, PHONE_REGEX } from '../utils/security.js';

export async function submitSpeakerNomination(req, res, next) {
  try {
    // 1. Honeypot check
    if (req.body.website_url_hp || req.body._hp) {
      console.warn('[SpeakerNomination] Honeypot triggered. Silently rejecting bot.');
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your nomination has been received.',
      });
    }

    const deadlines = await getRegistrationDeadlines();
    const deadline = deadlines.speakerNominationDeadline;
    if (deadline && new Date() > new Date(deadline)) {
      return res.status(403).json({
        success: false,
        error: 'REGISTRATIONS_CLOSED',
        message: `Speaker nominations closed on ${formatRegistrationDeadline(deadline)} IST.`,
      });
    }

    // 2. Extract Nominator Details
    const nominator = req.body.nominatorDetails || {};
    const email = sanitizeInput(nominator.email || req.body.email)?.toLowerCase();
    const fullName = sanitizeInput(nominator.fullName || req.body.fullName);
    const contactNumber = sanitizeInput(nominator.contactNumber || req.body.contactNumber);
    const communicationEmail = sanitizeInput(nominator.communicationEmail || req.body.communicationEmail)?.toLowerCase();
    const workStatus = sanitizeInput(nominator.workStatus || req.body.workStatus);
    const currentProfession = sanitizeInput(nominator.currentProfession || req.body.currentProfession);
    const organization = sanitizeInput(nominator.organization || req.body.organization);

    // 3. Extract Self Nomination Boolean (Supports boolean or 'Yes'/'No' strings)
    const rawIsSelf = req.body.isSelfNomination ?? req.body.areYouNominatingYourself;
    const isSelfNomination =
      rawIsSelf === true ||
      rawIsSelf === 'true' ||
      rawIsSelf === 'Yes' ||
      rawIsSelf === 'yes';

    // 4. Validate Nominator Details
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid nominator email is required.',
      });
    }

    if (!fullName) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Nominator full name is required.',
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

    if (!['Student', 'Working Professional'].includes(workStatus)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Please choose work status: Student or Working Professional.',
      });
    }

    if (!currentProfession) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Current profession is required.',
      });
    }

    if (!organization) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Organization you currently work or study at is required.',
      });
    }

    // 5. Conditional Validation based on isSelfNomination
    let selfNominationData = null;
    let nomineeData = null;

    if (isSelfNomination) {
      const self = req.body.selfNomination || req.body;
      const bio = sanitizeInput(self.bio || self.briefBiography);
      const socialLinks = sanitizeInput(self.socialLinks || self.linkedinSocialLinks);
      const mediaLinks = sanitizeInput(self.mediaLinks || self.onlineVideosArticles) || '';
      const uniqueIdea = sanitizeInput(self.uniqueIdea);
      const keyTakeaways = sanitizeInput(self.keyTakeaways);

      if (!bio) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'A brief biography about yourself is required.',
        });
      }

      if (!socialLinks) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'LinkedIn and social media profile links are required.',
        });
      }

      if (!uniqueIdea) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'The unique idea you want to share in the TEDx talk is required.',
        });
      }

      if (!keyTakeaways) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Key takeaways after the talk are required.',
        });
      }

      selfNominationData = {
        bio,
        socialLinks,
        mediaLinks,
        uniqueIdea,
        keyTakeaways,
      };
    } else {
      // Nominating someone else
      const nominee = req.body.nominee || req.body;
      const nomineeName = sanitizeInput(nominee.nomineeName || nominee.name);
      const qualification = sanitizeInput(nominee.qualification || nominee.professionalDescription);
      const nomineeOrg = sanitizeInput(nominee.organization || nominee.currentOrganization);
      const bio = sanitizeInput(nominee.bio || nominee.briefBiography);
      const socialLinks = sanitizeInput(nominee.socialLinks || nominee.linkedinSocialLinks);
      const mediaLinks = sanitizeInput(nominee.mediaLinks || nominee.onlineVideosArticles);
      const uniquePerspective = sanitizeInput(nominee.uniquePerspective);

      if (!nomineeName) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: "Nominee's name is required.",
        });
      }

      if (!qualification) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Qualification / professional description of nominee is required.',
        });
      }

      if (!nomineeOrg) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Current organization of nominee is required.',
        });
      }

      if (!bio) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'A brief biography about the nominee is required.',
        });
      }

      if (!socialLinks) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Links to LinkedIn and social profiles of nominee are required.',
        });
      }

      if (!mediaLinks) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Links to online videos or articles of nominee are required.',
        });
      }

      if (!uniquePerspective) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Unique perspective the nominee brings to the stage is required.',
        });
      }

      nomineeData = {
        nomineeName,
        qualification,
        organization: nomineeOrg,
        bio,
        socialLinks,
        mediaLinks,
        uniquePerspective,
      };
    }

    // 6. Save to Database
    const dbConn = await connectDB().catch(() => null);

    const recordData = {
      nominatorDetails: {
        email,
        fullName,
        contactNumber,
        communicationEmail,
        workStatus,
        currentProfession,
        organization,
      },
      isSelfNomination,
      selfNomination: selfNominationData,
      nominee: nomineeData,
      status: 'submitted',
      submissionMeta: {
        ipHash: hashClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
      },
    };

    if (dbConn) {
      const created = await SpeakerNomination.create(recordData);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your speaker nomination has been received.',
        data: {
          id: created._id,
          nominatorName: fullName,
          isSelfNomination,
          createdAt: created.createdAt,
        },
      });
    } else {
      const created = store.addSpeakerNomination(recordData);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your speaker nomination has been received.',
        data: {
          id: created._id,
          nominatorName: fullName,
          isSelfNomination,
          createdAt: created.createdAt,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export default {
  submitSpeakerNomination,
};
