import { z } from 'zod';
import {
  idSchema,
  amountSchema,
  descriptionSchema,
  notesSchema,
  dateSchema,
  futureDateSchema,
  prioritySchema,
  requiredStringSchema,
  optionalStringSchema,
  optionalNumberSchema,
  fileSchema
} from './common';

// Application type schema
export const applicationTypeSchema = z.enum([
  'financial_aid',
  'in_kind_aid',
  'scholarship',
  'medical_aid',
  'housing_aid',
  'education_aid',
  'emergency_aid',
  'other'
], {
  message: 'Geçerli bir başvuru türü seçiniz'
});

// Application status schema
export const applicationStatusSchema = z.enum([
  'draft',
  'submitted',
  'under_review',
  'pending_documents',
  'approved',
  'rejected',
  'cancelled',
  'completed'
], {
  message: 'Geçerli bir başvuru durumu seçiniz'
});

// Application urgency schema
export const applicationUrgencySchema = z.enum(['low', 'medium', 'high', 'critical'], {
  message: 'Geçerli bir aciliyet seviyesi seçiniz'
});

// Document requirement schema
export const documentRequirementSchema = z.object({
  id: z.string().uuid().optional(),
  name: requiredStringSchema.max(100, 'Belge adı en fazla 100 karakter olabilir'),
  description: descriptionSchema,
  required: z.boolean().default(true),
  category: z.enum(['identity', 'income', 'address', 'medical', 'education', 'other'], {
    message: 'Geçerli bir belge kategorisi seçiniz'
  }),
  acceptedFormats: z.array(z.string()).default(['pdf', 'jpg', 'png', 'doc', 'docx']),
  maxSize: z.number().default(5), // MB
  submitted: z.boolean().default(false),
  submittedAt: dateSchema.optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  rejectionReason: optionalStringSchema
});

// Application item schema (for in-kind aid)
export const applicationItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: requiredStringSchema.max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  category: requiredStringSchema.max(50, 'Kategori en fazla 50 karakter olabilir'),
  quantity: z.number().min(1, 'Miktar en az 1 olmalıdır').max(1000, 'Miktar en fazla 1000 olabilir'),
  unit: requiredStringSchema.max(20, 'Birim en fazla 20 karakter olabilir'),
  estimatedValue: optionalNumberSchema,
  urgency: applicationUrgencySchema.default('medium'),
  justification: descriptionSchema,
  notes: notesSchema
});

// Financial aid details schema
export const financialAidDetailsSchema = z.object({
  requestedAmount: amountSchema,
  purpose: requiredStringSchema.max(200, 'Amaç en fazla 200 karakter olabilir'),
  justification: z.string().min(50, 'Gerekçe en az 50 karakter olmalıdır').max(1000, 'Gerekçe en fazla 1000 karakter olabilir'),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'check', 'mobile_payment'], {
    message: 'Geçerli bir ödeme yöntemi seçiniz'
  }).default('bank_transfer'),
  bankAccountNo: z.string().optional(),
  bankName: optionalStringSchema,
  iban: z.string().regex(/^TR[0-9]{24}$/, 'Geçerli bir IBAN numarası giriniz').optional(),
  installments: z.number().min(1, 'Taksit sayısı en az 1 olmalıdır').max(12, 'Taksit sayısı en fazla 12 olabilir').default(1),
  firstPaymentDate: futureDateSchema.optional()
});

// Scholarship details schema
export const scholarshipDetailsSchema = z.object({
  educationLevel: z.enum(['primary', 'secondary', 'high_school', 'university', 'graduate'], {
    message: 'Geçerli bir eğitim seviyesi seçiniz'
  }),
  schoolName: requiredStringSchema.max(100, 'Okul adı en fazla 100 karakter olabilir'),
  department: optionalStringSchema,
  grade: z.number().min(1).max(12).optional(),
  gpa: z.number().min(0).max(4).optional(),
  academicYear: requiredStringSchema.regex(/^\d{4}-\d{4}$/, 'Akademik yıl formatı: 2023-2024'),
  monthlyAmount: amountSchema,
  duration: z.number().min(1, 'Süre en az 1 ay olmalıdır').max(60, 'Süre en fazla 60 ay olabilir'),
  startDate: futureDateSchema,
  endDate: futureDateSchema,
  specialRequirements: optionalStringSchema
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  path: ['endDate']
});

