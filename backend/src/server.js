import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TEDxCIT2027 API is running' });
});

app.listen(PORT, () => {
  console.log(`[TEDxCIT2027] Backend server running on http://localhost:${PORT}`);
});

export default app;

