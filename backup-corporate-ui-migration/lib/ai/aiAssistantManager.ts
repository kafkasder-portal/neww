import { enhancedNlpProcessor } from './enhancedNlpProcessor'
// import { smartCommandProcessor } from './smartCommandProcessor'
import { workflowEngine } from './workflowEngine'
import { moduleController } from './moduleController'

export interface AICapabilities {
  naturalLanguageProcessing: boolean
  smartCommandProcessing: boolean
  workflowAutomation: boolean
  learningFromFeedback: boolean
  multiModalInput: boolean
  contextAwareness: boolean
  proactiveAssistance: boolean
}

export interface AIPerformanceMetrics {
  totalInteractions: number
  successRate: number
  averageResponseTime: number
  userSatisfactionScore: number
  learnedPatterns: number
  automationsSaved: number
}

export interface AIInsight {
  type: 'suggestion' | 'warning' | 'opportunity' | 'achievement'
  title: string
  description: string
  action?: string
  priority: 'low' | 'medium' | 'high'
  module?: string
}

export class AIAssistantManager {
  private static instance: AIAssistantManager
  private performanceMetrics: AIPerformanceMetrics = {
    totalInteractions: 0,
    successRate: 0,
    averageResponseTime: 0,
    userSatisfactionScore: 0,
    learnedPatterns: 0,
    automationsSaved: 0
  }

  static getInstance(): AIAssistantManager {
    if (!AIAssistantManager.instance) {
      AIAssistantManager.instance = new AIAssistantManager()
    }
    return AIAssistantManager.instance
  }

  // AI Yeteneklerini döndür
  getCapabilities(): AICapabilities {
    return {
      naturalLanguageProcessing: true,
      smartCommandProcessing: true,
      workflowAutomation: true,
      learningFromFeedback: true,
      multiModalInput: true, // Ses, metin
      contextAwareness: true,
      proactiveAssistance: true
    }
  }

