import store from '../models/store.js';

/**
 * Controller for Student Speaker Applications
 */

export async function applyStudentSpeaker(req, res, next) {
  try {
    const { name, email, phone, college, department, year, talkIdea, auditionVideoUrl } = req.body;

    if (!name || !email || !college || !talkIdea) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Name, email, college, and talk idea are required.',
      });
    }

    const application = store.addStudentSpeakerApplication({
      name,
      email,
      phone,
      college,
      department,
      year,
      talkIdea,
      auditionVideoUrl,
      status: 'UNDER_REVIEW',
    });

    return res.status(201).json({
      success: true,
      message: 'Student speaker application submitted successfully.',
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

export async function listStudentSpeakerApplications(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: store.studentSpeakerApplications,
    });
  } catch (err) {
    next(err);
  }
}

