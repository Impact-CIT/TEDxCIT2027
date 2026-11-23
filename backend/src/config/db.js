import mongoose from 'mongoose';
import dns from 'node:dns';

// Resolve querySrv ECONNREFUSED on Windows/campus networks by querying public DNS (Google & Cloudflare) for Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore if custom DNS resolution is disallowed by the runtime
}

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
    throw new Error('MONGODB_URI is required; refusing to start without persistent storage.');
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is dropped or closed, reset promise and cached connection
  if (mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully to Atlas database: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    }).catch((err) => {
      console.error('[MongoDB] Connection failed:', err.message);
      cached.promise = null;
      err.statusCode = 503;
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

mongoose.connection.on('disconnected', () => {
  cached.conn = null;
  cached.promise = null;
  console.warn('[MongoDB] Connection interrupted; the driver will reconnect on the next operation.');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err.message);
});

export default connectDB;

