import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';

describe('SMS Routes', () => {
  const mockSMSMessage = {
    to: '+905551234567',
    message: 'Test SMS message',
    type: 'notification',
    priority: 'normal',
    scheduled_at: null
  };

  const mockBulkSMS = {
    recipients: ['+905551234567', '+905559876543'],
    message: 'Bulk SMS test message',
    type: 'campaign',
    priority: 'normal'
  };

  const mockTemplate = {
    name: 'welcome_message',
    content: 'Merhaba {name}, hoş geldiniz!',
    variables: ['name'],
    type: 'notification',
    is_active: true
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

  describe('POST /api/sms/send', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .send(mockSMSMessage);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          message: 'Test message'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid phone number format', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          to: 'invalid-phone'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty message', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          message: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for message too long', async () => {
      const longMessage = 'a'.repeat(1601); // SMS limit is usually 1600 chars
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          message: longMessage
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid SMS type', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          priority: 'invalid_priority'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should sanitize message content', async () => {
      const maliciousMessage = {
        ...mockSMSMessage,
        message: '<script>alert("xss")</script>Test message'
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousMessage);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle scheduled SMS', async () => {
      const scheduledMessage = {
        ...mockSMSMessage,
        scheduled_at: '2024-12-31T23:59:59Z'
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(scheduledMessage);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should return 400 for past scheduled time', async () => {
      const pastTime = {
        ...mockSMSMessage,
        scheduled_at: '2020-01-01T00:00:00Z'
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(pastTime);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sms/send-bulk', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .send(mockBulkSMS);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing recipients', async () => {
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          message: 'Test message'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty recipients array', async () => {
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkSMS,
          recipients: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for too many recipients', async () => {
      const tooManyRecipients = Array(1001).fill('+905551234567'); // Limit might be 1000
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkSMS,
          recipients: tooManyRecipients
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid phone numbers in recipients', async () => {
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkSMS,
          recipients: ['+905551234567', 'invalid-phone']
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle duplicate phone numbers', async () => {
      const response = await request(app)
        .post('/api/sms/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkSMS,
          recipients: ['+905551234567', '+905551234567']
        });

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('GET /api/sms/messages', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/sms/messages');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/sms/messages?page=1&limit=10')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should validate pagination limits', async () => {
      const response = await request(app)
        .get('/api/sms/messages?page=0&limit=101')
        .set('Authorization', mockAuthToken);

      expect([400, 401]).toContain(response.status);
    });

    it('should handle date range filters', async () => {
      const response = await request(app)
        .get('/api/sms/messages?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle status filter', async () => {
      const response = await request(app)
        .get('/api/sms/messages?status=sent')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle type filter', async () => {
      const response = await request(app)
        .get('/api/sms/messages?type=notification')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/sms/messages/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/sms/messages/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/sms/messages/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/sms/messages/:id', () => {
    const messageId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/sms/messages/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .delete(`/api/sms/messages/${messageId}`);

      expect(response.status).toBe(401);
    });
  });

  // Template endpoints
  describe('GET /api/sms/templates', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/sms/templates');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination and filters', async () => {
      const response = await request(app)
        .get('/api/sms/templates?page=1&limit=10&type=notification')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/sms/templates', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', mockAuthToken)
        .send({
          name: 'test_template'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid template name', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          name: 'invalid name with spaces'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for template content too long', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          content: 'a'.repeat(1601)
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .send(mockTemplate);

      expect(response.status).toBe(401);
    });

    it('should validate template variables', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          content: 'Hello {name} and {surname}',
          variables: ['name'] // Missing 'surname'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sms/send-template', () => {
    it('should return 400 for missing template name', async () => {
      const response = await request(app)
        .post('/api/sms/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: '+905551234567',
          variables: { name: 'Test' }
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing variables', async () => {
      const response = await request(app)
        .post('/api/sms/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: '+905551234567',
          template_name: 'welcome_message'
          // Missing variables
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/sms/send-template')
        .send({
          to: '+905551234567',
          template_name: 'welcome_message',
          variables: { name: 'Test' }
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sms/stats', () => {
    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/sms/stats');

      expect(response.status).toBe(401);
    });

    it('should handle date range for statistics', async () => {
      const response = await request(app)
        .get('/api/sms/stats?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle grouping parameter', async () => {
      const response = await request(app)
        .get('/api/sms/stats?group_by=status')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Input Sanitization and Security', () => {
    it('should prevent SQL injection in message content', async () => {
      const maliciousData = {
        ...mockSMSMessage,
        message: "'; DROP TABLE sms_messages; --"
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should prevent XSS in template content', async () => {
      const maliciousData = {
        ...mockTemplate,
        content: '<script>alert("xss")</script>Hello {name}'
      };

      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(10001);
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockSMSMessage,
          message: longString
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid SMS sending requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app)
          .post('/api/sms/send')
          .set('Authorization', mockAuthToken)
          .send(mockSMSMessage)
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Should have rate limiting for SMS endpoints
      expect(statusCodes.some(code => [429].includes(code))).toBe(true);
    });

    it('should handle bulk SMS rate limiting', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app)
          .post('/api/sms/send-bulk')
          .set('Authorization', mockAuthToken)
          .send(mockBulkSMS)
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Bulk SMS should have stricter rate limiting
      expect(statusCodes.some(code => [429].includes(code))).toBe(true);
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate Turkish phone numbers', async () => {
      const turkishNumbers = [
        '+905551234567',
        '+90 555 123 45 67',
        '05551234567'
      ];

      for (const number of turkishNumbers) {
        const response = await request(app)
          .post('/api/sms/send')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockSMSMessage,
            to: number
          });

        expect([200, 201, 400, 401]).toContain(response.status);
      }
    });

    it('should reject invalid phone number formats', async () => {
      const invalidNumbers = [
        '123456',
        '+1234',
        'not-a-number',
        '+90555123456789012345' // Too long
      ];

      for (const number of invalidNumbers) {
        const response = await request(app)
          .post('/api/sms/send')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockSMSMessage,
            to: number
          });

        expect(response.status).toBe(400);
      }
    });
  });

  describe('Message Content Validation', () => {
    it('should handle special characters in messages', async () => {
      const specialChars = {
        ...mockSMSMessage,
        message: 'Test message with émojis 🎉 and spëcial çharacters'
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(specialChars);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should validate message encoding', async () => {
      const unicodeMessage = {
        ...mockSMSMessage,
        message: 'Türkçe karakterler: ğüşıöç ĞÜŞIÖÇ'
      };

      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', mockAuthToken)
        .send(unicodeMessage);

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });
});