import DOMPurify from 'dompurify';

/**
 * Sanitization configuration options
 */
export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripTags?: boolean;
  allowHtml?: boolean;
}

/**
 * Default sanitization options for different contexts
 */
export const SANITIZATION_CONFIGS = {
  // For plain text inputs (forms, search, etc.)
  TEXT_ONLY: {
    allowedTags: [] as string[],
    allowedAttributes: [] as string[],
    stripTags: true,
    allowHtml: false,
  },
  
  // For rich text content (messages, descriptions)
  RICH_TEXT: {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as string[],
    allowedAttributes: ['class'] as string[],
    stripTags: false,
    allowHtml: true,
  },
  
  // For HTML content with links
  HTML_WITH_LINKS: {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'] as string[],
    allowedAttributes: ['class', 'href', 'target', 'rel'] as string[],
    stripTags: false,
    allowHtml: true,
  },
  
  // For email inputs
  EMAIL: {
    allowedTags: [] as string[],
    allowedAttributes: [] as string[],
    stripTags: true,
    allowHtml: false,
  },
  
  // For phone number inputs
  PHONE: {
    allowedTags: [] as string[],
    allowedAttributes: [] as string[],
    stripTags: true,
    allowHtml: false,
  },
  
  // For URL inputs
  URL: {
    allowedTags: [] as string[],
    allowedAttributes: [] as string[],
    stripTags: true,
    allowHtml: false,
  },
};

/**
 * Sanitize input string based on configuration
 */
export function sanitizeInput(
  input: string | null | undefined,
  config: SanitizationOptions = SANITIZATION_CONFIGS.TEXT_ONLY
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Configure DOMPurify based on options
  const purifyConfig: Record<string, unknown> = {};
  
  if (config.allowedTags) {
    purifyConfig.ALLOWED_TAGS = config.allowedTags;
  }
  
  if (config.allowedAttributes) {
    purifyConfig.ALLOWED_ATTR = config.allowedAttributes;
  }
  
  if (config.stripTags) {
    purifyConfig.ALLOWED_TAGS = [];
    purifyConfig.KEEP_CONTENT = true;
  }

  // Additional security configurations
  purifyConfig.FORBID_ATTR = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'];
  purifyConfig.FORBID_TAGS = ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'];
  
  return DOMPurify.sanitize(input.trim(), purifyConfig) as unknown as string;
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  config: SanitizationOptions = SANITIZATION_CONFIGS.TEXT_ONLY
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = { ...obj } as Record<string, unknown>;
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, config);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item, config) : 
        typeof item === 'object' ? sanitizeObject(item, config) : item
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, config);
    }
  }
  
  return sanitized as T;
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  // Remove any HTML tags and dangerous characters
  const cleaned = sanitizeInput(email, SANITIZATION_CONFIGS.TEXT_ONLY);
  
  // Basic email validation pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailPattern.test(cleaned) ? cleaned : '';
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhoneNumber(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove HTML and keep only numbers, spaces, +, -, (, )
  const cleaned = sanitizeInput(phone, SANITIZATION_CONFIGS.TEXT_ONLY);
  
  return cleaned.replace(/[^0-9+\-\s()]/g, '');
}

// Helper function to check if a URL is a placeholder or invalid
function isValidUrlString(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const trimmedUrl = url.trim();
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^YOUR_.*_URL$/i,
    /^PLACEHOLDER/i,
    /^REPLACE_WITH/i,
    /^\[.*\]$/,
    /^<.*>$/,
    /^\{.*\}$/,
    /^undefined$/i,
    /^null$/i,
    /^\s*$/
  ];
  
  if (placeholderPatterns.some(pattern => pattern.test(trimmedUrl))) {
    return false;
  }
  
  // Basic URL format check
  if (trimmedUrl.length < 3) return false;
  
  return true;
}

/**
 * Comprehensive URL validation helper function
 * Checks if a URL is valid and safe to use in URL constructor
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const trimmedUrl = url.trim();
  
  // Use the internal helper to check for placeholders
  if (!isValidUrlString(trimmedUrl)) {
    return false;
  }
  
  try {
    // Try to construct URL object
    let urlObj: URL;
    
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      // Absolute URL
      urlObj = new URL(trimmedUrl);
    } else {
      // Relative URL - use a safe base for testing
      urlObj = new URL(trimmedUrl, 'http://localhost');
    }
    
    // Check for valid protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Safe URL constructor that returns null for invalid URLs
 * Use this instead of new URL() to avoid throwing errors
 */
export function safeUrlConstruct(url: string, base?: string): URL | null {
  if (!isValidUrl(url)) {
    return null;
  }
  
  try {
    return base ? new URL(url, base) : new URL(url);
  } catch {
    return null;
  }
}

/**
 * Get a safe URL string with fallback
 * Returns the URL if valid, otherwise returns the fallback
 */
export function getSafeUrl(url: string | null | undefined, fallback: string = ''): string {
  if (!url || !isValidUrl(url)) {
    return fallback;
  }
  
  return sanitizeUrl(url) || fallback;
}

/**
 * Sanitize URLs
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const cleaned = sanitizeInput(url, SANITIZATION_CONFIGS.TEXT_ONLY);
  
  // Check if it's a valid URL string (not a placeholder)
  if (!isValidUrlString(cleaned)) {
    return '';
  }
  
  // Only allow http and https protocols
  try {
    let urlObj: URL;
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      // Absolute URL
      urlObj = new URL(cleaned);
    } else {
      // Relative URL - use current origin as base
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      urlObj = new URL(cleaned, baseUrl);
    }
    
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return urlObj.toString();
    }
  } catch {
    // Invalid URL
  }
  
  return '';
}