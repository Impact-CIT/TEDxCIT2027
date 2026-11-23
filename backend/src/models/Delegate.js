import mongoose from 'mongoose';

const DelegateSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passType: {
      type: String,
      required: true,
      enum: ['student', 'professional'],
      index: true,
    },
    passName: {
      type: String,
      required: true,
    },

    // --- Common Delegate Fields ---
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Valid Email address is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
      default: null,
    },
    attendedBefore: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },
    heardAbout: {
      type: String,
      trim: true,
      default: null,
    },
    declaration: {
      type: Boolean,
      required: true,
    },

    // --- Student Delegate Specific Fields ---
    collegeName: {
      type: String,
      trim: true,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    yearOfStudy: {
      type: String,
      trim: true,
      default: null,
    },
    section: {
      type: String,
      trim: true,
      default: null,
    },

    // --- Professional Delegate Specific Fields ---
    organisationName: {
      type: String,
      trim: true,
      default: null,
    },
    jobDesignation: {
      type: String,
      trim: true,
      default: null,
    },
    industryDomain: {
      type: String,
      trim: true,
      default: null,
    },
    experienceYears: {
      type: String,
      trim: true,
      default: null,
    },

    // --- Razorpay & Payment Gateway Fields ---
    amount: {
      type: Number,
      required: true,
    },
    amountInPaise: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    receipt: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
    },
    paymentSignature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'delegates',
  }
);

export const Delegate =
  mongoose.models.Delegate || mongoose.model('Delegate', DelegateSchema);

export default Delegate;
