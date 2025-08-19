import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  generateId, 
  formatCurrency, 
  validateEmail, 
  validatePhone, 
  hashPassword, 
  comparePassword,
  generateToken,
  verifyToken,
  sanitizeHtml,
  formatDate,
  calculateAge,
  isValidUUID,
  slugify,
  truncateText,
  generateRandomString,
  isValidUrl,
  parsePhoneNumber,
  formatPhoneNumber,
  validateTurkishId,
  calculateDistance,
  formatFileSize,
  getFileExtension,
  isImageFile,
  generateQRCode,
  sendEmail,
  sendSMS,
  uploadFile,
  deleteFile,
  resizeImage,
  generatePDF,
  exportToExcel,
  importFromExcel,
  validateCreditCard,
  maskCreditCard,
  calculateTax,
  formatPercentage,
  roundToDecimal,
  convertCurrency,
  generateInvoiceNumber,
  calculateDonationTax,
  validateIBAN,
  formatIBAN
} from '../utils';

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ID and UUID Functions', () => {
    it('should generate valid UUID', () => {
      const id = generateId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should validate UUID format', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null)).toBe(false);
    });

    it('should generate unique IDs', () => {
      const ids = Array(100).fill(null).map(() => generateId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe('String Utilities', () => {
    it('should slugify strings correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Türkçe Karakterler')).toBe('turkce-karakterler');
      expect(slugify('Special!@#$%Characters')).toBe('special-characters');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('')).toBe('');
    });

    it('should truncate text correctly', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
      expect(truncateText(longText, 50)).toBe(longText);
      expect(truncateText('Short', 20)).toBe('Short');
      expect(truncateText('', 10)).toBe('');
    });

    it('should generate random strings', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).toHaveLength(10);
      expect(str2).toHaveLength(10);
      expect(str1).not.toBe(str2);
      expect(str1).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should sanitize HTML correctly', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeHtml('<p>Safe content</p>')).toBe('<p>Safe content</p>');
      expect(sanitizeHtml('<img src=x onerror=alert(1)>')).toBe('<img src="x">');
      expect(sanitizeHtml('Plain text')).toBe('Plain text');
    });
  });

  describe('Validation Functions', () => {
    it('should validate email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should validate phone numbers', () => {
      expect(validatePhone('+905551234567')).toBe(true);
      expect(validatePhone('05551234567')).toBe(true);
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('invalid-phone')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    it('should validate Turkish ID numbers', () => {
      expect(validateTurkishId('12345678901')).toBe(true); // Valid checksum
      expect(validateTurkishId('12345678902')).toBe(false); // Invalid checksum
      expect(validateTurkishId('1234567890')).toBe(false); // Too short
      expect(validateTurkishId('123456789012')).toBe(false); // Too long
      expect(validateTurkishId('abcdefghijk')).toBe(false); // Non-numeric
    });

    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://subdomain.example.com/path')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
      expect(isValidUrl('invalid-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should validate credit card numbers', () => {
      expect(validateCreditCard('4111111111111111')).toBe(true); // Valid Visa
      expect(validateCreditCard('5555555555554444')).toBe(true); // Valid MasterCard
      expect(validateCreditCard('1234567890123456')).toBe(false); // Invalid
      expect(validateCreditCard('411111111111111')).toBe(false); // Too short
      expect(validateCreditCard('')).toBe(false);
    });

    it('should validate IBAN numbers', () => {
      expect(validateIBAN('TR330006100519786457841326')).toBe(true);
      expect(validateIBAN('GB82WEST12345698765432')).toBe(true);
      expect(validateIBAN('INVALID_IBAN')).toBe(false);
      expect(validateIBAN('')).toBe(false);
    });
  });

  describe('Password Functions', () => {
    it('should hash passwords', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should compare passwords correctly', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      
      expect(await comparePassword(password, hash)).toBe(true);
      expect(await comparePassword('wrongPassword', hash)).toBe(false);
    });

    it('should handle empty passwords', async () => {
      await expect(hashPassword('')).rejects.toThrow();
      await expect(comparePassword('', 'hash')).rejects.toThrow();
    });
  });

  describe('Token Functions', () => {
    it('should generate and verify tokens', () => {
      const payload = { userId: '123', role: 'user' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe('123');
      expect(decoded.role).toBe('user');
    });

    it('should handle invalid tokens', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
      expect(() => verifyToken('')).toThrow();
    });

    it('should handle expired tokens', () => {
      const payload = { userId: '123', exp: Math.floor(Date.now() / 1000) - 3600 }; // Expired 1 hour ago
      const token = generateToken(payload);
      
      expect(() => verifyToken(token)).toThrow();
    });
  });

  describe('Date and Time Functions', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
      expect(formatDate(date, 'DD.MM.YYYY HH:mm')).toBe('15.01.2024 10:30');
    });

    it('should calculate age correctly', () => {
      const birthDate = new Date('1990-01-15');
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThan(30);
      expect(age).toBeLessThan(40);
    });

    it('should handle invalid dates', () => {
      expect(() => formatDate(new Date('invalid'), 'YYYY-MM-DD')).toThrow();
      expect(() => calculateAge(new Date('invalid'))).toThrow();
    });
  });

  describe('Currency and Number Functions', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56, 'TRY')).toBe('₺1,234.56');
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(500.5, 'EUR')).toBe('€500.50');
      expect(formatCurrency(0, 'TRY')).toBe('₺0.00');
    });

    it('should format percentages', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(1)).toBe('100.00%');
      expect(formatPercentage(0)).toBe('0.00%');
    });

    it('should round to decimal places', () => {
      expect(roundToDecimal(3.14159, 2)).toBe(3.14);
      expect(roundToDecimal(10.999, 1)).toBe(11.0);
      expect(roundToDecimal(5, 2)).toBe(5.00);
    });

    it('should calculate tax correctly', () => {
      expect(calculateTax(100, 0.18)).toBe(18);
      expect(calculateTax(1000, 0.08)).toBe(80);
      expect(calculateTax(0, 0.18)).toBe(0);
    });

    it('should calculate donation tax benefits', () => {
      expect(calculateDonationTax(1000)).toBeGreaterThan(0);
      expect(calculateDonationTax(0)).toBe(0);
    });

    it('should convert currency', async () => {
      // Mock currency conversion
      const converted = await convertCurrency(100, 'USD', 'TRY');
      expect(converted).toBeGreaterThan(0);
    });
  });

  describe('Phone Number Functions', () => {
    it('should parse phone numbers', () => {
      const parsed = parsePhoneNumber('+905551234567');
      expect(parsed.countryCode).toBe('+90');
      expect(parsed.nationalNumber).toBe('5551234567');
      expect(parsed.isValid).toBe(true);
    });

    it('should format phone numbers', () => {
      expect(formatPhoneNumber('+905551234567')).toBe('+90 555 123 45 67');
      expect(formatPhoneNumber('05551234567')).toBe('0555 123 45 67');
    });

    it('should handle invalid phone numbers', () => {
      const parsed = parsePhoneNumber('invalid');
      expect(parsed.isValid).toBe(false);
      
      expect(() => formatPhoneNumber('invalid')).toThrow();
    });
  });

  describe('File Functions', () => {
    it('should get file extensions', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.jpg')).toBe('jpg');
      expect(getFileExtension('file.tar.gz')).toBe('gz');
      expect(getFileExtension('noextension')).toBe('');
    });

    it('should identify image files', () => {
      expect(isImageFile('photo.jpg')).toBe(true);
      expect(isImageFile('image.png')).toBe(true);
      expect(isImageFile('picture.gif')).toBe(true);
      expect(isImageFile('document.pdf')).toBe(false);
      expect(isImageFile('video.mp4')).toBe(false);
    });

    it('should format file sizes', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(1073741824)).toBe('1.00 GB');
      expect(formatFileSize(500)).toBe('500 B');
    });
  });

  describe('Geographic Functions', () => {
    it('should calculate distance between coordinates', () => {
      const istanbul = { lat: 41.0082, lng: 28.9784 };
      const ankara = { lat: 39.9334, lng: 32.8597 };
      
      const distance = calculateDistance(istanbul, ankara);
      expect(distance).toBeGreaterThan(350); // Approximately 450km
      expect(distance).toBeLessThan(500);
    });

    it('should handle same coordinates', () => {
      const point = { lat: 41.0082, lng: 28.9784 };
      const distance = calculateDistance(point, point);
      expect(distance).toBe(0);
    });

    it('should handle invalid coordinates', () => {
      const invalid = { lat: 'invalid', lng: 'invalid' };
      const valid = { lat: 41.0082, lng: 28.9784 };
      
      expect(() => calculateDistance(invalid, valid)).toThrow();
    });
  });

  describe('Format Functions', () => {
    it('should format IBAN correctly', () => {
      expect(formatIBAN('TR330006100519786457841326')).toBe('TR33 0006 1005 1978 6457 8413 26');
      expect(formatIBAN('GB82WEST12345698765432')).toBe('GB82 WEST 1234 5698 7654 32');
    });

    it('should mask credit card numbers', () => {
      expect(maskCreditCard('4111111111111111')).toBe('**** **** **** 1111');
      expect(maskCreditCard('5555555555554444')).toBe('**** **** **** 4444');
    });

    it('should generate invoice numbers', () => {
      const invoice1 = generateInvoiceNumber();
      const invoice2 = generateInvoiceNumber();
      
      expect(invoice1).toMatch(/^INV-\d{4}-\d{6}$/);
      expect(invoice2).toMatch(/^INV-\d{4}-\d{6}$/);
      expect(invoice1).not.toBe(invoice2);
    });
  });

  describe('QR Code Functions', () => {
    it('should generate QR codes', async () => {
      const qrCode = await generateQRCode('https://example.com');
      expect(qrCode).toBeDefined();
      expect(typeof qrCode).toBe('string');
      expect(qrCode.startsWith('data:image')).toBe(true);
    });

    it('should handle empty data', async () => {
      await expect(generateQRCode('')).rejects.toThrow();
    });

    it('should handle large data', async () => {
      const largeData = 'a'.repeat(3000);
      const qrCode = await generateQRCode(largeData);
      expect(qrCode).toBeDefined();
    });
  });

  describe('Communication Functions', () => {
    it('should send emails', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email'
      };
      
      // Mock email sending
      const result = await sendEmail(emailData);
      expect(result.success).toBe(true);
    });

    it('should send SMS', async () => {
      const smsData = {
        to: '+905551234567',
        message: 'Test SMS'
      };
      
      // Mock SMS sending
      const result = await sendSMS(smsData);
      expect(result.success).toBe(true);
    });

    it('should handle invalid email addresses', async () => {
      const emailData = {
        to: 'invalid-email',
        subject: 'Test',
        body: 'Test'
      };
      
      await expect(sendEmail(emailData)).rejects.toThrow();
    });

    it('should handle invalid phone numbers', async () => {
      const smsData = {
        to: 'invalid-phone',
        message: 'Test'
      };
      
      await expect(sendSMS(smsData)).rejects.toThrow();
    });
  });

  describe('File Upload Functions', () => {
    it('should upload files', async () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 17
      };
      
      const result = await uploadFile(mockFile, 'documents');
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
    });

    it('should delete files', async () => {
      const result = await deleteFile('test-file-url');
      expect(result.success).toBe(true);
    });

    it('should resize images', async () => {
      const mockImageBuffer = Buffer.from('mock image data');
      const resized = await resizeImage(mockImageBuffer, { width: 300, height: 200 });
      expect(resized).toBeDefined();
    });

    it('should handle invalid file types', async () => {
      const mockFile = {
        buffer: Buffer.from('malicious content'),
        originalname: 'malware.exe',
        mimetype: 'application/x-executable',
        size: 1000
      };
      
      await expect(uploadFile(mockFile, 'documents')).rejects.toThrow();
    });
  });

  describe('Document Generation Functions', () => {
    it('should generate PDF documents', async () => {
      const data = {
        title: 'Test Document',
        content: 'This is test content',
        author: 'Test Author'
      };
      
      const pdf = await generatePDF(data);
      expect(pdf).toBeDefined();
      expect(Buffer.isBuffer(pdf)).toBe(true);
    });

    it('should export to Excel', async () => {
      const data = [
        { name: 'John Doe', email: 'john@example.com', age: 30 },
        { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
      ];
      
      const excel = await exportToExcel(data, 'Users');
      expect(excel).toBeDefined();
      expect(Buffer.isBuffer(excel)).toBe(true);
    });

    it('should import from Excel', async () => {
      const mockExcelBuffer = Buffer.from('mock excel data');
      const data = await importFromExcel(mockExcelBuffer);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should handle empty data for export', async () => {
      const excel = await exportToExcel([], 'Empty');
      expect(excel).toBeDefined();
    });

    it('should handle invalid Excel files for import', async () => {
      const invalidBuffer = Buffer.from('not an excel file');
      await expect(importFromExcel(invalidBuffer)).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      expect(() => validateEmail(null)).not.toThrow();
      expect(() => validatePhone(undefined)).not.toThrow();
      expect(() => formatCurrency(null, 'TRY')).not.toThrow();
      expect(() => slugify(null)).not.toThrow();
    });

    it('should handle edge cases', () => {
      expect(formatCurrency(-100, 'TRY')).toBe('-₺100.00');
      expect(calculateAge(new Date())).toBe(0);
      expect(truncateText('Short', 100)).toBe('Short');
      expect(roundToDecimal(3.14159, 0)).toBe(3);
    });

    it('should validate input types', () => {
      expect(() => formatCurrency('not a number', 'TRY')).toThrow();
      expect(() => calculateAge('not a date')).toThrow();
      expect(() => roundToDecimal('not a number', 2)).toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const start = Date.now();
      const largeArray = Array(10000).fill(null).map((_, i) => `item-${i}`);
      const slugified = largeArray.map(item => slugify(item));
      const end = Date.now();
      
      expect(slugified).toHaveLength(10000);
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent operations', async () => {
      const promises = Array(100).fill(null).map(async (_, i) => {
        const password = `password-${i}`;
        const hash = await hashPassword(password);
        return comparePassword(password, hash);
      });
      
      const results = await Promise.all(promises);
      expect(results.every(result => result === true)).toBe(true);
    });
  });
});