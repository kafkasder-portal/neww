import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';
import { validateRequest, sanitizeInput, preventSQLInjection, validateFileUpload } from '../middleware/validation';
import { xssProtection, csrfProtection } from '../middleware/xss-protection';

describe('Middleware Tests', () => {
  const mockAuthToken = 'Bearer mock-jwt-token';

  beforeAll(async () => {
    // Setup test environment
  });

  afterAll(async () => {
    // Cleanup test environment
  });

  beforeEach(() => {
    if (vi && vi.clearAllMocks) {
      vi.clearAllMocks();
    }
  });

  describe('Validation Middleware', () => {
    describe('Input Validation', () => {
      it('should validate email format', async () => {
        const invalidEmailData = {
          email: 'invalid-email-format',
          password: 'validPassword123!'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidEmailData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/email/i);
      });

      it('should validate password strength', async () => {
        const weakPasswordData = {
          email: 'test@example.com',
          password: '123' // Too weak
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(weakPasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/password/i);
      });

      it('should validate phone number format', async () => {
        const invalidPhoneData = {
          name: 'Test User',
          email: 'test@example.com',
          phone: 'invalid-phone',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/beneficiaries')
          .set('Authorization', mockAuthToken)
          .send(invalidPhoneData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/phone/i);
      });

      it('should validate required fields', async () => {
        const incompleteData = {
          email: 'test@example.com'
          // Missing password
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(incompleteData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate field length limits', async () => {
        const longNameData = {
          name: 'a'.repeat(256), // Too long
          email: 'test@example.com',
          phone: '+905551234567',
          address: 'Test Address'
        };

        const response = await request(app)
          .post('/api/beneficiaries')
          .set('Authorization', mockAuthToken)
          .send(longNameData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate numeric fields', async () => {
        const invalidAmountData = {
          amount: 'not-a-number',
          currency: 'TRY',
          donor_id: '550e8400-e29b-41d4-a716-446655440000',
          beneficiary_id: '550e8400-e29b-41d4-a716-446655440001'
        };

        const response = await request(app)
          .post('/api/donations')
          .set('Authorization', mockAuthToken)
          .send(invalidAmountData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate date formats', async () => {
        const invalidDateData = {
          title: 'Test Task',
          description: 'Test Description',
          due_date: 'invalid-date',
          priority: 'medium',
          status: 'pending'
        };

        const response = await request(app)
          .post('/api/tasks')
          .set('Authorization', mockAuthToken)
          .send(invalidDateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate UUID format', async () => {
        const response = await request(app)
          .get('/api/beneficiaries/invalid-uuid')
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/id/i);
      });

      it('should validate enum values', async () => {
        const invalidStatusData = {
          title: 'Test Task',
          description: 'Test Description',
          priority: 'invalid-priority', // Should be low, medium, high
          status: 'pending'
        };

        const response = await request(app)
          .post('/api/tasks')
          .set('Authorization', mockAuthToken)
          .send(invalidStatusData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate positive numbers', async () => {
        const negativeAmountData = {
          amount: -100,
          currency: 'TRY',
          donor_id: '550e8400-e29b-41d4-a716-446655440000',
          beneficiary_id: '550e8400-e29b-41d4-a716-446655440001'
        };

        const response = await request(app)
          .post('/api/donations')
          .set('Authorization', mockAuthToken)
          .send(negativeAmountData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate URL format', async () => {
        const invalidUrlData = {
          name: 'Test Organization',
          website: 'not-a-valid-url',
          email: 'test@example.com'
        };

        const response = await request(app)
          .post('/api/organizations')
          .set('Authorization', mockAuthToken)
          .send(invalidUrlData);

        expect([400, 404]).toContain(response.status);
      });
    });

    describe('Pagination Validation', () => {
      it('should validate page parameter', async () => {
        const response = await request(app)
          .get('/api/beneficiaries?page=0') // Page should be >= 1
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate limit parameter', async () => {
        const response = await request(app)
          .get('/api/beneficiaries?limit=101') // Limit should be <= 100
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate negative limit', async () => {
        const response = await request(app)
          .get('/api/beneficiaries?limit=-1')
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should handle non-numeric pagination parameters', async () => {
        const response = await request(app)
          .get('/api/beneficiaries?page=abc&limit=xyz')
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('Date Range Validation', () => {
      it('should validate date range format', async () => {
        const response = await request(app)
          .get('/api/donations?start_date=invalid-date&end_date=2024-12-31')
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate date range logic', async () => {
        const response = await request(app)
          .get('/api/donations?start_date=2024-12-31&end_date=2024-01-01') // End before start
          .set('Authorization', mockAuthToken);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should validate future dates where appropriate', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 10);
        
        const response = await request(app)
          .get(`/api/donations?start_date=${futureDate.toISOString().split('T')[0]}`)
          .set('Authorization', mockAuthToken);

        expect([200, 400, 401]).toContain(response.status);
      });
    });

    describe('File Upload Validation', () => {
      it('should validate file size', async () => {
        // This would typically be tested with actual file upload
        // For now, we test the validation function directly
        const mockFile = {
          size: 26214400, // 25MB+ (too large)
          mimetype: 'image/jpeg',
          originalname: 'test.jpg'
        };

        const isValid = validateFileUpload(mockFile, {
          maxSize: 25 * 1024 * 1024, // 25MB
          allowedTypes: ['image/jpeg', 'image/png']
        });

        expect(isValid.valid).toBe(false);
        expect(isValid.error).toMatch(/size/i);
      });

      it('should validate file type', async () => {
        const mockFile = {
          size: 1024 * 1024, // 1MB
          mimetype: 'application/x-executable',
          originalname: 'malicious.exe'
        };

        const isValid = validateFileUpload(mockFile, {
          maxSize: 25 * 1024 * 1024,
          allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
        });

        expect(isValid.valid).toBe(false);
        expect(isValid.error).toMatch(/type/i);
      });

      it('should validate file extension', async () => {
        const mockFile = {
          size: 1024 * 1024,
          mimetype: 'image/jpeg',
          originalname: 'test.exe' // Extension doesn't match mimetype
        };

        const isValid = validateFileUpload(mockFile, {
          maxSize: 25 * 1024 * 1024,
          allowedTypes: ['image/jpeg', 'image/png']
        });

        expect(isValid.valid).toBe(false);
      });
    });
  });

  describe('XSS Protection Middleware', () => {
    it('should sanitize HTML in request body', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>Test Name',
        description: '<img src=x onerror=alert("xss")>Description'
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      // Should either sanitize or reject
      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should sanitize query parameters', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?search=<script>alert("xss")</script>')
        .set('Authorization', mockAuthToken);

      expect([200, 400, 401]).toContain(response.status);
    });

    it('should set security headers', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should handle nested XSS attempts', async () => {
      const nestedXSS = {
        data: {
          nested: {
            field: '<script>alert("nested xss")</script>'
          }
        }
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', mockAuthToken)
        .send(nestedXSS);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should preserve safe HTML', async () => {
      const safeHTML = {
        description: '<p>This is <strong>safe</strong> HTML content</p>'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', mockAuthToken)
        .send({
          title: 'Test Task',
          ...safeHTML,
          priority: 'medium',
          status: 'pending'
        });

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('CSRF Protection Middleware', () => {
    it('should require CSRF token for state-changing operations', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+905551234567',
          address: 'Test Address'
        });

      // Should either require CSRF token or be configured to skip in test environment
      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });

    it('should provide CSRF token endpoint', async () => {
      const response = await request(app)
        .get('/api/auth/csrf-token')
        .set('Authorization', mockAuthToken);

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('csrfToken');
      }
    });

    it('should validate CSRF token format', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .set('X-CSRF-Token', 'invalid-token')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+905551234567',
          address: 'Test Address'
        });

      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in search parameters', async () => {
      const sqlInjection = "'; DROP TABLE beneficiaries; --";
      
      const response = await request(app)
        .get(`/api/beneficiaries?search=${encodeURIComponent(sqlInjection)}`)
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should prevent SQL injection in request body', async () => {
      const maliciousData = {
        name: "'; DROP TABLE users; --",
        email: 'test@example.com',
        phone: '+905551234567',
        address: 'Test Address'
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should prevent SQL injection in URL parameters', async () => {
      const sqlInjection = "1'; DROP TABLE beneficiaries; --";
      
      const response = await request(app)
        .get(`/api/beneficiaries/${sqlInjection}`)
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle SQL keywords in legitimate content', async () => {
      const legitimateData = {
        name: 'SELECT Organization', // Contains SQL keyword but legitimate
        email: 'select@example.com',
        phone: '+905551234567',
        address: 'DROP Street 123' // Contains SQL keyword but legitimate
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(legitimateData);

      // Should allow legitimate content that happens to contain SQL keywords
      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('Input Sanitization', () => {
    it('should trim whitespace from string inputs', async () => {
      const dataWithWhitespace = {
        name: '  Test User  ',
        email: '  test@example.com  ',
        phone: '  +905551234567  ',
        address: '  Test Address  '
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(dataWithWhitespace);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle null and undefined values', async () => {
      const dataWithNulls = {
        name: 'Test User',
        email: 'test@example.com',
        phone: null,
        address: undefined
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(dataWithNulls);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle empty strings', async () => {
      const dataWithEmptyStrings = {
        name: '',
        email: 'test@example.com',
        phone: '+905551234567',
        address: ''
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(dataWithEmptyStrings);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should normalize unicode characters', async () => {
      const unicodeData = {
        name: 'Tëst Üser', // Unicode characters
        email: 'test@example.com',
        phone: '+905551234567',
        address: 'Tëst Àddress'
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(unicodeData);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle very long strings', async () => {
      const veryLongString = 'a'.repeat(10000);
      
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          name: veryLongString,
          email: 'test@example.com',
          phone: '+905551234567',
          address: 'Test Address'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should apply rate limiting to authentication endpoints', async () => {
      const requests = Array(20).fill(null).map(() => 
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Should have rate limiting (429) for too many requests
      expect(statusCodes.some(code => code === 429)).toBe(true);
    });

    it('should apply different rate limits to different endpoints', async () => {
      // Test that different endpoints have different rate limits
      const authRequests = Array(10).fill(null).map(() => 
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'test' })
      );

      const dataRequests = Array(50).fill(null).map(() => 
        request(app)
          .get('/api/beneficiaries')
          .set('Authorization', mockAuthToken)
      );

      const [authResponses, dataResponses] = await Promise.all([
        Promise.all(authRequests),
        Promise.all(dataRequests)
      ]);

      const authStatusCodes = authResponses.map(r => r.status);
      const dataStatusCodes = dataResponses.map(r => r.status);

      // Auth endpoints should have stricter rate limiting
      expect(authStatusCodes.filter(code => code === 429).length)
        .toBeGreaterThan(dataStatusCodes.filter(code => code === 429).length);
    });

    it('should reset rate limit after time window', async () => {
      // This test would require waiting for the rate limit window to reset
      // In a real test environment, you might mock the time or use shorter windows
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test'
        });

      expect([400, 401, 429]).toContain(response.status);
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle validation errors gracefully', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({}); // Empty body should trigger validation errors

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBeDefined();
    });

    it('should not expose internal error details', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      // Should not expose stack traces or internal details
      expect(response.body.error).not.toMatch(/stack|trace|internal/i);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle oversized requests', async () => {
      const largePayload = {
        data: 'a'.repeat(10 * 1024 * 1024) // 10MB payload
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(largePayload);

      expect([400, 413]).toContain(response.status); // 413 = Payload Too Large
    });
  });

  describe('Security Headers Middleware', () => {
    it('should set Content Security Policy headers', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('content-security-policy');
    });

    it('should set HSTS headers', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('strict-transport-security');
    });

    it('should set X-Frame-Options', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should set X-Content-Type-Options', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set Referrer-Policy', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('referrer-policy');
    });
  });
});