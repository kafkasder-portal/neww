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

class WhatsAppMockService {
  private isReady: boolean = false
  private messageTemplates: MessageTemplate[] = []
  private scheduledMessages: ScheduledMessage[] = []
  private messageHistory: WhatsAppMessage[] = []

  constructor() {
    this.loadTemplates()
    this.loadMockData()
  }

  private loadMockData() {
    // Örnek şablonlar
    this.messageTemplates = [
      {
        id: 'template_1',
        name: 'Hoş Geldiniz',
        content: 'Merhaba {{name}}, derneğimize hoş geldiniz!',
        variables: ['name'],
        category: 'notification',
        isActive: true
      },
      {
        id: 'template_2',
        name: 'Bağış Hatırlatması',
        content: 'Sayın {{name}}, {{amount}} TL bağışınız için teşekkürler.',
        variables: ['name', 'amount'],
        category: 'reminder',
        isActive: true
      },
      {
        id: 'template_3',
        name: 'Etkinlik Duyurusu',
        content: '{{eventName}} etkinliğimiz {{date}} tarihinde gerçekleşecektir.',
        variables: ['eventName', 'date'],
        category: 'marketing',
        isActive: true
      }
    ]

    // Örnek mesaj geçmişi
    this.messageHistory = [
      {
        id: 'msg_1',
        from: '905551234567',
        to: '905559876543',
        body: 'Merhaba, yardım hakkında bilgi alabilir miyim?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'delivered'
      },
      {
        id: 'msg_2',
        from: '905559876543',
        to: '905551234567',
        body: 'Tabii, size nasıl yardımcı olabilirim?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        status: 'read'
      }
    ]

    // Örnek zamanlanmış mesajlar
    this.scheduledMessages = [
      {
        id: 'scheduled_1',
        to: '905551234567',
        templateId: 'template_2',
        variables: { name: 'Ahmet Yılmaz', amount: '1000' },
        scheduledAt: new Date(Date.now() + 86400000), // 24 saat sonra
        status: 'pending'
      }
    ]
  }

  // Bağlantı durumu
  getConnectionStatus(): { isReady: boolean; isConnected: boolean } {
    return {
      isReady: this.isReady,
      isConnected: this.isReady
    }
  }

  // Bağlantı simülasyonu
  async initialize(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isReady = true
        resolve(true)
      }, 2000) // 2 saniye simülasyon
    })
  }

  async destroy(): Promise<void> {
    this.isReady = false
  }

  // Mesaj gönderme simülasyonu
  async sendMessage(to: string, content: string, mediaUrl?: string): Promise<boolean> {
    if (!this.isReady) {
      console.error('WhatsApp client hazır değil!')
      return false
    }

    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 1000))

    const message: WhatsAppMessage = {
      id: `msg_${Date.now()}`,
      from: '905559876543', // Sistem numarası
      to,
      body: content,
      timestamp: new Date(),
      type: mediaUrl ? 'media' : 'text',
      status: 'sent',
      mediaUrl
    }

    this.messageHistory.push(message)
    return true
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
}

// Singleton instance
export const whatsappService = new WhatsAppMockService()
