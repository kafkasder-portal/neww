import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Skip CSRF for health check endpoints
  if (req.path === '/api/health' || req.path === '/api/health/') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.headers['x-session-token'] as string;
  
  if (!token || !sessionToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token required'
    });
  }
  
  // CSRF validation with required environment variable
  const csrfSecret = process.env.CSRF_SECRET;
  if (!csrfSecret) {
    console.error('CSRF_SECRET environment variable is required');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
  }

  const expectedToken = crypto
    .createHmac('sha256', csrfSecret)
    .update(sessionToken)
    .digest('hex');
  
  if (token !== expectedToken) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token'
    });
  }
  
  next();
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (sessionToken: string): string => {
  const csrfSecret = process.env.CSRF_SECRET;
  if (!csrfSecret) {
    throw new Error('CSRF_SECRET environment variable is required');
  }

  return crypto
    .createHmac('sha256', csrfSecret)
    .update(sessionToken)
    .digest('hex');
};

/**
 * SQL Injection Protection Middleware
 */
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /('|--|;|\||\*|\*\*)/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];
  
  const checkForSQLInjection = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    }
    
    if (Array.isArray(obj)) {
      return obj.some(checkForSQLInjection);
    }
    
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(checkForSQLInjection);
    }
    
    return false;
  };
  
  if (req.body && checkForSQLInjection(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Suspicious input detected'
    });
  }
  
  if (req.query && checkForSQLInjection(req.query)) {
    return res.status(400).json({
      success: false,
      error: 'Suspicious query parameters detected'
    });
  }
  
  next();
};

/**
 * Request size limiter
 */
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const maxSize = parseInt(process.env.MAX_REQUEST_SIZE || '10485760'); // 10MB default
  
  if (req.headers['content-length']) {
    const contentLength = parseInt(req.headers['content-length']);
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'Request entity too large'
      });
    }
  }
  
  next();
};

/**
 * IP Whitelist Middleware (optional)
 */
export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
  
  if (allowedIPs.length === 0) {
    return next(); // No IP restriction if not configured
  }
  
  const clientIP = req.ip || (req.connection as any).remoteAddress || req.headers['x-forwarded-for'];
  
  if (!clientIP || !allowedIPs.includes(clientIP as string)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied from this IP address'
    });
  }
  
  next();
};

/**
 * Request ID middleware for tracking
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = crypto.randomUUID();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-ID', id);
  next();
};

/**
 * Security headers middleware (additional to helmet)
 */
export const additionalSecurityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};
