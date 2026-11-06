import crypto from 'crypto';

/**
 * In-Memory Database Store for TEDxCIT2027
 * Manages registrations, orders, speaker applications, and payment records.
 */

class DataStore {
  constructor() {
    this.registrations = new Map(); // id -> registration
    this.registrationsByOrderId = new Map(); // orderId -> id
    this.speakerApplications = [];
    this.studentSpeakerApplications = [];
  }

  /**
   * Create a new delegate registration record with pass-specific fields
   */
  createRegistration(data) {
    const id = `REG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const isStudent = data.passType === 'student';

    const record = {
      id,
      passType: data.passType,
      passName: data.passName,
      // Common Fields
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      linkedin: data.linkedin?.trim() || null,
      attendedBefore: data.attendedBefore || 'No',
      heardAbout: data.heardAbout?.trim() || null,
      declaration: Boolean(data.declaration),

      // Student Delegate Specific Fields
      ...(isStudent
        ? {
            collegeName: data.collegeName?.trim() || null,
            department: data.department?.trim() || null,
            yearOfStudy: data.yearOfStudy?.trim() || null,
            section: data.section?.trim() || null,
          }
        : {
            // Professional Delegate Specific Fields
            organisationName: data.organisationName?.trim() || null,
            jobDesignation: data.jobDesignation?.trim() || null,
            industryDomain: data.industryDomain?.trim() || null,
            experienceYears: data.experienceYears?.trim() || null,
          }),

      // Financial & Gateway Fields
      amount: data.amount, // in INR (100 or 200)
      amountInPaise: data.amountInPaise,
      currency: data.currency || 'INR',
      receipt: data.receipt,
      orderId: data.orderId,
      paymentId: null,
      paymentSignature: null,
      status: 'PENDING_PAYMENT',
      paymentMethod: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.registrations.set(id, record);
    if (record.orderId) {
      this.registrationsByOrderId.set(record.orderId, id);
    }

    return { ...record };
  }

  /**
   * Find registration by ID
   */
  getRegistrationById(id) {
    if (!id) return null;
    const record = this.registrations.get(id);
    return record ? { ...record } : null;
  }

  /**
   * Find registration by Razorpay Order ID
   */
  getRegistrationByOrderId(orderId) {
    if (!orderId) return null;
    const id = this.registrationsByOrderId.get(orderId);
    if (!id) return null;
    return this.getRegistrationById(id);
  }

  /**
   * Update payment confirmation on registration
   */
  markPaymentSuccess(orderId, { paymentId, signature, paymentMethod }) {
    const registration = this.getRegistrationByOrderId(orderId);
    if (!registration) {
      return null;
    }

    const updated = {
      ...registration,
      paymentId: paymentId || registration.paymentId,
      paymentSignature: signature || registration.paymentSignature,
      paymentMethod: paymentMethod || 'RAZORPAY',
      status: 'PAID',
      updatedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    this.registrations.set(registration.id, updated);
    return { ...updated };
  }

  /**
   * Mark payment failed
   */
  markPaymentFailed(orderId, { reason, paymentId }) {
    const registration = this.getRegistrationByOrderId(orderId);
    if (!registration) return null;

    const updated = {
      ...registration,
      status: 'FAILED',
      failureReason: reason || 'Payment failed or cancelled by user',
      paymentId: paymentId || registration.paymentId,
      updatedAt: new Date().toISOString(),
    };

    this.registrations.set(registration.id, updated);
    return { ...updated };
  }

  /**
   * Get all registrations (for admin review)
   */
  getAllRegistrations() {
    return Array.from(this.registrations.values());
  }

  /**
   * Add speaker application
   */
  addSpeakerApplication(data) {
    const id = `SPK-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const entry = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.speakerApplications.push(entry);
    return entry;
  }

  /**
   * Add student speaker application
   */
  addStudentSpeakerApplication(data) {
    const id = `STU-SPK-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const entry = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.studentSpeakerApplications.push(entry);
    return entry;
  }

  /**
   * Clear all records (useful in tests)
   */
  clear() {
    this.registrations.clear();
    this.registrationsByOrderId.clear();
    this.speakerApplications = [];
    this.studentSpeakerApplications = [];
  }
}

export const store = new DataStore();
export default store;
