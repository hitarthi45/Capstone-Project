// src/common/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

/**
 * Centralised error handling middleware.
 * All errors should be passed to `next(err)` in controllers/services.
 * The response follows the envelope defined in the spec:
 *   { success: false, error: { code, message, details? } }
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const status = err.statusCode ?? err.status ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = err.message ?? 'An unexpected error occurred';
  const details = err.details;

  // Log the error stack in development
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err);
  }

  const errorResponse: any = { code, message };
  if (details) errorResponse.details = details;

  res.status(status).json({ success: false, error: errorResponse });
};
