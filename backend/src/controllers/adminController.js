import { connectDB } from '../config/db.js';
import AnonymousVoice from '../models/AnonymousVoice.js';
import SpeakerNomination from '../models/SpeakerNomination.js';
import store from '../models/store.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tedxcit2027admin';

/**
 * Middleware: Protects Admin Endpoints
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-admin-password'];

  let providedPassword = customHeader;

  if (!providedPassword && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      providedPassword = authHeader.substring(7);
    } else if (authHeader.startsWith('Basic ')) {
      const decoded = Buffer.from(authHeader.substring(6), 'base64').toString('utf8');
      const parts = decoded.split(':');
      providedPassword = parts[1] || parts[0];
    }
  }

  if (providedPassword === ADMIN_PASSWORD) {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'UNAUTHORIZED',
    message: 'Invalid or missing admin credentials.',
  });
}

/**
 * GET /api/admin/submissions
 * Lists submissions from both collections with filter, search, and CSV export
 */
export async function getAdminSubmissions(req, res, next) {
  try {
    const { type = 'all', status = 'all', search = '', format = 'json' } = req.query;

    const dbConn = await connectDB().catch(() => null);

    let anonymousList = [];
    let speakerList = [];

    if (dbConn) {
      const avQuery = {};
      const snQuery = {};

      if (status !== 'all') {
        avQuery.status = status;
        snQuery.status = status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
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
    } else {
      // In-Memory Fallback
      if (type === 'all' || type === 'anonymous') {
        anonymousList = store.anonymousVoices.filter((item) => {
          if (status !== 'all' && item.status !== status) return false;
          if (search) {
            const s = search.toLowerCase();
            return (
              item.fullName?.toLowerCase().includes(s) ||
              item.email?.toLowerCase().includes(s) ||
              item.talkTitle?.toLowerCase().includes(s)
            );
          }
          return true;
        });
      }

      if (type === 'all' || type === 'speaker') {
        speakerList = store.speakerNominations.filter((item) => {
          if (status !== 'all' && item.status !== status) return false;
          if (search) {
            const s = search.toLowerCase();
            return (
              item.nominatorDetails?.fullName?.toLowerCase().includes(s) ||
              item.nominatorDetails?.email?.toLowerCase().includes(s) ||
              item.nominee?.nomineeName?.toLowerCase().includes(s)
            );
          }
          return true;
        });
      }
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

    const dbConn = await connectDB().catch(() => null);

    if (dbConn) {
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
    } else {
      // In-Memory
      const list = type === 'anonymous' ? store.anonymousVoices : store.speakerNominations;
      const item = list.find((x) => (x._id === id || x.id === id));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      item.status = status;
      item.updatedAt = new Date().toISOString();
      return res.status(200).json({ success: true, data: item });
    }
  } catch (err) {
    next(err);
  }
}

export default {
  requireAdminAuth,
  getAdminSubmissions,
  updateSubmissionStatus,
};

