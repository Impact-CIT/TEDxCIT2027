import { connectDB } from '../config/db.js';
import SPEAK_CONFIG from '../config/speakConfig.js';
import RegistrationSettings from '../models/RegistrationSettings.js';

const SETTINGS_KEY = 'registration-deadlines';

const defaultSettings = {
  anonymousVoicesDeadline: new Date(SPEAK_CONFIG.anonymousVoicesDeadline).toISOString(),
  speakerNominationDeadline: SPEAK_CONFIG.speakerNominationDeadline
    ? new Date(SPEAK_CONFIG.speakerNominationDeadline).toISOString()
    : null,
  anonymousVoicesOpen: true,
  speakerNominationOpen: true,
};

let memorySettings = { ...defaultSettings };

function toISOStringOrNull(value) {
  return value ? new Date(value).toISOString() : null;
}

export async function getRegistrationDeadlines() {
  let dbConn;
  try {
    dbConn = await connectDB();
  } catch (err) {
    console.warn(`[RegistrationSettings] Could not load saved deadlines; using defaults: ${err.message}`);
    return { ...memorySettings };
  }

  if (!dbConn) {
    return { ...memorySettings };
  }

  const settings = await RegistrationSettings.findOne({ key: SETTINGS_KEY }).lean();
  if (!settings) {
    return { ...defaultSettings };
  }

  return {
    anonymousVoicesDeadline: toISOStringOrNull(settings.anonymousVoicesDeadline),
    speakerNominationDeadline: toISOStringOrNull(settings.speakerNominationDeadline),
    anonymousVoicesOpen: settings.anonymousVoicesOpen ?? true,
    speakerNominationOpen: settings.speakerNominationOpen ?? true,
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

  for (const field of ['anonymousVoicesOpen', 'speakerNominationOpen']) {
    if (input?.[field] !== undefined && typeof input[field] !== 'boolean') {
      throw new Error(`${field} must be a boolean.`);
    }
  }

  return deadlines;
}

export async function saveRegistrationDeadlines(input) {
  const normalizedDeadlines = validateRegistrationDeadlines(input);
  const dbConn = await connectDB();

  if (!dbConn) {
    memorySettings = {
      ...memorySettings,
      ...normalizedDeadlines,
      anonymousVoicesOpen: input.anonymousVoicesOpen ?? memorySettings.anonymousVoicesOpen,
      speakerNominationOpen: input.speakerNominationOpen ?? memorySettings.speakerNominationOpen,
    };
    return { ...memorySettings };
  }

  const currentSettings = await RegistrationSettings.findOne({ key: SETTINGS_KEY }).lean();
  const current = currentSettings
    ? {
        anonymousVoicesOpen: currentSettings.anonymousVoicesOpen ?? true,
        speakerNominationOpen: currentSettings.speakerNominationOpen ?? true,
      }
    : defaultSettings;
  const normalized = {
    ...normalizedDeadlines,
    anonymousVoicesOpen: input.anonymousVoicesOpen ?? current.anonymousVoicesOpen,
    speakerNominationOpen: input.speakerNominationOpen ?? current.speakerNominationOpen,
  };

  const settings = await RegistrationSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      $set: {
        anonymousVoicesDeadline: new Date(normalized.anonymousVoicesDeadline),
        speakerNominationDeadline: normalized.speakerNominationDeadline
          ? new Date(normalized.speakerNominationDeadline)
          : null,
        anonymousVoicesOpen: normalized.anonymousVoicesOpen,
        speakerNominationOpen: normalized.speakerNominationOpen,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    anonymousVoicesDeadline: toISOStringOrNull(settings.anonymousVoicesDeadline),
    speakerNominationDeadline: toISOStringOrNull(settings.speakerNominationDeadline),
    anonymousVoicesOpen: settings.anonymousVoicesOpen,
    speakerNominationOpen: settings.speakerNominationOpen,
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
