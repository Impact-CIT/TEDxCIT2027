import mongoose from 'mongoose';

const AnonymousVoiceSchema = new mongoose.Schema(
  {
    // Submitter / Student details
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    communicationEmail: {
      type: String,
      required: [true, 'Communication Email is required'],
      lowercase: true,
      trim: true,
    },
    socialLinks: {
      type: String,
      required: [true, 'LinkedIn or social profile links are required'],
      trim: true,
      maxlength: [1000, 'Social links cannot exceed 1000 characters'],
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      enum: ['Chennai Institute of Technology', 'CITAR'],
    },
    graduationYear: {
      type: String,
      required: [true, 'Year of graduation is required'],
      enum: ['2027', '2028', '2029', '2030'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'AIDS',
        'AIML',
        'CZ',
        'CSBS',
        'IT',
        'ECE',
        'ACT',
        'VLSI',
        'EEE',
        'MCT',
        'BME',
        'MECH',
        'CIVIL',
      ],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      maxlength: [30, 'Section cannot exceed 30 characters'],
    },

    // Talk Details
    talkTitle: {
      type: String,
      required: [true, 'Talk title is required'],
      trim: true,
      maxlength: [200, 'Talk title cannot exceed 200 characters'],
    },
    coreMessage: {
      type: String,
      required: [true, 'Core message is required'],
      trim: true,
      maxlength: [3000, 'Core message cannot exceed 3000 characters'],
    },
    uniquePerspective: {
      type: String,
      required: [true, 'Unique perspective is required'],
      trim: true,
      maxlength: [3000, 'Unique perspective cannot exceed 3000 characters'],
    },
    visionBridge: {
      type: String,
      required: [true, 'Vision description is required'],
      trim: true,
      maxlength: [3000, 'Vision cannot exceed 3000 characters'],
    },
    themeRelevance: {
      type: String,
      required: [true, 'Theme relevance description is required'],
      trim: true,
      maxlength: [3000, 'Theme relevance cannot exceed 3000 characters'],
    },
    criticismResponse: {
      type: String,
      required: [true, 'Criticism response is required'],
      trim: true,
      maxlength: [3000, 'Criticism response cannot exceed 3000 characters'],
    },
    talkStructure: {
      type: String,
      required: [true, 'Talk structure description is required'],
      trim: true,
      maxlength: [3000, 'Talk structure cannot exceed 3000 characters'],
    },

    // Keep upload metadata fields for compatibility with existing submissions.
    recordedSpeechType: {
      type: String,
      enum: ['link', 'upload'],
      default: 'link',
    },
    recordedSpeechUrl: {
      type: String,
      required: [true, 'Recorded speech URL or video file link is required'],
      trim: true,
    },
    recordedSpeechMeta: {
      originalName: { type: String, default: null },
      size: { type: Number, default: null },
      mimeType: { type: String, default: null },
    },

    // Status and Review
    status: {
      type: String,
      enum: ['submitted', 'shortlisted', 'rejected'],
      default: 'submitted',
      index: true,
    },

    // Submission Metadata
    submissionMeta: {
      ipHash: { type: String, default: null },
      userAgent: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: 'anonymousVoices',
  }
);

// Compound and query indexes
AnonymousVoiceSchema.index({ createdAt: -1 });

export const AnonymousVoice =
  mongoose.models.AnonymousVoice || mongoose.model('AnonymousVoice', AnonymousVoiceSchema);

export default AnonymousVoice;
