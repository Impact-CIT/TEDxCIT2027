import store from '../models/store.js';

/**
 * Controller for General Speaker Applications
 */

export async function applySpeaker(req, res, next) {
  try {
    const { name, email, phone, talkTitle, talkSynopsis, bio, linkedinUrl } = req.body;

    if (!name || !email || !talkTitle) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Name, email, and talk title are required.',
      });
    }

    const application = store.addSpeakerApplication({
      name,
      email,
      phone,
      talkTitle,
      talkSynopsis,
      bio,
      linkedinUrl,
      status: 'UNDER_REVIEW',
    });

    return res.status(201).json({
      success: true,
      message: 'Speaker application submitted successfully.',
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

export async function listSpeakerApplications(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: store.speakerApplications,
    });
  } catch (err) {
    next(err);
  }
}

