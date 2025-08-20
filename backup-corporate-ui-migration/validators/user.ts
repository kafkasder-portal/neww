import { z } from 'zod';
import {
  idSchema,
  nameSchema,
  surnameSchema,
  emailSchema,
  phoneSchema,

  dateSchema,
  requiredStringSchema,
  optionalStringSchema,
  descriptionSchema,
  notesSchema
} from './common';
import { passwordSchema } from './auth';

// User role schema
export const userRoleSchema = z.enum([
  'super_admin',
  'admin',
  'manager',
  'coordinator',
  'operator',
  'viewer'
], {
  message: 'Geçerli bir kullanıcı rolü seçiniz'
});

// User status schema
export const userStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending_verification',
  'locked'
], {
  message: 'Geçerli bir kullanıcı durumu seçiniz'
});

// Department schema
export const departmentSchema = z.enum([
  'administration',
  'social_services',
  'finance',
  'operations',
  'it',
  'communications',
  'field_work',
  'other'
], {
  message: 'Geçerli bir departman seçiniz'
});

// User preferences schema
export const userPreferencesSchema = z.object({
  language: z.enum(['tr', 'en'], {
    message: 'Geçerli bir dil seçiniz'
  }).default('tr'),
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Geçerli bir tema seçiniz'
  }).default('system'),
  timezone: z.string().default('Europe/Istanbul'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], {
    message: 'Geçerli bir tarih formatı seçiniz'
  }).default('DD/MM/YYYY'),
  timeFormat: z.enum(['12', '24'], {
    message: 'Geçerli bir saat formatı seçiniz'
  }).default('24'),
  notifications: z.object({
    email: z.boolean().default(true),
    browser: z.boolean().default(true),
    mobile: z.boolean().default(false),
    sms: z.boolean().default(false)
  }),
  dashboard: z.object({
    defaultView: z.enum(['overview', 'beneficiaries', 'applications', 'aid'], {
      message: 'Geçerli bir varsayılan görünüm seçiniz'
    }).default('overview'),
    itemsPerPage: z.number().min(10).max(100).default(25),
    autoRefresh: z.boolean().default(false),
    refreshInterval: z.number().min(30).max(300).default(60) // seconds
  })
});

// User profile schema
export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: surnameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  avatar: z.string().url('Geçerli bir URL giriniz').optional(),
  title: optionalStringSchema,
  department: departmentSchema.optional(),
  bio: z.string().max(500, 'Biyografi en fazla 500 karakter olabilir').optional(),
  location: optionalStringSchema,
  website: z.string().url('Geçerli bir URL giriniz').optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Geçerli bir LinkedIn URL\'si giriniz').optional(),
    twitter: z.string().url('Geçerli bir Twitter URL\'si giriniz').optional(),
    github: z.string().url('Geçerli bir GitHub URL\'si giriniz').optional()
  }).optional()
});

// User security schema
export const userSecuritySchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  lastPasswordChange: dateSchema.optional(),
  passwordExpiryDate: dateSchema.optional(),
  loginAttempts: z.number().min(0).default(0),
  lastLoginAt: dateSchema.optional(),
  lastLoginIp: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz').optional(),
  sessionTimeout: z.number().min(5).max(1440).default(30), // minutes
  allowedIpAddresses: z.array(z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz')).optional(),
  securityQuestions: z.array(z.object({
    question: requiredStringSchema,
    answer: requiredStringSchema // This should be hashed
  })).optional()
});

// Permission schema
export const permissionSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(50, 'İzin adı en fazla 50 karakter olabilir'),
  description: descriptionSchema,
  category: z.enum([
    'system',
    'users',
    'beneficiaries',
    'applications',
    'aid',
    'donations',
    'scholarship',
    'reports',
    'settings'
  ], {
    message: 'Geçerli bir izin kategorisi seçiniz'
  }),
  actions: z.array(z.enum(['create', 'read', 'update', 'delete', 'approve', 'export'], {
    message: 'Geçerli bir eylem seçiniz'
  })),
  isActive: z.boolean().default(true)
});

// Role schema
export const roleSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(50, 'Rol adı en fazla 50 karakter olabilir'),
  description: descriptionSchema,
  level: z.number().min(1).max(10), // 1 = highest authority, 10 = lowest
  permissions: z.array(idSchema),
  isSystemRole: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional()
});

// Main user schema
export const userSchema = z.object({
  id: idSchema.optional(),
  
  // Basic information
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır').max(30, 'Kullanıcı adı en fazla 30 karakter olabilir').regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  email: emailSchema,
  emailVerified: z.boolean().default(false),
  emailVerificationToken: optionalStringSchema,
  
  // Profile information
  profile: userProfileSchema,
  
  // Role and permissions
  role: userRoleSchema,
  customPermissions: z.array(idSchema).optional(),
  
  // Status and security
  status: userStatusSchema.default('pending_verification'),
  security: userSecuritySchema,
  
  // Preferences
  preferences: userPreferencesSchema,
  
  // Employment information
  employeeId: optionalStringSchema,
  hireDate: dateSchema.optional(),
  terminationDate: dateSchema.optional(),
  supervisor: idSchema.optional(),
  
  // Additional information
  notes: notesSchema,
  tags: z.array(z.string()).default([]),
  
  // Metadata
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional(),
  lastActiveAt: dateSchema.optional()
});

// User creation schema
export const createUserSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır').max(30, 'Kullanıcı adı en fazla 30 karakter olabilir').regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: surnameSchema,
  role: userRoleSchema,
  department: departmentSchema.optional(),
  phone: phoneSchema.optional(),
  sendWelcomeEmail: z.boolean().default(true)
});

// User update schema
export const updateUserSchema = userSchema.partial().omit({
  id: true,
  createdAt: true,
  createdBy: true,
  security: true // Security should be updated separately
});

// User search schema
export const userSearchSchema = z.object({
  query: z.string().max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  username: optionalStringSchema,
  email: emailSchema.optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  department: departmentSchema.optional(),
  createdAfter: dateSchema.optional(),
  createdBefore: dateSchema.optional(),
  lastActiveAfter: dateSchema.optional(),
  lastActiveBefore: dateSchema.optional(),
  tags: z.array(z.string()).optional()
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: requiredStringSchema,
  newPassword: passwordSchema,
  confirmPassword: requiredStringSchema
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword']
});

// User activity log schema
export const userActivitySchema = z.object({
  id: idSchema.optional(),
  userId: idSchema,
  action: requiredStringSchema,
  resource: optionalStringSchema,
  resourceId: idSchema.optional(),
  details: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz').optional(),
  userAgent: optionalStringSchema,
  timestamp: dateSchema,
  success: z.boolean().default(true),
  errorMessage: optionalStringSchema
});

// User statistics schema
export const userStatsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  inactiveUsers: z.number(),
  suspendedUsers: z.number(),
  byRole: z.record(z.string(), z.number()),
  byDepartment: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  newUsersThisMonth: z.number(),
  averageSessionDuration: z.number(),
  mostActiveUsers: z.array(z.object({
    userId: idSchema,
    username: z.string(),
    activityCount: z.number(),
    lastActive: dateSchema
  }))
});

// Type exports
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type Department = z.infer<typeof departmentSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserSecurity = z.infer<typeof userSecuritySchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserSearch = z.infer<typeof userSearchSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type UserActivity = z.infer<typeof userActivitySchema>;
export type UserStats = z.infer<typeof userStatsSchema>;