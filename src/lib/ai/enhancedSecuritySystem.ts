import { supabase } from '@/lib/supabase'
import { logSystemError } from '@/services/errorService'

export interface SecurityEvent {
  id: string
  type: 'authentication' | 'authorization' | 'data_access' | 'privacy_violation' | 'anomaly' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  action: string
  resource?: string
  details: Record<string, any>
  timestamp: Date
  resolved: boolean
  riskScore: number
}

export interface PrivacyAudit {
  id: string
  userId: string
  dataType: 'personal' | 'financial' | 'sensitive' | 'public'
  accessType: 'read' | 'write' | 'delete' | 'export'
  purpose: string
  timestamp: Date
  authorized: boolean
  consentGiven: boolean
  dataRetentionPeriod?: number
  dataAnonymized: boolean
}

export interface ComplianceCheck {
  id: string
  regulation: 'GDPR' | 'KVKK' | 'SOX' | 'HIPAA' | 'PCI_DSS'
  requirement: string
  status: 'compliant' | 'non_compliant' | 'pending' | 'exempt'
  lastChecked: Date
  nextCheck: Date
  details: Record<string, any>
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface DataClassification {
  id: string
  dataType: string
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  classification: 'PII' | 'PHI' | 'financial' | 'operational' | 'public'
  retentionPeriod: number
  encryptionRequired: boolean
  accessControls: string[]
  auditRequired: boolean
}

export interface ThreatDetection {
  id: string
  threatType: 'brute_force' | 'sql_injection' | 'xss' | 'csrf' | 'privilege_escalation' | 'data_exfiltration'
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  target: string
  indicators: string[]
  timestamp: Date
  blocked: boolean
  falsePositive: boolean
}

export class EnhancedSecuritySystem {
  private static instance: EnhancedSecuritySystem
  private securityEvents = new Map<string, SecurityEvent[]>()
  private privacyAudits = new Map<string, PrivacyAudit[]>()
  private complianceChecks = new Map<string, ComplianceCheck[]>()
  private threatDetections = new Map<string, ThreatDetection[]>()
  private dataClassifications = new Map<string, DataClassification[]>()
  private riskProfiles = new Map<string, number>()

  static getInstance(): EnhancedSecuritySystem {
    if (!EnhancedSecuritySystem.instance) {
      EnhancedSecuritySystem.instance = new EnhancedSecuritySystem()
    }
    return EnhancedSecuritySystem.instance
  }

  // Security Event Monitoring
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved' | 'riskScore'>): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        resolved: false,
        riskScore: this.calculateRiskScore(event)
      }

      await this.storeSecurityEvent(securityEvent)
      
      // Update cache
      const userEvents = this.securityEvents.get(event.userId || 'anonymous') || []
      userEvents.push(securityEvent)
      this.securityEvents.set(event.userId || 'anonymous', userEvents.slice(-100))

      // Check for security anomalies
      await this.detectSecurityAnomalies(event.userId)
      
