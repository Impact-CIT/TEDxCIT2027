import mongoose from 'mongoose';
import SPEAK_CONFIG from '../config/speakConfig.js';

const registrationSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'registration-deadlines',
    },
    anonymousVoicesDeadline: {
      type: Date,
      default: () => new Date(SPEAK_CONFIG.anonymousVoicesDeadline),
    },
    speakerNominationDeadline: {
      type: Date,
      default: () => SPEAK_CONFIG.speakerNominationDeadline
        ? new Date(SPEAK_CONFIG.speakerNominationDeadline)
        : null,
    },
  },
  { versionKey: false }
);

export default mongoose.models.RegistrationSettings
  || mongoose.model('RegistrationSettings', registrationSettingsSchema);
