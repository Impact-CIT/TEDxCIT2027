const ANONYMOUS_VOICES_SHEET_ID = '1eEaPxO6hA6Pe1zNjeiIuxyeKLJOBqI5aqSmGV2CA00U';
const SPEAKER_NOMINATIONS_SHEET_ID = '1lM2E06PmAarhED-ml5pGSeMogPiZahDma77TVMl7_T4';
const TAB_NAME = 'Submissions';

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ success: false, message: 'Unauthorized' });
    }

    const spreadsheetId = payload.type === 'anonymous'
      ? ANONYMOUS_VOICES_SHEET_ID
      : payload.type === 'speaker'
        ? SPEAKER_NOMINATIONS_SHEET_ID
        : null;

    if (!spreadsheetId || !Array.isArray(payload.row)) {
      return jsonResponse({ success: false, message: 'Invalid payload' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(TAB_NAME);
      const submissionId = String(payload.row[0] || '');
      const lastRow = sheet.getLastRow();

      if (submissionId && lastRow > 1) {
        const existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues().flat();
        if (existingIds.includes(submissionId)) {
          return jsonResponse({ success: true, duplicate: true });
        }
      }

      sheet.appendRow(payload.row);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
