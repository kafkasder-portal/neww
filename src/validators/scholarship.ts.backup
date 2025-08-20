import { z } from 'zod';
import {
  idSchema,
  amountSchema,
  notesSchema,
  dateSchema,
  futureDateSchema,
  requiredStringSchema,
  optionalStringSchema,
  optionalNumberSchema,
  educationLevelSchema
} from './common';

// Scholarship type schema
export const scholarshipTypeSchema = z.enum([
  'academic_merit',
  'need_based',
  'athletic',
  'artistic',
  'vocational',
  'research',
  'community_service',
  'minority',
  'disability',
  'other'
], {
  message: 'Geçerli bir burs türü seçiniz'
});

// Scholarship status schema
export const scholarshipStatusSchema = z.enum([
  'draft',
  'published',
  'active',
  'closed',
  'suspended',
  'completed',
  'cancelled'
], {
  message: 'Geçerli bir burs durumu seçiniz'
});

// Application status schema
export const scholarshipApplicationStatusSchema = z.enum([
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'approved',
  'rejected',
  'waitlisted',
  'withdrawn'
], {
  message: 'Geçerli bir başvuru durumu seçiniz'
});

// Academic information schema
export const academicInfoSchema = z.object({
  educationLevel: educationLevelSchema,
  currentGrade: z.number().min(1).max(12).optional(),
  gpa: z.number().min(0).max(4).optional(),
  schoolName: requiredStringSchema.max(100, 'Okul adı en fazla 100 karakter olabilir'),
  department: optionalStringSchema,
  major: optionalStringSchema,
  graduationYear: z.number().min(2020).max(2030).optional(),
  academicAchievements: optionalStringSchema,
  extracurricularActivities: optionalStringSchema,
  languageSkills: z.array(z.object({
    language: requiredStringSchema,
    level: z.enum(['beginner', 'intermediate', 'advanced', 'native'], {
      message: 'Geçerli bir seviye seçiniz'
    })
  })).optional()
});

// Financial information schema
export const financialInfoSchema = z.object({
  familyIncome: optionalNumberSchema,
  personalIncome: optionalNumberSchema,
  hasOtherScholarships: z.boolean().default(false),
  otherScholarshipDetails: optionalStringSchema,
  financialNeedDescription: z.string().max(1000, 'Mali durum açıklaması en fazla 1000 karakter olabilir').optional(),
  bankAccountNo: optionalStringSchema,
  iban: z.string().regex(/^TR[0-9]{24}$/, 'Geçerli bir IBAN numarası giriniz').optional()
});

// Scholarship criteria schema
export const scholarshipCriteriaSchema = z.object({
  minAge: z.number().min(0).max(100).optional(),
  maxAge: z.number().min(0).max(100).optional(),
  educationLevels: z.array(educationLevelSchema),
  minGpa: z.number().min(0).max(4).optional(),
  maxFamilyIncome: optionalNumberSchema,
  requiredDocuments: z.array(z.string()),
  eligibilityRequirements: z.array(z.string()),
  geographicRestrictions: z.array(z.string()).optional(),
  fieldOfStudy: z.array(z.string()).optional(),
  specialRequirements: optionalStringSchema
});

// Scholarship program schema
export const scholarshipProgramSchema = z.object({
  id: idSchema.optional(),
  name: requiredStringSchema.max(100, 'Program adı en fazla 100 karakter olabilir'),
  description: z.string().min(50, 'Açıklama en az 50 karakter olmalıdır').max(2000, 'Açıklama en fazla 2000 karakter olabilir'),
  type: scholarshipTypeSchema,
  status: scholarshipStatusSchema.default('draft'),
  
  // Financial details
  totalBudget: amountSchema,
  availableAmount: amountSchema,
  scholarshipAmount: amountSchema,
  numberOfScholarships: z.number().min(1, 'Burs sayısı en az 1 olmalıdır'),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'semester', 'annual', 'lump_sum'], {
    message: 'Geçerli bir ödeme sıklığı seçiniz'
  }),
  duration: z.number().min(1, 'Süre en az 1 ay olmalıdır').max(60, 'Süre en fazla 60 ay olabilir'),
  
  // Dates
  applicationStartDate: dateSchema,
  applicationEndDate: futureDateSchema,
  selectionDate: futureDateSchema,
  announcementDate: futureDateSchema,
  programStartDate: futureDateSchema,
  programEndDate: futureDateSchema,
  
  // Criteria and requirements
  criteria: scholarshipCriteriaSchema,
  
  // Additional information
  sponsor: optionalStringSchema,
  contactPerson: optionalStringSchema,
  contactEmail: z.string().email('Geçerli bir e-posta adresi giriniz').optional(),
  contactPhone: optionalStringSchema,
  website: z.string().url('Geçerli bir URL giriniz').optional(),
  
  // Terms and conditions
  termsAndConditions: z.string().min(100, 'Şartlar ve koşullar en az 100 karakter olmalıdır'),
  renewalCriteria: optionalStringSchema,
  obligations: z.array(z.string()).optional(),
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional(),
  tags: z.array(z.string()).default([])
}).refine(data => new Date(data.applicationEndDate) > new Date(data.applicationStartDate), {
  message: 'Başvuru bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  path: ['applicationEndDate']
}).refine(data => new Date(data.programEndDate) > new Date(data.programStartDate), {
  message: 'Program bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  path: ['programEndDate']
});

