import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';
import crypto from 'crypto';
import { securityLogger } from './security';

// XSS Protection Middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Set XSS protection headers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

// Deep sanitization of objects
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// String sanitization
function sanitizeString(str: string): string {
  // Remove potential XSS vectors
  let sanitized = DOMPurify.sanitize(str, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  // Additional XSS pattern detection
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onload
    /expression\s*\(/gi, // CSS expressions
    /url\s*\(/gi, // CSS url() functions
    /@import/gi // CSS imports
  ];
  
  // Check for XSS patterns
  const originalLength = sanitized.length;
  xssPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Log if XSS attempt was detected
  if (sanitized.length !== originalLength) {
    securityLogger('XSS_ATTEMPT_DETECTED', {
      original: str,
      sanitized: sanitized,
      removedContent: str.length - sanitized.length
    });
  }
  
  return sanitized;
}

// CSRF Token Management
interface CSRFTokenStore {
  [sessionId: string]: {
    token: string;
    expires: number;
  };
}

const csrfTokens: CSRFTokenStore = {};
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

// Generate CSRF token
export const generateCSRFToken = (sessionId: string): string => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + CSRF_TOKEN_EXPIRY;
  
  csrfTokens[sessionId] = { token, expires };
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
};

// Validate CSRF token
export const validateCSRFToken = (sessionId: string, token: string): boolean => {
  const storedToken = csrfTokens[sessionId];
  
  if (!storedToken) {
    return false;
  }
  
  if (Date.now() > storedToken.expires) {
    delete csrfTokens[sessionId];
    return false;
  }
  
  return storedToken.token === token;
};

// CSRF Protection Middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF protection for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Skip for API endpoints that use API keys
  if (req.headers['x-api-key']) {
    return next();
  }
  
  const sessionId = req.sessionID || req.session?.id;
  if (!sessionId) {
    securityLogger('CSRF_NO_SESSION', {
      path: req.path,
      method: req.method,
      ip: req.ip
    }, req);
    
    return res.status(403).json({
      error: 'No session found',
      code: 'CSRF_NO_SESSION'
    });
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;
  
  if (!token) {
    securityLogger('CSRF_TOKEN_MISSING', {
      path: req.path,
      method: req.method,
      sessionId,
      ip: req.ip
    }, req);
    
    return res.status(403).json({
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING'
    });
  }
  
  if (!validateCSRFToken(sessionId, token as string)) {
    securityLogger('CSRF_TOKEN_INVALID', {
      path: req.path,
      method: req.method,
      sessionId,
      token: token,
      ip: req.ip
    }, req);
    
    return res.status(403).json({
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    });
  }
  
  next();
};

// CSRF Token endpoint
export const getCSRFToken = (req: Request, res: Response) => {
  const sessionId = req.sessionID || req.session?.id;
  
  if (!sessionId) {
    return res.status(400).json({
      error: 'No session found'
    });
  }
  
  const token = generateCSRFToken(sessionId);
  
  res.json({
    csrfToken: token,
    expires: Date.now() + CSRF_TOKEN_EXPIRY
  });
};

// Clean up expired tokens
function cleanupExpiredTokens(): void {
  const now = Date.now();
  
  Object.keys(csrfTokens).forEach(sessionId => {
    if (csrfTokens[sessionId].expires < now) {
      delete csrfTokens[sessionId];
    }
  });
}

// Content Security Policy
export const contentSecurityPolicy = (req: Request, res: Response, next: NextFunction) => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.supabase.co wss://realtime.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];
  
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  next();
};

// HTML encoding for output
export const htmlEncode = (str: string): string => {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'\/]/g, (match) => htmlEntities[match]);
};

// URL encoding
export const urlEncode = (str: string): string => {
  return encodeURIComponent(str);
};

// Safe JSON response
export const safeJsonResponse = (res: Response, data: any, statusCode: number = 200) => {
  // Ensure no script tags in JSON response
  const jsonString = JSON.stringify(data);
  const safeJson = jsonString.replace(/<\/script>/gi, '<\/script>');
  
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(statusCode).send(safeJson);
};

// Input length validation
export const validateInputLength = (maxLength: number = 10000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const checkLength = (obj: any, path: string = ''): boolean => {
      if (typeof obj === 'string') {
        if (obj.length > maxLength) {
          securityLogger('INPUT_LENGTH_EXCEEDED', {
            path: path,
            length: obj.length,
            maxLength,
            requestPath: req.path
          }, req);
          return false;
        }
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (!checkLength(obj[i], `${path}[${i}]`)) {
            return false;
          }
        }
      } else if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (!checkLength(obj[key], path ? `${path}.${key}` : key)) {
              return false;
            }
          }
        }
      }
      return true;
    };
    
    if (!checkLength(req.body)) {
      return res.status(400).json({
        error: 'Input too long',
        maxLength
      });
    }
    
    next();
  };
};

// Periodic cleanup of expired CSRF tokens
setInterval(cleanupExpiredTokens, 15 * 60 * 1000); // Every 15 minutes