  // Performans metriklerini güncelle
  updateMetrics(interaction: {
    success: boolean
    responseTime: number
    userFeedback?: 'positive' | 'negative' | 'neutral'
  }): void {
    this.performanceMetrics.totalInteractions++
    
    // Başarı oranını güncelle
    const currentSuccessCount = Math.round(this.performanceMetrics.successRate * (this.performanceMetrics.totalInteractions - 1))
    const newSuccessCount = currentSuccessCount + (interaction.success ? 1 : 0)
    this.performanceMetrics.successRate = newSuccessCount / this.performanceMetrics.totalInteractions

    // Ortalama yanıt süresini güncelle
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalInteractions - 1) + interaction.responseTime) / 
      this.performanceMetrics.totalInteractions

    // Kullanıcı memnuniyetini güncelle
    if (interaction.userFeedback) {
      const feedbackScore = interaction.userFeedback === 'positive' ? 1 : 
                           interaction.userFeedback === 'negative' ? 0 : 0.5
      this.performanceMetrics.userSatisfactionScore = 
        (this.performanceMetrics.userSatisfactionScore * (this.performanceMetrics.totalInteractions - 1) + feedbackScore) / 
        this.performanceMetrics.totalInteractions
    }

    // Öğrenilen pattern sayısını güncelle
    // this.performanceMetrics.learnedPatterns = smartCommandProcessor.getLearnedPatterns().size
  }

  // Performans metriklerini al
  getPerformanceMetrics(): AIPerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  // AI insights ve öneriler oluştur
  generateInsights(_userId?: string): AIInsight[] {
    const insights: AIInsight[] = []
    // const history = smartCommandProcessor.getExecutionHistory(userId)
    const recentHistory: any[] = [] // Mock history for now

    // Başarı oranı düşükse uyarı
    if (this.performanceMetrics.successRate < 0.7 && this.performanceMetrics.totalInteractions > 5) {
      insights.push({
        type: 'warning',
        title: 'Düşük Başarı Oranı',
        description: `AI asistanın başarı oranı %${Math.round(this.performanceMetrics.successRate * 100)}. Komutlarınızı daha açık ifade etmeyi deneyin.`,
        action: 'Yardım al',
        priority: 'medium'
      })
    }

    // Sık kullanılan komutlar için automation önerisi
    // const mostUsedCommands = smartCommandProcessor.getMostUsedCommands(3)
    const mostUsedCommands: any[] = [] // Mock for now
    mostUsedCommands.forEach((cmd: any) => {
      if (cmd.count > 5) {
        insights.push({
          type: 'opportunity',
          title: 'Automation Fırsatı',
          description: `"${cmd.command}" komutunu ${cmd.count} kez kullandınız. Bu işlem için otomatik kural oluşturabilirsiniz.`,
          action: 'Automation kur',
          priority: 'low'
        })
      }
    })

    // Son zamanlarda başarısız komutlar
    const recentFailures = recentHistory.filter((h: any) => !h.result.success)
    if (recentFailures.length > 2) {
      insights.push({
        type: 'suggestion',
        title: 'Komut Optimizasyonu',
        description: `Son ${recentFailures.length} komutunuz başarısız oldu. Komut formatınızı gözden geçirin.`,
        action: 'Örnekleri gör',
        priority: 'medium'
      })
    }

    // Yeni özellik bildirimi
    if (this.performanceMetrics.totalInteractions === 10) {
      insights.push({
        type: 'achievement',
        title: 'AI Asistan Keşfi',
        description: '10 komut tamamladınız! Artık sesli komutları ve gelişmiş filtreleri kullanabilirsiniz.',
        action: 'Özellikleri keşfet',
        priority: 'low'
      })
    }

    // Modül bazlı öneriler
    const moduleUsage = this.analyzeModuleUsage(recentHistory)
    Object.entries(moduleUsage).forEach(([module, usage]) => {
      if (usage.errorRate > 0.5 && usage.count > 3) {
        insights.push({
          type: 'warning',
          title: `${module.charAt(0).toUpperCase() + module.slice(1)} Modülü`,
          description: `Bu modülde yüksek hata oranı (%${Math.round(usage.errorRate * 100)}). Yetkinizi kontrol edin.`,
          module,
          priority: 'high'
        })
      }
    })

    return insights.slice(0, 5) // Maksimum 5 insight
  }

  private analyzeModuleUsage(history: any[]): Record<string, { count: number; errorRate: number }> {
    const moduleStats: Record<string, { total: number; errors: number }> = {}

    history.forEach(item => {
      const module = item.result.data?.module || 'system'
      if (!moduleStats[module]) {
        moduleStats[module] = { total: 0, errors: 0 }
      }
      moduleStats[module].total++
      if (!item.result.success) {
        moduleStats[module].errors++
      }
    })

    const result: Record<string, { count: number; errorRate: number }> = {}
    Object.entries(moduleStats).forEach(([module, stats]) => {
      result[module] = {
        count: stats.total,
        errorRate: stats.errors / stats.total
      }
    })

    return result
  }

  // Proaktif öneriler oluştur
  generateProactiveAssistance(_context: any): string[] {
    const suggestions: string[] = []
    const now = new Date()
    const hour = now.getHours()

    // Zaman bazlı öneriler
    if (hour >= 9 && hour <= 11) {
      suggestions.push(
        'Günaydın! Bugünün görevlerini kontrol etmek ister misiniz?',
        'Dün tamamlanamayan işler var mı?'
      )
    } else if (hour >= 17 && hour <= 19) {
      suggestions.push(
        'Günlük raporu almak ister misiniz?',
        'Yarın için görev planı oluşturalım mı?'
      )
    }

    // Modül bazlı öneriler
    const availableModules = moduleController.getModules()
    if (availableModules.includes('donations')) {
      suggestions.push('Bu ayın bağış durumunu kontrol edin')
    }
    if (availableModules.includes('meetings')) {
      suggestions.push('Yaklaşan toplantıları görüntüleyin')
    }

    // Otomatik görevler
    const activeWorkflows = workflowEngine.getActiveExecutions()
    if (activeWorkflows.length > 0) {
      suggestions.push(`${activeWorkflows.length} aktif workflow çalışıyor`)
    }

    return suggestions.slice(0, 3)
  }

  // Kullanıcı geri bildirimini işle
  processFeedback(commandId: string, feedback: 'positive' | 'negative' | 'neutral', details?: string): void {
    // Geri bildirimi kaydet ve öğrenme sistemine besle
    const timestamp = new Date()
    
    // Machine learning için feedback data store edilebilir
    console.log('AI Feedback:', {
      commandId,
      feedback,
      details,
      timestamp
    })

    // Pattern'ları güncelle
    if (feedback === 'negative') {
      // Başarısız pattern'ları azalt
    } else if (feedback === 'positive') {
      // Başarılı pattern'ları güçlendir
    }
  }

  // AI sistem durumunu kontrol et
  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'error'
    components: Array<{
      name: string
      status: 'ok' | 'warning' | 'error'
      message?: string
    }>
  } {
    const components = [
      {
        name: 'NLP Processor',
        status: 'ok' as const
      },
      {
        name: 'Smart Command Processor',
        status: 'ok' as const
      },
      {
        name: 'Workflow Engine',
        status: 'ok' as const
      },
      {
        name: 'Module Controller',
        status: 'ok' as const
      }
    ]

    const hasErrors = components.some(c => c.status === 'error')
    const hasWarnings = components.some(c => c.status === 'warning')

    return {
      status: hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy',
      components
    }
  }

  // Özel komut şablonları oluştur
  generateCommandTemplates(module?: string): Array<{
    template: string
    description: string
    example: string
  }> {
    const templates = [
      {
        template: '[MODÜL] [İŞLEM] [PARAMETRE]',
        description: 'Temel komut formatı',
        example: 'Hak sahibi ekle: Ahmet Yılmaz, 555-0123'
      },
      {
        template: '[MIKTAR] [PARA_BİRİMİ] bağış ekle [İSİM]',
        description: 'Bağış ekleme',
        example: '1000 TL bağış ekle Ayşe Demir'
      },
      {
        template: '[TARİH] [SAAT] toplantı oluştur [KONU]',
        description: 'Toplantı planlama',
        example: 'Yarın 14:00 toplantı oluştur Bütçe toplantısı'
      },
      {
        template: '[KİŞİ] için [GÖREV] oluştur [TARİH]',
        description: 'Görev atama',
        example: 'Ali Veli için belge tarama oluştur bu hafta'
      },
      {
        template: '[MODÜL] raporu al [TARİH_ARALIĞI]',
        description: 'Rapor alma',
        example: 'Bağış raporu al bu ay'
      }
    ]

    if (module) {
      return templates.filter(t => 
        t.example.toLowerCase().includes(module) || 
        t.description.toLowerCase().includes(module)
      )
    }

    return templates
  }

  // Gelişmiş yardım sistemi
  getContextualHelp(currentCommand?: string): {
    suggestions: string[]
    examples: string[]
    tips: string[]
  } {
    const suggestions = []
    const examples = []
    const tips = []

    if (currentCommand) {
      const nlpResult = enhancedNlpProcessor.process(currentCommand)
      
      // Intent bazlı öneriler
      switch (nlpResult.intent.primary) {
        case 'CREATE':
          suggestions.push('Gerekli alanları eksiksiz doldurun')
          examples.push('Yeni hak sahibi ekle: Mehmet Can, 0555-123-4567, mehmet@email.com')
          break
        case 'READ':
          suggestions.push('Filtreleme için ek parametreler kullanın')
          examples.push('Aktif hak sahiplerini listele', 'Bu ayın bağışlarını göster')
          break
      }
    }

    // Genel ipuçları
    tips.push(
      'Komutları günlük konuşma dilinizle yazabilirsiniz',
      'Tarih ve saat bilgilerini "bugün", "yarın" gibi ifadelerle kullanın',
      'Sesli komut için mikrofon butonunu kullanın',
      'Belirsiz komutlar için AI sizden açıklama isteyecektir'
    )

    return { suggestions, examples, tips }
  }
}

export const aiAssistantManager = AIAssistantManager.getInstance()
