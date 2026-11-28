const SYNC_TIMEOUT_MS = 8000;

function toIso(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function normalize(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : String(value);
}

export function anonymousVoiceRow(submission) {
  return [
    normalize(submission._id),
    toIso(submission.createdAt),
    normalize(submission.status),
    normalize(submission.fullName),
    normalize(submission.email),
    normalize(submission.contactNumber),
    normalize(submission.communicationEmail),
    normalize(submission.socialLinks),
    normalize(submission.institution),
    normalize(submission.graduationYear),
    normalize(submission.department),
    normalize(submission.section),
    normalize(submission.talkTitle),
    normalize(submission.coreMessage),
    normalize(submission.uniquePerspective),
    normalize(submission.visionBridge),
    normalize(submission.themeRelevance),
    normalize(submission.criticismResponse),
    normalize(submission.talkStructure),
    normalize(submission.recordedSpeechUrl),
  ];
}

export function speakerNominationRow(submission) {
  const nominator = submission.nominatorDetails || {};
  const profile = submission.isSelfNomination
    ? submission.selfNomination || {}
    : submission.nominee || {};

  return [
    normalize(submission._id),
    toIso(submission.createdAt),
    normalize(submission.status),
    submission.isSelfNomination ? 'Self nomination' : 'Speaker nomination',
    normalize(nominator.fullName),
    normalize(nominator.email),
    normalize(nominator.contactNumber),
    normalize(nominator.communicationEmail),
    normalize(nominator.workStatus),
    normalize(nominator.currentProfession),
    normalize(nominator.organization),
    normalize(submission.isSelfNomination ? nominator.fullName : profile.nomineeName),
    normalize(profile.qualification),
    normalize(submission.isSelfNomination ? nominator.organization : profile.organization),
    normalize(profile.bio),
    normalize(profile.socialLinks),
    normalize(profile.mediaLinks),
    normalize(submission.isSelfNomination ? profile.uniqueIdea : profile.uniquePerspective),
    normalize(profile.keyTakeaways),
  ];
}

export async function syncSubmissionToGoogleSheets(type, submission) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    console.warn('[GoogleSheets] Sync skipped because webhook settings are missing.');
    return { synced: false, reason: 'not_configured' };
  }

  const row = type === 'anonymous'
    ? anonymousVoiceRow(submission)
    : speakerNominationRow(submission);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, type, row }),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success !== true) {
      throw new Error(result.message || `Webhook returned ${response.status}`);
    }

    return { synced: true };
  } catch (error) {
    console.error(`[GoogleSheets] Failed to sync ${type} submission:`, error.message);
    return { synced: false, reason: 'request_failed' };
  } finally {
    clearTimeout(timeout);
  }
}
