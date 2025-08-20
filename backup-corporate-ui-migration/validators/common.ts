import { z } from 'zod';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../constants/validation';

// Common validation schemas
export const idSchema = z.string().uuid('Geçerli bir ID formatı giriniz');

export const nameSchema = z
  .string()
  .min(VALIDATION_RULES.name.min, VALIDATION_MESSAGES.minLength(VALIDATION_RULES.name.min))
  .max(VALIDATION_RULES.name.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.name.max))
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf ve boşluk karakteri kullanabilirsiniz');

export const surnameSchema = z
  .string()
  .min(VALIDATION_RULES.surname.min, VALIDATION_MESSAGES.minLength(VALIDATION_RULES.surname.min))
  .max(VALIDATION_RULES.surname.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.surname.max))
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf ve boşluk karakteri kullanabilirsiniz');

export const emailSchema = z
  .string()
  .email(VALIDATION_MESSAGES.email)
  .max(VALIDATION_RULES.email.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.email.max));

export const phoneSchema = z
  .string()
  .regex(/^[0-9+\s()-]+$/, VALIDATION_MESSAGES.phone)
  .min(VALIDATION_RULES.phone.min, VALIDATION_MESSAGES.minLength(VALIDATION_RULES.phone.min))
  .max(VALIDATION_RULES.phone.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.phone.max));

export const turkishPhoneSchema = z
  .string()
  .regex(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir Türkiye telefon numarası giriniz (örn: 0555 123 45 67)');

export const identityNoSchema = z
  .string()
  .length(VALIDATION_RULES.identityNo.length, `TC Kimlik No ${VALIDATION_RULES.identityNo.length} haneli olmalıdır`)
  .regex(/^[1-9][0-9]{10}$/, VALIDATION_MESSAGES.identityNo)
  .refine((value) => {
    // TC Kimlik No validation algorithm
    const digits = value.split('').map(Number);
    const checksum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - 
                     (digits[1] + digits[3] + digits[5] + digits[7]);
    const checksum2 = (digits[0] + digits[1] + digits[2] + digits[3] + digits[4] + 
                      digits[5] + digits[6] + digits[7] + digits[8] + digits[9]) % 10;
    
    return (checksum1 % 10 === digits[9]) && (checksum2 === digits[10]);
  }, VALIDATION_MESSAGES.identityNo);

export const ibanSchema = z
  .string()
  .length(VALIDATION_RULES.iban.length, `IBAN ${VALIDATION_RULES.iban.length} karakter olmalıdır`)
  .regex(/^TR[0-9]{24}$/, VALIDATION_MESSAGES.iban)
  .refine((value) => {
    // IBAN validation algorithm for Turkey
    const rearranged = value.slice(4) + value.slice(0, 4);
    const numericString = rearranged.replace(/[A-Z]/g, (char) => 
      (char.charCodeAt(0) - 55).toString()
    );
    
    // Calculate mod 97
    let remainder = 0;
    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
    }
    
    return remainder === 1;
  }, VALIDATION_MESSAGES.iban);

export const postalCodeSchema = z
  .string()
  .length(VALIDATION_RULES.postalCode.length, `Posta kodu ${VALIDATION_RULES.postalCode.length} haneli olmalıdır`)
  .regex(/^[0-9]{5}$/, VALIDATION_MESSAGES.postalCode);

export const addressSchema = z
  .string()
  .min(VALIDATION_RULES.address.min, VALIDATION_MESSAGES.minLength(VALIDATION_RULES.address.min))
  .max(VALIDATION_RULES.address.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.address.max));

export const descriptionSchema = z
  .string()
  .max(VALIDATION_RULES.description.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.description.max))
  .optional();

export const notesSchema = z
  .string()
  .max(VALIDATION_RULES.notes.max, VALIDATION_MESSAGES.maxLength(VALIDATION_RULES.notes.max))
  .optional();

export const amountSchema = z
  .number()
  .min(VALIDATION_RULES.amount.min, VALIDATION_MESSAGES.min(VALIDATION_RULES.amount.min))
  .max(VALIDATION_RULES.amount.max, VALIDATION_MESSAGES.max(VALIDATION_RULES.amount.max))
  .positive(VALIDATION_MESSAGES.positive);