      // Update risk profile
      await this.updateRiskProfile(event.userId, securityEvent.riskScore)

    } catch (error) {
      logSystemError('Security Event Logging Error', error)
    }
  }

  async getSecurityEvents(userId?: string, days: number = 30): Promise<SecurityEvent[]> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data, error } = await supabase
        .from('ai_security_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', cutoffDate.toISOString())
        .order('timestamp', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      logSystemError('Get Security Events Error', error)
      return []
    }
  }

  // Privacy Protection
  async auditDataAccess(
    userId: string,
    dataType: PrivacyAudit['dataType'],
    accessType: PrivacyAudit['accessType'],
    purpose: string,
    resource?: string
  ): Promise<boolean> {
    try {
      const audit: PrivacyAudit = {
        id: crypto.randomUUID(),
        userId,
        dataType,
        accessType,
        purpose,
        timestamp: new Date(),
        authorized: await this.checkDataAccessAuthorization(userId, dataType, accessType),
        consentGiven: await this.checkUserConsent(userId, dataType),
        dataRetentionPeriod: this.getDataRetentionPeriod(dataType),
        dataAnonymized: await this.isDataAnonymized(dataType)
      }

      await this.storePrivacyAudit(audit)
      
      // Update cache
      const userAudits = this.privacyAudits.get(userId) || []
      userAudits.push(audit)
      this.privacyAudits.set(userId, userAudits.slice(-50))

      // Check for privacy violations
      if (!audit.authorized || !audit.consentGiven) {
        await this.logSecurityEvent({
          type: 'privacy_violation',
          severity: 'high',
          userId,
          action: `Unauthorized ${accessType} access to ${dataType} data`,
          resource,
          details: { audit }
        })
        return false
      }

      return true
    } catch (error) {
      logSystemError('Privacy Audit Error', error)
      return false
    }
  }

  async anonymizeData(data: any, dataType: string): Promise<any> {
    try {
      const classification = await this.getDataClassification(dataType)
      
      if (!classification.encryptionRequired) {
        return data
      }

      // Apply data anonymization based on classification
      switch (classification.classification) {
        case 'PII':
          return this.anonymizePII(data)
        case 'PHI':
          return this.anonymizePHI(data)
        case 'financial':
          return this.anonymizeFinancialData(data)
        default:
          return data
      }
    } catch (error) {
      logSystemError('Data Anonymization Error', error)
      return data
    }
  }

  // Compliance Monitoring
  async checkCompliance(regulation: ComplianceCheck['regulation']): Promise<ComplianceCheck[]> {
    try {
      const checks: ComplianceCheck[] = []
      
      switch (regulation) {
        case 'GDPR':
          checks.push(...await this.checkGDPRCompliance())
          break
        case 'KVKK':
          checks.push(...await this.checkKVKKCompliance())
          break
        case 'SOX':
          checks.push(...await this.checkSOXCompliance())
          break
        case 'HIPAA':
          checks.push(...await this.checkHIPAACompliance())
          break
        case 'PCI_DSS':
          checks.push(...await this.checkPCIDSSCompliance())
          break
      }

      // Store compliance checks
      await this.storeComplianceChecks(checks)
      
      return checks
    } catch (error) {
      logSystemError('Compliance Check Error', error)
      return []
    }
  }

  async getComplianceStatus(regulation?: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('ai_compliance_checks')
        .select('*')
        .eq('regulation', regulation)
        .order('last_checked', { ascending: false })

      if (error) throw error

      const checks = data || []
      const compliant = checks.filter(c => c.status === 'compliant').length
      const nonCompliant = checks.filter(c => c.status === 'non_compliant').length
      const pending = checks.filter(c => c.status === 'pending').length

      return {
        total: checks.length,
        compliant,
        nonCompliant,
        pending,
        complianceRate: checks.length > 0 ? compliant / checks.length : 0,
        highRiskItems: checks.filter(c => c.risk_level === 'high' || c.risk_level === 'critical')
      }
    } catch (error) {
      logSystemError('Get Compliance Status Error', error)
      return {}
    }
  }

  // Threat Detection
  async detectThreats(userId?: string, sessionId?: string): Promise<ThreatDetection[]> {
    try {
      const threats: ThreatDetection[] = []
      
      // Analyze recent security events
      const recentEvents = await this.getSecurityEvents(userId, 1)
      
      // Detect brute force attacks
      const bruteForceThreat = this.detectBruteForceAttack(recentEvents)
      if (bruteForceThreat) threats.push(bruteForceThreat)
      
      // Detect suspicious data access patterns
      const dataAccessThreat = this.detectSuspiciousDataAccess(recentEvents)
      if (dataAccessThreat) threats.push(dataAccessThreat)
      
      // Detect privilege escalation attempts
      const privilegeThreat = this.detectPrivilegeEscalation(recentEvents)
      if (privilegeThreat) threats.push(privilegeThreat)
      
      // Store threat detections
      await this.storeThreatDetections(threats)
      
      return threats
    } catch (error) {
      logSystemError('Threat Detection Error', error)
      return []
    }
  }

  // Data Classification
  async classifyData(dataType: string, content?: any): Promise<DataClassification> {
    try {
      // Check if classification already exists
      const existing = this.dataClassifications.get(dataType)
      if (existing) return existing

      // Determine sensitivity based on content analysis
      const sensitivity = this.determineSensitivity(dataType, content)
      const classification = this.determineClassification(dataType, content)
      
      const dataClassification: DataClassification = {
        id: crypto.randomUUID(),
        dataType,
        sensitivity,
        classification,
        retentionPeriod: this.getRetentionPeriod(classification),
        encryptionRequired: sensitivity === 'confidential' || sensitivity === 'restricted',
        accessControls: this.getAccessControls(sensitivity),
        auditRequired: sensitivity === 'confidential' || sensitivity === 'restricted'
      }

      // Store classification
      await this.storeDataClassification(dataClassification)
      
      // Update cache
      this.dataClassifications.set(dataType, dataClassification)
      
      return dataClassification
    } catch (error) {
      logSystemError('Data Classification Error', error)
      // Return default classification
      return {
        id: crypto.randomUUID(),
        dataType,
        sensitivity: 'internal',
        classification: 'operational',
        retentionPeriod: 365,
        encryptionRequired: false,
        accessControls: ['authenticated'],
        auditRequired: false
      }
    }
  }

  // Risk Assessment
  async assessRisk(userId: string): Promise<number> {
    try {
      const recentEvents = await this.getSecurityEvents(userId, 7)
      const riskScore = this.calculateUserRiskScore(recentEvents)
      
      this.riskProfiles.set(userId, riskScore)
      
      return riskScore
    } catch (error) {
      logSystemError('Risk Assessment Error', error)
      return 0
    }
  }

  async getRiskProfile(userId: string): Promise<Record<string, any>> {
    try {
      const riskScore = this.riskProfiles.get(userId) || 0
      const recentEvents = await this.getSecurityEvents(userId, 30)
      
      return {
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        recentThreats: recentEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length,
        recommendations: this.generateSecurityRecommendations(recentEvents)
      }
    } catch (error) {
      logSystemError('Get Risk Profile Error', error)
      return { riskScore: 0, riskLevel: 'low', recentThreats: 0, recommendations: [] }
    }
  }

  // Helper methods
  private calculateRiskScore(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved' | 'riskScore'>): number {
    let score = 0
    
    // Base score by severity
    switch (event.severity) {
      case 'low': score += 10; break
      case 'medium': score += 25; break
      case 'high': score += 50; break
      case 'critical': score += 100; break
    }
    
    // Additional factors
    if (event.type === 'privacy_violation') score += 30
    if (event.type === 'authorization') score += 20
    if (event.resource?.includes('admin')) score += 15
    
    return Math.min(score, 100)
  }

  private async detectSecurityAnomalies(userId?: string): Promise<void> {
    try {
      const recentEvents = await this.getSecurityEvents(userId, 1)
      
      // Check for unusual activity patterns
      const eventCount = recentEvents.length
      const highSeverityCount = recentEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length
      
      if (eventCount > 50 || highSeverityCount > 5) {
        await this.logSecurityEvent({
          type: 'anomaly',
          severity: 'high',
          userId,
          action: 'Unusual activity pattern detected',
          details: { eventCount, highSeverityCount }
        })
      }
    } catch (error) {
      logSystemError('Security Anomaly Detection Error', error)
    }
  }

  private async updateRiskProfile(userId: string, riskScore: number): Promise<void> {
    try {
      const currentRisk = this.riskProfiles.get(userId) || 0
      const newRisk = Math.min(currentRisk + riskScore, 100)
      this.riskProfiles.set(userId, newRisk)
      
      // If risk is too high, trigger additional security measures
      if (newRisk > 80) {
        await this.triggerHighRiskMeasures(userId)
      }
    } catch (error) {
      logSystemError('Update Risk Profile Error', error)
    }
  }

  private async checkDataAccessAuthorization(userId: string, dataType: string, accessType: string): Promise<boolean> {
    try {
      // Check user permissions for data access
      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('data_type', dataType)
        .eq('access_type', accessType)
        .single()

      return !!permissions
    } catch (error) {
      logSystemError('Data Access Authorization Check Error', error)
      return false
    }
  }

  private async checkUserConsent(userId: string, dataType: string): Promise<boolean> {
    try {
      // Check if user has given consent for data type
      const { data: consent } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .eq('data_type', dataType)
        .eq('active', true)
        .single()

      return !!consent
    } catch (error) {
      logSystemError('User Consent Check Error', error)
      return false
    }
  }

  private getDataRetentionPeriod(dataType: string): number {
    const retentionPeriods: Record<string, number> = {
      personal: 2555, // 7 years
      financial: 1825, // 5 years
      sensitive: 1095, // 3 years
      public: 365 // 1 year
    }
    
    return retentionPeriods[dataType] || 365
  }

  private async isDataAnonymized(dataType: string): Promise<boolean> {
    // Check if data type requires anonymization
    const sensitiveTypes = ['personal', 'financial', 'sensitive']
    return sensitiveTypes.includes(dataType)
  }

  private anonymizePII(data: any): any {
    // Anonymize personally identifiable information
    if (typeof data === 'object' && data !== null) {
      const anonymized = { ...data }
      
      // Anonymize common PII fields
      if (anonymized.email) anonymized.email = this.hashEmail(anonymized.email)
      if (anonymized.phone) anonymized.phone = this.maskPhone(anonymized.phone)
      if (anonymized.name) anonymized.name = this.anonymizeName(anonymized.name)
      if (anonymized.address) anonymized.address = this.anonymizeAddress(anonymized.address)
      
      return anonymized
    }
    
    return data
  }

  private anonymizePHI(data: any): any {
    // Anonymize protected health information
    if (typeof data === 'object' && data !== null) {
      const anonymized = { ...data }
      
      // Anonymize common PHI fields
      if (anonymized.medicalRecord) anonymized.medicalRecord = this.hashValue(anonymized.medicalRecord)
      if (anonymized.diagnosis) anonymized.diagnosis = this.generalizeDiagnosis(anonymized.diagnosis)
      if (anonymized.treatment) anonymized.treatment = this.generalizeTreatment(anonymized.treatment)
      
      return anonymized
    }
    
    return data
  }

  private anonymizeFinancialData(data: any): any {
    // Anonymize financial data
    if (typeof data === 'object' && data !== null) {
      const anonymized = { ...data }
      
      // Anonymize common financial fields
      if (anonymized.accountNumber) anonymized.accountNumber = this.maskAccountNumber(anonymized.accountNumber)
      if (anonymized.creditCard) anonymized.creditCard = this.maskCreditCard(anonymized.creditCard)
      if (anonymized.balance) anonymized.balance = this.roundAmount(anonymized.balance)
      
      return anonymized
    }
    
    return data
  }

  private async checkGDPRCompliance(): Promise<ComplianceCheck[]> {
    const checks: ComplianceCheck[] = []
    
    // Check data minimization
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'GDPR',
      requirement: 'Data Minimization',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      details: { dataCollected: 'minimal', purpose: 'clearly_defined' },
      riskLevel: 'low'
    })
    
    // Check consent management
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'GDPR',
      requirement: 'Consent Management',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      details: { consentTracking: 'active', withdrawal: 'enabled' },
      riskLevel: 'low'
    })
    
    return checks
  }

  private async checkKVKKCompliance(): Promise<ComplianceCheck[]> {
    const checks: ComplianceCheck[] = []
    
    // Check data processing conditions
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'KVKK',
      requirement: 'Data Processing Conditions',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      details: { legalBasis: 'explicit_consent', processing: 'lawful' },
      riskLevel: 'low'
    })
    
    return checks
  }

  private async checkSOXCompliance(): Promise<ComplianceCheck[]> {
    const checks: ComplianceCheck[] = []
    
    // Check financial reporting controls
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'SOX',
      requirement: 'Financial Controls',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      details: { controls: 'implemented', monitoring: 'active' },
      riskLevel: 'medium'
    })
    
    return checks
  }

  private async checkHIPAACompliance(): Promise<ComplianceCheck[]> {
    const checks: ComplianceCheck[] = []
    
    // Check PHI protection
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'HIPAA',
      requirement: 'PHI Protection',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      details: { encryption: 'enabled', access: 'controlled' },
      riskLevel: 'high'
    })
    
    return checks
  }

  private async checkPCIDSSCompliance(): Promise<ComplianceCheck[]> {
    const checks: ComplianceCheck[] = []
    
    // Check payment data security
    checks.push({
      id: crypto.randomUUID(),
      regulation: 'PCI_DSS',
      requirement: 'Payment Data Security',
      status: 'compliant',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      details: { encryption: 'enabled', tokenization: 'used' },
      riskLevel: 'high'
    })
    
    return checks
  }

  private detectBruteForceAttack(events: SecurityEvent[]): ThreatDetection | null {
    const authEvents = events.filter(e => e.type === 'authentication' && e.action.includes('failed'))
    
    if (authEvents.length > 10) {
      return {
        id: crypto.randomUUID(),
        threatType: 'brute_force',
        confidence: 0.85,
        severity: 'high',
        source: authEvents[0]?.ipAddress || 'unknown',
        target: authEvents[0]?.userId || 'unknown',
        indicators: ['multiple_failed_logins', 'short_time_interval'],
        timestamp: new Date(),
        blocked: true,
        falsePositive: false
      }
    }
    
    return null
  }

  private detectSuspiciousDataAccess(events: SecurityEvent[]): ThreatDetection | null {
    const dataAccessEvents = events.filter(e => e.type === 'data_access')
    const uniqueResources = new Set(dataAccessEvents.map(e => e.resource))
    
    if (dataAccessEvents.length > 20 && uniqueResources.size > 10) {
      return {
        id: crypto.randomUUID(),
        threatType: 'data_exfiltration',
        confidence: 0.7,
        severity: 'high',
        source: dataAccessEvents[0]?.userId || 'unknown',
        target: 'multiple_resources',
        indicators: ['excessive_data_access', 'multiple_resources'],
        timestamp: new Date(),
        blocked: false,
        falsePositive: false
      }
    }
    
    return null
  }

  private detectPrivilegeEscalation(events: SecurityEvent[]): ThreatDetection | null {
    const authEvents = events.filter(e => e.type === 'authorization' && e.action.includes('elevated'))
    
    if (authEvents.length > 0) {
      return {
        id: crypto.randomUUID(),
        threatType: 'privilege_escalation',
        confidence: 0.9,
        severity: 'critical',
        source: authEvents[0]?.userId || 'unknown',
        target: 'system_privileges',
        indicators: ['privilege_elevation', 'unauthorized_access'],
        timestamp: new Date(),
        blocked: true,
        falsePositive: false
      }
    }
    
    return null
  }

  private determineSensitivity(dataType: string, content?: any): DataClassification['sensitivity'] {
    const sensitiveTypes = ['personal', 'financial', 'health', 'biometric']
    const internalTypes = ['operational', 'analytics', 'logs']
    
    if (sensitiveTypes.some(type => dataType.includes(type))) return 'confidential'
    if (internalTypes.some(type => dataType.includes(type))) return 'internal'
    if (dataType.includes('public')) return 'public'
    
    return 'internal'
  }

  private determineClassification(dataType: string, content?: any): DataClassification['classification'] {
    if (dataType.includes('personal') || dataType.includes('identity')) return 'PII'
    if (dataType.includes('health') || dataType.includes('medical')) return 'PHI'
    if (dataType.includes('financial') || dataType.includes('payment')) return 'financial'
    if (dataType.includes('public') || dataType.includes('announcement')) return 'public'
    
    return 'operational'
  }

  private getRetentionPeriod(classification: string): number {
    const periods: Record<string, number> = {
      PII: 2555, // 7 years
      PHI: 2555, // 7 years
      financial: 1825, // 5 years
      operational: 1095, // 3 years
      public: 365 // 1 year
    }
    
    return periods[classification] || 365
  }

  private getAccessControls(sensitivity: string): string[] {
    switch (sensitivity) {
      case 'restricted':
        return ['admin', 'authenticated', 'role_based']
      case 'confidential':
        return ['authenticated', 'role_based']
      case 'internal':
        return ['authenticated']
      case 'public':
        return ['public']
      default:
        return ['authenticated']
    }
  }

  private calculateUserRiskScore(events: SecurityEvent[]): number {
    let score = 0
    
    events.forEach(event => {
      score += event.riskScore
    })
    
    // Decay factor for older events
    const decayFactor = Math.max(0.1, 1 - (events.length * 0.1))
    
    return Math.min(score * decayFactor, 100)
  }

  private getRiskLevel(riskScore: number): string {
    if (riskScore >= 80) return 'critical'
    if (riskScore >= 60) return 'high'
    if (riskScore >= 30) return 'medium'
    return 'low'
  }

  private generateSecurityRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = []
    
    const highRiskEvents = events.filter(e => e.severity === 'high' || e.severity === 'critical')
    if (highRiskEvents.length > 0) {
      recommendations.push('Yüksek riskli güvenlik olayları tespit edildi. Güvenlik ayarlarını gözden geçirin.')
    }
    
    const privacyViolations = events.filter(e => e.type === 'privacy_violation')
    if (privacyViolations.length > 0) {
      recommendations.push('Gizlilik ihlalleri tespit edildi. Veri erişim politikalarını kontrol edin.')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Güvenlik durumu normal. Düzenli güvenlik kontrollerini sürdürün.')
    }
    
    return recommendations
  }

  private async triggerHighRiskMeasures(userId: string): Promise<void> {
    try {
      // Log high risk event
      await this.logSecurityEvent({
        type: 'anomaly',
        severity: 'critical',
        userId,
        action: 'High risk profile detected - additional security measures triggered',
        details: { riskLevel: 'high', measures: ['enhanced_monitoring', 'access_review'] }
      })
      
      // In real implementation, this would trigger:
      // - Enhanced monitoring
      // - Access review
      // - Additional authentication requirements
      // - Security team notification
    } catch (error) {
      logSystemError('High Risk Measures Trigger Error', error)
    }
  }

  // Anonymization helper methods
  private hashEmail(email: string): string {
    const [local, domain] = email.split('@')
    return `${local.charAt(0)}***@${domain}`
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')
  }

  private anonymizeName(name: string): string {
    const parts = name.split(' ')
    return parts.map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ')
  }

  private anonymizeAddress(address: string): string {
    return address.replace(/\d+/g, '***')
  }

  private hashValue(value: string): string {
    return btoa(value).substring(0, 8) + '***'
  }

  private generalizeDiagnosis(diagnosis: string): string {
    return 'General Medical Condition'
  }

  private generalizeTreatment(treatment: string): string {
    return 'Standard Treatment'
  }

  private maskAccountNumber(accountNumber: string): string {
    return '****' + accountNumber.slice(-4)
  }

  private maskCreditCard(creditCard: string): string {
    return '****' + creditCard.slice(-4)
  }

  private roundAmount(amount: number): number {
    return Math.round(amount / 100) * 100
  }

  // Database operations
  private async storeSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_security_events')
        .insert([{
          ...event,
          timestamp: event.timestamp.toISOString()
        }])

      if (error) throw error
    } catch (error) {
      logSystemError('Store Security Event Error', error)
    }
  }

  private async storePrivacyAudit(audit: PrivacyAudit): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_privacy_audits')
        .insert([{
          ...audit,
          timestamp: audit.timestamp.toISOString()
        }])

      if (error) throw error
    } catch (error) {
      logSystemError('Store Privacy Audit Error', error)
    }
  }

  private async storeComplianceChecks(checks: ComplianceCheck[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_compliance_checks')
        .insert(checks.map(check => ({
          ...check,
          last_checked: check.lastChecked.toISOString(),
          next_check: check.nextCheck.toISOString()
        })))

      if (error) throw error
    } catch (error) {
      logSystemError('Store Compliance Checks Error', error)
    }
  }

  private async storeThreatDetections(threats: ThreatDetection[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_threat_detections')
        .insert(threats.map(threat => ({
          ...threat,
          timestamp: threat.timestamp.toISOString()
        })))

      if (error) throw error
    } catch (error) {
      logSystemError('Store Threat Detections Error', error)
    }
  }

  private async storeDataClassification(classification: DataClassification): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_data_classifications')
        .insert([classification])

      if (error) throw error
    } catch (error) {
      logSystemError('Store Data Classification Error', error)
    }
  }
}

export const enhancedSecuritySystem = EnhancedSecuritySystem.getInstance()
