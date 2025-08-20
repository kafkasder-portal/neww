import { env } from '@/lib/env'

export interface SMSMessage {
  id: string
  to: string
  message: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sentAt?: string
  deliveredAt?: string
  errorMessage?: string
  provider: 'netgsm' | 'mock'
  credits?: number
}

export interface SMSTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  category: string
  isActive: boolean
}

export interface SMSConfig {
  provider: 'netgsm' | 'mock'
  apiKey: string
  username: string
  password: string
  sender: string
  testMode: boolean
}

export interface BulkSMSRequest {
  recipients: string[]
  message: string
  templateId?: string
  templateVariables?: Record<string, string>
  scheduleAt?: string
}

export interface SMSStats {
  totalSent: number
  totalDelivered: number
  totalFailed: number
  creditsUsed: number
  creditsRemaining: number
  successRate: number
}

/**
 * NetGSM SMS Gateway Service Implementation
 * Provides SMS sending capabilities using NetGSM API
 */
export class NetGSMService {
  private config: SMSConfig
  private baseUrl = 'https://api.netgsm.com.tr'

  constructor(config: SMSConfig) {
    this.config = config
  }

  /**
   * Send single SMS message
   */
  async sendSMS(to: string, message: string): Promise<SMSMessage> {
    const smsId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const smsMessage: SMSMessage = {
      id: smsId,
      to: this.formatPhoneNumber(to),
      message,
      status: 'pending',
      provider: this.config.provider,
      sentAt: new Date().toISOString()
    }

    if (this.config.testMode || this.config.provider === 'mock') {
      return this.mockSendSMS(smsMessage)
    }

    try {
      const response = await fetch(`${this.baseUrl}/sms/send/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          usercode: this.config.username,
          password: this.config.password,
          gsmno: smsMessage.to,
          message: message,
          msgheader: this.config.sender,
          filter: '0', // Türkçe karakter filtresi
          startdate: '', // Hemen gönder
          stopdate: ''
        })
      })

      const result = await response.text()
      
      if (result.startsWith('00')) {
        // Başarılı - NetGSM '00 MSGID' formatında döner
        smsMessage.status = 'sent'
        smsMessage.id = result.split(' ')[1] || smsMessage.id
      } else {
        // Hata kodları
        smsMessage.status = 'failed'
        smsMessage.errorMessage = this.getNetGSMErrorMessage(result)
      }

    } catch (error) {
      console.error('NetGSM API Error:', error)
      smsMessage.status = 'failed'
      smsMessage.errorMessage = 'Network error: ' + (error as Error).message
    }

    return smsMessage
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(request: BulkSMSRequest): Promise<SMSMessage[]> {
    const results: SMSMessage[] = []
    
    for (const recipient of request.recipients) {
      let finalMessage = request.message
      
      // Template variable replacement
      if (request.templateVariables) {
        Object.entries(request.templateVariables).forEach(([key, value]) => {
          finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), value)
        })
      }

      const result = await this.sendSMS(recipient, finalMessage)
      results.push(result)
      
      // Rate limiting - 1 saniye bekle
      if (request.recipients.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  /**
   * Check SMS delivery status
   */
  async checkDeliveryStatus(messageId: string): Promise<'delivered' | 'pending' | 'failed'> {
    if (this.config.testMode || this.config.provider === 'mock') {
      return 'delivered'
    }

    try {
      const response = await fetch(`${this.baseUrl}/sms/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          usercode: this.config.username,
          password: this.config.password,
          bulkid: messageId,
          type: '1' // Detaylı rapor
        })
      })

      const result = await response.text()
      
      if (result.includes('1')) {
        return 'delivered'
      } else if (result.includes('0')) {
        return 'pending'
      } else {
        return 'failed'
      }
      
    } catch (error) {
      console.error('Delivery status check error:', error)
      return 'failed'
    }
  }

  /**
   * Get account balance/credits
   */
  async getBalance(): Promise<number> {
    if (this.config.testMode || this.config.provider === 'mock') {
      return 1000 // Mock balance
    }

    try {
      const response = await fetch(`${this.baseUrl}/balance/list/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          usercode: this.config.username,
          password: this.config.password
        })
      })

      const result = await response.text()
      return parseFloat(result) || 0
      
    } catch (error) {
      console.error('Balance check error:', error)
      return 0
    }
  }

  /**
   * Format phone number for NetGSM (Turkish format)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '')
    
    // Handle Turkish phone number formats
    if (cleaned.startsWith('0')) {
      cleaned = '90' + cleaned.slice(1) // 0532xxx -> 90532xxx
    } else if (cleaned.startsWith('90')) {
      // Already in international format
    } else if (cleaned.length === 10) {
      cleaned = '90' + cleaned // 532xxx -> 90532xxx
    }
    
    return cleaned
  }

  /**
   * Mock SMS sending for development/testing
   */
  private async mockSendSMS(smsMessage: SMSMessage): Promise<SMSMessage> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate success/failure (95% success rate)
    if (Math.random() > 0.05) {
      smsMessage.status = 'sent'
      setTimeout(() => {
        smsMessage.status = 'delivered'
        smsMessage.deliveredAt = new Date().toISOString()
      }, 2000)
    } else {
      smsMessage.status = 'failed'
      smsMessage.errorMessage = 'Mock failure for testing'
    }

    return smsMessage
  }

  /**
   * Get NetGSM error message from error code
   */
  private getNetGSMErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      '01': 'Mesaj gövdesi boş',
      '02': 'Kullanıcı adı ya da şifre hatalı',
      '03': 'Kullanıcı adı ya da şifre boş',
      '04': 'Müşteri aktif değil',
      '05': 'Müşteri SMS göndermeye yetkili değil',
      '06': 'Kredi yetersiz',
      '07': 'Gönderici adı sistemde bulunamadı',
      '08': 'Mesaj tipi tanımlanamadı',
      '09': 'Mesaj uzunluğu maximum karakter sayısını aşıyor',
      '10': 'Geçersiz telefon numarası',
      '11': 'Tekrarlayan mesaj',
      '12': 'Mesaj metni kara listede',
      '13': 'Mesaj gönderim tarihsaat formatı hatalı',
      '14': 'Optout olan numara'
    }

    return errorMessages[errorCode] || `Bilinmeyen hata: ${errorCode}`
  }
}

/**
 * Main SMS Service - Factory pattern for different providers
 */
export class SMSService {
  private provider: NetGSMService
  private templates: SMSTemplate[] = []

  constructor(config?: Partial<SMSConfig>) {
    const defaultConfig: SMSConfig = {
      provider: (env.APP_ENVIRONMENT === 'production' ? 'netgsm' : 'mock') as 'netgsm' | 'mock',
      apiKey: env.SMS_API_KEY || '',
      username: process.env.NETGSM_USERNAME || '',
      password: process.env.NETGSM_PASSWORD || '',
      sender: process.env.NETGSM_SENDER || 'KAFKASDER',
      testMode: env.APP_ENVIRONMENT !== 'production'
    }

    const finalConfig = { ...defaultConfig, ...config }
    this.provider = new NetGSMService(finalConfig)
    this.loadTemplates()
  }

  /**
   * Send single SMS
   */
  async sendSMS(to: string, message: string): Promise<SMSMessage> {
    return await this.provider.sendSMS(to, message)
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(request: BulkSMSRequest): Promise<SMSMessage[]> {
    return await this.provider.sendBulkSMS(request)
  }

  /**
   * Send SMS using template
   */
  async sendTemplatedSMS(
    to: string, 
    templateId: string, 
    variables: Record<string, string> = {}
  ): Promise<SMSMessage> {
    const template = this.templates.find(t => t.id === templateId)
    if (!template) {
      throw new Error(`SMS template not found: ${templateId}`)
    }

    let message = template.content
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })

    return await this.sendSMS(to, message)
  }

  /**
   * Get delivery status
   */
  async getDeliveryStatus(messageId: string) {
    return await this.provider.checkDeliveryStatus(messageId)
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<number> {
    return await this.provider.getBalance()
  }

  /**
   * Get SMS templates
   */
  getTemplates(): SMSTemplate[] {
    return this.templates
  }

  /**
   * Add SMS template
   */
  addTemplate(template: Omit<SMSTemplate, 'id'>): SMSTemplate {
    const newTemplate: SMSTemplate = {
      ...template,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  /**
   * Load default SMS templates
   */
  private loadTemplates() {
    this.templates = [
      {
        id: 'welcome',
        name: 'Hoş Geldin Mesajı',
        content: 'Merhaba {{name}}! KAFKASDER ailesine hoş geldiniz. Yardımlarınız için teşekkür ederiz.',
        variables: ['name'],
        category: 'welcome',
        isActive: true
      },
      {
        id: 'donation_thanks',
        name: 'Bağış Teşekkürü',
        content: 'Sayın {{name}}, {{amount}} TL bağışınız için teşekkür ederiz. Bağış no: {{donation_id}}',
        variables: ['name', 'amount', 'donation_id'],
        category: 'donation',
        isActive: true
      },
      {
        id: 'meeting_reminder',
        name: 'Toplantı Hatırlatması',
        content: 'Sayın {{name}}, {{date}} tarihinde {{time}} saatinde {{location}} konumunda toplantımız var.',
        variables: ['name', 'date', 'time', 'location'],
        category: 'meeting',
        isActive: true
      },
      {
        id: 'payment_notification',
        name: 'Ödeme Bildirimi',
        content: 'Sayın {{name}}, {{amount}} TL yardım ödemeniz hesabınıza geçmiştir. Ref: {{ref_no}}',
        variables: ['name', 'amount', 'ref_no'],
        category: 'payment',
        isActive: true
      },
      {
        id: 'application_status',
        name: 'Başvuru Durumu',
        content: 'Sayın {{name}}, {{application_type}} başvurunuz {{status}} durumuna geçmiştir.',
        variables: ['name', 'application_type', 'status'],
        category: 'application',
        isActive: true
      }
    ]
  }
}

// Singleton instance
let smsServiceInstance: SMSService | null = null

export const getSMSService = (config?: Partial<SMSConfig>): SMSService => {
  if (!smsServiceInstance) {
    smsServiceInstance = new SMSService(config)
  }
  return smsServiceInstance
}

// Export default instance
export const smsService = getSMSService()