export const percentageSchema = z
  .number()
  .min(VALIDATION_RULES.percentage.min, VALIDATION_MESSAGES.min(VALIDATION_RULES.percentage.min))
  .max(VALIDATION_RULES.percentage.max, VALIDATION_MESSAGES.max(VALIDATION_RULES.percentage.max));

export const ageSchema = z
  .number()
  .min(VALIDATION_RULES.age.min, VALIDATION_MESSAGES.min(VALIDATION_RULES.age.min))
  .max(VALIDATION_RULES.age.max, VALIDATION_MESSAGES.max(VALIDATION_RULES.age.max))
  .int(VALIDATION_MESSAGES.integer);

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, VALIDATION_MESSAGES.date)
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, VALIDATION_MESSAGES.date);

export const futureDateSchema = dateSchema
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsedDate > today;
  }, VALIDATION_MESSAGES.futureDate);

export const pastDateSchema = dateSchema
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return parsedDate < today;
  }, VALIDATION_MESSAGES.pastDate);

export const urlSchema = z
  .string()
  .url(VALIDATION_MESSAGES.url)
  .optional();

// Password validation schema is in auth.ts to avoid conflicts

export const genderSchema = z.enum(['male', 'female', 'other'], {
  message: 'Geçerli bir cinsiyet seçiniz'
});

export const maritalStatusSchema = z.enum(['single', 'married', 'divorced', 'widowed'], {
  message: 'Geçerli bir medeni durum seçiniz'
});

export const educationLevelSchema = z.enum([
  'none', 'literate', 'primary', 'secondary', 'high_school', 'university', 'graduate'
], {
  message: 'Geçerli bir eğitim seviyesi seçiniz'
});

export const statusSchema = z.enum(['active', 'inactive', 'pending', 'approved', 'rejected', 'cancelled'], {
  message: 'Geçerli bir durum seçiniz'
});

export const prioritySchema = z.enum(['low', 'medium', 'high', 'urgent'], {
  message: 'Geçerli bir öncelik seviyesi seçiniz'
});

// File validation schemas
export const fileSchema = z.object({
  name: z.string().min(1, 'Dosya adı gereklidir'),
  size: z.number().max(5 * 1024 * 1024, VALIDATION_MESSAGES.fileSize('5')), // 5MB
  type: z.string().refine(
    (type) => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      return allowedTypes.includes(type);
    },
    VALIDATION_MESSAGES.fileType('JPG, PNG, GIF, WebP, PDF, DOC, DOCX, XLS, XLSX')
  )
});

export const imageFileSchema = z.object({
  name: z.string().min(1, 'Dosya adı gereklidir'),
  size: z.number().max(2 * 1024 * 1024, VALIDATION_MESSAGES.fileSize('2')), // 2MB
  type: z.string().refine(
    (type) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(type);
    },
    VALIDATION_MESSAGES.fileType('JPG, PNG, GIF, WebP')
  )
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().min(1, 'Sayfa numarası 1\'den küçük olamaz').default(1),
  limit: z.number().min(1, 'Limit 1\'den küçük olamaz').max(100, 'Limit 100\'den büyük olamaz').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Arama terimi en az 1 karakter olmalıdır').max(100, 'Arama terimi en fazla 100 karakter olabilir'),
  filters: z.record(z.string(), z.any()).optional()
});

// Common form field schemas
export const requiredStringSchema = z.string().min(1, VALIDATION_MESSAGES.required);
export const optionalStringSchema = z.string().optional();
export const requiredNumberSchema = z.number({ message: VALIDATION_MESSAGES.required });
export const optionalNumberSchema = z.number().optional();
export const requiredDateSchema = z.string().min(1, VALIDATION_MESSAGES.required).pipe(dateSchema);
export const optionalDateSchema = z.string().optional().nullable().transform(val => val || undefined);

// Utility functions for validation
export const createRequiredSchema = <T>(schema: z.ZodSchema<T>) => 
  schema.refine(val => val !== undefined && val !== null && val !== '', {
    message: VALIDATION_MESSAGES.required
  });

export const createOptionalSchema = <T>(schema: z.ZodSchema<T>) => 
  schema.optional().nullable();

export const createArraySchema = <T>(itemSchema: z.ZodSchema<T>, minItems = 0, maxItems = 100) => 
  z.array(itemSchema)
    .min(minItems, `En az ${minItems} öğe gereklidir`)
    .max(maxItems, `En fazla ${maxItems} öğe olabilir`);