import { z } from 'zod';
import {
  idSchema,
  amountSchema,
  descriptionSchema,
  notesSchema,
  dateSchema,
  prioritySchema,
  requiredStringSchema,
  optionalStringSchema,
  optionalNumberSchema
} from './common';

// Aid type schema
export const aidTypeSchema = z.enum([
  'financial',
  'in_kind',
  'medical',
  'educational',
  'emergency',
  'housing',
  'food',
  'clothing',
  'other'
], {
  message: 'Geçerli bir yardım türü seçiniz'
});

// Aid status schema
export const aidStatusSchema = z.enum([
  'planned',
  'approved',
  'in_progress',
  'delivered',
  'completed',
  'cancelled',
  'rejected'
], {
  message: 'Geçerli bir yardım durumu seçiniz'
});

// Payment method schema
export const paymentMethodSchema = z.enum([
  'bank_transfer',
  'cash',
  'check',
  'mobile_payment',
  'voucher',
  'direct_payment'
], {
  message: 'Geçerli bir ödeme yöntemi seçiniz'
});

// Aid record schema
export const aidRecordSchema = z.object({
  id: idSchema.optional(),
  beneficiaryId: idSchema,
  applicationId: idSchema.optional(),
  type: aidTypeSchema,
  title: requiredStringSchema.max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: descriptionSchema,
  amount: amountSchema.optional(),
  currency: z.string().length(3, 'Para birimi 3 karakter olmalıdır').default('TRY'),
  status: aidStatusSchema.default('planned'),
  priority: prioritySchema.default('medium'),
  
  // Dates
  plannedDate: dateSchema,
  approvalDate: dateSchema.optional(),
  deliveryDate: dateSchema.optional(),
  completionDate: dateSchema.optional(),
  
  // Payment information
  paymentMethod: paymentMethodSchema.optional(),
  paymentReference: optionalStringSchema,
  bankAccountNo: optionalStringSchema,
  
  // Approval workflow
  approvedBy: idSchema.optional(),
  approvedAmount: optionalNumberSchema,
  approvalNotes: notesSchema,
  
  // Delivery information
  deliveredBy: idSchema.optional(),
  deliveryLocation: optionalStringSchema,
  deliveryNotes: notesSchema,
  recipientSignature: z.boolean().default(false),
  
  // Additional information
  category: optionalStringSchema,
  subcategory: optionalStringSchema,
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  
  // Notes
  notes: notesSchema,
  internalNotes: notesSchema,
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional(),
  department: optionalStringSchema
});

// In-kind aid item schema
export const inKindItemSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  category: requiredStringSchema.max(50, 'Kategori en fazla 50 karakter olabilir'),
  quantity: z.number().min(1, 'Miktar en az 1 olmalıdır'),
  unit: requiredStringSchema.max(20, 'Birim en fazla 20 karakter olabilir'),
  unitValue: optionalNumberSchema,
  totalValue: optionalNumberSchema,
  brand: optionalStringSchema,
  model: optionalStringSchema,
  condition: z.enum(['new', 'used_good', 'used_fair', 'refurbished'], {
    message: 'Geçerli bir ürün durumu seçiniz'
  }).default('new'),
  expiryDate: dateSchema.optional(),
  notes: notesSchema
});

// In-kind aid schema
export const inKindAidSchema = z.object({
  id: idSchema.optional(),
  beneficiaryId: idSchema,
  applicationId: idSchema.optional(),
  title: requiredStringSchema.max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: descriptionSchema,
  status: aidStatusSchema.default('planned'),
  priority: prioritySchema.default('medium'),
  
  // Items
  items: z.array(inKindItemSchema).min(1, 'En az bir ürün eklemelisiniz'),
  totalValue: optionalNumberSchema,
  
  // Dates
  plannedDate: dateSchema,
  approvalDate: dateSchema.optional(),
  deliveryDate: dateSchema.optional(),
  completionDate: dateSchema.optional(),
  
  // Approval
  approvedBy: idSchema.optional(),
  approvalNotes: notesSchema,
  
  // Delivery
  deliveredBy: idSchema.optional(),
  deliveryLocation: optionalStringSchema,
  deliveryMethod: z.enum(['pickup', 'delivery', 'mail'], {
    message: 'Geçerli bir teslimat yöntemi seçiniz'
  }).optional(),
  deliveryNotes: notesSchema,
  recipientSignature: z.boolean().default(false),
  
  // Additional information
  supplier: optionalStringSchema,
  purchaseDate: dateSchema.optional(),
  invoiceNo: optionalStringSchema,
  storageLocation: optionalStringSchema,
  
  // Notes
  notes: notesSchema,
  internalNotes: notesSchema,
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional()
});

// Payment record schema
export const paymentRecordSchema = z.object({
  id: idSchema.optional(),
  aidRecordId: idSchema,
  beneficiaryId: idSchema,
  amount: amountSchema,
  currency: z.string().length(3, 'Para birimi 3 karakter olmalıdır').default('TRY'),
  paymentMethod: paymentMethodSchema,
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled'], {
    message: 'Geçerli bir ödeme durumu seçiniz'
  }).default('pending'),
  
  // Payment details
  paymentDate: dateSchema,
  processedDate: dateSchema.optional(),
  reference: optionalStringSchema,
  transactionId: optionalStringSchema,
  
  // Bank information
  bankName: optionalStringSchema,
  bankAccountNo: optionalStringSchema,
  iban: z.string().regex(/^TR[0-9]{24}$/, 'Geçerli bir IBAN numarası giriniz').optional(),
  
  // Processing information
  processedBy: idSchema.optional(),
  approvedBy: idSchema.optional(),
  
  // Additional information
  description: descriptionSchema,
  notes: notesSchema,
  attachments: z.array(z.string()).default([]),
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional()
});

// Aid search schema
export const aidSearchSchema = z.object({
  query: z.string().max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  beneficiaryId: idSchema.optional(),
  type: aidTypeSchema.optional(),
  status: aidStatusSchema.optional(),
  priority: prioritySchema.optional(),
  category: optionalStringSchema,
  amountMin: optionalNumberSchema,
  amountMax: optionalNumberSchema,
  plannedAfter: dateSchema.optional(),
  plannedBefore: dateSchema.optional(),
  deliveredAfter: dateSchema.optional(),
  deliveredBefore: dateSchema.optional(),
  approvedBy: idSchema.optional(),
  deliveredBy: idSchema.optional(),
  department: optionalStringSchema,
  tags: z.array(z.string()).optional()
});

// Aid statistics schema
export const aidStatsSchema = z.object({
  totalCount: z.number(),
  totalAmount: z.number(),
  byType: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  byMonth: z.record(z.string(), z.number()),
  averageAmount: z.number(),
  completionRate: z.number(),
  pendingCount: z.number(),
  deliveredCount: z.number()
});

// Type exports
export type AidType = z.infer<typeof aidTypeSchema>;
export type AidStatus = z.infer<typeof aidStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type AidRecord = z.infer<typeof aidRecordSchema>;
export type InKindItem = z.infer<typeof inKindItemSchema>;
export type InKindAid = z.infer<typeof inKindAidSchema>;
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;
export type AidSearch = z.infer<typeof aidSearchSchema>;
export type AidStats = z.infer<typeof aidStatsSchema>;