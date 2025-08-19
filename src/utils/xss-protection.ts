import DOMPurify from 'dompurify';

// XSS Protection utility functions for frontend

// Configure DOMPurify for different use cases
const createPurifyConfig = (allowedTags: string[] = [], allowedAttributes: string[] = []) => ({
  ALLOWED_TAGS: allowedTags,
  ALLOWED_ATTR: allowedAttributes,
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
});

// Strict sanitization - no HTML allowed
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  return DOMPurify.sanitize(input, createPurifyConfig());
};

// Basic HTML sanitization - allows safe HTML tags
export const sanitizeHTML = (input: string): string => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre'
  ];
  
  const allowedAttributes = ['class', 'id'];
  
  return DOMPurify.sanitize(input, createPurifyConfig(allowedTags, allowedAttributes));
};

// Rich text sanitization - allows more HTML tags for rich text editors
export const sanitizeRichText = (input: string): string => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 's', 'sub', 'sup',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead',
    'tbody', 'tr', 'td', 'th', 'div', 'span'
  ];
  
  const allowedAttributes = [
    'class', 'id', 'href', 'target', 'rel', 'src', 'alt',
    'width', 'height', 'style', 'title'
  ];
  
  return DOMPurify.sanitize(input, {
    ...createPurifyConfig(allowedTags, allowedAttributes),
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
};

// URL sanitization
export const sanitizeURL = (url: string): string => {
  if (typeof url !== 'string') {
    return '';
  }
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lowerUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }
  
  // Allow only http, https, mailto, tel
  const allowedProtocols = /^(https?:|mailto:|tel:|#|\/)/i;
  if (!allowedProtocols.test(url)) {
    return '';
  }
  
  return DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Sanitize object recursively
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T, 
  sanitizer: (value: string) => string = sanitizeText
): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizer(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, sanitizer)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeText(key);
      sanitizedObj[sanitizedKey] = sanitizeObject(value, sanitizer);
    }
    return sanitizedObj;
  }
  
  return obj;
};

// Validate and sanitize form data
export const sanitizeFormData = (formData: FormData): FormData => {
  const sanitizedFormData = new FormData();
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      sanitizedFormData.append(sanitizeText(key), sanitizeText(value));
    } else {
      // For File objects, only sanitize the key
      sanitizedFormData.append(sanitizeText(key), value);
    }
  }
  
  return sanitizedFormData;
};

// Input validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[+]?[1-9]?[0-9]{7,15}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s._-]+$/,
  safeFilename: /^[a-zA-Z0-9._-]+$/,
};

// Validate input against patterns
export const validateInput = (
  input: string, 
  pattern: RegExp, 
  maxLength: number = 1000
): { isValid: boolean; error?: string } => {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input too long (max ${maxLength} characters)` };
  }
  
  if (!pattern.test(input)) {
    return { isValid: false, error: 'Input contains invalid characters' };
  }
  
  return { isValid: true };
};

// Check for suspicious content
export const detectSuspiciousContent = (input: string): { isSuspicious: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  
  // Check for script tags
  if (/<script[^>]*>.*?<\/script>/gi.test(input)) {
    reasons.push('Contains script tags');
  }
  
  // Check for javascript: protocol
  if (/javascript:/gi.test(input)) {
    reasons.push('Contains javascript: protocol');
  }
  
  // Check for event handlers
  if (/on\w+\s*=/gi.test(input)) {
    reasons.push('Contains event handlers');
  }
  
  // Check for iframe/object/embed tags
  if (/<(iframe|object|embed)[^>]*>/gi.test(input)) {
    reasons.push('Contains potentially dangerous HTML tags');
  }
  
  // Check for SQL injection patterns
  if (/(union|select|insert|delete|update|drop|create|alter)\s/gi.test(input)) {
    reasons.push('Contains SQL-like keywords');
  }
  
  // Check for excessive special characters
  const specialCharCount = (input.match(/[<>"'&;(){}[\]]/g) || []).length;
  if (specialCharCount > input.length * 0.1) {
    reasons.push('Excessive special characters');
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  };
};

// React component wrapper for safe HTML rendering
export const createSafeHTML = (html: string, sanitizer = sanitizeHTML) => {
  return {
    __html: sanitizer(html)
  };
};

// Hook for safe HTML rendering in React components
export const useSafeHTML = (html: string, sanitizer = sanitizeHTML) => {
  return createSafeHTML(html, sanitizer);
};

// Content Security Policy nonce helper
export const getCSPNonce = (): string => {
  const nonceElement = document.querySelector('meta[name="csp-nonce"]') as HTMLMetaElement;
  return nonceElement?.content || '';
};

// Safe eval alternative (for JSON parsing)
export const safeJSONParse = <T = any>(jsonString: string, fallback: T): T => {
  try {
    // First sanitize the string
    const sanitized = sanitizeText(jsonString);
    
    // Additional check for dangerous patterns
    if (sanitized.includes('__proto__') || sanitized.includes('constructor') || sanitized.includes('prototype')) {
      console.warn('Potentially dangerous JSON detected');
      return fallback;
    }
    
    return JSON.parse(sanitized);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
};

// Export all functions as a namespace
export const XSSProtection = {
  sanitizeText,
  sanitizeHTML,
  sanitizeRichText,
  sanitizeURL,
  sanitizeObject,
  sanitizeFormData,
  validateInput,
  detectSuspiciousContent,
  createSafeHTML,
  useSafeHTML,
  getCSPNonce,
  safeJSONParse,
  ValidationPatterns,
};

export default XSSProtection;