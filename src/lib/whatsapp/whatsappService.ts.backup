// Node.js ortamını simüle et
if (typeof global === 'undefined') {
  (window as any).global = window
}

import { Client, LocalAuth, Message, MessageMedia } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import cron from 'node-cron'

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  body: string
  timestamp: Date
  type: 'text' | 'media' | 'document'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  mediaUrl?: string
}

export interface MessageTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  category: 'notification' | 'reminder' | 'marketing' | 'support'
  isActive: boolean
}

export interface ScheduledMessage {
  id: string
  to: string
  templateId: string
  variables: Record<string, string>
  scheduledAt: Date
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
}

export class WhatsAppService {
  private client: Client
  private isReady: boolean = false
  private messageTemplates: MessageTemplate[] = []
  private scheduledMessages: ScheduledMessage[] = []
  private messageHistory: WhatsAppMessage[] = []

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })

    this.setupEventHandlers()
    this.loadTemplates()
    this.setupScheduler()
  }

  private setupEventHandlers() {
    // QR kod oluşturma
    this.client.on('qr', (qr) => {
      console.log('QR Code alındı, tarayın:')
      qrcode.generate(qr, { small: true })
    })

    // Hazır olduğunda
    this.client.on('ready', () => {
      console.log('WhatsApp client hazır!')
      this.isReady = true
    })

    // Mesaj alma
    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message)
    })

    // Bağlantı durumu
    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp bağlantısı kesildi:', reason)
      this.isReady = false
    })

    this.client.on('auth_failure', (msg) => {
      console.log('WhatsApp kimlik doğrulama hatası:', msg)
    })
  }

  private async handleIncomingMessage(message: Message) {
    const whatsappMessage: WhatsAppMessage = {
      id: message.id._serialized,
      from: message.from,
      to: message.to,
      body: message.body,
      timestamp: new Date(message.timestamp * 1000),
      type: message.hasMedia ? 'media' : 'text',
      status: 'delivered',
      mediaUrl: message.hasMedia ? await this.downloadMedia(message) : undefined
    }

    this.messageHistory.push(whatsappMessage)

    // Otomatik yanıt sistemi
    await this.handleAutoReply(message)
  }

  private async downloadMedia(message: Message): Promise<string | undefined> {
    try {
      const media = await message.downloadMedia()
      // Burada medya dosyasını kaydetme işlemi yapılabilir
      return media.data
    } catch (error) {
      console.error('Medya indirme hatası:', error)
      return undefined
    }
  }

  private async handleAutoReply(message: Message) {
    const lowerBody = message.body.toLowerCase()

    // Basit otomatik yanıt sistemi
    if (lowerBody.includes('merhaba') || lowerBody.includes('selam')) {
      await this.sendMessage(message.from, 'Merhaba! Size nasıl yardımcı olabilirim?')
    } else if (lowerBody.includes('yardım') || lowerBody.includes('destek')) {
      await this.sendMessage(message.from, 'Destek için lütfen bizimle iletişime geçin.')
    } else if (lowerBody.includes('bağış') || lowerBody.includes('yardım')) {
      await this.sendMessage(message.from, 'Bağış yapmak için web sitemizi ziyaret edebilirsiniz.')
    }
  }

  // Mesaj gönderme
  async sendMessage(to: string, content: string, mediaUrl?: string): Promise<boolean> {
    if (!this.isReady) {
      console.error('WhatsApp client hazır değil!')
      return false
    }

    try {
      let message: Message

      if (mediaUrl) {
        const media = new MessageMedia('image/jpeg', mediaUrl, 'image.jpg')
        message = await this.client.sendMessage(to, media, { caption: content })
      } else {
        message = await this.client.sendMessage(to, content)
      }

      const whatsappMessage: WhatsAppMessage = {
        id: message.id._serialized,
        from: message.from,
        to: message.to,
        body: content,
        timestamp: new Date(),
        type: mediaUrl ? 'media' : 'text',
        status: 'sent',
        mediaUrl
      }

      this.messageHistory.push(whatsappMessage)
      return true
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error)
      return false
    }
  }

  // Toplu mesaj gönderme
  async sendBulkMessage(recipients: string[], content: string, delayMs: number = 1000): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const recipient of recipients) {
      try {
        const result = await this.sendMessage(recipient, content)
        if (result) {
          success++
        } else {
          failed++
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, delayMs))
      } catch (error) {
        console.error(`Toplu mesaj hatası (${recipient}):`, error)
        failed++
      }
    }

    return { success, failed }
  }

  // Şablon mesaj gönderme
  async sendTemplateMessage(to: string, templateId: string, variables: Record<string, string>): Promise<boolean> {
    const template = this.messageTemplates.find(t => t.id === templateId && t.isActive)
    if (!template) {
      console.error('Şablon bulunamadı:', templateId)
      return false
    }

    let content = template.content
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }

    return await this.sendMessage(to, content)
  }

  // Şablon yönetimi
  addTemplate(template: Omit<MessageTemplate, 'id'>): string {
    const id = `template_${Date.now()}`
    const newTemplate: MessageTemplate = {
      ...template,
      id
    }
    this.messageTemplates.push(newTemplate)
    this.saveTemplates()
    return id
  }

  updateTemplate(id: string, updates: Partial<MessageTemplate>): boolean {
    const index = this.messageTemplates.findIndex(t => t.id === id)
    if (index === -1) return false

    this.messageTemplates[index] = { ...this.messageTemplates[index], ...updates }
    this.saveTemplates()
    return true
  }

  deleteTemplate(id: string): boolean {
    const index = this.messageTemplates.findIndex(t => t.id === id)
    if (index === -1) return false

    this.messageTemplates.splice(index, 1)
    this.saveTemplates()
    return true
  }

  getTemplates(): MessageTemplate[] {
    return [...this.messageTemplates]
  }

  // Zamanlanmış mesaj yönetimi
  scheduleMessage(scheduledMessage: Omit<ScheduledMessage, 'id' | 'status'>): string {
    const id = `scheduled_${Date.now()}`
    const newScheduledMessage: ScheduledMessage = {
      ...scheduledMessage,
      id,
      status: 'pending'
    }
    this.scheduledMessages.push(newScheduledMessage)
    return id
  }

  cancelScheduledMessage(id: string): boolean {
    const index = this.scheduledMessages.findIndex(m => m.id === id)
    if (index === -1) return false

    this.scheduledMessages[index].status = 'cancelled'
    return true
  }

  getScheduledMessages(): ScheduledMessage[] {
    return [...this.scheduledMessages]
  }

  // Mesaj geçmişi
  getMessageHistory(limit: number = 100): WhatsAppMessage[] {
    return this.messageHistory.slice(-limit)
  }

  getMessageHistoryByPhone(phone: string, limit: number = 50): WhatsAppMessage[] {
    return this.messageHistory
      .filter(m => m.from === phone || m.to === phone)
      .slice(-limit)
  }

  // İstatistikler
  getStatistics() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const messages24h = this.messageHistory.filter(m => m.timestamp > last24h)
    const messages7d = this.messageHistory.filter(m => m.timestamp > last7d)

    return {
      totalMessages: this.messageHistory.length,
      messages24h: messages24h.length,
      messages7d: messages7d.length,
      sentMessages: this.messageHistory.filter(m => m.status === 'sent').length,
      deliveredMessages: this.messageHistory.filter(m => m.status === 'delivered').length,
      failedMessages: this.messageHistory.filter(m => m.status === 'failed').length,
      pendingScheduled: this.scheduledMessages.filter(m => m.status === 'pending').length
    }
  }

  // Bağlantı durumu
  getConnectionStatus(): { isReady: boolean; isConnected: boolean } {
    return {
      isReady: this.isReady,
      isConnected: this.client.pupPage !== null
    }
  }

  // Bağlantıyı yeniden başlat
  async reconnect(): Promise<boolean> {
    try {
      await this.client.destroy()
      await this.client.initialize()
      return true
    } catch (error) {
      console.error('Yeniden bağlanma hatası:', error)
      return false
    }
  }

  // Veri kaydetme/yükleme
  private saveTemplates() {
    try {
      localStorage.setItem('whatsapp_templates', JSON.stringify(this.messageTemplates))
    } catch (error) {
      console.error('Şablon kaydetme hatası:', error)
    }
  }

  private loadTemplates() {
    try {
      const saved = localStorage.getItem('whatsapp_templates')
      if (saved) {
        this.messageTemplates = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Şablon yükleme hatası:', error)
    }
  }

  // Zamanlayıcı kurulumu
  private setupScheduler() {
    // Her dakika zamanlanmış mesajları kontrol et
    cron.schedule('* * * * *', async () => {
      const now = new Date()
      const pendingMessages = this.scheduledMessages.filter(
        m => m.status === 'pending' && m.scheduledAt <= now
      )

      for (const message of pendingMessages) {
        try {
          const template = this.messageTemplates.find(t => t.id === message.templateId)
          if (template) {
            let content = template.content
            for (const [key, value] of Object.entries(message.variables)) {
              content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
            }

            const success = await this.sendMessage(message.to, content)
            message.status = success ? 'sent' : 'failed'
          } else {
            message.status = 'failed'
          }
        } catch (error) {
          console.error('Zamanlanmış mesaj gönderme hatası:', error)
          message.status = 'failed'
        }
      }
    })
  }

  // Servisi başlat
  async initialize(): Promise<boolean> {
    try {
      await this.client.initialize()
      return true
    } catch (error) {
      console.error('WhatsApp servis başlatma hatası:', error)
      return false
    }
  }

  // Servisi durdur
  async destroy(): Promise<void> {
    try {
      await this.client.destroy()
    } catch (error) {
      console.error('WhatsApp servis durdurma hatası:', error)
    }
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService()
