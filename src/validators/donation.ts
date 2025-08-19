import { z } from 'zod';
import {
  idSchema,
  amountSchema,
  descriptionSchema,
  notesSchema,
  dateSchema,
  emailSchema,
  phoneSchema,
  nameSchema,
  surnameSchema,
  addressSchema,

  requiredStringSchema,
  optionalStringSchema,
  optionalNumberSchema
} from './common';

// Donation type schema
export const donationTypeSchema = z.enum([
  'monetary',
  'in_kind',
  'service',
  'recurring',
  'memorial',
  'corporate',
  'fundraising'
], {
  message: 'Geçerli bir bağış türü seçiniz'
});

// Donation status schema
export const donationStatusSchema = z.enum([
  'pending',
  'confirmed',
  'received',
  'processed',
  'cancelled',
  'refunded'
], {
  message: 'Geçerli bir bağış durumu seçiniz'
});

// Donation method schema
export const donationMethodSchema = z.enum([
  'bank_transfer',
  'credit_card',
  'cash',
  'check',
  'online_payment',
  'mobile_payment',
  'cryptocurrency'
], {
  message: 'Geçerli bir bağış yöntemi seçiniz'
});

// Donor type schema
export const donorTypeSchema = z.enum([
  'individual',
  'corporate',
  'foundation',
  'government',
  'anonymous'
], {
  message: 'Geçerli bir bağışçı türü seçiniz'
});

// Donor information schema
export const donorSchema = z.object({
  id: idSchema.optional(),
  type: donorTypeSchema,
  
  // Individual donor fields
  firstName: nameSchema.optional(),
  lastName: surnameSchema.optional(),
  
  // Corporate donor fields
  companyName: z.string().max(100, 'Şirket adı en fazla 100 karakter olabilir').optional(),
  taxNumber: z.string().max(20, 'Vergi numarası en fazla 20 karakter olabilir').optional(),
  
  // Contact information
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  city: optionalStringSchema,
  country: optionalStringSchema.default('Türkiye'),
  
  // Preferences
  isAnonymous: z.boolean().default(false),
  allowContact: z.boolean().default(true),
  preferredContactMethod: z.enum(['email', 'phone', 'mail', 'none'], {
    message: 'Geçerli bir iletişim tercihi seçiniz'
  }).default('email'),
  
  // Additional information
  notes: notesSchema,
  tags: z.array(z.string()).default([]),
  
  // Metadata
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

// In-kind donation item schema
export const donationItemSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  category: requiredStringSchema.max(50, 'Kategori en fazla 50 karakter olabilir'),
  quantity: z.number().min(1, 'Miktar en az 1 olmalıdır'),
  unit: requiredStringSchema.max(20, 'Birim en fazla 20 karakter olabilir'),
  estimatedValue: optionalNumberSchema,
  condition: z.enum(['new', 'used_excellent', 'used_good', 'used_fair'], {
    message: 'Geçerli bir durum seçiniz'
  }).default('new'),
  description: descriptionSchema,
  notes: notesSchema
});

// Recurring donation schema
export const recurringDonationSchema = z.object({
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly'], {
    message: 'Geçerli bir sıklık seçiniz'
  }),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  nextPaymentDate: dateSchema,
  totalPayments: z.number().min(1, 'Toplam ödeme sayısı en az 1 olmalıdır').optional(),
  remainingPayments: z.number().min(0, 'Kalan ödeme sayısı 0\'dan küçük olamaz').optional(),
  isActive: z.boolean().default(true),
  pausedUntil: dateSchema.optional(),
  cancellationReason: optionalStringSchema
});

