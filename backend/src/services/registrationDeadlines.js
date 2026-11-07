import { connectDB } from '../config/db.js';
import SPEAK_CONFIG from '../config/speakConfig.js';
import RegistrationSettings from '../models/RegistrationSettings.js';

const SETTINGS_KEY = 'registration-deadlines';

const defaultDeadlines = {
  anonymousVoicesDeadline: new Date(SPEAK_CONFIG.anonymousVoicesDeadline).toISOString(),
  speakerNominationDeadline: SPEAK_CONFIG.speakerNominationDeadline
    ? new Date(SPEAK_CONFIG.speakerNominationDeadline).toISOString()
    : null,
};

let memoryDeadlines = { ...defaultDeadlines };

function toISOStringOrNull(value) {
  return value ? new Date(value).toISOString() : null;
}

export async function getRegistrationDeadlines() {
  let dbConn;
  try {
    dbConn = await connectDB();
  } catch (err) {
    console.warn(`[RegistrationSettings] Could not load saved deadlines; using defaults: ${err.message}`);
    return { ...memoryDeadlines };
  }

  if (!dbConn) {
    return { ...memoryDeadlines };
  }

  const settings = await RegistrationSettings.findOne({ key: SETTINGS_KEY }).lean();
  if (!settings) {
    return { ...defaultDeadlines };
  }

  return {
    anonymousVoicesDeadline: toISOStringOrNull(settings.anonymousVoicesDeadline),
    speakerNominationDeadline: toISOStringOrNull(settings.speakerNominationDeadline),
  };
}

export function validateRegistrationDeadlines(input) {
  const deadlines = {};

  for (const field of ['anonymousVoicesDeadline', 'speakerNominationDeadline']) {
    const value = input?.[field];
    if (field === 'speakerNominationDeadline' && (value === null || value === '')) {
      deadlines[field] = null;
      continue;
    }

    if (typeof value !== 'string' || !value.trim() || Number.isNaN(Date.parse(value))) {
      throw new Error(`${field} must be a valid date${field === 'speakerNominationDeadline' ? ' or null' : ''}.`);
    }
    deadlines[field] = new Date(value).toISOString();
  }

  return deadlines;
}

export async function saveRegistrationDeadlines(deadlines) {
  const normalized = validateRegistrationDeadlines(deadlines);
  const dbConn = await connectDB();

  if (!dbConn) {
    memoryDeadlines = normalized;
    return { ...memoryDeadlines };
  }

  const settings = await RegistrationSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      $set: {
        anonymousVoicesDeadline: new Date(normalized.anonymousVoicesDeadline),
        speakerNominationDeadline: normalized.speakerNominationDeadline
          ? new Date(normalized.speakerNominationDeadline)
          : null,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    anonymousVoicesDeadline: toISOStringOrNull(settings.anonymousVoicesDeadline),
    speakerNominationDeadline: toISOStringOrNull(settings.speakerNominationDeadline),
  };
}

export function formatRegistrationDeadline(deadline) {
  if (!deadline) return null;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(deadline));
}
