import { z } from 'zod';
import {
  nameSchema,
  surnameSchema,
  emailSchema,
  phoneSchema,
  turkishPhoneSchema,
  identityNoSchema,
  addressSchema,

  notesSchema,
  dateSchema,
  pastDateSchema,
  genderSchema,
  maritalStatusSchema,
  educationLevelSchema,
  statusSchema,
  prioritySchema,
  requiredStringSchema,
  optionalStringSchema,

  optionalNumberSchema,
  ageSchema,
  postalCodeSchema
} from './common';

// Beneficiary personal information schema
export const beneficiaryPersonalSchema = z.object({
  firstName: nameSchema,
  lastName: surnameSchema,
  identityNo: identityNoSchema,
  birthDate: pastDateSchema,
  birthPlace: requiredStringSchema.max(50, 'Doğum yeri en fazla 50 karakter olabilir'),
  gender: genderSchema,
  maritalStatus: maritalStatusSchema,
  nationality: requiredStringSchema.max(30, 'Uyruk en fazla 30 karakter olabilir').default('TC'),
  motherName: nameSchema.optional(),
  fatherName: nameSchema.optional(),
  educationLevel: educationLevelSchema.optional()
});

// Beneficiary contact information schema
export const beneficiaryContactSchema = z.object({
  email: emailSchema.optional(),
  phone: turkishPhoneSchema.optional(),
  alternativePhone: turkishPhoneSchema.optional(),
  address: addressSchema,
  city: requiredStringSchema.max(30, 'Şehir en fazla 30 karakter olabilir'),
  district: requiredStringSchema.max(30, 'İlçe en fazla 30 karakter olabilir'),
  neighborhood: requiredStringSchema.max(50, 'Mahalle en fazla 50 karakter olabilir'),
  postalCode: postalCodeSchema.optional(),
  emergencyContactName: nameSchema.optional(),
  emergencyContactPhone: turkishPhoneSchema.optional(),
  emergencyContactRelation: optionalStringSchema
});

// Beneficiary financial information schema
export const beneficiaryFinancialSchema = z.object({
  monthlyIncome: optionalNumberSchema,
  householdSize: z.number().min(1, 'Hane halkı sayısı en az 1 olmalıdır').max(20, 'Hane halkı sayısı en fazla 20 olabilir').optional(),
  dependentCount: z.number().min(0, 'Bağımlı sayısı 0\'dan küçük olamaz').max(20, 'Bağımlı sayısı en fazla 20 olabilir').optional(),
  employmentStatus: z.enum(['employed', 'unemployed', 'retired', 'student', 'disabled', 'other'], {
    message: 'Geçerli bir istihdam durumu seçiniz'
  }).optional(),
  occupation: optionalStringSchema,
  socialSecurityNo: z.string().regex(/^[0-9]{11}$/, 'SGK numarası 11 haneli olmalıdır').optional(),
  bankAccountNo: optionalStringSchema,
  bankName: optionalStringSchema
});

// Beneficiary health information schema
export const beneficiaryHealthSchema = z.object({
  hasDisability: z.boolean().default(false),
  disabilityType: z.enum(['physical', 'mental', 'visual', 'hearing', 'multiple', 'other'], {
    message: 'Geçerli bir engellilik türü seçiniz'
  }).optional(),
  disabilityPercentage: z.number().min(0).max(100).optional(),
  chronicIllness: optionalStringSchema,
  medicationNeeds: optionalStringSchema,
  healthInsurance: z.boolean().default(false),
  healthInsuranceType: z.enum(['sgk', 'private', 'green_card', 'other'], {
    message: 'Geçerli bir sağlık sigortası türü seçiniz'
  }).optional()
});

// Beneficiary housing information schema
export const beneficiaryHousingSchema = z.object({
  housingType: z.enum(['owned', 'rented', 'family_owned', 'social_housing', 'homeless', 'other'], {
    message: 'Geçerli bir konut türü seçiniz'
  }).optional(),
  monthlyRent: optionalNumberSchema,
  roomCount: z.number().min(1).max(20).optional(),
  hasElectricity: z.boolean().default(true),
  hasWater: z.boolean().default(true),
  hasGas: z.boolean().default(false),
  hasInternet: z.boolean().default(false),
  housingCondition: z.enum(['excellent', 'good', 'fair', 'poor', 'very_poor'], {
    message: 'Geçerli bir konut durumu seçiniz'
  }).optional()
});

// Family member schema
export const familyMemberSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: nameSchema,
  lastName: surnameSchema,
  identityNo: identityNoSchema.optional(),
  birthDate: pastDateSchema.optional(),
  gender: genderSchema,
  relation: z.enum(['spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other'], {
    message: 'Geçerli bir aile ilişkisi seçiniz'
  }),
  educationLevel: educationLevelSchema.optional(),
  employmentStatus: z.enum(['employed', 'unemployed', 'retired', 'student', 'disabled', 'other'], {
    message: 'Geçerli bir istihdam durumu seçiniz'
  }).optional(),
  monthlyIncome: optionalNumberSchema,
  hasDisability: z.boolean().default(false),
  disabilityType: optionalStringSchema,
  notes: notesSchema
});

