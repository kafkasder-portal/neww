import { supabase } from '@/lib/supabase'
import { logSystemError } from '@/services/errorService'

export interface DataInsight {
  id: string
  type: 'trend' | 'anomaly' | 'pattern' | 'prediction' | 'recommendation'
  title: string
  description: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  data: any
  timestamp: Date
  category: string
  actionable: boolean
  action?: string
}

export interface TrendAnalysis {
  metric: string
  period: string
  currentValue: number
  previousValue: number
  change: number
  changePercentage: number
  trend: 'increasing' | 'decreasing' | 'stable'
  confidence: number
  factors: string[]
}

export interface PredictiveModel {
  id: string
  name: string
  target: string
  features: string[]
  accuracy: number
  lastUpdated: Date
  predictions: Prediction[]
}

export interface Prediction {
  id: string
  modelId: string
  target: string
  predictedValue: any
  confidence: number
  timestamp: Date
  actualValue?: any
  accuracy?: number
}

export interface AnomalyDetection {
  id: string
  metric: string
  value: number
  expectedRange: [number, number]
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  resolved: boolean
}

export class EnhancedDataAnalysis {
  private static instance: EnhancedDataAnalysis
  private insightsCache = new Map<string, DataInsight[]>()
  private trendsCache = new Map<string, TrendAnalysis[]>()
  private predictionsCache = new Map<string, Prediction[]>()
  private anomaliesCache = new Map<string, AnomalyDetection[]>()

  static getInstance(): EnhancedDataAnalysis {
    if (!EnhancedDataAnalysis.instance) {
      EnhancedDataAnalysis.instance = new EnhancedDataAnalysis()
    }
    return EnhancedDataAnalysis.instance
  }

  // Comprehensive Data Analysis
  async analyzeSystemData(userId?: string): Promise<DataInsight[]> {
    try {
      const insights: DataInsight[] = []
      
      // Analyze donations
      const donationInsights = await this.analyzeDonations()
      insights.push(...donationInsights)
      
      // Analyze beneficiaries
      const beneficiaryInsights = await this.analyzeBeneficiaries()
      insights.push(...beneficiaryInsights)
      
      // Analyze tasks and meetings
      const taskInsights = await this.analyzeTasks()
      insights.push(...taskInsights)
      
      const meetingInsights = await this.analyzeMeetings()
      insights.push(...meetingInsights)
      
      // Analyze system performance
      const performanceInsights = await this.analyzeSystemPerformance()
      insights.push(...performanceInsights)
      
      // Generate cross-module insights
      const crossModuleInsights = await this.generateCrossModuleInsights()
      insights.push(...crossModuleInsights)
      
      // Store insights
      await this.storeInsights(insights)
      
      return insights.sort((a, b) => b.confidence - a.confidence)
    } catch (error) {
      // Replace all instances like:
      // logSystemError('AI Data Analysis Error', error)
      // With:
      logSystemError(new Error('AI Data Analysis Error'), { error })
      return []
    }
  }

