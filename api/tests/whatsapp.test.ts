import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';

describe('WhatsApp Routes', () => {
  const mockWhatsAppMessage = {
    to: '+905551234567',
    message: 'Test WhatsApp message',
    type: 'text',
    priority: 'normal'
  };

  const mockMediaMessage = {
    to: '+905551234567',
    message: 'Check out this image!',
    type: 'media',
    media_url: 'https://example.com/image.jpg',
    media_type: 'image',
    priority: 'normal'
  };

  const mockTemplateMessage = {
    to: '+905551234567',
    template_name: 'welcome_message',
    template_params: {
      name: 'John Doe',
      organization: 'Test Org'
    },
    priority: 'high'
  };

  const mockBulkMessage = {
    recipients: ['+905551234567', '+905559876543'],
    message: 'Bulk WhatsApp message',
    type: 'text',
    priority: 'normal'
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

  describe('POST /api/whatsapp/send', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .send(mockWhatsAppMessage);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing phone number', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          message: 'Test message'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid phone number format', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockWhatsAppMessage,
          to: 'invalid-phone'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing message content', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          to: '+905551234567'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty message content', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockWhatsAppMessage,
          message: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for message too long', async () => {
      const longMessage = 'a'.repeat(4097); // WhatsApp limit is usually 4096 chars
      
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockWhatsAppMessage,
          message: longMessage
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid message type', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockWhatsAppMessage,
          type: 'invalid-type'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should send text message successfully', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send(mockWhatsAppMessage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'sent');
      expect(response.body).toHaveProperty('to', mockWhatsAppMessage.to);
      expect(response.body).toHaveProperty('message_id');
    });

    it('should send media message successfully', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send(mockMediaMessage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'sent');
      expect(response.body).toHaveProperty('type', 'media');
      expect(response.body).toHaveProperty('media_url');
    });

    it('should return 400 for media message without media_url', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockMediaMessage,
          media_url: undefined
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid media URL', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockMediaMessage,
          media_url: 'invalid-url'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/whatsapp/send-template', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send-template')
        .send(mockTemplateMessage);

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing template name', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          to: '+905551234567',
          template_params: {}
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for non-existent template', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send-template')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTemplateMessage,
          template_name: 'non_existent_template'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should send template message successfully', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send-template')
        .set('Authorization', mockAuthToken)
        .send(mockTemplateMessage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'sent');
      expect(response.body).toHaveProperty('template_name', mockTemplateMessage.template_name);
    });
  });

  describe('POST /api/whatsapp/bulk-send', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/whatsapp/bulk-send')
        .send(mockBulkMessage);

      expect(response.status).toBe(401);
    });

    it('should return 400 for empty recipients array', async () => {
      const response = await request(app)
        .post('/api/whatsapp/bulk-send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkMessage,
          recipients: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for too many recipients', async () => {
      const manyRecipients = Array.from({ length: 1001 }, (_, i) => `+90555123${i.toString().padStart(4, '0')}`);
      
      const response = await request(app)
        .post('/api/whatsapp/bulk-send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkMessage,
          recipients: manyRecipients
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid phone numbers in recipients', async () => {
      const response = await request(app)
        .post('/api/whatsapp/bulk-send')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBulkMessage,
          recipients: ['+905551234567', 'invalid-phone']
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should send bulk messages successfully', async () => {
      const response = await request(app)
        .post('/api/whatsapp/bulk-send')
        .set('Authorization', mockAuthToken)
        .send(mockBulkMessage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('batch_id');
      expect(response.body).toHaveProperty('total_recipients', mockBulkMessage.recipients.length);
      expect(response.body).toHaveProperty('status', 'processing');
    });
  });

  describe('GET /api/whatsapp/messages', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages');

      expect(response.status).toBe(401);
    });

    it('should return messages list with pagination', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages')
        .set('Authorization', mockAuthToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter messages by phone number', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages')
        .set('Authorization', mockAuthToken)
        .query({ phone: '+905551234567' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should filter messages by status', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages')
        .set('Authorization', mockAuthToken)
        .query({ status: 'delivered' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should filter messages by date range', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages')
        .set('Authorization', mockAuthToken)
        .query({
          start_date: '2024-01-01',
          end_date: '2024-01-31'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('GET /api/whatsapp/messages/:id', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages/123');

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid message ID format', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent message', async () => {
      const response = await request(app)
        .get('/api/whatsapp/messages/00000000-0000-0000-0000-000000000000')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(404);
    });

    it('should return message details successfully', async () => {
      // First send a message
      const sendResponse = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', mockAuthToken)
        .send(mockWhatsAppMessage);

      const messageId = sendResponse.body.id;

      const response = await request(app)
        .get(`/api/whatsapp/messages/${messageId}`)
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', messageId);
      expect(response.body).toHaveProperty('to');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('delivery_status');
    });
  });

  describe('GET /api/whatsapp/templates', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/whatsapp/templates');

      expect(response.status).toBe(401);
    });

    it('should return available templates', async () => {
      const response = await request(app)
        .get('/api/whatsapp/templates')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('content');
        expect(response.body[0]).toHaveProperty('variables');
        expect(response.body[0]).toHaveProperty('is_active');
      }
    });

    it('should filter templates by status', async () => {
      const response = await request(app)
        .get('/api/whatsapp/templates')
        .set('Authorization', mockAuthToken)
        .query({ is_active: true });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/whatsapp/stats', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/whatsapp/stats');

      expect(response.status).toBe(401);
    });

    it('should return WhatsApp statistics', async () => {
      const response = await request(app)
        .get('/api/whatsapp/stats')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total_sent');
      expect(response.body).toHaveProperty('total_delivered');
      expect(response.body).toHaveProperty('total_read');
      expect(response.body).toHaveProperty('total_failed');
      expect(response.body).toHaveProperty('delivery_rate');
      expect(response.body).toHaveProperty('read_rate');
    });

    it('should return statistics for specific date range', async () => {
      const response = await request(app)
        .get('/api/whatsapp/stats')
        .set('Authorization', mockAuthToken)
        .query({
          start_date: '2024-01-01',
          end_date: '2024-01-31'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total_sent');
      expect(response.body).toHaveProperty('period');
    });
  });

  describe('POST /api/whatsapp/webhook', () => {
    it('should handle webhook verification', async () => {
      const response = await request(app)
        .get('/api/whatsapp/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'test-challenge',
          'hub.verify_token': 'test-verify-token'
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('test-challenge');
    });

    it('should return 403 for invalid verify token', async () => {
      const response = await request(app)
        .get('/api/whatsapp/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'test-challenge',
          'hub.verify_token': 'invalid-token'
        });

      expect(response.status).toBe(403);
    });

    it('should handle delivery status updates', async () => {
      const webhookData = {
        entry: [{
          changes: [{
            value: {
              statuses: [{
                id: 'message-id-123',
                status: 'delivered',
                timestamp: '1234567890',
                recipient_id: '+905551234567'
              }]
            }
          }]
        }]
      };

      const response = await request(app)
        .post('/api/whatsapp/webhook')
        .send(webhookData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should handle incoming messages', async () => {
      const webhookData = {
        entry: [{
          changes: [{
            value: {
              messages: [{
                id: 'incoming-message-123',
                from: '+905551234567',
                text: { body: 'Hello from user' },
                timestamp: '1234567890',
                type: 'text'
              }]
            }
          }]
        }]
      };

      const response = await request(app)
        .post('/api/whatsapp/webhook')
        .send(webhookData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});