// Main donation schema
export const donationSchema = z.object({
  id: idSchema.optional(),
  donorId: idSchema.optional(),
  donor: donorSchema.optional(),
  
  // Basic information
  type: donationTypeSchema,
  method: donationMethodSchema.optional(),
  amount: amountSchema.optional(),
  currency: z.string().length(3, 'Para birimi 3 karakter olmalıdır').default('TRY'),
  
  // Status and dates
  status: donationStatusSchema.default('pending'),
  donationDate: dateSchema,
  receivedDate: dateSchema.optional(),
  processedDate: dateSchema.optional(),
  
  // Purpose and allocation
  purpose: optionalStringSchema,
  campaign: optionalStringSchema,
  designation: z.enum(['general', 'education', 'health', 'emergency', 'infrastructure', 'other'], {
    message: 'Geçerli bir tahsis alanı seçiniz'
  }).default('general'),
  
  // In-kind donations
  items: z.array(donationItemSchema).optional(),
  totalEstimatedValue: optionalNumberSchema,
  
  // Recurring donations
  isRecurring: z.boolean().default(false),
  recurringDetails: recurringDonationSchema.optional(),
  
  // Payment information
  paymentReference: optionalStringSchema,
  transactionId: optionalStringSchema,
  bankReference: optionalStringSchema,
  
  // Tax and receipt information
  taxDeductible: z.boolean().default(true),
  receiptRequired: z.boolean().default(true),
  receiptIssued: z.boolean().default(false),
  receiptNumber: optionalStringSchema,
  receiptDate: dateSchema.optional(),
  
  // Memorial donations
  isMemorial: z.boolean().default(false),
  memorialFor: optionalStringSchema,
  memorialMessage: optionalStringSchema,
  notifyFamily: z.boolean().default(false),
  familyContactInfo: optionalStringSchema,
  
  // Corporate donations
  isCorporate: z.boolean().default(false),
  corporateMatchingGift: z.boolean().default(false),
  matchingGiftAmount: optionalNumberSchema,
  
  // Additional information
  description: descriptionSchema,
  notes: notesSchema,
  internalNotes: notesSchema,
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  
  // Acknowledgment
  acknowledgmentSent: z.boolean().default(false),
  acknowledgmentDate: dateSchema.optional(),
  acknowledgmentMethod: z.enum(['email', 'mail', 'phone', 'none'], {
    message: 'Geçerli bir teşekkür yöntemi seçiniz'
  }).optional(),
  
  // Processing information
  processedBy: idSchema.optional(),
  approvedBy: idSchema.optional(),
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional(),
  source: z.enum(['website', 'mobile_app', 'phone', 'mail', 'event', 'other'], {
    message: 'Geçerli bir kaynak seçiniz'
  }).optional()
});

// Donation search schema
export const donationSearchSchema = z.object({
  query: z.string().max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  donorId: idSchema.optional(),
  type: donationTypeSchema.optional(),
  method: donationMethodSchema.optional(),
  status: donationStatusSchema.optional(),
  designation: z.enum(['general', 'education', 'health', 'emergency', 'infrastructure', 'other']).optional(),
  amountMin: optionalNumberSchema,
  amountMax: optionalNumberSchema,
  donatedAfter: dateSchema.optional(),
  donatedBefore: dateSchema.optional(),
  campaign: optionalStringSchema,
  isRecurring: z.boolean().optional(),
  isMemorial: z.boolean().optional(),
  isCorporate: z.boolean().optional(),
  receiptIssued: z.boolean().optional(),
  acknowledgmentSent: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

// Donation update schema
export const donationUpdateSchema = donationSchema.partial().omit({
  id: true,
  createdBy: true
});

// Donation receipt schema
export const donationReceiptSchema = z.object({
  donationId: idSchema,
  receiptNumber: requiredStringSchema,
  issueDate: dateSchema,
  taxYear: z.number().min(2000).max(2100),
  amount: amountSchema,
  currency: z.string().length(3, 'Para birimi 3 karakter olmalıdır').default('TRY'),
  donorName: requiredStringSchema,
  donorAddress: addressSchema.optional(),
  purpose: optionalStringSchema,
  issuedBy: idSchema,
  template: z.enum(['standard', 'memorial', 'corporate'], {
    message: 'Geçerli bir makbuz şablonu seçiniz'
  }).default('standard')
});

// Donation statistics schema
export const donationStatsSchema = z.object({
  totalCount: z.number(),
  totalAmount: z.number(),
  averageAmount: z.number(),
  byType: z.record(z.string(), z.number()),
  byMethod: z.record(z.string(), z.number()),
  byDesignation: z.record(z.string(), z.number()),
  byMonth: z.record(z.string(), z.number()),
  recurringCount: z.number(),
  recurringAmount: z.number(),
  corporateCount: z.number(),
  corporateAmount: z.number(),
  topDonors: z.array(z.object({
    donorId: idSchema,
    donorName: z.string(),
    totalAmount: z.number(),
    donationCount: z.number()
  })),
  retentionRate: z.number(),
  newDonorCount: z.number()
});

// Type exports
export type DonationType = z.infer<typeof donationTypeSchema>;
export type DonationStatus = z.infer<typeof donationStatusSchema>;
export type DonationMethod = z.infer<typeof donationMethodSchema>;
export type DonorType = z.infer<typeof donorTypeSchema>;
export type Donor = z.infer<typeof donorSchema>;
export type DonationItem = z.infer<typeof donationItemSchema>;
export type RecurringDonation = z.infer<typeof recurringDonationSchema>;
export type Donation = z.infer<typeof donationSchema>;
export type DonationSearch = z.infer<typeof donationSearchSchema>;
export type DonationUpdate = z.infer<typeof donationUpdateSchema>;
export type DonationReceipt = z.infer<typeof donationReceiptSchema>;
export type DonationStats = z.infer<typeof donationStatsSchema>;