  // Donation Analysis
  private async analyzeDonations(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      const { data: donations } = await supabase
        .from('donations')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (!donations || donations.length === 0) return insights

      // Total donation analysis
      const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
      const avgAmount = totalAmount / donations.length
      const donationCount = donations.length

      // Monthly trend
      const monthlyData = this.groupByMonth(donations, 'created_at')
      const currentMonth = new Date().getMonth()
      const currentMonthAmount = monthlyData[currentMonth]?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
      const previousMonthAmount = monthlyData[currentMonth - 1]?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

      if (currentMonthAmount > previousMonthAmount * 1.2) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'trend',
          title: 'Bağış Artışı Tespit Edildi',
          description: `Bu ay bağışlar %${Math.round(((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100)} arttı`,
          confidence: 0.85,
          severity: 'medium',
          data: { currentMonthAmount, previousMonthAmount, change: currentMonthAmount - previousMonthAmount },
          timestamp: new Date(),
          category: 'donations',
          actionable: true,
          action: 'Bağış kampanyası oluştur'
        })
      }

      // Donation type analysis
      const typeAnalysis = this.analyzeDonationTypes(donations)
      if (typeAnalysis.mostPopularType) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'pattern',
          title: 'En Popüler Bağış Türü',
          description: `${typeAnalysis.mostPopularType} en çok tercih edilen bağış türü (%${typeAnalysis.mostPopularPercentage})`,
          confidence: 0.9,
          severity: 'low',
          data: typeAnalysis,
          timestamp: new Date(),
          category: 'donations',
          actionable: true,
          action: 'Bu türde kampanya oluştur'
        })
      }

      // Anomaly detection
      const anomalies = this.detectDonationAnomalies(donations)
      insights.push(...anomalies.map(anomaly => ({
        id: crypto.randomUUID(),
        type: 'anomaly',
        title: 'Anormal Bağış Tespit Edildi',
        description: anomaly.description,
        confidence: 0.75,
        severity: anomaly.severity,
        data: anomaly,
        timestamp: new Date(),
        category: 'donations',
        actionable: true,
        action: 'Bağışı incele'
      })))

    } catch (error) {
      logSystemError('Donation Analysis Error', error)
    }

    return insights
  }

  // Beneficiary Analysis
  private async analyzeBeneficiaries(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      const { data: beneficiaries } = await supabase
        .from('beneficiaries')
        .select('*')

      if (!beneficiaries || beneficiaries.length === 0) return insights

      // New beneficiaries trend
      const recentBeneficiaries = beneficiaries.filter(b => 
        new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )

      if (recentBeneficiaries.length > beneficiaries.length * 0.1) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'trend',
          title: 'Yeni Hak Sahibi Artışı',
          description: `Son 7 günde ${recentBeneficiaries.length} yeni hak sahibi eklendi`,
          confidence: 0.8,
          severity: 'medium',
          data: { recentCount: recentBeneficiaries.length, totalCount: beneficiaries.length },
          timestamp: new Date(),
          category: 'beneficiaries',
          actionable: true,
          action: 'Yeni hak sahiplerini incele'
        })
      }

      // Geographic analysis
      const geographicInsight = this.analyzeGeographicDistribution(beneficiaries)
      if (geographicInsight) {
        insights.push(geographicInsight)
      }

      // Status analysis
      const statusAnalysis = this.analyzeBeneficiaryStatus(beneficiaries)
      if (statusAnalysis.pendingCount > beneficiaries.length * 0.3) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'recommendation',
          title: 'Bekleyen Başvuru Sayısı Yüksek',
          description: `${statusAnalysis.pendingCount} başvuru bekliyor (%${Math.round((statusAnalysis.pendingCount / beneficiaries.length) * 100)})`,
          confidence: 0.85,
          severity: 'high',
          data: statusAnalysis,
          timestamp: new Date(),
          category: 'beneficiaries',
          actionable: true,
          action: 'Bekleyen başvuruları incele'
        })
      }

    } catch (error) {
      logSystemError('Beneficiary Analysis Error', error)
    }

    return insights
  }

  // Task Analysis
  private async analyzeTasks(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')

      if (!tasks || tasks.length === 0) return insights

      // Overdue tasks
      const overdueTasks = tasks.filter(t => 
        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
      )

      if (overdueTasks.length > 0) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'Geciken Görevler Tespit Edildi',
          description: `${overdueTasks.length} görev süresi geçmiş`,
          confidence: 0.95,
          severity: 'high',
          data: { overdueCount: overdueTasks.length, totalCount: tasks.length },
          timestamp: new Date(),
          category: 'tasks',
          actionable: true,
          action: 'Geciken görevleri incele'
        })
      }

      // Task completion rate
      const completedTasks = tasks.filter(t => t.status === 'completed')
      const completionRate = completedTasks.length / tasks.length

      if (completionRate < 0.7) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'trend',
          title: 'Görev Tamamlama Oranı Düşük',
          description: `Görev tamamlama oranı %${Math.round(completionRate * 100)}`,
          confidence: 0.8,
          severity: 'medium',
          data: { completionRate, completedCount: completedTasks.length, totalCount: tasks.length },
          timestamp: new Date(),
          category: 'tasks',
          actionable: true,
          action: 'Görev yönetimini iyileştir'
        })
      }

      // Task priority analysis
      const priorityAnalysis = this.analyzeTaskPriorities(tasks)
      if (priorityAnalysis.highPriorityCount > tasks.length * 0.4) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'pattern',
          title: 'Yüksek Öncelikli Görev Yoğunluğu',
          description: `${priorityAnalysis.highPriorityCount} yüksek öncelikli görev var`,
          confidence: 0.75,
          severity: 'medium',
          data: priorityAnalysis,
          timestamp: new Date(),
          category: 'tasks',
          actionable: true,
          action: 'Öncelikleri yeniden değerlendir'
        })
      }

    } catch (error) {
      logSystemError('Task Analysis Error', error)
    }

    return insights
  }

  // Meeting Analysis
  private async analyzeMeetings(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (!meetings || meetings.length === 0) return insights

      // Upcoming meetings
      const upcomingMeetings = meetings.filter(m => 
        new Date(m.date) > new Date() && new Date(m.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )

      if (upcomingMeetings.length > 5) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'trend',
          title: 'Yoğun Toplantı Programı',
          description: `Önümüzdeki hafta ${upcomingMeetings.length} toplantı planlanmış`,
          confidence: 0.8,
          severity: 'medium',
          data: { upcomingCount: upcomingMeetings.length },
          timestamp: new Date(),
          category: 'meetings',
          actionable: true,
          action: 'Toplantı programını gözden geçir'
        })
      }

      // Meeting attendance analysis
      const attendanceAnalysis = this.analyzeMeetingAttendance(meetings)
      if (attendanceAnalysis.lowAttendanceMeetings.length > 0) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'Düşük Katılımlı Toplantılar',
          description: `${attendanceAnalysis.lowAttendanceMeetings.length} toplantıda düşük katılım`,
          confidence: 0.7,
          severity: 'medium',
          data: attendanceAnalysis,
          timestamp: new Date(),
          category: 'meetings',
          actionable: true,
          action: 'Katılım stratejilerini gözden geçir'
        })
      }

    } catch (error) {
      logSystemError('Meeting Analysis Error', error)
    }

    return insights
  }

  // System Performance Analysis
  private async analyzeSystemPerformance(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      // Analyze API response times
      const performanceData = await this.getSystemPerformanceData()
      
      if (performanceData.avgResponseTime > 2000) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'Sistem Performans Sorunu',
          description: `Ortalama yanıt süresi ${Math.round(performanceData.avgResponseTime)}ms (hedef: <2000ms)`,
          confidence: 0.8,
          severity: 'high',
          data: performanceData,
          timestamp: new Date(),
          category: 'system',
          actionable: true,
          action: 'Performans optimizasyonu yap'
        })
      }

      // Error rate analysis
      if (performanceData.errorRate > 0.05) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          title: 'Yüksek Hata Oranı',
          description: `Hata oranı %${Math.round(performanceData.errorRate * 100)} (hedef: <5%)`,
          confidence: 0.9,
          severity: 'critical',
          data: performanceData,
          timestamp: new Date(),
          category: 'system',
          actionable: true,
          action: 'Hata loglarını incele'
        })
      }

    } catch (error) {
      logSystemError('System Performance Analysis Error', error)
    }

    return insights
  }

  // Cross-Module Insights
  private async generateCrossModuleInsights(): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      // Correlation between donations and beneficiaries
      const correlationInsight = await this.analyzeDonationBeneficiaryCorrelation()
      if (correlationInsight) {
        insights.push(correlationInsight)
      }

      // Workflow efficiency analysis
      const workflowInsight = await this.analyzeWorkflowEfficiency()
      if (workflowInsight) {
        insights.push(workflowInsight)
      }

      // Resource allocation analysis
      const resourceInsight = await this.analyzeResourceAllocation()
      if (resourceInsight) {
        insights.push(resourceInsight)
      }

    } catch (error) {
      logSystemError('Cross-Module Analysis Error', error)
    }

    return insights
  }

  // Predictive Analytics
  async generatePredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = []
    
    try {
      // Donation predictions
      const donationPredictions = await this.predictDonations()
      predictions.push(...donationPredictions)
      
      // Beneficiary growth predictions
      const beneficiaryPredictions = await this.predictBeneficiaryGrowth()
      predictions.push(...beneficiaryPredictions)
      
      // Task completion predictions
      const taskPredictions = await this.predictTaskCompletion()
      predictions.push(...taskPredictions)
      
      // System load predictions
      const loadPredictions = await this.predictSystemLoad()
      predictions.push(...loadPredictions)

    } catch (error) {
      logSystemError('Prediction Generation Error', error)
    }

    return predictions
  }

  // Real-time Monitoring
  async monitorRealTimeMetrics(): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = []
    
    try {
      // Monitor active users
      const activeUsersAnomaly = await this.monitorActiveUsers()
      if (activeUsersAnomaly) anomalies.push(activeUsersAnomaly)
      
      // Monitor system resources
      const resourceAnomaly = await this.monitorSystemResources()
      if (resourceAnomaly) anomalies.push(resourceAnomaly)
      
      // Monitor database performance
      const dbAnomaly = await this.monitorDatabasePerformance()
      if (dbAnomaly) anomalies.push(dbAnomaly)

    } catch (error) {
      logSystemError('Real-time Monitoring Error', error)
    }

    return anomalies
  }

  // Helper methods
  private groupByMonth(data: any[], dateField: string): Record<number, any[]> {
    const grouped: Record<number, any[]> = {}
    
    data.forEach(item => {
      const date = new Date(item[dateField])
      const month = date.getMonth()
      if (!grouped[month]) grouped[month] = []
      grouped[month].push(item)
    })
    
    return grouped
  }

  private analyzeDonationTypes(donations: any[]): any {
    const typeCount: Record<string, number> = {}
    
    donations.forEach(donation => {
      const type = donation.type || 'unknown'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    
    const total = donations.length
    const mostPopularType = Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b
    )
    
    return {
      typeCount,
      mostPopularType,
      mostPopularPercentage: Math.round((typeCount[mostPopularType] / total) * 100)
    }
  }

  private detectDonationAnomalies(donations: any[]): any[] {
    const anomalies: any[] = []
    
    // Detect unusually large donations
    const amounts = donations.map(d => d.amount || 0).filter(a => a > 0)
    const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
    const stdDev = Math.sqrt(amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length)
    
    donations.forEach(donation => {
      if (donation.amount > mean + 2 * stdDev) {
        anomalies.push({
          type: 'large_donation',
          value: donation.amount,
          expectedRange: [0, mean + 2 * stdDev],
          severity: donation.amount > mean + 3 * stdDev ? 'high' : 'medium',
          description: `Büyük bağış tespit edildi: ${donation.amount} TL`
        })
      }
    })
    
    return anomalies
  }

  private analyzeGeographicDistribution(beneficiaries: any[]): DataInsight | null {
    const cityCount: Record<string, number> = {}
    
    beneficiaries.forEach(beneficiary => {
      const city = beneficiary.city || 'unknown'
      cityCount[city] = (cityCount[city] || 0) + 1
    })
    
    const mostPopulatedCity = Object.keys(cityCount).reduce((a, b) => 
      cityCount[a] > cityCount[b] ? a : b
    )
    
    if (cityCount[mostPopulatedCity] > beneficiaries.length * 0.5) {
      return {
        id: crypto.randomUUID(),
        type: 'pattern',
        title: 'Coğrafi Yoğunlaşma',
        description: `Hak sahiplerinin %${Math.round((cityCount[mostPopulatedCity] / beneficiaries.length) * 100)}'i ${mostPopulatedCity} şehrinde`,
        confidence: 0.8,
        severity: 'medium',
        data: { cityCount, mostPopulatedCity },
        timestamp: new Date(),
        category: 'beneficiaries',
        actionable: true,
        action: 'Diğer şehirlerde kampanya başlat'
      }
    }
    
    return null
  }

  private analyzeBeneficiaryStatus(beneficiaries: any[]): any {
    const statusCount: Record<string, number> = {}
    
    beneficiaries.forEach(beneficiary => {
      const status = beneficiary.status || 'unknown'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    
    return {
      statusCount,
      pendingCount: statusCount['pending'] || 0,
      approvedCount: statusCount['approved'] || 0,
      rejectedCount: statusCount['rejected'] || 0
    }
  }

  private analyzeTaskPriorities(tasks: any[]): any {
    const priorityCount: Record<string, number> = {}
    
    tasks.forEach(task => {
      const priority = task.priority || 'medium'
      priorityCount[priority] = (priorityCount[priority] || 0) + 1
    })
    
    return {
      priorityCount,
      highPriorityCount: priorityCount['high'] || 0,
      mediumPriorityCount: priorityCount['medium'] || 0,
      lowPriorityCount: priorityCount['low'] || 0
    }
  }

  private analyzeMeetingAttendance(meetings: any[]): any {
    const lowAttendanceMeetings = meetings.filter(m => 
      m.attendance_rate && m.attendance_rate < 0.5
    )
    
    return {
      totalMeetings: meetings.length,
      lowAttendanceMeetings: lowAttendanceMeetings,
      averageAttendance: meetings.reduce((sum, m) => sum + (m.attendance_rate || 0), 0) / meetings.length
    }
  }

  private async getSystemPerformanceData(): Promise<any> {
    // Mock performance data - in real implementation, this would come from monitoring system
    return {
      avgResponseTime: 1500,
      errorRate: 0.02,
      activeUsers: 25,
      cpuUsage: 45,
      memoryUsage: 60
    }
  }

  private async analyzeDonationBeneficiaryCorrelation(): Promise<DataInsight | null> {
    // Mock correlation analysis
    return {
      id: crypto.randomUUID(),
      type: 'pattern',
      title: 'Bağış-Hak Sahibi Korelasyonu',
      description: 'Bağış artışı ile hak sahibi artışı arasında güçlü korelasyon tespit edildi',
      confidence: 0.75,
      severity: 'low',
      data: { correlation: 0.82 },
      timestamp: new Date(),
      category: 'cross-module',
      actionable: true,
      action: 'Korelasyon analizini detaylandır'
    }
  }

  private async analyzeWorkflowEfficiency(): Promise<DataInsight | null> {
    // Mock workflow analysis
    return {
      id: crypto.randomUUID(),
      type: 'recommendation',
      title: 'İş Akışı Optimizasyonu',
      description: 'Görev tamamlama sürelerini %20 azaltmak için iş akışı optimizasyonu önerilir',
      confidence: 0.7,
      severity: 'medium',
      data: { potentialImprovement: 0.2 },
      timestamp: new Date(),
      category: 'cross-module',
      actionable: true,
      action: 'İş akışı analizi yap'
    }
  }

  private async analyzeResourceAllocation(): Promise<DataInsight | null> {
    // Mock resource analysis
    return {
      id: crypto.randomUUID(),
      type: 'recommendation',
      title: 'Kaynak Dağılımı Optimizasyonu',
      description: 'Yüksek öncelikli görevlere daha fazla kaynak ayrılması önerilir',
      confidence: 0.65,
      severity: 'low',
      data: { resourceUtilization: 0.75 },
      timestamp: new Date(),
      category: 'cross-module',
      actionable: true,
      action: 'Kaynak dağılımını gözden geçir'
    }
  }

  private async predictDonations(): Promise<Prediction[]> {
    // Mock donation predictions
    return [{
      id: crypto.randomUUID(),
      modelId: 'donation-prediction-v1',
      target: 'monthly_donations',
      predictedValue: 150000,
      confidence: 0.8,
      timestamp: new Date()
    }]
  }

  private async predictBeneficiaryGrowth(): Promise<Prediction[]> {
    // Mock beneficiary growth predictions
    return [{
      id: crypto.randomUUID(),
      modelId: 'beneficiary-growth-v1',
      target: 'monthly_new_beneficiaries',
      predictedValue: 45,
      confidence: 0.75,
      timestamp: new Date()
    }]
  }

  private async predictTaskCompletion(): Promise<Prediction[]> {
    // Mock task completion predictions
    return [{
      id: crypto.randomUUID(),
      modelId: 'task-completion-v1',
      target: 'weekly_completion_rate',
      predictedValue: 0.85,
      confidence: 0.7,
      timestamp: new Date()
    }]
  }

  private async predictSystemLoad(): Promise<Prediction[]> {
    // Mock system load predictions
    return [{
      id: crypto.randomUUID(),
      modelId: 'system-load-v1',
      target: 'peak_hour_load',
      predictedValue: 0.78,
      confidence: 0.8,
      timestamp: new Date()
    }]
  }

  private async monitorActiveUsers(): Promise<AnomalyDetection | null> {
    // Mock active users monitoring
    const currentUsers = 25
    const expectedRange: [number, number] = [10, 50]
    
    if (currentUsers < expectedRange[0] || currentUsers > expectedRange[1]) {
      return {
        id: crypto.randomUUID(),
        metric: 'active_users',
        value: currentUsers,
        expectedRange,
        severity: currentUsers < expectedRange[0] ? 'medium' : 'high',
        description: `Aktif kullanıcı sayısı beklenen aralığın dışında: ${currentUsers}`,
        timestamp: new Date(),
        resolved: false
      }
    }
    
    return null
  }

  private async monitorSystemResources(): Promise<AnomalyDetection | null> {
    // Mock system resources monitoring
    const cpuUsage = 75
    const expectedRange: [number, number] = [0, 80]
    
    if (cpuUsage > expectedRange[1]) {
      return {
        id: crypto.randomUUID(),
        metric: 'cpu_usage',
        value: cpuUsage,
        expectedRange,
        severity: 'high',
        description: `CPU kullanımı yüksek: %${cpuUsage}`,
        timestamp: new Date(),
        resolved: false
      }
    }
    
    return null
  }

  private async monitorDatabasePerformance(): Promise<AnomalyDetection | null> {
    // Mock database performance monitoring
    const queryTime = 1200
    const expectedRange: [number, number] = [0, 1000]
    
    if (queryTime > expectedRange[1]) {
      return {
        id: crypto.randomUUID(),
        metric: 'query_response_time',
        value: queryTime,
        expectedRange,
        severity: 'medium',
        description: `Veritabanı sorgu süresi yavaş: ${queryTime}ms`,
        timestamp: new Date(),
        resolved: false
      }
    }
    
    return null
  }

  // Database operations
  private async storeInsights(insights: DataInsight[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_data_insights')
        .insert(insights.map(insight => ({
          ...insight,
          timestamp: insight.timestamp.toISOString()
        })))

      if (error) throw error
    } catch (error) {
      logSystemError('Store Insights Error', error)
    }
  }
}

export const enhancedDataAnalysis = EnhancedDataAnalysis.getInstance()
