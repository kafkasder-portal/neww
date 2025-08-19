import { z } from 'zod';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../constants/validation';
import { emailSchema, requiredStringSchema } from './common';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.password.min, VALIDATION_MESSAGES.minLength(VALIDATION_RULES.password.min))
  .max(VALIDATION_RULES.password.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.password.max))
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    VALIDATION_MESSAGES.passwordWeak
  );

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: requiredStringSchema,
  rememberMe: z.boolean().optional().default(false)
});

// Register schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: requiredStringSchema,
  firstName: requiredStringSchema.min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: requiredStringSchema.min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z.string().regex(/^[0-9+\s()-]+$/, VALIDATION_MESSAGES.phone).optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Kullanım şartlarını kabul etmelisiniz'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.passwordMismatch,
  path: ['confirmPassword']
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: requiredStringSchema,
  password: passwordSchema,
  confirmPassword: requiredStringSchema
}).refine(data => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.passwordMismatch,
  path: ['confirmPassword']
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: requiredStringSchema,
  newPassword: passwordSchema,
  confirmNewPassword: requiredStringSchema
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: VALIDATION_MESSAGES.passwordMismatch,
  path: ['confirmNewPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'Yeni şifre mevcut şifreden farklı olmalıdır',
  path: ['newPassword']
});

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: requiredStringSchema.min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: requiredStringSchema.min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: emailSchema,
  phone: z.string().regex(/^[0-9+\s()-]+$/, VALIDATION_MESSAGES.phone).optional(),
  avatar: z.string().url('Geçerli bir URL giriniz').optional()
});

// Two-factor authentication schema
export const twoFactorSchema = z.object({
  code: z.string().length(6, 'Doğrulama kodu 6 haneli olmalıdır').regex(/^[0-9]{6}$/, 'Sadece rakam giriniz')
});

// Session management schema
export const sessionSchema = z.object({
  deviceName: requiredStringSchema.max(50, 'Cihaz adı en fazla 50 karakter olabilir'),
  deviceType: z.enum(['desktop', 'mobile', 'tablet'], {
    message: 'Geçerli bir cihaz türü seçiniz'
  }).optional(),
  location: z.string().optional(),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz').optional()
});

// API key schema
export const apiKeySchema = z.object({
  name: requiredStringSchema.min(3, 'API anahtarı adı en az 3 karakter olmalıdır').max(50, 'API anahtarı adı en fazla 50 karakter olabilir'),
  description: z.string().max(200, 'Açıklama en fazla 200 karakter olabilir').optional(),
  permissions: z.array(z.string()).min(1, 'En az bir izin seçmelisiniz'),
  expiresAt: z.string().optional().nullable()
});

// OAuth provider schema
export const oauthProviderSchema = z.object({
  provider: z.enum(['google', 'github', 'microsoft'], {
    message: 'Geçerli bir OAuth sağlayıcısı seçiniz'
  }),
  code: requiredStringSchema,
  state: requiredStringSchema.optional(),
  redirectUri: z.string().url('Geçerli bir yönlendirme URL\'si giriniz')
});

// Email verification schema
export const emailVerificationSchema = z.object({
  token: requiredStringSchema,
  email: emailSchema
});

// Account recovery schema
export const accountRecoverySchema = z.object({
  email: emailSchema,
  recoveryMethod: z.enum(['email', 'phone', 'security_questions'], {
    message: 'Geçerli bir kurtarma yöntemi seçiniz'
  }),
  securityAnswers: z.array(z.string()).optional()
});

// Security settings schema
export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  loginNotifications: z.boolean().default(true),
  sessionTimeout: z.number().min(5, 'Oturum zaman aşımı en az 5 dakika olmalıdır').max(1440, 'Oturum zaman aşımı en fazla 24 saat olabilir').default(30),
  allowedIpAddresses: z.array(z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz')).optional(),
  passwordChangeRequired: z.boolean().default(false)
});

// Login attempt schema
export const loginAttemptSchema = z.object({
  email: emailSchema,
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Geçerli bir IP adresi giriniz'),
  userAgent: z.string().optional(),
  success: z.boolean(),
  failureReason: z.string().optional()
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TwoFactorInput = z.infer<typeof twoFactorSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type OAuthProviderInput = z.infer<typeof oauthProviderSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type AccountRecoveryInput = z.infer<typeof accountRecoverySchema>;
export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>;
export type LoginAttemptInput = z.infer<typeof loginAttemptSchema>;