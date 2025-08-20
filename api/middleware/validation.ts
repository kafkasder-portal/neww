import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
// Express-validator temporarily removed due to compatibility issues
import * as DOMPurify from 'isomorphic-dompurify';
import { securityLogger } from './security';

// Common validation schemas
export const commonSchemas = {
  email: z.string().email().max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  phone: z.string().regex(/^[+]?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  id: z.string().uuid('Invalid ID format'),
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  date: z.string().datetime('Invalid date format'),
  url: z.string().url('Invalid URL format').optional(),
  text: z.string().max(5000, 'Text too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['active', 'inactive', 'pending', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  role: z.enum(['admin', 'manager', 'user', 'viewer'])
};

// Validation schemas for different entities
export const validationSchemas = {
  // Auth schemas
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    full_name: commonSchemas.name,
    department: z.string().max(100).optional(),
    phone: commonSchemas.phone
  }),

  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required')
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
    confirmPassword: z.string().min(1, 'Password confirmation is required')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  }),

  // Beneficiary schemas
  createBeneficiary: z.object({
    full_name: commonSchemas.name,
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone,
    address: commonSchemas.text,
    birth_date: z.string().optional(),
    emergency_contact: commonSchemas.phone.optional(),
    notes: commonSchemas.description
  }),

  updateBeneficiary: z.object({
    full_name: commonSchemas.name.optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    address: commonSchemas.text.optional(),
    birth_date: z.string().optional(),
    emergency_contact: commonSchemas.phone.optional(),
    notes: commonSchemas.description.optional(),
    is_active: z.boolean().optional()
  }),

  // Donation schemas
  createDonation: z.object({
    donor_id: commonSchemas.id,
    amount: commonSchemas.amount,
    currency: z.enum(['TRY', 'USD', 'EUR']).default('TRY'),
    donation_type: z.enum(['one_time', 'monthly', 'yearly']).default('one_time'),
    category_id: commonSchemas.id.optional(),
    notes: commonSchemas.description,
    is_anonymous: z.boolean().default(false)
  }),

  createDonor: z.object({
    full_name: commonSchemas.name,
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    address: commonSchemas.text.optional(),
    tax_number: z.string().max(20).optional(),
    company_name: z.string().max(200).optional(),
    notes: commonSchemas.description
  }),

  // Task schemas
  createTask: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: commonSchemas.description,
    assigned_to: commonSchemas.id.optional(),
    priority: commonSchemas.priority.default('medium'),
    due_date: z.string().datetime().optional(),
    category: z.string().max(50).optional()
  }),

  updateTask: z.object({
    title: z.string().min(1).max(200).optional(),
    description: commonSchemas.description.optional(),
    assigned_to: commonSchemas.id.optional(),
    priority: commonSchemas.priority.optional(),
    status: commonSchemas.status.optional(),
    due_date: z.string().datetime().optional(),
    category: z.string().max(50).optional()
  }),

  // Meeting schemas
  createMeeting: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: commonSchemas.description,
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    location: z.string().max(200).optional(),
    participant_ids: z.array(commonSchemas.id).optional(),
    meeting_type: z.enum(['board', 'general', 'committee', 'other']).default('general')
  }).refine(data => new Date(data.end_time) > new Date(data.start_time), {
    message: 'End time must be after start time',
    path: ['end_time']
  }),

  // Message schemas
  createMessage: z.object({
    recipient_id: commonSchemas.id,
    subject: z.string().min(1, 'Subject is required').max(200),
    content: z.string().min(1, 'Content is required').max(5000),
    priority: commonSchemas.priority.default('medium'),
    message_type: z.enum(['email', 'sms', 'whatsapp', 'internal']).default('internal')
  }),

  // Payment schemas
  createPayment: z.object({
    donation_id: commonSchemas.id,
    amount: commonSchemas.amount,
    currency: z.enum(['TRY', 'USD', 'EUR']).default('TRY'),
    payment_method: z.enum(['credit_card', 'bank_transfer', 'cash', 'other']),
    transaction_id: z.string().max(100).optional(),
    notes: commonSchemas.description
  })
};

// Zod validation middleware
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize input before validation
      const sanitizedBody = sanitizeInput(req.body);
      
      // Validate with Zod
      const validatedData = schema.parse(sanitizedBody);
      
      // Replace request body with validated data
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        securityLogger('VALIDATION_ERROR', {
          errors: error.errors,
          path: req.path,
          method: req.method
        }, req);
        
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }
      
      securityLogger('VALIDATION_UNEXPECTED_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path,
        method: req.method
      }, req);
      
      return res.status(500).json({
        error: 'Internal validation error'
      });
    }
  };
};

// Express-validator based validations temporarily removed due to compatibility issues
// TODO: Re-implement with proper express-validator v7 syntax

// Input sanitization function
function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potential XSS attacks
    return DOMPurify.sanitize(input.trim());
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
}

// Express-validator error handler temporarily removed due to compatibility issues
// TODO: Re-implement with proper express-validator v7 syntax

// File upload validation
export const validateFileUpload = (allowedTypes: string[], maxSize: number = 5 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }
    
    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      securityLogger('FILE_TYPE_VALIDATION_ERROR', {
        mimetype: req.file.mimetype,
        allowedTypes,
        filename: req.file.originalname
      }, req);
      
      return res.status(400).json({
        error: 'Invalid file type',
        allowedTypes
      });
    }
    
    // Check file size
    if (req.file.size > maxSize) {
      securityLogger('FILE_SIZE_VALIDATION_ERROR', {
        size: req.file.size,
        maxSize,
        filename: req.file.originalname
      }, req);
      
      return res.status(400).json({
        error: 'File too large',
        maxSize: `${maxSize / (1024 * 1024)}MB`
      });
    }
    
    next();
  };
};

// SQL injection prevention
export const preventSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /('|(--)|(;)|(\||\|)|(\*|\*))/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];
  
  const checkForSQLInjection = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    
    if (Array.isArray(value)) {
      return value.some(checkForSQLInjection);
    }
    
    if (value && typeof value === 'object') {
      return Object.values(value).some(checkForSQLInjection);
    }
    
    return false;
  };
  
  const suspicious = [
    ...Object.values(req.body || {}),
    ...Object.values(req.query || {}),
    ...Object.values(req.params || {})
  ];
  
  if (suspicious.some(checkForSQLInjection)) {
    securityLogger('SQL_INJECTION_ATTEMPT', {
      body: req.body,
      query: req.query,
      params: req.params,
      path: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      error: 'Invalid input detected'
    });
  }
  
  next();
};
