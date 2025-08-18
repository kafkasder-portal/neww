import { env } from '@/lib/env'

export interface EmailMessage {
  id: string
  to: string
  cc?: string[]
  bcc?: string[]
  subject: string
  content: string
  htmlContent?: string
  attachments?: EmailAttachment[]
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  errorMessage?: string
  provider: 'smtp' | 'mock'
}

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType: string
  size: number
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  htmlContent?: string
  variables: string[]
  category: string
  isActive: boolean
}

export interface EmailConfig {
  provider: 'smtp' | 'mock'
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  fromName: string
  fromEmail: string
  testMode: boolean
}

export interface BulkEmailRequest {
  recipients: string[]
  subject: string
  content: string
  htmlContent?: string
  templateId?: string
  templateVariables?: Record<string, string>
  attachments?: EmailAttachment[]
  scheduleAt?: string
}

export interface EmailStats {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  totalBounced: number
  totalFailed: number
  openRate: number
  clickRate: number
  bounceRate: number
}

/**
 * SMTP Email Service Implementation
 * Provides email sending capabilities using SMTP
 */
export class SMTPService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  /**
   * Send single email
   */
  async sendEmail(
    to: string, 
    subject: string, 
    content: string, 
    htmlContent?: string,
    attachments?: EmailAttachment[]
  ): Promise<EmailMessage> {
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const emailMessage: EmailMessage = {
      id: emailId,
      to,
      subject,
      content,
      htmlContent,
      attachments,
      status: 'pending',
      provider: this.config.provider,
      sentAt: new Date().toISOString()
    }

    if (this.config.testMode || this.config.provider === 'mock') {
      return this.mockSendEmail(emailMessage)
    }

    try {
      // SMTP implementation would go here
      // For now, using mock since we need actual SMTP credentials
      const nodemailer = await import('nodemailer')
      
      const transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.username,
          pass: this.config.password
        }
      })

      const mailOptions = {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: emailMessage.to,
        subject: emailMessage.subject,
        text: emailMessage.content,
        html: emailMessage.htmlContent || emailMessage.content,
        attachments: emailMessage.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType
        }))
      }

      await transporter.sendMail(mailOptions)
      emailMessage.status = 'sent'

    } catch (error) {
      console.error('SMTP Error:', error)
      emailMessage.status = 'failed'
      emailMessage.errorMessage = (error as Error).message
    }

    return emailMessage
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(request: BulkEmailRequest): Promise<EmailMessage[]> {
    const results: EmailMessage[] = []
    
    for (const recipient of request.recipients) {
      let finalSubject = request.subject
      let finalContent = request.content
      let finalHtmlContent = request.htmlContent
      
      // Template variable replacement
      if (request.templateVariables) {
        Object.entries(request.templateVariables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g')
          finalSubject = finalSubject.replace(regex, value)
          finalContent = finalContent.replace(regex, value)
          if (finalHtmlContent) {
            finalHtmlContent = finalHtmlContent.replace(regex, value)
          }
        })
      }

      const result = await this.sendEmail(
        recipient, 
        finalSubject, 
        finalContent, 
        finalHtmlContent,
        request.attachments
      )
      results.push(result)
      
      // Rate limiting - 2 saniye bekle (SMTP için daha konservatif)
      if (request.recipients.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    return results
  }

  /**
   * Mock email sending for development/testing
   */
  private async mockSendEmail(emailMessage: EmailMessage): Promise<EmailMessage> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulate success/failure (98% success rate for email)
    if (Math.random() > 0.02) {
      emailMessage.status = 'sent'
      
      // Simulate delivery after 3 seconds
      setTimeout(() => {
        emailMessage.status = 'delivered'
        emailMessage.deliveredAt = new Date().toISOString()
      }, 3000)
      
      // Simulate opening after 10 seconds (30% open rate)
      if (Math.random() < 0.3) {
        setTimeout(() => {
          emailMessage.openedAt = new Date().toISOString()
        }, 10000)
      }
    } else {
      emailMessage.status = 'failed'
      emailMessage.errorMessage = 'Mock failure for testing'
    }

    return emailMessage
  }
}

/**
 * Main Email Service - Factory pattern for different providers
 */
export class EmailService {
  private provider: SMTPService
  private templates: EmailTemplate[] = []

