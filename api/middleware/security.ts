import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify with JSDOM for server-side usage
const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window as any);

/**
 * Rate Limiting Configuration
 */
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100,
  skipSuccessfulRequests: boolean = false,
  message: string = 'Too many requests, please try again later.'
) => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000),
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
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

// Strict rate limiter for authentication endpoints
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per 15 minutes
  true, // Skip successful requests
  'Too many login attempts, please try again later.'
);

// Progressive rate limiter for failed auth attempts
export const failedAuthRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 failed attempts per hour
  false, // Don't skip any requests
  'Too many failed login attempts, account temporarily locked.'
);

// General API rate limiter
export const apiRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  false,
  'API rate limit exceeded, please slow down.'
);

// Strict rate limiter for sensitive operations (financial, admin)
export const sensitiveRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 requests per hour
  false,
  'Sensitive operation rate limit exceeded.'
);

// File upload rate limiter
export const uploadRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  20, // 20 uploads per hour
  false,
  'File upload rate limit exceeded.'
);

/**
 * Enhanced XSS Protection Middleware
 */
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('XSS Protection Error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid input detected',
      code: 'INVALID_INPUT'
    });
  }
};

// Recursive object sanitization
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return DOMPurifyInstance.sanitize(obj, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = DOMPurifyInstance.sanitize(key, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

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
 * Enhanced SQL Injection Protection Middleware
 */
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    // SQL Injection patterns
    /('|--|;|\||\*|\*\*)/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(information_schema|sys\.tables|pg_tables|sqlite_master)/i,
    /(or\s+1\s*=\s*1|and\s+1\s*=\s*1)/i,
    /(\/\*|\*\/|\/\*\!\d+)/i,

    // XSS patterns
    /(script|javascript|vbscript|onload|onerror|onclick|onmouseover)/i,
    /(<|>|&lt;|&gt;)/i,
    /(eval\s*\(|expression\s*\()/i,
    /(document\.|window\.|alert\s*\()/i,

    // Path traversal patterns
    /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,

    // Command injection patterns
    /(\||&|;|`|\$\(|backtick)/i,
    /(rm\s|cat\s|ls\s|ps\s|kill\s|wget\s|curl\s)/i
  ];

  const checkForMaliciousInput = (obj: any, path: string = ''): string | null => {
    if (typeof obj === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(obj)) {
          return `${path}: ${pattern.toString()}`;
        }
      }
      return null;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const result = checkForMaliciousInput(obj[i], `${path}[${i}]`);
        if (result) return result;
      }
      return null;
    }

    if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const result = checkForMaliciousInput(value, `${path}.${key}`);
        if (result) return result;
      }
      return null;
    }

    return null;
  };

  // Check request body
  if (req.body) {
    const bodyResult = checkForMaliciousInput(req.body, 'body');
    if (bodyResult) {
      console.warn(`Malicious input detected in body from IP: ${req.ip}, Pattern: ${bodyResult}`);
      return res.status(400).json({
        success: false,
        error: 'Suspicious input detected in request body',
        code: 'MALICIOUS_INPUT'
      });
    }
  }

  // Check query parameters
  if (req.query) {
    const queryResult = checkForMaliciousInput(req.query, 'query');
    if (queryResult) {
      console.warn(`Malicious input detected in query from IP: ${req.ip}, Pattern: ${queryResult}`);
      return res.status(400).json({
        success: false,
        error: 'Suspicious query parameters detected',
        code: 'MALICIOUS_QUERY'
      });
    }
  }

  // Check URL parameters
  if (req.params) {
    const paramsResult = checkForMaliciousInput(req.params, 'params');
    if (paramsResult) {
      console.warn(`Malicious input detected in params from IP: ${req.ip}, Pattern: ${paramsResult}`);
      return res.status(400).json({
        success: false,
        error: 'Suspicious URL parameters detected',
        code: 'MALICIOUS_PARAMS'
      });
    }
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
