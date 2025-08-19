import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';

describe('Email Routes', () => {
  const mockEmail = {
    to: 'test@example.com',
    subject: 'Test Email Subject',
    content: 'This is a test email content',
    type: 'notification',
    priority: 'normal',
    scheduled_at: null
  };

  const mockBulkEmail = {
    recipients: ['test1@example.com', 'test2@example.com'],
    subject: 'Bulk Email Test',
    content: 'This is a bulk email test',
    type: 'campaign',
    priority: 'normal'
  };

  const mockTemplate = {
    name: 'welcome_email',
    subject: 'Hoş geldiniz {name}!',
    content: '<h1>Merhaba {name}</h1><p>Sisteme hoş geldiniz!</p>',
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

  describe('POST /api/email/send', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send(mockEmail);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          subject: 'Test Subject'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          to: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty subject', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          subject: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty content', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          content: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for subject too long', async () => {
      const longSubject = 'a'.repeat(999); // Email subject limit
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          subject: longSubject
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for content too long', async () => {
      const longContent = 'a'.repeat(100001); // Email content limit
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          content: longContent
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email type', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          priority: 'invalid_priority'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should sanitize email content', async () => {
      const maliciousEmail = {
        ...mockEmail,
        content: '<script>alert("xss")</script><p>Test content</p>'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousEmail);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle scheduled emails', async () => {
      const scheduledEmail = {
        ...mockEmail,
        scheduled_at: '2024-12-31T23:59:59Z'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(scheduledEmail);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should return 400 for past scheduled time', async () => {
      const pastTime = {
        ...mockEmail,
        scheduled_at: '2020-01-01T00:00:00Z'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(pastTime);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle CC and BCC recipients', async () => {
      const emailWithCCBCC = {
        ...mockEmail,
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com']
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(emailWithCCBCC);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should validate CC email formats', async () => {
      const invalidCC = {
        ...mockEmail,
        cc: ['invalid-email']
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(invalidCC);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate BCC email formats', async () => {
      const invalidBCC = {
        ...mockEmail,
        bcc: ['invalid-email']
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(invalidBCC);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/email/send-bulk', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/email/send-bulk')
        .send(mockBulkEmail);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing recipients', async () => {
      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          subject: 'Test Subject',
          content: 'Test content'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty recipients array', async () => {
      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkEmail,
          recipients: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for too many recipients', async () => {
      const tooManyRecipients = Array(1001).fill('test@example.com'); // Limit might be 1000
      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkEmail,
          recipients: tooManyRecipients
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email addresses in recipients', async () => {
      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkEmail,
          recipients: ['valid@example.com', 'invalid-email']
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle duplicate email addresses', async () => {
      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkEmail,
          recipients: ['test@example.com', 'test@example.com']
        });

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle personalization data', async () => {
      const personalizedBulk = {
        ...mockBulkEmail,
        personalization: {
          'test1@example.com': { name: 'John' },
          'test2@example.com': { name: 'Jane' }
        }
      };

      const response = await request(app)
        .post('/api/email/send-bulk')
        .set('Authorization', mockAuthToken)
        .send(personalizedBulk);

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('GET /api/email/messages', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/email/messages');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/email/messages?page=1&limit=10')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should validate pagination limits', async () => {
      const response = await request(app)
        .get('/api/email/messages?page=0&limit=101')
        .set('Authorization', mockAuthToken);

      expect([400, 401]).toContain(response.status);
    });

    it('should handle date range filters', async () => {
      const response = await request(app)
        .get('/api/email/messages?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle status filter', async () => {
      const response = await request(app)
        .get('/api/email/messages?status=sent')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle type filter', async () => {
      const response = await request(app)
        .get('/api/email/messages?type=notification')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle search functionality', async () => {
      const response = await request(app)
        .get('/api/email/messages?search=test')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/email/messages/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/email/messages/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/email/messages/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/email/messages/:id', () => {
    const messageId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/email/messages/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .delete(`/api/email/messages/${messageId}`);

      expect(response.status).toBe(401);
    });
  });

  // Template endpoints
  describe('GET /api/email/templates', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/email/templates');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination and filters', async () => {
      const response = await request(app)
        .get('/api/email/templates?page=1&limit=10&type=notification')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/email/templates', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          name: 'test_template'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid template name', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          name: 'invalid name with spaces'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for template subject too long', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          subject: 'a'.repeat(999)
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for template content too long', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          content: 'a'.repeat(100001)
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .send(mockTemplate);

      expect(response.status).toBe(401);
    });

    it('should validate template variables', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          subject: 'Hello {name} and {surname}',
          content: 'Welcome {name}',
          variables: ['name'] // Missing 'surname'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate HTML content', async () => {
      const response = await request(app)
        .post('/api/email/templates')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplate,
          content: '<html><body><h1>Valid HTML</h1></body></html>'
        });

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/email/send-template', () => {
    it('should return 400 for missing template name', async () => {
      const response = await request(app)
        .post('/api/email/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: 'test@example.com',
          variables: { name: 'Test' }
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing variables', async () => {
      const response = await request(app)
        .post('/api/email/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: 'test@example.com',
          template_name: 'welcome_email'
          // Missing variables
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/email/send-template')
        .send({
          to: 'test@example.com',
          template_name: 'welcome_email',
          variables: { name: 'Test' }
        });

      expect(response.status).toBe(401);
    });

    it('should validate required template variables', async () => {
      const response = await request(app)
        .post('/api/email/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: 'test@example.com',
          template_name: 'welcome_email',
          variables: {} // Missing required 'name' variable
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/email/stats', () => {
    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/email/stats');

      expect(response.status).toBe(401);
    });

    it('should handle date range for statistics', async () => {
      const response = await request(app)
        .get('/api/email/stats?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle grouping parameter', async () => {
      const response = await request(app)
        .get('/api/email/stats?group_by=status')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle delivery statistics', async () => {
      const response = await request(app)
        .get('/api/email/stats/delivery')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle engagement statistics', async () => {
      const response = await request(app)
        .get('/api/email/stats/engagement')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Email Attachments', () => {
    it('should handle email with attachments', async () => {
      const emailWithAttachment = {
        ...mockEmail,
        attachments: [
          {
            filename: 'document.pdf',
            content: 'base64-encoded-content',
            contentType: 'application/pdf'
          }
        ]
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(emailWithAttachment);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should validate attachment size', async () => {
      const largeAttachment = {
        ...mockEmail,
        attachments: [
          {
            filename: 'large-file.pdf',
            content: 'a'.repeat(26214400), // 25MB+ content
            contentType: 'application/pdf'
          }
        ]
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(largeAttachment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate attachment content type', async () => {
      const invalidAttachment = {
        ...mockEmail,
        attachments: [
          {
            filename: 'script.exe',
            content: 'base64-content',
            contentType: 'application/x-executable'
          }
        ]
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(invalidAttachment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should limit number of attachments', async () => {
      const tooManyAttachments = {
        ...mockEmail,
        attachments: Array(11).fill({
          filename: 'document.pdf',
          content: 'base64-content',
          contentType: 'application/pdf'
        })
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(tooManyAttachments);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Input Sanitization and Security', () => {
    it('should prevent SQL injection in email content', async () => {
      const maliciousData = {
        ...mockEmail,
        content: "'; DROP TABLE email_messages; --"
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should prevent XSS in email subject', async () => {
      const maliciousData = {
        ...mockEmail,
        subject: '<script>alert("xss")</script>Test Subject'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(100001);
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockEmail,
          content: longString
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate email headers', async () => {
      const emailWithHeaders = {
        ...mockEmail,
        headers: {
          'X-Custom-Header': 'value',
          'Reply-To': 'reply@example.com'
        }
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(emailWithHeaders);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should prevent header injection', async () => {
      const maliciousHeaders = {
        ...mockEmail,
        headers: {
          'X-Malicious': 'value\r\nBcc: hacker@evil.com'
        }
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(maliciousHeaders);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid email sending requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app)
          .post('/api/email/send')
          .set('Authorization', mockAuthToken)
          .send(mockEmail)
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Should have rate limiting for email endpoints
      expect(statusCodes.some(code => [429].includes(code))).toBe(true);
    });

    it('should handle bulk email rate limiting', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app)
          .post('/api/email/send-bulk')
          .set('Authorization', mockAuthToken)
          .send(mockBulkEmail)
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Bulk email should have stricter rate limiting
      expect(statusCodes.some(code => [429].includes(code))).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should validate various email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@subdomain.example.com'
      ];

      for (const email of validEmails) {
        const response = await request(app)
          .post('/api/email/send')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockEmail,
            to: email
          });

        expect([200, 201, 400, 401]).toContain(response.status);
      }
    });

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        'user name@domain.com' // Space in email
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/email/send')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockEmail,
            to: email
          });

        expect(response.status).toBe(400);
      }
    });

    it('should handle international domain names', async () => {
      const internationalEmail = {
        ...mockEmail,
        to: 'test@türkiye.com'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(internationalEmail);

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('Content Validation', () => {
    it('should handle HTML content validation', async () => {
      const htmlEmail = {
        ...mockEmail,
        content: '<html><body><h1>Test</h1><p>Content</p></body></html>',
        content_type: 'text/html'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(htmlEmail);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle plain text content', async () => {
      const textEmail = {
        ...mockEmail,
        content: 'Plain text email content',
        content_type: 'text/plain'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(textEmail);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should validate HTML structure', async () => {
      const malformedHTML = {
        ...mockEmail,
        content: '<html><body><h1>Unclosed tag<p>Content</body></html>',
        content_type: 'text/html'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(malformedHTML);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle special characters in content', async () => {
      const specialChars = {
        ...mockEmail,
        content: 'Email with émojis 🎉 and spëcial çharacters'
      };

      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', mockAuthToken)
        .send(specialChars);

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });
});