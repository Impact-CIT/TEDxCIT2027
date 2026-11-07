import crypto from 'crypto';

/**
 * Strips HTML tags and script elements from input strings
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Hashes client IP to preserve privacy while supporting fraud analysis
 */
export function hashClientIp(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Indian phone number validation (10 digits, optionally prefixed with +91 or 0)
 */
export const PHONE_REGEX = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

/**
 * URL validation regex
 */
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export default {
  sanitizeInput,
  hashClientIp,
  EMAIL_REGEX,
  PHONE_REGEX,
  URL_REGEX,
};

