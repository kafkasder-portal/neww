import { supabase } from '@/lib/supabase'
import { logSystemError } from '@/services/errorService'

export interface AILearningPattern {
  id: string
  userId: string
  pattern: string
  context: string
  successRate: number
  usageCount: number
  lastUsed: Date
  confidence: number
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  description?: string
  action?: string
  parameters?: Record<string, any>
  conditions?: Record<string, any>
  target?: string
  module?: string
}

export interface AIUserPreference {
  id: string
  userId: string
  preferenceType: 'command_style' | 'response_format' | 'automation_level' | 'notification_preference'
  value: any
  confidence: number
  lastUpdated: Date
}

export interface AIContextMemory {
  id: string
  userId: string
  sessionId: string
  context: string
  entities: Record<string, any>
  intent: string
  confidence: number
  timestamp: Date
  expiresAt: Date
}

export interface AIPerformanceMetric {
  id: string
  userId: string
  command: string
  result: 'success' | 'failure' | 'partial'
  responseTime: number
  confidence: number
  userSatisfaction?: number
  timestamp: Date
  context: Record<string, any>
}

export class EnhancedLearningSystem {
  private static instance: EnhancedLearningSystem
  private learningCache = new Map<string, AILearningPattern>()
  private userPreferences = new Map<string, AIUserPreference[]>()
  private contextMemory = new Map<string, AIContextMemory[]>()
  private performanceMetrics = new Map<string, AIPerformanceMetric[]>()

  static getInstance(): EnhancedLearningSystem {
    if (!EnhancedLearningSystem.instance) {
      EnhancedLearningSystem.instance = new EnhancedLearningSystem()
    }
    return EnhancedLearningSystem.instance
  }

