import mongoose from 'mongoose';

const SpeakerNominationSchema = new mongoose.Schema(
  {
    // Details of the Nominator
    nominatorDetails: {
      email: {
        type: String,
        required: [true, 'Nominator email is required'],
        lowercase: true,
        trim: true,
        index: true,
      },
      fullName: {
        type: String,
        required: [true, 'Nominator full name is required'],
        trim: true,
        maxlength: [120, 'Name cannot exceed 120 characters'],
      },
      contactNumber: {
        type: String,
        required: [true, 'Nominator contact number is required'],
        trim: true,
      },
      communicationEmail: {
        type: String,
        required: [true, 'Nominator communication email is required'],
        lowercase: true,
        trim: true,
      },
      workStatus: {
        type: String,
        required: [true, 'Work status is required'],
        enum: ['Student', 'Working Professional'],
      },
      currentProfession: {
        type: String,
        required: [true, 'Current profession is required'],
        trim: true,
        maxlength: [150, 'Profession cannot exceed 150 characters'],
      },
      organization: {
        type: String,
        required: [true, 'Organization is required'],
        trim: true,
        maxlength: [200, 'Organization cannot exceed 200 characters'],
      },
    },

    // Distinguishes Self Nomination vs Nominating Someone Else
    isSelfNomination: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Conditional Section: Populated ONLY if isSelfNomination === true
    selfNomination: {
      bio: {
        type: String,
        maxlength: [3000, 'Bio cannot exceed 3000 characters'],
      },
      socialLinks: {
        type: String,
        maxlength: [1000, 'Social links cannot exceed 1000 characters'],
      },
      mediaLinks: {
        type: String,
        maxlength: [1000, 'Media links cannot exceed 1000 characters'],
        default: '',
      },
      uniqueIdea: {
        type: String,
        maxlength: [3000, 'Unique idea cannot exceed 3000 characters'],
      },
      keyTakeaways: {
        type: String,
        maxlength: [3000, 'Key takeaways cannot exceed 3000 characters'],
      },
    },

    // Conditional Section: Populated ONLY if isSelfNomination === false
    nominee: {
      nomineeName: {
        type: String,
        maxlength: [150, 'Nominee name cannot exceed 150 characters'],
      },
      qualification: {
        type: String,
        maxlength: [250, 'Qualification cannot exceed 250 characters'],
      },
      organization: {
        type: String,
        maxlength: [200, 'Organization cannot exceed 200 characters'],
      },
      bio: {
        type: String,
        maxlength: [3000, 'Bio cannot exceed 3000 characters'],
      },
      socialLinks: {
        type: String,
        maxlength: [1000, 'Social links cannot exceed 1000 characters'],
      },
      mediaLinks: {
        type: String,
        maxlength: [1000, 'Media links cannot exceed 1000 characters'],
      },
      uniquePerspective: {
        type: String,
        maxlength: [3000, 'Unique perspective cannot exceed 3000 characters'],
      },
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
    collection: 'speakerNominations',
  }
);

SpeakerNominationSchema.index({ createdAt: -1 });

export const SpeakerNomination =
  mongoose.models.SpeakerNomination ||
  mongoose.model('SpeakerNomination', SpeakerNominationSchema);

export default SpeakerNomination;
