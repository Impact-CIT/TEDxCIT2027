import mongoose from 'mongoose';

/**
 * MongoDB Atlas Connection Manager
 * Handles persistent connections in Express server and reuses cached connections in serverless environments.
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] WARNING: MONGODB_URI is not set in environment. Submissions will use in-memory store until configured.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully to Atlas database: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    }).catch((err) => {
      console.error('[MongoDB] Connection failed:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDB;

