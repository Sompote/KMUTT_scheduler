import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import database connection
import db from './database/connection';

// Import routes
import authRouter from './routes/auth';
import yearsRouter from './routes/years';
import roomsRouter from './routes/rooms';
import instructorsRouter from './routes/instructors';
import subjectsRouter from './routes/subjects';
import sessionsRouter from './routes/sessions';
import configRouter from './routes/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/years', yearsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/instructors', instructorsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/config', configRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.DATABASE_PATH || './data/scheduler.db'}`);
  console.log(`\n✅ API Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/years`);
  console.log(`   GET  /api/rooms`);
  console.log(`   GET  /api/instructors`);
  console.log(`   GET  /api/subjects`);
  console.log(`   GET  /api/sessions`);
  console.log(`   GET  /api/config/acad-year`);
  console.log(`   GET  /api/config/settings`);
  console.log(`   GET  /api/config/dept-constraints\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  db.close();
  process.exit(0);
});

export default app;
