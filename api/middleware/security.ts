import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import cors from 'cors';
// Express-validator temporarily removed due to compatibility issues
import * as DOMPurify from 'isomorphic-dompurify';
import * as crypto from 'crypto';

// Type definitions
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
    interface Session {
      csrfToken?: string;
    }
  }
}

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_JWT_SECRET',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'SESSION_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate key lengths
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
  }
};

// Rate limiting configuration
export const createRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/health' || req.path === '/api/health/';
    },
    // Custom key generator for user-based rate limiting
    keyGenerator: (req: Request): string => {
      const userId = req.headers['x-user-id'] as string;
      return userId ? `user:${userId}` : (req.ip || 'unknown');
    },
    // Log rate limit hits
    handler: (req: Request, res: Response) => {
      console.warn(`Rate limit exceeded for IP: ${req.ip}, User: ${req.headers['x-user-id']}, Path: ${req.path}`);
      res.status(429).json({
        success: false,
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Strict rate limiting for authentication endpoints
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const authRateLimiter = authRateLimit; // Alias for compatibility
export const failedAuthRateLimiter = createRateLimit(15 * 60 * 1000, 3); // 3 attempts per 15 minutes for failed auth

// General API rate limiting
export const apiRateLimit = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
);

// Payment endpoints rate limiting
export const paymentRateLimit = createRateLimit(60 * 1000, 3); // 3 attempts per minute

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://*.supabase.co'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your production domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Input validation helpers temporarily removed due to express-validator compatibility issues
// TODO: Re-implement with proper express-validator v7 syntax or use Zod

// Key rotation utilities
export const rotateKeys = async () => {
  // This would typically integrate with your key management service
  console.log('Key rotation process initiated');
  
  // Generate new keys
  const newJWTSecret = crypto.randomBytes(64).toString('hex');
  const newEncryptionKey = crypto.randomBytes(32).toString('hex');
  const newSessionSecret = crypto.randomBytes(64).toString('hex');
  
  // In production, you would:
  // 1. Store new keys in secure key management service
  // 2. Update environment variables
  // 3. Gracefully restart services
  // 4. Invalidate old sessions if necessary
  
  return {
    jwtSecret: newJWTSecret,
    encryptionKey: newEncryptionKey,
    sessionSecret: newSessionSecret,
    rotatedAt: new Date().toISOString()
  };
};

// Security audit logging
export const securityLogger = (event: string, details: any, req?: Request) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?.id
  };
  
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
};