// Complete beneficiary schema
export const beneficiarySchema = z.object({
  // Personal information
  ...beneficiaryPersonalSchema.shape,
  
  // Contact information
  ...beneficiaryContactSchema.shape,
  
  // Financial information
  ...beneficiaryFinancialSchema.shape,
  
  // Health information
  ...beneficiaryHealthSchema.shape,
  
  // Housing information
  ...beneficiaryHousingSchema.shape,
  
  // Family members
  familyMembers: z.array(familyMemberSchema).optional().default([]),
  
  // Application information
  applicationDate: dateSchema.optional(),
  referredBy: optionalStringSchema,
  referralSource: z.enum(['self', 'family', 'neighbor', 'social_worker', 'government', 'ngo', 'other'], {
    message: 'Geçerli bir yönlendirme kaynağı seçiniz'
  }).optional(),
  
  // Status and priority
  status: statusSchema.default('pending'),
  priority: prioritySchema.default('medium'),
  
  // Additional information
  specialNeeds: optionalStringSchema,
  previousAidReceived: z.boolean().default(false),
  previousAidDetails: optionalStringSchema,
  verificationStatus: z.enum(['pending', 'verified', 'rejected'], {
    message: 'Geçerli bir doğrulama durumu seçiniz'
  }).default('pending'),
  verificationDate: dateSchema.optional(),
  verifiedBy: optionalStringSchema,
  
  // Notes and comments
  notes: notesSchema,
  internalNotes: notesSchema,
  
  // Metadata
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  tags: z.array(z.string()).optional().default([])
});

// Beneficiary search schema
export const beneficiarySearchSchema = z.object({
  query: z.string().min(1, 'Arama terimi en az 1 karakter olmalıdır').max(100, 'Arama terimi en fazla 100 karakter olabilir').optional(),
  identityNo: identityNoSchema.optional(),
  firstName: nameSchema.optional(),
  lastName: surnameSchema.optional(),
  phone: phoneSchema.optional(),
  city: optionalStringSchema,
  district: optionalStringSchema,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  hasDisability: z.boolean().optional(),
  ageMin: ageSchema.optional(),
  ageMax: ageSchema.optional(),
  incomeMax: optionalNumberSchema,
  createdAfter: dateSchema.optional(),
  createdBefore: dateSchema.optional(),
  tags: z.array(z.string()).optional()
});

// Beneficiary update schema (partial)
export const beneficiaryUpdateSchema = beneficiarySchema.partial().omit({
  createdBy: true
});

// Beneficiary quick add schema (minimal required fields)
export const beneficiaryQuickAddSchema = z.object({
  firstName: nameSchema,
  lastName: surnameSchema,
  identityNo: identityNoSchema,
  phone: turkishPhoneSchema.optional(),
  address: addressSchema,
  city: requiredStringSchema,
  district: requiredStringSchema,
  priority: prioritySchema.default('medium'),
  notes: notesSchema
});

// Beneficiary verification schema
export const beneficiaryVerificationSchema = z.object({
  verificationStatus: z.enum(['verified', 'rejected'], {
    message: 'Geçerli bir doğrulama durumu seçiniz'
  }),
  verificationNotes: z.string().max(500, 'Doğrulama notları en fazla 500 karakter olabilir').optional(),
  documentsVerified: z.boolean().default(false),
  addressVerified: z.boolean().default(false),
  incomeVerified: z.boolean().default(false)
});

// Beneficiary statistics schema
export const beneficiaryStatsSchema = z.object({
  totalCount: z.number(),
  activeCount: z.number(),
  pendingCount: z.number(),
  verifiedCount: z.number(),
  byCity: z.record(z.string(), z.number()),
  byPriority: z.record(z.string(), z.number()),
  byAgeGroup: z.record(z.string(), z.number()),
  averageHouseholdSize: z.number(),
  averageIncome: z.number().optional()
});

// Type exports
export type BeneficiaryPersonal = z.infer<typeof beneficiaryPersonalSchema>;
export type BeneficiaryContact = z.infer<typeof beneficiaryContactSchema>;
export type BeneficiaryFinancial = z.infer<typeof beneficiaryFinancialSchema>;
export type BeneficiaryHealth = z.infer<typeof beneficiaryHealthSchema>;
export type BeneficiaryHousing = z.infer<typeof beneficiaryHousingSchema>;
export type FamilyMember = z.infer<typeof familyMemberSchema>;
export type Beneficiary = z.infer<typeof beneficiarySchema>;
export type BeneficiarySearch = z.infer<typeof beneficiarySearchSchema>;
export type BeneficiaryUpdate = z.infer<typeof beneficiaryUpdateSchema>;
export type BeneficiaryQuickAdd = z.infer<typeof beneficiaryQuickAddSchema>;
export type BeneficiaryVerification = z.infer<typeof beneficiaryVerificationSchema>;
export type BeneficiaryStats = z.infer<typeof beneficiaryStatsSchema>;