import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../../api/app'

// Mock Supabase
vi.mock('../../api/config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(() => ({ data: null, error: null })),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis()
    })),
    auth: {
      getUser: vi.fn(() => ({ 
        data: { 
          user: { 
            id: 'test-user-id', 
            email: 'test@example.com' 
          } 
        }, 
        error: null 
      }))
    },
    rpc: vi.fn(() => ({ data: {}, error: null }))
  }
}))

// Mock authentication middleware
vi.mock('../../api/middleware/auth', () => ({
  authenticateUser: (req: any, res: any, next: any) => {
    req.user = { 
      id: 'test-user-id', 
      email: 'test@example.com',
      role: 'admin' 
    }
    next()
  }
}))

// Mock RBAC middleware
vi.mock('../../api/middleware/rbac', () => ({
  requirePermission: () => (req: any, res: any, next: any) => next()
}))

// Mock fetch for external API calls
global.fetch = vi.fn()

describe('Communications API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('SMS API', () => {
    it('should send single SMS successfully', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: '905551234567',
          message: 'Test SMS message'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.messageId).toBeDefined()
    })

    it('should validate phone number format', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: 'invalid-phone',
          message: 'Test SMS message'
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })

    it('should send bulk SMS', async () => {
      const response = await request(app)
        .post('/api/sms/bulk')
        .set('Authorization', 'Bearer test-token')
        .send({
          recipients: ['905551234567', '905557654321'],
          message: 'Bulk SMS test'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.total).toBe(2)
    })

    it('should get SMS balance', async () => {
      const response = await request(app)
        .get('/api/sms/balance')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.balance).toBeDefined()
      expect(response.body.currency).toBe('TRY')
    })

    it('should get SMS logs', async () => {
      const response = await request(app)
        .get('/api/sms/logs')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
    })

    it('should get SMS templates', async () => {
      const response = await request(app)
        .get('/api/sms/templates')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
    })

    it('should create SMS template', async () => {
      const response = await request(app)
        .post('/api/sms/templates')
        .set('Authorization', 'Bearer test-token')
        .send({
          name: 'Test Template',
          content: 'Hello {{name}}!',
          variables: ['name'],
          category: 'test'
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.template).toBeDefined()
    })
  })

  describe('Email API', () => {
    it('should send single email successfully', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: 'test@example.com',
          subject: 'Test Email',
          content: 'Test email content'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.messageId).toBeDefined()
    })

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: 'invalid-email',
          subject: 'Test',
          content: 'Test'
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })

    it('should send bulk emails', async () => {
      const response = await request(app)
        .post('/api/email/bulk')
        .set('Authorization', 'Bearer test-token')
        .send({
          recipients: ['test1@example.com', 'test2@example.com'],
          subject: 'Bulk Test',
          content: 'Bulk email content'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.total).toBe(2)
    })

    it('should test SMTP connection', async () => {
      const response = await request(app)
        .get('/api/email/test-connection')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
    })

    it('should get email templates', async () => {
      const response = await request(app)
        .get('/api/email/templates')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.data).toBeDefined()
    })

    it('should handle HTML email content', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: 'test@example.com',
          subject: 'HTML Test',
          content: 'Plain text content',
          htmlContent: '<h1>HTML Content</h1>'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe('WhatsApp API', () => {
    it('should send WhatsApp message successfully', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: '905551234567',
          message: 'Test WhatsApp message'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.messageId).toBeDefined()
    })

    it('should send WhatsApp message with media', async () => {
      const response = await request(app)
        .post('/api/whatsapp/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: '905551234567',
          message: 'Test with image',
          mediaUrl: 'https://example.com/image.jpg',
          mediaType: 'image'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should get WhatsApp status', async () => {
      const response = await request(app)
        .get('/api/whatsapp/status')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.connected).toBeDefined()
    })

    it('should handle webhook verification', async () => {
      const response = await request(app)
        .post('/api/whatsapp/webhook')
        .query({
          'hub.verify_token': 'test-verify-token',
          'hub.challenge': 'test-challenge'
        })

      expect(response.status).toBe(200)
    })

    it('should process webhook status updates', async () => {
      const webhookData = {
        entry: [{
          changes: [{
            value: {
              statuses: [{
                id: 'test-message-id',
                status: 'delivered',
                timestamp: Date.now()
              }]
            }
          }]
        }]
      }

      const response = await request(app)
        .post('/api/whatsapp/webhook')
        .send(webhookData)

      expect(response.status).toBe(200)
    })

    it('should get communication statistics', async () => {
      const response = await request(app)
        .get('/api/whatsapp/communication-stats')
        .set('Authorization', 'Bearer test-token')

      expect(response.status).toBe(200)
      expect(response.body.stats).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle unauthorized requests', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .send({
          to: '905551234567',
          message: 'Test'
        })

      expect(response.status).toBe(401)
    })

    it('should handle invalid request data', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: 'test@example.com'
          // Missing required subject and content
        })

      expect(response.status).toBe(400)
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      (global.fetch as any).mockRejectedValue(new Error('Network error'))
      
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: '905551234567',
          message: 'Test message'
        })

      // Should still return a response, but with failure status
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('Rate Limiting & Security', () => {
    it('should respect bulk message limits', async () => {
      const tooManyRecipients = Array.from({ length: 1001 }, (_, i) => `90555123${String(i).padStart(4, '0')}`)
      
      const response = await request(app)
        .post('/api/sms/bulk')
        .set('Authorization', 'Bearer test-token')
        .send({
          recipients: tooManyRecipients,
          message: 'Test'
        })

      expect(response.status).toBe(400)
    })

    it('should validate message content length', async () => {
      const longMessage = 'a'.repeat(1601) // Exceeds SMS limit
      
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', 'Bearer test-token')
        .send({
          to: '905551234567',
          message: longMessage
        })

      expect(response.status).toBe(400)
    })
  })
})
