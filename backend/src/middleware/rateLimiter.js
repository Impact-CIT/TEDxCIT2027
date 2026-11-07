import rateLimit from 'express-rate-limit';

export const submissionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // limit each IP to 20 submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    ip: false, // Prevents ERR_ERL_UNDEFINED_IP_ADDRESS in pipe/socket environments
  },
  keyGenerator: (req) => {
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '127.0.0.1'
    );
  },
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many submissions received from this IP address. Please try again in an hour.',
  },
});

export const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    ip: false,
  },
  keyGenerator: (req) => (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  ),
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many sign-in attempts. Please try again later.',
  },
});

export default submissionRateLimiter;
