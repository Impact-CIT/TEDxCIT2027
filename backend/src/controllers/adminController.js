import 'dotenv/config';
import crypto from 'node:crypto';
import { connectDB } from '../config/db.js';
import AnonymousVoice from '../models/AnonymousVoice.js';
import SpeakerNomination from '../models/SpeakerNomination.js';
import { getRegistrationDeadlines } from '../services/registrationDeadlines.js';

const ADMIN_SESSION_COOKIE = 'tedx_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

function safeEqual(left, right) {
  if (!left || !right) return false;
  const leftHash = crypto.createHash('sha256').update(left).digest();
  const rightHash = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function getAdminSecrets() {
  return {
    password: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
  };
}

function getSessionCookie(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return cookie ? cookie.slice(ADMIN_SESSION_COOKIE.length + 1) : '';
}

function signSession(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function getSessionSigningSecret(password, sessionSecret) {
  return crypto.createHmac('sha256', sessionSecret).update(password).digest();
}

function createSessionToken(secret) {
  const payload = Buffer.from(JSON.stringify({
    expiresAt: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  })).toString('base64url');
  return `${payload}.${signSession(payload, secret)}`;
}

function isValidSession(token, secret) {
  if (!token || !secret) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  if (!safeEqual(signature, signSession(payload, secret))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(session.expiresAt) && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function serializeSessionCookie(value, maxAge) {
  const attributes = [
    `${ADMIN_SESSION_COOKIE}=${value}`,
    'Path=/api/admin',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ];
  if (process.env.NODE_ENV === 'production') attributes.push('Secure');
  return attributes.join('; ');
}

export function loginAdmin(req, res) {
  const { password, sessionSecret } = getAdminSecrets();
  if (!password || !sessionSecret) {
    return res.status(503).json({
      success: false,
      error: 'ADMIN_AUTH_NOT_CONFIGURED',
      message: 'Admin authentication is not configured on the server.',
    });
  }

  if (typeof req.body?.password !== 'string' || !safeEqual(req.body.password, password)) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid admin credentials.',
    });
  }

  res.setHeader(
    'Set-Cookie',
    serializeSessionCookie(
      createSessionToken(getSessionSigningSecret(password, sessionSecret)),
      ADMIN_SESSION_TTL_SECONDS
    )
  );
  return res.status(200).json({ success: true });
}

export function logoutAdmin(req, res) {
  res.setHeader('Set-Cookie', serializeSessionCookie('', 0));
  return res.status(200).json({ success: true });
}

export function requireAdminAuth(req, res, next) {
  const { password, sessionSecret } = getAdminSecrets();
  if (!password || !sessionSecret) {
    return res.status(503).json({
      success: false,
      error: 'ADMIN_AUTH_NOT_CONFIGURED',
      message: 'Admin authentication is not configured on the server.',
    });
  }

  if (isValidSession(
    getSessionCookie(req),
    getSessionSigningSecret(password, sessionSecret)
  )) {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'UNAUTHORIZED',
    message: 'Admin session is missing or expired. Please sign in again.',
  });
}

/**
 * GET /api/admin/submissions
 * Lists submissions from both collections with filter, search, and CSV export
 */
export async function getAdminSubmissions(req, res, next) {
  try {
    const { type = 'all', status = 'all', search = '', format = 'json' } = req.query;

    await connectDB();
    const deadlines = await getRegistrationDeadlines();

    let anonymousList = [];
    let speakerList = [];

    const avQuery = {};
    const snQuery = {};

    if (status !== 'all') {
      avQuery.status = status;
      snQuery.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      avQuery.$or = [{ fullName: regex }, { email: regex }, { talkTitle: regex }];
      snQuery.$or = [
        { 'nominatorDetails.fullName': regex },
        { 'nominatorDetails.email': regex },
        { 'nominee.nomineeName': regex },
      ];
    }

    if (type === 'all' || type === 'anonymous') {
      anonymousList = await AnonymousVoice.find(avQuery).sort({ createdAt: -1 }).lean();
    }

    if (type === 'all' || type === 'speaker') {
      speakerList = await SpeakerNomination.find(snQuery).sort({ createdAt: -1 }).lean();
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=tedx-submissions-${Date.now()}.csv`);

      let csv = 'Type,ID,Name,Email,Contact,Status,Created At,Details\n';

      anonymousList.forEach((row) => {
        csv += `"Anonymous Voice","${row._id || row.id}","${row.fullName}","${row.email}","${row.contactNumber}","${row.status}","${row.createdAt}","${(row.talkTitle || '').replace(/"/g, '""')}"\n`;
      });

      speakerList.forEach((row) => {
        const nominator = row.nominatorDetails || {};
        const subject = row.isSelfNomination ? 'Self Nomination' : `Nominee: ${row.nominee?.nomineeName || 'N/A'}`;
        csv += `"Speaker Nomination","${row._id || row.id}","${nominator.fullName}","${nominator.email}","${nominator.contactNumber}","${row.status}","${row.createdAt}","${subject.replace(/"/g, '""')}"\n`;
      });

      return res.send(csv);
    }

    return res.status(200).json({
      success: true,
      counts: {
        anonymousVoices: anonymousList.length,
        speakerNominations: speakerList.length,
        total: anonymousList.length + speakerList.length,
      },
      deadlines,
      data: {
        anonymousVoices: anonymousList,
        speakerNominations: speakerList,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/submissions/:type/:id/status
 * Updates status of a submission (submitted | shortlisted | rejected)
 */
export async function updateSubmissionStatus(req, res, next) {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!['submitted', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Status must be one of: submitted, shortlisted, rejected',
      });
    }

    await connectDB();

    let updated;
    if (type === 'anonymous') {
      updated = await AnonymousVoice.findByIdAndUpdate(id, { status }, { new: true });
    } else if (type === 'speaker') {
      updated = await SpeakerNomination.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type parameter' });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export default {
  requireAdminAuth,
  getAdminSubmissions,
  updateSubmissionStatus,
};
