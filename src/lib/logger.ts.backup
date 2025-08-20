/**
 * Centralized logging utility
 * Replaces console statements with proper logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.level = (process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO);
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
    return `${timestamp} [${level}]${contextStr}: ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (this.isDevelopment) {
        console.debug(this.formatMessage('DEBUG', message, context));
      }
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error ? { ...context, stack: error.stack } : context;
      console.error(this.formatMessage('ERROR', message, errorContext));
    }
  }

  // Convenience methods for common use cases
  api(message: string, context?: LogContext): void {
    this.info(message, { ...context, category: 'api' });
  }

  auth(message: string, context?: LogContext): void {
    this.info(message, { ...context, category: 'auth' });
  }

  performance(message: string, context?: LogContext): void {
    this.info(message, { ...context, category: 'performance' });
  }

  cache(message: string, context?: LogContext): void {
    this.debug(message, { ...context, category: 'cache' });
  }

  // For backward compatibility - redirect console.log calls
  log(message: string, context?: LogContext): void {
    this.info(message, context);
  }
}

export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context);
export const logApi = (message: string, context?: LogContext) => logger.api(message, context);
export const logAuth = (message: string, context?: LogContext) => logger.auth(message, context);
export const logPerformance = (message: string, context?: LogContext) => logger.performance(message, context);
export const logCache = (message: string, context?: LogContext) => logger.cache(message, context);
