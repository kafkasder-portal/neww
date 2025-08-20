import { z } from 'zod';
import {
  idSchema,
  dateSchema,
  emailSchema,
  urlSchema,
  requiredStringSchema,
  optionalStringSchema,
  descriptionSchema,
  notesSchema,

} from './common';

// System settings schema
export const systemSettingsSchema = z.object({
  // General settings
  organizationName: requiredStringSchema.max(100, 'Organizasyon adı en fazla 100 karakter olabilir'),
  organizationLogo: urlSchema,
  organizationAddress: requiredStringSchema.max(200, 'Adres en fazla 200 karakter olabilir'),
  organizationPhone: requiredStringSchema.max(20, 'Telefon en fazla 20 karakter olabilir'),
  organizationEmail: emailSchema,
  organizationWebsite: urlSchema,
  
  // Application settings
  applicationName: requiredStringSchema.max(50, 'Uygulama adı en fazla 50 karakter olabilir'),
  applicationVersion: requiredStringSchema.max(20, 'Versiyon en fazla 20 karakter olabilir'),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: optionalStringSchema,
  
  // Security settings
  passwordMinLength: z.number().min(6).max(20).default(8),
  passwordRequireUppercase: z.boolean().default(true),
  passwordRequireLowercase: z.boolean().default(true),
  passwordRequireNumbers: z.boolean().default(true),
  passwordRequireSymbols: z.boolean().default(true),
  passwordExpiryDays: z.number().min(0).max(365).default(90),
  maxLoginAttempts: z.number().min(3).max(10).default(5),
  sessionTimeoutMinutes: z.number().min(5).max(1440).default(30),
  twoFactorRequired: z.boolean().default(false),
  
  // File upload settings
  maxFileSize: z.number().min(1).max(100).default(5), // MB
  allowedFileTypes: z.array(z.string()).default(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']),
  
  // Email settings
  emailEnabled: z.boolean().default(true),
  smtpHost: optionalStringSchema,
  smtpPort: z.number().min(1).max(65535).optional(),
  smtpUsername: optionalStringSchema,
  smtpPassword: optionalStringSchema,
  smtpSecure: z.boolean().default(true),
  emailFromAddress: emailSchema.optional(),
  emailFromName: optionalStringSchema,
  
  // Notification settings
  notificationsEnabled: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  
  // Backup settings
  autoBackupEnabled: z.boolean().default(true),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly'], {
    message: 'Geçerli bir yedekleme sıklığı seçiniz'
  }).default('daily'),
  backupRetentionDays: z.number().min(7).max(365).default(30),
  backupLocation: optionalStringSchema,
  
  // Localization settings
  defaultLanguage: z.enum(['tr', 'en'], {
    message: 'Geçerli bir dil seçiniz'
  }).default('tr'),
  defaultTimezone: z.string().default('Europe/Istanbul'),
  defaultCurrency: z.string().length(3, 'Para birimi 3 karakter olmalıdır').default('TRY'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], {
    message: 'Geçerli bir tarih formatı seçiniz'
  }).default('DD/MM/YYYY'),
  
  // Integration settings
  apiEnabled: z.boolean().default(false),
  apiRateLimit: z.number().min(10).max(10000).default(100),
  webhooksEnabled: z.boolean().default(false),
  
  // Audit settings
  auditLogEnabled: z.boolean().default(true),
  auditLogRetentionDays: z.number().min(30).max(2555).default(365),
  
  // Performance settings
  cacheEnabled: z.boolean().default(true),
  cacheTtl: z.number().min(60).max(86400).default(3600), // seconds
  
  // Feature flags
  features: z.object({
    beneficiaryManagement: z.boolean().default(true),
    applicationProcessing: z.boolean().default(true),
    aidDistribution: z.boolean().default(true),
    donationManagement: z.boolean().default(true),
    scholarshipPrograms: z.boolean().default(true),
    reportGeneration: z.boolean().default(true),
    messageSystem: z.boolean().default(true),
    documentManagement: z.boolean().default(true),
    mobileApp: z.boolean().default(false),
    advancedAnalytics: z.boolean().default(false)
  }),
  
  // Custom fields
  customFields: z.record(z.string(), z.any()).optional(),
  
  // Metadata
  updatedAt: dateSchema.optional(),
  updatedBy: idSchema.optional()
});

