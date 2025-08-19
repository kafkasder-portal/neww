import DOMPurify from 'dompurify';

/**
 * Frontend Security Utilities
 */

// Security configuration
export const SECURITY_CONFIG = {
  // CSP violations logging
  CSP_REPORT_ENDPOINT: '/api/security/csp-report',
  
  // Input validation patterns
  DANGEROUS_PATTERNS: [
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*>/gi,
    /<link\b[^<]*>/gi,
    /<meta\b[^<]*>/gi,
  ],
  
  // Safe URL patterns
  SAFE_URL_PATTERNS: [
    /^https?:\/\//i,
    /^\/(?!\/)/i,
    /^#/i,
    /^mailto:/i,
    /^tel:/i,
  ]
};

/**
 * Enhanced DOMPurify configuration for different contexts
 */
export const PURIFY_CONFIGS = {
  // Strict text-only (remove all HTML)
  TEXT_ONLY: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  
  // Basic formatting allowed
  BASIC_HTML: {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  
  // Rich text with links
  RICH_TEXT: {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    KEEP_CONTENT: true,
  },
  
  // For display only (no user input)
  DISPLAY_SAFE: {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'a', 'ul', 'ol', 'li', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    KEEP_CONTENT: true,
  }
};

/**
 * Sanitize HTML content with context-specific rules
 */
export function sanitizeHtml(
  input: string | null | undefined,
  config: keyof typeof PURIFY_CONFIGS = 'TEXT_ONLY'
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  try {
    return DOMPurify.sanitize(input, PURIFY_CONFIGS[config]);
  } catch (error) {
    console.error('HTML sanitization error:', error);
    return '';
  }
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Check for dangerous patterns
  for (const pattern of SECURITY_CONFIG.DANGEROUS_PATTERNS) {
    if (pattern.test(url)) {
      console.warn('Dangerous URL pattern detected:', url);
      return '';
    }
  }
  
  // Check if URL matches safe patterns
  const isSafe = SECURITY_CONFIG.SAFE_URL_PATTERNS.some(pattern => pattern.test(url));
  
  if (!isSafe) {
    console.warn('Unsafe URL pattern:', url);
    return '';
  }
  
  return url;
}

/**
 * Content Security Policy (CSP) utilities
 */
export class CSPUtils {
  private static nonces = new Set<string>();
  
  /**
   * Generate a secure nonce for inline scripts/styles
   */
  static generateNonce(): string {
    const nonce = btoa(crypto.getRandomValues(new Uint8Array(16)).join(''));
    this.nonces.add(nonce);
    return nonce;
  }
  
  /**
   * Validate nonce
   */
  static validateNonce(nonce: string): boolean {
    return this.nonces.has(nonce);
  }
  
  /**
   * Report CSP violation
   */
  static reportViolation(violationData: any): void {
    // Log violation locally
    console.warn('CSP Violation:', violationData);
    
    // Send to server for analysis (in production)
    if (process.env.NODE_ENV === 'production') {
      fetch(SECURITY_CONFIG.CSP_REPORT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...violationData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(error => {
        console.error('Failed to report CSP violation:', error);
      });
    }
  }
}

/**
 * Input validation utilities
 */
export class InputValidator {
  /**
   * Check if input contains potentially dangerous content
   */
  static isDangerous(input: string): boolean {
    return SECURITY_CONFIG.DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }
  
  /**
   * Validate file upload
   */
  static validateFileUpload(file: File): { valid: boolean; reason?: string } {
    // Check file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { valid: false, reason: 'File too large' };
    }
    
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, reason: 'File type not allowed' };
    }
    
    // Check file name for dangerous patterns
    if (this.isDangerous(file.name)) {
      return { valid: false, reason: 'Suspicious file name' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate form data recursively
   */
  static validateFormData(data: any): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    const validateRecursive = (obj: any, path: string = ''): void => {
      if (typeof obj === 'string') {
        if (this.isDangerous(obj)) {
          violations.push(`Dangerous content in ${path}`);
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          validateRecursive(item, `${path}[${index}]`);
        });
      } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
          validateRecursive(value, path ? `${path}.${key}` : key);
        });
      }
    };
    
    validateRecursive(data);
    
    return {
      valid: violations.length === 0,
      violations,
    };
  }
}

/**
 * Security headers helper
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
    ].join('; '),
    
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Initialize security measures
 */
export function initializeSecurity(): void {
  // Add CSP violation event listener
  if (typeof document !== 'undefined') {
    document.addEventListener('securitypolicyviolation', (event) => {
      CSPUtils.reportViolation({
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition,
      });
    });
  }
  
  // Configure DOMPurify hooks for additional security
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    // Remove any data-* attributes that could contain code
    if (node.nodeType === 1) { // Element node
      const element = node as Element;
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && InputValidator.isDangerous(attr.value)) {
          element.removeAttribute(attr.name);
        }
      });
    }
  });
  
  // Log configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 Security utilities initialized');
  }
}

export default {
  sanitizeHtml,
  sanitizeUrl,
  CSPUtils,
  InputValidator,
  getSecurityHeaders,
  initializeSecurity,
  PURIFY_CONFIGS,
  SECURITY_CONFIG,
};