// Scholarship application schema
export const scholarshipApplicationSchema = z.object({
  id: idSchema.optional(),
  scholarshipId: idSchema,
  applicantId: idSchema,
  status: scholarshipApplicationStatusSchema.default('draft'),
  
  // Application information
  applicationDate: dateSchema,
  submissionDate: dateSchema.optional(),
  
  // Personal information (from beneficiary)
  personalStatement: z.string().min(200, 'Kişisel beyan en az 200 karakter olmalıdır').max(2000, 'Kişisel beyan en fazla 2000 karakter olabilir'),
  careerGoals: z.string().min(100, 'Kariyer hedefleri en az 100 karakter olmalıdır').max(1000, 'Kariyer hedefleri en fazla 1000 karakter olabilir'),
  
  // Academic information
  academicInfo: academicInfoSchema,
  
  // Financial information
  financialInfo: financialInfoSchema,
  
  // References
  references: z.array(z.object({
    name: requiredStringSchema,
    title: requiredStringSchema,
    organization: requiredStringSchema,
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    phone: optionalStringSchema,
    relationship: requiredStringSchema
  })).min(1, 'En az bir referans eklemelisiniz').max(3, 'En fazla 3 referans ekleyebilirsiniz'),
  
  // Documents
  requiredDocuments: z.array(z.object({
    name: requiredStringSchema,
    submitted: z.boolean().default(false),
    submissionDate: dateSchema.optional(),
    fileUrl: optionalStringSchema,
    verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending')
  })),
  
  // Evaluation
  evaluationScore: z.number().min(0).max(100).optional(),
  evaluationNotes: notesSchema,
  evaluatedBy: idSchema.optional(),
  evaluationDate: dateSchema.optional(),
  
  // Interview
  interviewScheduled: z.boolean().default(false),
  interviewDate: dateSchema.optional(),
  interviewNotes: notesSchema,
  interviewScore: z.number().min(0).max(100).optional(),
  
  // Decision
  decisionDate: dateSchema.optional(),
  decisionBy: idSchema.optional(),
  decisionNotes: notesSchema,
  rejectionReason: optionalStringSchema,
  
  // Award details (if approved)
  awardedAmount: optionalNumberSchema,
  awardStartDate: dateSchema.optional(),
  awardEndDate: dateSchema.optional(),
  
  // Additional information
  notes: notesSchema,
  internalNotes: notesSchema,
  
  // Metadata
  createdBy: idSchema.optional(),
  updatedBy: idSchema.optional()
});

// Scholarship payment schema
export const scholarshipPaymentSchema = z.object({
  id: idSchema.optional(),
  scholarshipId: idSchema,
  applicationId: idSchema,
  recipientId: idSchema,
  amount: amountSchema,
  paymentDate: dateSchema,
  paymentMethod: z.enum(['bank_transfer', 'check', 'cash'], {
    message: 'Geçerli bir ödeme yöntemi seçiniz'
  }),
  status: z.enum(['pending', 'processing', 'completed', 'failed'], {
    message: 'Geçerli bir ödeme durumu seçiniz'
  }).default('pending'),
  reference: optionalStringSchema,
  notes: notesSchema,
  processedBy: idSchema.optional(),
  processedDate: dateSchema.optional()
});

// Scholarship search schema
export const scholarshipSearchSchema = z.object({
  query: z.string().max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  type: scholarshipTypeSchema.optional(),
  status: scholarshipStatusSchema.optional(),
  educationLevel: educationLevelSchema.optional(),
  amountMin: optionalNumberSchema,
  amountMax: optionalNumberSchema,
  applicationStartAfter: dateSchema.optional(),
  applicationEndBefore: dateSchema.optional(),
  sponsor: optionalStringSchema,
  tags: z.array(z.string()).optional()
});

// Scholarship statistics schema
export const scholarshipStatsSchema = z.object({
  totalPrograms: z.number(),
  activePrograms: z.number(),
  totalApplications: z.number(),
  approvedApplications: z.number(),
  totalAwarded: z.number(),
  averageAward: z.number(),
  byType: z.record(z.string(), z.number()),
  byEducationLevel: z.record(z.string(), z.number()),
  applicationsByMonth: z.record(z.string(), z.number()),
  approvalRate: z.number(),
  completionRate: z.number()
});

// Type exports
export type ScholarshipType = z.infer<typeof scholarshipTypeSchema>;
export type ScholarshipStatus = z.infer<typeof scholarshipStatusSchema>;
export type ScholarshipApplicationStatus = z.infer<typeof scholarshipApplicationStatusSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type FinancialInfo = z.infer<typeof financialInfoSchema>;
export type ScholarshipCriteria = z.infer<typeof scholarshipCriteriaSchema>;
export type ScholarshipProgram = z.infer<typeof scholarshipProgramSchema>;
export type ScholarshipApplication = z.infer<typeof scholarshipApplicationSchema>;
export type ScholarshipPayment = z.infer<typeof scholarshipPaymentSchema>;
export type ScholarshipSearch = z.infer<typeof scholarshipSearchSchema>;
export type ScholarshipStats = z.infer<typeof scholarshipStatsSchema>;