// System status schema
export const systemStatusSchema = z.object({
  status: z.enum(['healthy', 'warning', 'critical', 'maintenance'], {
    message: 'Geçerli bir sistem durumu seçiniz'
  }),
  uptime: z.number().min(0),
  version: requiredStringSchema,
  lastUpdate: dateSchema,
  
  // Database status
  database: z.object({
    status: z.enum(['connected', 'disconnected', 'error'], {
      message: 'Geçerli bir veritabanı durumu seçiniz'
    }),
    responseTime: z.number().min(0),
    connections: z.number().min(0),
    size: z.number().min(0) // MB
  }),
  
  // Storage status
  storage: z.object({
    totalSpace: z.number().min(0), // GB
    usedSpace: z.number().min(0), // GB
    freeSpace: z.number().min(0), // GB
    usagePercentage: z.number().min(0).max(100)
  }),
  
  // Memory status
  memory: z.object({
    totalMemory: z.number().min(0), // MB
    usedMemory: z.number().min(0), // MB
    freeMemory: z.number().min(0), // MB
    usagePercentage: z.number().min(0).max(100)
  }),
  
  // Services status
  services: z.array(z.object({
    name: requiredStringSchema,
    status: z.enum(['running', 'stopped', 'error'], {
      message: 'Geçerli bir servis durumu seçiniz'
    }),
    responseTime: z.number().min(0).optional(),
    lastCheck: dateSchema
  })),
  
  // Performance metrics
  performance: z.object({
    cpuUsage: z.number().min(0).max(100),
    averageResponseTime: z.number().min(0),
    requestsPerMinute: z.number().min(0),
    errorRate: z.number().min(0).max(100)
  })
});

// Audit log schema
export const auditLogSchema = z.object({
  id: idSchema.optional(),
  userId: idSchema.optional(),
  username: optionalStringSchema,
  action: requiredStringSchema.max(100, 'Eylem en fazla 100 karakter olabilir'),
  resource: requiredStringSchema.max(50, 'Kaynak en fazla 50 karakter olabilir'),
  resourceId: idSchema.optional(),
  oldValues: z.record(z.string(), z.any()).optional(),
  newValues: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz').optional(),
  userAgent: optionalStringSchema,
  timestamp: dateSchema,
  success: z.boolean().default(true),
  errorMessage: optionalStringSchema,
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    message: 'Geçerli bir önem seviyesi seçiniz'
  }).default('medium'),
  category: z.enum([
    'authentication',
    'authorization',
    'data_access',
    'data_modification',
    'system_configuration',
    'user_management',
    'security',
    'other'
  ], {
    message: 'Geçerli bir kategori seçiniz'
  })
});

// System notification schema
export const systemNotificationSchema = z.object({
  id: idSchema.optional(),
  type: z.enum(['info', 'warning', 'error', 'success'], {
    message: 'Geçerli bir bildirim türü seçiniz'
  }),
  title: requiredStringSchema.max(100, 'Başlık en fazla 100 karakter olabilir'),
  message: requiredStringSchema.max(500, 'Mesaj en fazla 500 karakter olabilir'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    message: 'Geçerli bir öncelik seviyesi seçiniz'
  }).default('medium'),
  targetUsers: z.array(idSchema).optional(), // If empty, send to all users
  targetRoles: z.array(z.string()).optional(),
  channels: z.array(z.enum(['in_app', 'email', 'sms', 'push'], {
    message: 'Geçerli bir kanal seçiniz'
  })).default(['in_app']),
  scheduledAt: dateSchema.optional(),
  expiresAt: dateSchema.optional(),
  isRead: z.boolean().default(false),
  readAt: dateSchema.optional(),
  actionUrl: urlSchema.optional(),
  actionText: optionalStringSchema,
  metadata: z.record(z.string(), z.any()).optional(),
  createdBy: idSchema.optional(),
  createdAt: dateSchema.optional()
});