  // Pattern Learning & Recognition
  async learnPattern(
    userId: string,
    command: string,
    context: string,
    result: 'success' | 'failure' | 'partial',
    confidence: number
  ): Promise<void> {
    try {
      const pattern = this.extractPattern(command)
      const existingPattern = await this.findPattern(userId, pattern)

      if (existingPattern) {
        // Update existing pattern
        const newSuccessRate = this.calculateSuccessRate(
          existingPattern.successRate,
          existingPattern.usageCount,
          result
        )
        
        await this.updatePattern(existingPattern.id, {
          successRate: newSuccessRate,
          usageCount: existingPattern.usageCount + 1,
          lastUsed: new Date(),
          confidence: Math.max(existingPattern.confidence, confidence)
        })
      } else {
        // Create new pattern
        await this.createPattern({
          userId,
          pattern,
          context,
          successRate: result === 'success' ? 1 : result === 'partial' ? 0.5 : 0,
          usageCount: 1,
          lastUsed: new Date(),
          confidence,
          category: this.categorizePattern(pattern),
          tags: this.extractTags(command),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      // Update cache
      this.learningCache.clear()
    } catch (error) {
      logSystemError('AI Learning Pattern Error', error)
    }
  }

  async getPersonalizedSuggestions(userId: string, context: string): Promise<string[]> {
    try {
      const patterns = await this.getUserPatterns(userId)
      const relevantPatterns = patterns.filter(p => 
        p.successRate > 0.7 && 
        p.usageCount > 2 &&
        this.isContextRelevant(p.context, context)
      )

      return relevantPatterns
        .sort((a, b) => b.successRate * b.usageCount - a.successRate * a.usageCount)
        .slice(0, 5)
        .map(p => p.pattern)
    } catch (error) {
      logSystemError('AI Suggestions Error', error)
      return []
    }
  }

  // User Preference Learning
  async learnUserPreference(
    userId: string,
    preferenceType: AIUserPreference['preferenceType'],
    value: any,
    confidence: number
  ): Promise<void> {
    try {
      const existing = await this.findUserPreference(userId, preferenceType)
      
      if (existing) {
        await this.updateUserPreference(existing.id, {
          value: this.mergePreferenceValues(existing.value, value),
          confidence: Math.max(existing.confidence, confidence),
          lastUpdated: new Date()
        })
      } else {
        await this.createUserPreference({
          userId,
          preferenceType,
          value,
          confidence,
          lastUpdated: new Date()
        })
      }

      // Update cache
      this.userPreferences.delete(userId)
    } catch (error) {
      logSystemError('AI User Preference Error', error)
    }
  }

  async getUserPreferences(userId: string): Promise<AIUserPreference[]> {
    try {
      if (this.userPreferences.has(userId)) {
        return this.userPreferences.get(userId)!
      }

      const { data, error } = await supabase
        .from('ai_user_preferences')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error

      const preferences = data || []
      this.userPreferences.set(userId, preferences)
      return preferences
    } catch (error) {
      logSystemError('AI Get User Preferences Error', error)
      return []
    }
  }

  // Context Memory Management
  async storeContextMemory(
    userId: string,
    sessionId: string,
    context: string,
    entities: Record<string, any>,
    intent: string,
    confidence: number
  ): Promise<void> {
    try {
      const memory: AIContextMemory = {
        id: crypto.randomUUID(),
        userId,
        sessionId,
        context,
        entities,
        intent,
        confidence,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      }

      await this.createContextMemory(memory)
      
      // Update cache
      const userMemories = this.contextMemory.get(userId) || []
      userMemories.push(memory)
      this.contextMemory.set(userId, userMemories.slice(-50)) // Keep last 50 memories
    } catch (error) {
      logSystemError('AI Context Memory Error', error)
    }
  }

  async getRelevantContext(userId: string, currentContext: string): Promise<AIContextMemory[]> {
    try {
      const memories = await this.getUserContextMemories(userId)
      const now = new Date()
      
      return memories
        .filter(m => m.expiresAt > now)
        .filter(m => this.calculateContextSimilarity(m.context, currentContext) > 0.6)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)
    } catch (error) {
      logSystemError('AI Get Context Error', error)
      return []
    }
  }

  // Performance Analytics
  async recordPerformanceMetric(metric: Omit<AIPerformanceMetric, 'id'>): Promise<void> {
    try {
      const fullMetric: AIPerformanceMetric = {
        ...metric,
        id: crypto.randomUUID()
      }

      await this.createPerformanceMetric(fullMetric)
      
      // Update cache
      const userMetrics = this.performanceMetrics.get(metric.userId) || []
      userMetrics.push(fullMetric)
      this.performanceMetrics.set(metric.userId, userMetrics.slice(-100)) // Keep last 100 metrics
    } catch (error) {
      logSystemError('AI Performance Metric Error', error)
    }
  }

  async getPerformanceAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const metrics = await this.getUserPerformanceMetrics(userId, days)
      
      const totalCommands = metrics.length
      const successCount = metrics.filter(m => m.result === 'success').length
      const averageResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalCommands
      const averageConfidence = metrics.reduce((sum, m) => sum + m.confidence, 0) / totalCommands
      
      const dailyBreakdown = this.calculateDailyBreakdown(metrics)
      const commandSuccessRates = this.calculateCommandSuccessRates(metrics)
      const userSatisfactionTrend = this.calculateUserSatisfactionTrend(metrics)

      return {
        totalCommands,
        successRate: totalCommands > 0 ? successCount / totalCommands : 0,
        averageResponseTime,
        averageConfidence,
        dailyBreakdown,
        commandSuccessRates,
        userSatisfactionTrend,
        improvementSuggestions: this.generateImprovementSuggestions(metrics)
      }
    } catch (error) {
      logSystemError('AI Performance Analytics Error', error)
      return null
    }
  }