  constructor(config?: Partial<EmailConfig>) {
    const defaultConfig: EmailConfig = {
      provider: (env.APP_ENVIRONMENT === 'production' ? 'smtp' : 'mock') as 'smtp' | 'mock',
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true, // Default to true for Hostinger SSL
      username: process.env.SMTP_USERNAME || '',
      password: process.env.SMTP_PASSWORD || '',
      fromName: process.env.SMTP_FROM_NAME || 'KAFKASDER',
      fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@kafkasder.org',
      testMode: env.APP_ENVIRONMENT !== 'production'
    }

    const finalConfig = { ...defaultConfig, ...config }
    this.provider = new SMTPService(finalConfig)
    this.loadTemplates()
  }

  /**
   * Send single email
   */
  async sendEmail(
    to: string, 
    subject: string, 
    content: string, 
    htmlContent?: string,
    attachments?: EmailAttachment[]
  ): Promise<EmailMessage> {
    return await this.provider.sendEmail(to, subject, content, htmlContent, attachments)
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(request: BulkEmailRequest): Promise<EmailMessage[]> {
    return await this.provider.sendBulkEmail(request)
  }

  /**
   * Send email using template
   */
  async sendTemplatedEmail(
    to: string,
    templateId: string,
    variables: Record<string, string> = {},
    attachments?: EmailAttachment[]
  ): Promise<EmailMessage> {
    const template = this.templates.find(t => t.id === templateId)
    if (!template) {
      throw new Error(`Email template not found: ${templateId}`)
    }

    let subject = template.subject
    let content = template.content
    let htmlContent = template.htmlContent

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      content = content.replace(regex, value)
      if (htmlContent) {
        htmlContent = htmlContent.replace(regex, value)
      }
    })

    return await this.sendEmail(to, subject, content, htmlContent, attachments)
  }

  /**
   * Get email templates
   */
  getTemplates(): EmailTemplate[] {
    return this.templates
  }

  /**
   * Add email template
   */
  addTemplate(template: Omit<EmailTemplate, 'id'>): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  /**
   * Load default email templates
   */
  private loadTemplates() {
    this.templates = [
      {
        id: 'welcome_email',
        name: 'Hoş Geldin E-postası',
        subject: 'KAFKASDER Ailesine Hoş Geldiniz',
        content: `Merhaba {{name}},

KAFKASDER ailesine hoş geldiniz! Kaydınız başarıyla tamamlanmıştır.

Hesap bilgileriniz:
- E-posta: {{email}}
- Kayıt tarihi: {{date}}

Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.

Saygılarımızla,
KAFKASDER Ekibi`,
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hoş Geldiniz</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Merhaba {{name}}!</h2>
        <p>KAFKASDER ailesine hoş geldiniz! Kaydınız başarıyla tamamlanmıştır.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Hesap Bilgileriniz:</h3>
            <ul>
                <li><strong>E-posta:</strong> {{email}}</li>
                <li><strong>Kayıt tarihi:</strong> {{date}}</li>
            </ul>
        </div>
        
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        
        <p style="margin-top: 30px;">
            Saygılarımızla,<br>
            <strong>KAFKASDER Ekibi</strong>
        </p>
    </div>
</body>
</html>`,
        variables: ['name', 'email', 'date'],
        category: 'welcome',
        isActive: true
      },
      {
        id: 'donation_receipt',
        name: 'Bağış Makbuzu',
        subject: 'Bağış Makbuzunuz - {{donation_id}}',
        content: `Sayın {{donor_name}},

{{amount}} TL tutarındaki bağışınız için teşekkür ederiz.

Bağış Detayları:
- Bağış No: {{donation_id}}
- Tutar: {{amount}} TL
- Tarih: {{date}}
- Ödeme Yöntemi: {{payment_method}}

Bu makbuz vergi indirimi için kullanılabilir.

KAFKASDER`,
        variables: ['donor_name', 'amount', 'donation_id', 'date', 'payment_method'],
        category: 'donation',
        isActive: true
      },
      {
        id: 'meeting_invitation',
        name: 'Toplantı Daveti',
        subject: 'Toplantı Daveti - {{meeting_title}}',
        content: `Sayın {{name}},

{{meeting_title}} konulu toplantımıza davetlisiniz.

Toplantı Detayları:
- Tarih: {{date}}
- Saat: {{time}}
- Konum: {{location}}
- Süre: {{duration}}

Katılım durumunuzu bildirmenizi rica ederiz.

Saygılarımızla,
KAFKASDER`,
        variables: ['name', 'meeting_title', 'date', 'time', 'location', 'duration'],
        category: 'meeting',
        isActive: true
      }
    ]
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null

export const getEmailService = (config?: Partial<EmailConfig>): EmailService => {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService(config)
  }
  return emailServiceInstance
}

// Export default instance
export const emailService = getEmailService()