// Backup schema
export const backupSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(100, 'Yedek adı en fazla 100 karakter olabilir'),
  type: z.enum(['full', 'incremental', 'differential'], {
    message: 'Geçerli bir yedek türü seçiniz'
  }),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed'], {
    message: 'Geçerli bir yedek durumu seçiniz'
  }).default('pending'),
  size: z.number().min(0).optional(), // MB
  location: optionalStringSchema,
  startedAt: dateSchema.optional(),
  completedAt: dateSchema.optional(),
  duration: z.number().min(0).optional(), // seconds
  errorMessage: optionalStringSchema,
  checksum: optionalStringSchema,
  isAutomatic: z.boolean().default(false),
  retentionDate: dateSchema.optional(),
  createdBy: idSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// System maintenance schema
export const maintenanceSchema = z.object({
  id: idSchema.optional(),
  title: requiredStringSchema.max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: descriptionSchema,
  type: z.enum(['scheduled', 'emergency', 'routine'], {
    message: 'Geçerli bir bakım türü seçiniz'
  }),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled'], {
    message: 'Geçerli bir bakım durumu seçiniz'
  }).default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    message: 'Geçerli bir öncelik seviyesi seçiniz'
  }).default('medium'),
  scheduledStart: dateSchema,
  scheduledEnd: dateSchema,
  actualStart: dateSchema.optional(),
  actualEnd: dateSchema.optional(),
  affectedServices: z.array(z.string()),
  notifyUsers: z.boolean().default(true),
  maintenanceMessage: optionalStringSchema,
  notes: notesSchema,
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional()
}).refine(data => new Date(data.scheduledEnd) > new Date(data.scheduledStart), {
  message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  path: ['scheduledEnd']
});

// System statistics schema
export const systemStatsSchema = z.object({
  // User statistics
  totalUsers: z.number(),
  activeUsers: z.number(),
  newUsersToday: z.number(),
  
  // Beneficiary statistics
  totalBeneficiaries: z.number(),
  activeBeneficiaries: z.number(),
  newBeneficiariesToday: z.number(),
  
  // Application statistics
  totalApplications: z.number(),
  pendingApplications: z.number(),
  approvedApplications: z.number(),
  newApplicationsToday: z.number(),
  
  // Aid statistics
  totalAidRecords: z.number(),
  totalAidAmount: z.number(),
  aidDistributedToday: z.number(),
  
  // Donation statistics
  totalDonations: z.number(),
  totalDonationAmount: z.number(),
  donationsToday: z.number(),
  
  // System performance
  averageResponseTime: z.number(),
  systemUptime: z.number(),
  errorRate: z.number(),
  
  // Storage usage
  storageUsed: z.number(),
  storageTotal: z.number(),
  
  // Database statistics
  databaseSize: z.number(),
  totalRecords: z.number(),
  
  // Recent activity
  recentLogins: z.number(),
  recentActions: z.number(),
  
  // Trends (last 30 days)
  userGrowthTrend: z.array(z.number()),
  applicationTrend: z.array(z.number()),
  aidTrend: z.array(z.number()),
  donationTrend: z.array(z.number())
});

// Type exports
export type SystemSettings = z.infer<typeof systemSettingsSchema>;
export type SystemStatus = z.infer<typeof systemStatusSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type SystemNotification = z.infer<typeof systemNotificationSchema>;
export type Backup = z.infer<typeof backupSchema>;
export type Maintenance = z.infer<typeof maintenanceSchema>;
export type SystemStats = z.infer<typeof systemStatsSchema>;