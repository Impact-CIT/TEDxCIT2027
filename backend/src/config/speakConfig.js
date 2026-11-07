/**
 * Configuration for TEDxCIT 2027 Apply to Speak Flow
 * Theme: "The Untapped" | Date: 11 February 2027
 */

export const SPEAK_CONFIG = {
  theme: 'The Untapped',
  eventDate: '11 February 2027',
  
  // Registration deadline for Anonymous Voices (configurable via env)
  anonymousVoicesDeadline: process.env.ANONYMOUS_VOICES_DEADLINE || '2027-01-25T23:59:59+05:30',
  anonymousVoicesDeadlineFormatted: '25 January 2027, 11:59 PM IST',

  // Institution Options
  institutions: [
    'Chennai Institute of Technology',
    'CITAR',
  ],

  // Graduation Years
  graduationYears: ['2027', '2028', '2029', '2030'],

  // Department Options
  departments: [
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

  // Video Upload limits
  maxVideoSizeMB: 200,
  maxVideoSizeBytes: 200 * 1024 * 1024,
  allowedVideoMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],

  // Contact Persons for queries
  contacts: [
    { name: 'Shubhavi R V', phone: '+91 63840 93306' },
    { name: 'Sachin G', phone: '+91 97910 31117' },
  ],
};

export default SPEAK_CONFIG;

