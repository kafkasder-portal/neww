import { describe, it, expect, vi, beforeEach } from 'vitest'
import { smsService, emailService } from '../smsService'
import { SMSService } from '../smsService'
import { EmailService } from '../emailService'

// Mock fetch globally
global.fetch = vi.fn()

describe('SMS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('NetGSM Integration', () => {
    it('should send SMS successfully in test mode', async () => {
      const smsService = new SMSService({ testMode: true, provider: 'mock' })
      
      const result = await smsService.sendSMS('905551234567', 'Test message')
      
      expect(result.status).toBe('sent')
      expect(result.to).toBe('905551234567')
      expect(result.message).toBe('Test message')
      expect(result.provider).toBe('mock')
    })

    it('should format Turkish phone numbers correctly', async () => {
      const smsService = new SMSService({ testMode: true, provider: 'mock' })
      
      const result1 = await smsService.sendSMS('5551234567', 'Test')
      expect(result1.to).toBe('905551234567')
      
      const result2 = await smsService.sendSMS('05551234567', 'Test')
      expect(result2.to).toBe('905551234567')
      
      const result3 = await smsService.sendSMS('+905551234567', 'Test')
      expect(result3.to).toBe('905551234567')
    })

    it('should handle bulk SMS sending', async () => {
      const smsService = new SMSService({ testMode: true, provider: 'mock' })
      
      const recipients = ['905551234567', '905557654321']
      const result = await smsService.sendBulkSMS({
        recipients,
        message: 'Bulk test message'
      })
      
      expect(result).toHaveLength(2)
      expect(['sent', 'delivered']).toContain(result[0].status)
      expect(['sent', 'delivered']).toContain(result[1].status)
    })

    it('should replace template variables correctly', async () => {
      const smsService = new SMSService({ testMode: true, provider: 'mock' })
      
      const result = await smsService.sendTemplatedSMS(
        '905551234567',
        'welcome',
        { name: 'Test User' }
      )
      
      expect(result.message).toContain('Test User')
      expect(['sent', 'failed']).toContain(result.status)
    })

    it('should handle NetGSM error responses', async () => {
      // Mock NetGSM error response
      (global.fetch as any).mockResolvedValue({
        text: () => Promise.resolve('02') // Invalid credentials
      })
      
      const smsService = new SMSService({ 
        testMode: false, 
        provider: 'netgsm',
        username: 'test',
        password: 'test'
      })
      
      const result = await smsService.sendSMS('905551234567', 'Test message')
      
      expect(result.status).toBe('failed')
      expect(result.errorMessage).toContain('Kullanıcı adı ya da şifre hatalı')
    })
  })

  describe('Template Management', () => {
    it('should load default templates', () => {
      const smsService = new SMSService({ testMode: true })
      const templates = smsService.getTemplates()
      
      expect(templates).toHaveLength(5)
      expect(templates.find(t => t.id === 'welcome')).toBeDefined()
      expect(templates.find(t => t.id === 'donation_thanks')).toBeDefined()
    })

    it('should add new templates', () => {
      const smsService = new SMSService({ testMode: true })
      
      const newTemplate = smsService.addTemplate({
        name: 'Test Template',
        content: 'Hello {{name}}!',
        variables: ['name'],
        category: 'test',
        isActive: true
      })
      
      expect(newTemplate.id).toBeDefined()
      expect(newTemplate.name).toBe('Test Template')
      expect(newTemplate.variables).toContain('name')
    })
  })
})

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SMTP Integration', () => {
    it('should send email successfully in test mode', async () => {
      const emailService = new EmailService({ testMode: true, provider: 'mock' })
      
      const result = await emailService.sendEmail(
        'test@example.com',
        'Test Subject',
        'Test content'
      )
      
      expect(result.status).toBe('sent')
      expect(result.to).toBe('test@example.com')
      expect(result.subject).toBe('Test Subject')
      expect(result.content).toBe('Test content')
    })

    it('should handle bulk email sending', async () => {
      const emailService = new EmailService({ testMode: true, provider: 'mock' })
      
      const recipients = ['test1@example.com', 'test2@example.com']
      const result = await emailService.sendBulkEmail({
        recipients,
        subject: 'Bulk Test',
        content: 'Bulk test content'
      })
      
      expect(result).toHaveLength(2)
      expect(['sent', 'delivered']).toContain(result[0].status)
      expect(['sent', 'delivered']).toContain(result[1].status)
    }, 10000)

    it('should replace template variables in emails', async () => {
      const emailService = new EmailService({ testMode: true, provider: 'mock' })
      
      const result = await emailService.sendTemplatedEmail(
        'test@example.com',
        'welcome_email',
        { 
          name: 'Test User', 
          email: 'test@example.com',
          date: '2024-01-01'
        }
      )
      
      expect(result.subject).toContain('Hoş Geldiniz')
      expect(result.content).toContain('Test User')
      expect(result.htmlContent).toContain('Test User')
    })

    it('should handle email attachments', async () => {
      const emailService = new EmailService({ testMode: true, provider: 'mock' })
      
      const result = await emailService.sendEmail(
        'test@example.com',
        'Test with attachment',
        'Email with attachment',
        undefined,
        [{
          filename: 'test.pdf',
          content: 'base64content',
          contentType: 'application/pdf',
          size: 1024
        }]
      )
      
      expect(result.attachments).toHaveLength(1)
      expect(result.attachments?.[0].filename).toBe('test.pdf')
    })
  })

  describe('Template Management', () => {
    it('should load default email templates', () => {
      const emailService = new EmailService({ testMode: true })
      const templates = emailService.getTemplates()
      
      expect(templates).toHaveLength(3)
      expect(templates.find(t => t.id === 'welcome_email')).toBeDefined()
      expect(templates.find(t => t.id === 'donation_receipt')).toBeDefined()
    })

    it('should handle HTML templates correctly', () => {
      const emailService = new EmailService({ testMode: true })
      const templates = emailService.getTemplates()
      
      const welcomeTemplate = templates.find(t => t.id === 'welcome_email')
      expect(welcomeTemplate?.htmlContent).toContain('<html>')
      expect(welcomeTemplate?.htmlContent).toContain('{{name}}')
    })
  })
})

describe('Integration Tests', () => {
  it('should coordinate SMS and Email services', async () => {
    const smsService = new SMSService({ testMode: true })
    const emailService = new EmailService({ testMode: true })
    
    // Send welcome message via both channels
    const smsResult = await smsService.sendTemplatedSMS(
      '905551234567',
      'welcome',
      { name: 'Test User' }
    )
    
    const emailResult = await emailService.sendTemplatedEmail(
      'test@example.com',
      'welcome_email',
      { 
        name: 'Test User',
        email: 'test@example.com',
        date: new Date().toLocaleDateString('tr-TR')
      }
    )
    
    expect(smsResult.status).toBe('sent')
    expect(emailResult.status).toBe('sent')
    expect(smsResult.message).toContain('Test User')
    expect(emailResult.content).toContain('Test User')
  })

  it('should handle service failures gracefully', async () => {
    // Mock network failure
    (global.fetch as any).mockRejectedValue(new Error('Network error'))
    
    const smsService = new SMSService({ 
      testMode: false, 
      provider: 'netgsm',
      username: 'test',
      password: 'test'
    })
    
    const result = await smsService.sendSMS('905551234567', 'Test message')
    
    expect(result.status).toBe('failed')
    expect(result.errorMessage).toContain('Network error')
  })
})
