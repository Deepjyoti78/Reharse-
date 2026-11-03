import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db/index';
import { authRouter } from './routes/auth';

// 1. Load Environment Configuration
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// 2. Initialize Database Tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 3. Security & Parser Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Mount API Routes
app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Rehearse Backend Authentication Service',
  });
});

// 5. Start Server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Rehearse Authentication Server running on: http://localhost:${PORT}`);
  console.log(`🔗 Connected with Frontend: ${FRONTEND_URL}`);
  console.log(`===============================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => console.log('Process terminated'));
});

