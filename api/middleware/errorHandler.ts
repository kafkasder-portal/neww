import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

/**
 * Custom Error class
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 */
export const globalErrorHandler = async (
  error: { statusCode?: number; message?: string; code?: string; stack?: string },
  req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<void> => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'],
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    error: {
      message: error.message,
      stack: error.stack,
      statusCode,
      code
    }
  });

  // Log to Supabase errors table if configured
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      await supabase.from('system_errors').insert({
        message,
        status_code: statusCode,
        code,
        path: req.path,
        method: req.method,
        ip: req.ip,
        user_agent: req.headers['user-agent'] || null,
        created_at: new Date().toISOString()
      });
    }
  } catch (loggingError) {
    console.error('Failed to log error to Supabase:', loggingError);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code
  });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
};

/**
 * Unhandled promise rejection handler
 */
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close server gracefully
    process.exit(1);
  });
};

/**
 * Uncaught exception handler
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    // Close server gracefully
    process.exit(1);
  });
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn('Slow request detected:', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        requestId: req.headers['x-request-id']
      });
    }

    // Log request metrics
    if (process.env.NODE_ENV === 'development') {
      console.log('Request completed:', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        requestId: req.headers['x-request-id']
      });
    }
  });

  next();
};

// Main error handler export
export const errorHandler = globalErrorHandler;