// Medical aid details schema
export const medicalAidDetailsSchema = z.object({
  medicalCondition: requiredStringSchema.max(200, 'Tıbbi durum en fazla 200 karakter olabilir'),
  diagnosis: optionalStringSchema,
  treatmentRequired: z.string().min(20, 'Gerekli tedavi en az 20 karakter olmalıdır').max(500, 'Gerekli tedavi en fazla 500 karakter olabilir'),
  estimatedCost: amountSchema,
  hospitalName: requiredStringSchema.max(100, 'Hastane adı en fazla 100 karakter olabilir'),
  doctorName: requiredStringSchema.max(100, 'Doktor adı en fazla 100 karakter olabilir'),
  urgencyLevel: applicationUrgencySchema,
  treatmentStartDate: futureDateSchema.optional(),
  hasInsurance: z.boolean().default(false),
  insuranceCoverage: z.number().min(0).max(100).optional(),
  additionalSupport: optionalStringSchema
});

// Housing aid details schema
export const housingAidDetailsSchema = z.object({
  housingType: z.enum(['rent_support', 'utility_bills', 'home_repair', 'furniture', 'relocation'], {
    message: 'Geçerli bir konut yardımı türü seçiniz'
  }),
  currentHousingSituation: z.string().min(20, 'Mevcut konut durumu en az 20 karakter olmalıdır').max(500, 'Mevcut konut durumu en fazla 500 karakter olabilir'),
  requestedSupport: z.string().min(20, 'Talep edilen destek en az 20 karakter olmalıdır').max(500, 'Talep edilen destek en fazla 500 karakter olabilir'),
  monthlyRent: optionalNumberSchema,
  utilityBills: optionalNumberSchema,
  repairDetails: optionalStringSchema,
  urgencyReason: optionalStringSchema,
  temporaryAccommodation: z.boolean().default(false)
});

// Application review schema
export const applicationReviewSchema = z.object({
  reviewerId: idSchema,
  reviewDate: dateSchema,
  status: applicationStatusSchema,
  decision: z.enum(['approve', 'reject', 'request_more_info', 'defer'], {
    message: 'Geçerli bir karar seçiniz'
  }),
  approvedAmount: optionalNumberSchema,
  comments: z.string().min(10, 'Yorum en az 10 karakter olmalıdır').max(1000, 'Yorum en fazla 1000 karakter olabilir'),
  conditions: optionalStringSchema,
  nextReviewDate: futureDateSchema.optional(),
  requiredDocuments: z.array(z.string()).optional(),
  internalNotes: notesSchema
});

// Main application schema
export const applicationSchema = z.object({
  // Basic information
  id: idSchema.optional(),
  applicationNo: optionalStringSchema,
  beneficiaryId: idSchema,
  type: applicationTypeSchema,
  title: requiredStringSchema.max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  
  // Status and priority
  status: applicationStatusSchema.default('draft'),
  priority: prioritySchema.default('medium'),
  urgency: applicationUrgencySchema.default('medium'),
  
  // Dates
  applicationDate: dateSchema,
  submissionDate: dateSchema.optional(),
  reviewDate: dateSchema.optional(),
  approvalDate: dateSchema.optional(),
  completionDate: dateSchema.optional(),
  expiryDate: futureDateSchema.optional(),
  
  // Type-specific details (discriminated union)
  details: z.discriminatedUnion('type', [
    z.object({ type: z.literal('financial_aid'), data: financialAidDetailsSchema }),
    z.object({ type: z.literal('scholarship'), data: scholarshipDetailsSchema }),
    z.object({ type: z.literal('medical_aid'), data: medicalAidDetailsSchema }),
    z.object({ type: z.literal('housing_aid'), data: housingAidDetailsSchema }),
    z.object({ type: z.literal('in_kind_aid'), data: z.object({ items: z.array(applicationItemSchema) }) }),
    z.object({ type: z.literal('other'), data: z.object({ customFields: z.record(z.string(), z.any()) }) })
  ]).optional(),
  
  // Documents and requirements
  requiredDocuments: z.array(documentRequirementSchema).default([]),
  attachments: z.array(fileSchema).optional(),
  
  // Review and approval
  reviews: z.array(applicationReviewSchema).default([]),
  currentReviewerId: idSchema.optional(),
  
  // Additional information
  referenceNo: optionalStringSchema,
  relatedApplications: z.array(idSchema).optional(),
  tags: z.array(z.string()).default([]),
  
  // Notes and comments
  applicantNotes: notesSchema,
  internalNotes: notesSchema,
  publicComments: optionalStringSchema,
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional(),
  assignedTo: idSchema.optional(),
  department: optionalStringSchema,
  
  // Tracking
  viewCount: z.number().default(0),
  lastViewedAt: dateSchema.optional(),
  lastViewedBy: idSchema.optional()
});

