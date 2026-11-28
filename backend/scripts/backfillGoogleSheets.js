import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import AnonymousVoice from '../src/models/AnonymousVoice.js';
import SpeakerNomination from '../src/models/SpeakerNomination.js';
import { syncSubmissionToGoogleSheets } from '../src/services/googleSheetsSync.js';

async function backfill(type, records) {
  let synced = 0;
  let failed = 0;

  for (const record of records) {
    const result = await syncSubmissionToGoogleSheets(type, record);
    if (result.synced) synced += 1;
    else failed += 1;
  }

  return { total: records.length, synced, failed };
}

async function main() {
  await connectDB();

  const [anonymousVoices, speakerNominations] = await Promise.all([
    AnonymousVoice.find({}).sort({ createdAt: 1 }).lean(),
    SpeakerNomination.find({}).sort({ createdAt: 1 }).lean(),
  ]);

  const anonymous = await backfill('anonymous', anonymousVoices);
  const speakers = await backfill('speaker', speakerNominations);

  console.log(JSON.stringify({ anonymous, speakers }));
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
