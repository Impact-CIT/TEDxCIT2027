/**
 * TEDxCIT2027 Delegate Pass Types & Pricing Configuration
 *
 * Current test pricing configured as requested:
 * - Student Delegate: ₹100
 * - Professional Delegate: ₹200
 *
 * All amounts sent to Razorpay must be in paise (1 INR = 100 paise).
 */

export const PASS_TYPES = {
  STUDENT: {
    id: 'student',
    name: 'Student Delegate Pass',
    category: 'Student',
    price: Number(process.env.PASS_PRICE_STUDENT) || 100,
    currency: 'INR',
    amountInPaise: (Number(process.env.PASS_PRICE_STUDENT) || 100) * 100,
    description: 'Full-day access to all TEDxCIT 2027 talks, official delegate kit, lunch & refreshments, interactive experience zones, and participation certificate.',
    eligibility: 'Must present a valid College/School Student ID card at the registration desk on the event day.',
    features: [
      'Access to all speaker sessions & live performances',
      'Official TEDxCIT 2027 Student Delegate Kit',
      'Networking Lunch & High-Tea Refreshments',
      'Interactive Innovation & Tech Experience Zones',
      'Official Certificate of Participation'
    ]
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional Delegate Pass',
    category: 'Professional',
    price: Number(process.env.PASS_PRICE_PROFESSIONAL) || 200,
    currency: 'INR',
    amountInPaise: (Number(process.env.PASS_PRICE_PROFESSIONAL) || 200) * 100,
    description: 'Executive-tier access for industry professionals, entrepreneurs, researchers, and corporate delegates, including reserved seating and VIP networking lounge access.',
    eligibility: 'Open to corporate professionals, startup founders, academicians, and general delegates.',
    features: [
      'Priority check-in & reserved premium seating',
      'Access to all speaker sessions & panel discussions',
      'Exclusive Executive Networking Lounge access',
      'Official TEDxCIT 2027 Executive Delegate Kit',
      'Networking Lunch & High-Tea with Speakers and Sponsors',
      'Digital Certificate of Attendance'
    ]
  }
};

/**
 * Helper to get pass details by ID (case-insensitive)
 */
export function getPassById(passId) {
  if (!passId) return null;
  const normalized = String(passId).trim().toUpperCase();
  return PASS_TYPES[normalized] || null;
}

/**
 * Returns array of all available passes for client consumption
 */
export function getAvailablePasses() {
  return Object.values(PASS_TYPES).map(pass => ({
    id: pass.id,
    name: pass.name,
    category: pass.category,
    price: pass.price,
    currency: pass.currency,
    description: pass.description,
    eligibility: pass.eligibility,
    features: pass.features
  }));
}