// Application search schema
export const applicationSearchSchema = z.object({
  query: z.string().max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  applicationNo: optionalStringSchema,
  beneficiaryId: idSchema.optional(),
  type: applicationTypeSchema.optional(),
  status: applicationStatusSchema.optional(),
  priority: prioritySchema.optional(),
  urgency: applicationUrgencySchema.optional(),
  createdAfter: dateSchema.optional(),
  createdBefore: dateSchema.optional(),
  submittedAfter: dateSchema.optional(),
  submittedBefore: dateSchema.optional(),
  reviewerId: idSchema.optional(),
  assignedTo: idSchema.optional(),
  department: optionalStringSchema,
  amountMin: optionalNumberSchema,
  amountMax: optionalNumberSchema,
  tags: z.array(z.string()).optional(),
  hasAttachments: z.boolean().optional(),
  pendingDocuments: z.boolean().optional()
});

// Application update schema
export const applicationUpdateSchema = applicationSchema.partial().omit({
  id: true,
  createdBy: true,
  applicationNo: true
});

// Application submission schema
export const applicationSubmissionSchema = applicationSchema.omit({
  id: true,
  applicationNo: true,
  status: true,
  reviews: true,
  viewCount: true,
  lastViewedAt: true,
  lastViewedBy: true
});

// Application approval schema
export const applicationApprovalSchema = z.object({
  decision: z.enum(['approve', 'reject'], {
    message: 'Geçerli bir onay kararı seçiniz'
  }),
  approvedAmount: optionalNumberSchema,
  conditions: optionalStringSchema,
  comments: z.string().min(10, 'Yorum en az 10 karakter olmalıdır').max(1000, 'Yorum en fazla 1000 karakter olabilir'),
  nextSteps: optionalStringSchema,
  expiryDate: futureDateSchema.optional()
});

// Application statistics schema
export const applicationStatsSchema = z.object({
  totalCount: z.number(),
  byStatus: z.record(z.string(), z.number()),
  byType: z.record(z.string(), z.number()),
  byPriority: z.record(z.string(), z.number()),
  byMonth: z.record(z.string(), z.number()),
  averageProcessingTime: z.number(),
  approvalRate: z.number(),
  totalApprovedAmount: z.number(),
  pendingReviewCount: z.number()
});

// Type exports
export type ApplicationType = z.infer<typeof applicationTypeSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type ApplicationUrgency = z.infer<typeof applicationUrgencySchema>;
export type DocumentRequirement = z.infer<typeof documentRequirementSchema>;
export type ApplicationItem = z.infer<typeof applicationItemSchema>;
export type FinancialAidDetails = z.infer<typeof financialAidDetailsSchema>;
export type ScholarshipDetails = z.infer<typeof scholarshipDetailsSchema>;
export type MedicalAidDetails = z.infer<typeof medicalAidDetailsSchema>;
export type HousingAidDetails = z.infer<typeof housingAidDetailsSchema>;
export type ApplicationReview = z.infer<typeof applicationReviewSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationSearch = z.infer<typeof applicationSearchSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
export type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;
export type ApplicationApproval = z.infer<typeof applicationApprovalSchema>;
export type ApplicationStats = z.infer<typeof applicationStatsSchema>;