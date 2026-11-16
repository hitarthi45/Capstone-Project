// src/index.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from './common/logger';
import { errorHandler } from './common/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is up' });
});

// Placeholder for future routes
app.use('/api/v1', (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not implemented' } });
});

// Error handling – must be after all routes
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;
