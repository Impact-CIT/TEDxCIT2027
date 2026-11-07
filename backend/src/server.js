import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { connectDB, isConnected } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting both local Vite frontend and production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS origin blocked by policy: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    await import('mongoose').then(({ default: mongoose }) => mongoose.connection.db.admin().ping());
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      service: 'TEDxCIT2027 Backend API',
      timestamp: new Date().toISOString(),
      mongodb: { connected: false, status: 'UNAVAILABLE' },
    });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'TEDxCIT2027 Backend API',
    timestamp: new Date().toISOString(),
    mongodb: {
      connected: isConnected(),
      status: isConnected() ? 'CONNECTED' : 'UNAVAILABLE',
    },
  });
});

// Mount Main API Routes
app.use('/api', routes);

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

// Start server only when executed directly (node src/server.js), not when imported by tests
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  connectDB().then(() => app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  TEDxCIT 2027: UNTAPPED - Backend Server`);
    console.log(`  Running at: http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  MongoDB: ${process.env.MONGODB_URI ? 'Configured (Atlas)' : 'Not configured (startup blocked)'}`);
    console.log(`=======================================================`);
    console.log(`  Endpoints:`);
    console.log(`  - GET  /api/health`);
    console.log(`  - POST /api/anonymous-voices      (Anonymous Voices submission)`);
    console.log(`  - POST /api/speaker-nominations   (Speaker Nomination submission)`);
    console.log(`  - GET  /api/admin/submissions     (Admin dashboard & CSV export)`);
    console.log(`=======================================================`);
  })).catch((err) => {
    console.error(`[Startup] MongoDB is required: ${err.message}`);
    process.exitCode = 1;
  });
}

export default app;