  // Predictive Analytics
  async predictUserIntent(userId: string, partialCommand: string): Promise<string[]> {
    try {
      const patterns = await this.getUserPatterns(userId)
      const contextMemories = await this.getRelevantContext(userId, partialCommand)
      
      const predictions = patterns
        .filter(p => p.pattern.toLowerCase().includes(partialCommand.toLowerCase()))
        .map(p => ({
          pattern: p.pattern,
          score: p.successRate * p.usageCount * p.confidence
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(p => p.pattern)

      return predictions
    } catch (error) {
      logSystemError('AI Intent Prediction Error', error)
      return []
    }
  }

  // Proactive Suggestions
  async generateProactiveSuggestions(userId: string): Promise<string[]> {
    try {
      const preferences = await this.getUserPreferences(userId)
      const patterns = await this.getUserPatterns(userId)
      const timeOfDay = new Date().getHours()
      
      const suggestions: string[] = []

      // Time-based suggestions
      if (timeOfDay === 9) {
        suggestions.push('Günlük rapor oluştur')
        suggestions.push('Bekleyen görevleri kontrol et')
      } else if (timeOfDay === 18) {
        suggestions.push('Günlük özet al')
        suggestions.push('Yarınki toplantıları kontrol et')
      }

      // Pattern-based suggestions
      const frequentPatterns = patterns
        .filter(p => p.usageCount > 5 && p.successRate > 0.8)
        .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
        .slice(0, 3)
        .map(p => p.pattern)

      suggestions.push(...frequentPatterns)

      // Preference-based suggestions
      const automationLevel = preferences.find(p => p.preferenceType === 'automation_level')
      if (automationLevel?.value === 'high') {
        suggestions.push('Otomatik görev oluştur')
        suggestions.push('Rutin işlemleri otomatikleştir')
      }

      return suggestions.slice(0, 5)
    } catch (error) {
      logSystemError('AI Proactive Suggestions Error', error)
      return []
    }
  }

  // Private helper methods
  private extractPattern(command: string): string {
    // Remove specific values but keep structure
    return command
      .replace(/\d+/g, '{number}')
      .replace(/"[^"]*"/g, '{string}')
      .replace(/[A-Za-z]+@[A-Za-z]+\.[A-Za-z]+/g, '{email}')
      .replace(/\b\d{10,11}\b/g, '{phone}')
      .toLowerCase()
  }

  private categorizePattern(pattern: string): string {
    if (pattern.includes('listele') || pattern.includes('göster')) return 'query'
    if (pattern.includes('ekle') || pattern.includes('oluştur')) return 'create'
    if (pattern.includes('güncelle') || pattern.includes('düzenle')) return 'update'
    if (pattern.includes('sil') || pattern.includes('kaldır')) return 'delete'
    if (pattern.includes('rapor') || pattern.includes('analiz')) return 'report'
    return 'other'
  }

  private extractTags(command: string): string[] {
    const tags: string[] = []
    const words = command.toLowerCase().split(' ')
    
    if (words.includes('bağış') || words.includes('donation')) tags.push('donations')
    if (words.includes('hak') || words.includes('beneficiary')) tags.push('beneficiaries')
    if (words.includes('görev') || words.includes('task')) tags.push('tasks')
    if (words.includes('toplantı') || words.includes('meeting')) tags.push('meetings')
    if (words.includes('mesaj') || words.includes('message')) tags.push('messages')
    
    return tags
  }

  private calculateSuccessRate(
    currentRate: number,
    currentCount: number,
    newResult: 'success' | 'failure' | 'partial'
  ): number {
    const newValue = newResult === 'success' ? 1 : newResult === 'partial' ? 0.5 : 0
    return (currentRate * currentCount + newValue) / (currentCount + 1)
  }

  private isContextRelevant(patternContext: string, currentContext: string): boolean {
    const patternWords = patternContext.toLowerCase().split(' ')
    const currentWords = currentContext.toLowerCase().split(' ')
    const commonWords = patternWords.filter(word => currentWords.includes(word))
    return commonWords.length / Math.max(patternWords.length, currentWords.length) > 0.3
  }

  private calculateContextSimilarity(context1: string, context2: string): number {
    const words1 = new Set(context1.toLowerCase().split(' '))
    const words2 = new Set(context2.toLowerCase().split(' '))
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    return intersection.size / union.size
  }

  private mergePreferenceValues(existing: any, newValue: any): any {
    if (typeof existing === 'number' && typeof newValue === 'number') {
      return (existing + newValue) / 2
    }
    if (Array.isArray(existing) && Array.isArray(newValue)) {
      return [...new Set([...existing, ...newValue])]
    }
    return newValue
  }

  private calculateDailyBreakdown(metrics: AIPerformanceMetric[]): Record<string, any> {
    const breakdown: Record<string, any> = {}
    
    metrics.forEach(metric => {
      const date = metric.timestamp.toDateString()
      if (!breakdown[date]) {
        breakdown[date] = { total: 0, success: 0, avgResponseTime: 0 }
      }
      
      breakdown[date].total++
      if (metric.result === 'success') breakdown[date].success++
      breakdown[date].avgResponseTime += metric.responseTime
    })

    Object.keys(breakdown).forEach(date => {
      breakdown[date].avgResponseTime /= breakdown[date].total
      breakdown[date].successRate = breakdown[date].success / breakdown[date].total
    })

    return breakdown
  }

  private calculateCommandSuccessRates(metrics: AIPerformanceMetric[]): Record<string, number> {
    const commandStats: Record<string, { success: number; total: number }> = {}
    
    metrics.forEach(metric => {
      if (!commandStats[metric.command]) {
        commandStats[metric.command] = { success: 0, total: 0 }
      }
      
      commandStats[metric.command].total++
      if (metric.result === 'success') commandStats[metric.command].success++
    })

    const successRates: Record<string, number> = {}
    Object.keys(commandStats).forEach(command => {
      successRates[command] = commandStats[command].success / commandStats[command].total
    })

    return successRates
  }

  private calculateUserSatisfactionTrend(metrics: AIPerformanceMetric[]): number[] {
    const satisfactionScores = metrics
      .filter(m => m.userSatisfaction !== undefined)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(m => m.userSatisfaction!)

    // Calculate trend (positive = improving, negative = declining)
    if (satisfactionScores.length < 2) return [0]
    
    const recent = satisfactionScores.slice(-10)
    const older = satisfactionScores.slice(0, -10)
    
    if (older.length === 0) return [0]
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length
    
    return [recentAvg - olderAvg]
  }

  private generateImprovementSuggestions(metrics: AIPerformanceMetric[]): string[] {
    const suggestions: string[] = []
    
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length
    if (avgResponseTime > 3000) {
      suggestions.push('Komut işleme süresini optimize etmek için daha spesifik komutlar kullanın')
    }
    
    const lowConfidenceCommands = metrics.filter(m => m.confidence < 0.6)
    if (lowConfidenceCommands.length > metrics.length * 0.3) {
      suggestions.push('Daha net ve açık komutlar kullanarak AI\'nın daha iyi anlamasını sağlayın')
    }
    
    const failedCommands = metrics.filter(m => m.result === 'failure')
    if (failedCommands.length > 0) {
      suggestions.push('Başarısız komutları tekrar deneyerek AI\'nın öğrenmesini sağlayın')
    }
    
    return suggestions
  }

  // Database operations
  private async findPattern(userId: string, pattern: string): Promise<AILearningPattern | null> {
    const { data, error } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .eq('user_id', userId)
      .eq('pattern', pattern)
      .maybeSingle()

    if (error) throw error
    return data
  }

  private async createPattern(pattern: Omit<AILearningPattern, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('ai_learning_patterns')
      .insert([pattern])

    if (error) throw error
  }

  private async updatePattern(id: string, updates: Partial<AILearningPattern>): Promise<void> {
    const { error } = await supabase
      .from('ai_learning_patterns')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  private async getUserPatterns(userId: string): Promise<AILearningPattern[]> {
    if (this.learningCache.has(userId)) {
      return this.learningCache.get(userId)!
    }

    const { data, error } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('last_used', { ascending: false })

    if (error) throw error

    const patterns = data || []
    this.learningCache.set(userId, patterns)
    return patterns
  }

  private async findUserPreference(userId: string, preferenceType: string): Promise<AIUserPreference | null> {
    const { data, error } = await supabase
      .from('ai_user_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('preference_type', preferenceType)
      .maybeSingle()

    if (error) throw error
    return data
  }

  private async createUserPreference(preference: Omit<AIUserPreference, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('ai_user_preferences')
      .insert([preference])

    if (error) throw error
  }

  private async updateUserPreference(id: string, updates: Partial<AIUserPreference>): Promise<void> {
    const { error } = await supabase
      .from('ai_user_preferences')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  private async createContextMemory(memory: AIContextMemory): Promise<void> {
    const { error } = await supabase
      .from('ai_context_memories')
      .insert([memory])

    if (error) throw error
  }

  private async getUserContextMemories(userId: string): Promise<AIContextMemory[]> {
    const { data, error } = await supabase
      .from('ai_context_memories')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error) throw error
    return data || []
  }

  private async createPerformanceMetric(metric: AIPerformanceMetric): Promise<void> {
    const { error } = await supabase
      .from('ai_performance_metrics')
      .insert([metric])

    if (error) throw error
  }

  private async getUserPerformanceMetrics(userId: string, days: number): Promise<AIPerformanceMetric[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await supabase
      .from('ai_performance_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', cutoffDate.toISOString())
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const enhancedLearningSystem = EnhancedLearningSystem.getInstance()
