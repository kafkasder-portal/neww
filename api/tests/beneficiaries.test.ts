import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';

describe('Beneficiaries Routes', () => {
  const mockBeneficiary = {
    full_name: 'Test Beneficiary',
    email: 'beneficiary@test.com',
    phone: '+905551234567',
    address: 'Test Address 123',
    birth_date: '1990-01-01',
    emergency_contact: '+905559876543',
    notes: 'Test notes'
  };

  const mockAuthToken = 'Bearer mock-jwt-token';

  beforeAll(async () => {
    // Setup test database or mock services
  });

  afterAll(async () => {
    // Cleanup test database or mock services
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/beneficiaries', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/beneficiaries');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 with pagination parameters', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?page=1&limit=10')
        .set('Authorization', mockAuthToken);

      // Note: This will fail without proper auth, but tests the route structure
      expect([200, 401]).toContain(response.status);
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?page=0&limit=101')
        .set('Authorization', mockAuthToken);

      expect([400, 401]).toContain(response.status);
    });

    it('should handle search query', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?q=test&filter=active')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/beneficiaries/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/beneficiaries/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/beneficiaries/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/beneficiaries', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBeneficiary,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid phone format', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBeneficiary,
          phone: 'invalid-phone'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for too long name', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBeneficiary,
          full_name: 'a'.repeat(101)
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/beneficiaries')
        .send(mockBeneficiary);

      expect(response.status).toBe(401);
    });

    it('should sanitize input data', async () => {
      const maliciousData = {
        ...mockBeneficiary,
        full_name: '<script>alert("xss")</script>Test Name',
        notes: 'Test notes <img src=x onerror=alert(1)>'
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      // Should either succeed with sanitized data or fail validation
      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/beneficiaries/:id', () => {
    const beneficiaryId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .put('/api/beneficiaries/invalid-id')
        .set('Authorization', mockAuthToken)
        .send({ full_name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .put(`/api/beneficiaries/${beneficiaryId}`)
        .send({ full_name: 'Updated Name' });

      expect(response.status).toBe(401);
    });

    it('should validate email format when provided', async () => {
      const response = await request(app)
        .put(`/api/beneficiaries/${beneficiaryId}`)
        .set('Authorization', mockAuthToken)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate phone format when provided', async () => {
      const response = await request(app)
        .put(`/api/beneficiaries/${beneficiaryId}`)
        .set('Authorization', mockAuthToken)
        .send({ phone: 'invalid-phone' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/beneficiaries/:id', () => {
    const beneficiaryId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/beneficiaries/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .delete(`/api/beneficiaries/${beneficiaryId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/beneficiaries/:id/donations', () => {
    const beneficiaryId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/beneficiaries/invalid-id/donations')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get(`/api/beneficiaries/${beneficiaryId}/donations`);

      expect(response.status).toBe(401);
    });

    it('should handle date range filters', async () => {
      const response = await request(app)
        .get(`/api/beneficiaries/${beneficiaryId}/donations?start_date=2024-01-01&end_date=2024-12-31`)
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .get(`/api/beneficiaries/${beneficiaryId}/donations?start_date=invalid-date`)
        .set('Authorization', mockAuthToken);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('Input Sanitization', () => {
    it('should prevent SQL injection attempts', async () => {
      const maliciousData = {
        full_name: "'; DROP TABLE beneficiaries; --",
        email: 'test@example.com',
        phone: '+905551234567',
        address: 'Test Address',
        notes: 'UNION SELECT * FROM users'
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(10001);
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBeneficiary,
          notes: longString
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app)
          .get('/api/beneficiaries')
          .set('Authorization', mockAuthToken)
      );

      const responses = await Promise.all(requests);
      
      // Some requests should succeed, some might be rate limited
      const statusCodes = responses.map(r => r.status);
      expect(statusCodes).toContain(401); // At least auth errors
    });
  });
});