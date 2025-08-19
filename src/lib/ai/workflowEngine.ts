import { toast } from 'sonner'
import { moduleController } from './moduleController'
// import { nlpProcessor } from './nlpProcessor' // Şu an kullanılmıyor
import { createCommandProcessor } from './commandProcessor'
import type { ProcessedCommand, CommandResult } from './commandProcessor'
import type { ActionContext } from './actions'
import { logSystemError } from '../../services/errorService'

export type WorkflowStep = {
  id: string
  name: string
  action: string
  module?: string
  parameters?: any
  conditions?: any
  dependencies?: string[]
  timeout?: number
  retryCount?: number
  onSuccess?: WorkflowStep[]
  onError?: WorkflowStep[]
}

export type WorkflowExecution = {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  steps: WorkflowStep[]
  currentStep?: string
  results: Record<string, any>
  errors: string[]
  startTime: Date
  endTime?: Date
  context: any
}

export type AutomationRule = {
  id: string
  name: string
  description: string
  trigger: {
    type: 'command' | 'schedule' | 'event' | 'condition'
    pattern?: string
    schedule?: string
    event?: string
    condition?: string
  }
  workflow: WorkflowStep[]
  active: boolean
  lastRun?: Date
  runCount: number
}

export class WorkflowEngine {
  private executions = new Map<string, WorkflowExecution>()
  private automationRules: AutomationRule[] = []
  private isRunning = false

  constructor() {
    this.initializeAutomationRules()
    this.startEngine()
  }

  private initializeAutomationRules() {
    // Önceden tanımlanmış automation kuralları
    this.automationRules = [
      {
        id: 'welcome-new-beneficiary',
        name: 'Yeni Hak Sahibi Karşılama',
        description: 'Yeni hak sahibi eklendiğinde otomatik karşılama mesajı gönder',
        trigger: {
          type: 'event',
          event: 'beneficiary.created'
        },
        workflow: [
          {
            id: 'send-welcome-sms',
            name: 'Karşılama SMS Gönder',
            action: 'sendMessage',
            module: 'messages',
            parameters: {
              type: 'sms',
              template: 'welcome_beneficiary'
            }
          }
        ],
        active: true,
        runCount: 0
      },
      {
        id: 'daily-report',
        name: 'Günlük Rapor',
        description: 'Her gün saat 18:00\'da günlük özet raporu oluştur',
        trigger: {
          type: 'schedule',
          schedule: '0 18 * * *' // Cron expression
        },
        workflow: [
          {
            id: 'generate-daily-stats',
            name: 'Günlük İstatistikler',
            action: 'getStatistics',
            module: 'system'
          },
          {
            id: 'send-daily-report',
            name: 'Rapor Gönder',
            action: 'sendReport',
            module: 'messages',
            dependencies: ['generate-daily-stats']
          }
        ],
        active: true,
        runCount: 0
      },
      {
        id: 'overdue-tasks-reminder',
        name: 'Geciken Görev Hatırlatması',
        description: 'Süresi geçen görevler için hatırlatma gönder',
        trigger: {
          type: 'schedule',
          schedule: '0 9 * * *' // Her gün saat 09:00
        },
        workflow: [
          {
            id: 'find-overdue-tasks',
            name: 'Geciken Görevleri Bul',
            action: 'list',
            module: 'tasks',
            conditions: {
              status: 'pending',
              overdue: true
            }
          },
          {
            id: 'notify-assignees',
            name: 'Sorumluları Bilgilendir',
            action: 'notifyAssignees',
            module: 'tasks',
            dependencies: ['find-overdue-tasks']
          }
        ],
        active: true,
        runCount: 0
      }
    ]
  }

  async executeCommand(
    command: string, 
    context: ActionContext,
    userId?: string
  ): Promise<CommandResult> {
    try {
      toast.loading('Komut işleniyor...', { id: 'command-processing' })

      // 1. NLP ile komut analizi yapılabilir (şu an devre dışı)
      
      // 2. Komut işleme
      const processor = createCommandProcessor({ userId })
      const processedCommand = await processor.processCommand(command)
      
      // 3. Confidence kontrolü
      if (processedCommand.confidence < 0.6) {
        toast.dismiss('command-processing')
        return {
          success: false,
          message: 'Komut anlaşılamadı. Lütfen daha açık bir şekilde belirtin.',
          suggestions: [
            'Örnek: "Hak sahibi listele"',
            'Örnek: "Yeni bağış ekle: 1000 TL"',
            'Örnek: "Ahmet Yılmaz için belge yükle"'
          ]
        }
      }

      // 4. Basit komut mu yoksa workflow gerektiriyor mu?
      if (this.isSimpleCommand(processedCommand)) {
        const result = await this.executeSimpleCommand(processedCommand, context)
        toast.dismiss('command-processing')
        
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
        
        return result
      } else {
        // 5. Karmaşık komut - workflow oluştur ve çalıştır
        const workflow = await this.createWorkflow(processedCommand)
        const execution = await this.executeWorkflow(workflow, context, userId)
        
        toast.dismiss('command-processing')
        toast.loading(`Workflow başlatıldı: ${workflow.name}`, { id: `workflow-${execution.id}` })
        
        return {
          success: true,
          message: `Workflow başlatıldı: ${workflow.name}`,
          data: { executionId: execution.id },
          nextSteps: [`Workflow durumunu takip edebilirsiniz: ${execution.id}`]
        }
      }

    } catch (error: any) {
      toast.dismiss('command-processing')
      toast.error(`Hata: ${error.message}`)
      
      return {
        success: false,
        message: `Komut yürütülürken hata oluştu: ${error.message}`,
        suggestions: ['Lütfen komutu kontrol edip tekrar deneyin']
      }
    }
  }

  private isSimpleCommand(command: ProcessedCommand): boolean {
    // Basit komutlar: tek modül, tek işlem
    const simpleActions = ['list', 'show', 'navigate', 'search']
    return simpleActions.includes(command.action) && 
           !command.parameters.bulk && 
           !command.conditions?.complex
  }

  private async executeSimpleCommand(
    command: ProcessedCommand, 
    context: ActionContext
  ): Promise<CommandResult> {
    // Navigasyon komutları
    if (command.action === 'navigate' || command.intent === 'NAVIGATE') {
      const path = this.getNavigationPath(command)
      context.navigateTo(path)
      return {
        success: true,
        message: `${path} sayfasına yönlendirildi`
      }
    }

    // Modül komutları
    if (command.module) {
      return await moduleController.executeCommand(command)
    }

    // Tema değişimi
    if (command.action.includes('theme')) {
      const theme = command.parameters.theme || 'system'
      context.setTheme(theme as any)
      return {
        success: true,
        message: `Tema ${theme} olarak değiştirildi`
      }
    }

    return {
      success: false,
      message: 'Komut işlenemiyor'
    }
  }

  private async createWorkflow(
    command: ProcessedCommand
  ): Promise<WorkflowExecution> {
    const workflowId = `workflow-${Date.now()}`
    const steps: WorkflowStep[] = []

    // Komuta göre workflow adımları oluştur
    if (command.intent === 'CREATE' && command.module === 'beneficiaries') {
      steps.push(
        {
          id: 'validate-data',
          name: 'Veri Doğrulama',
          action: 'validate',
          module: 'beneficiaries',
          parameters: command.parameters
        },
        {
          id: 'create-beneficiary',
          name: 'Hak Sahibi Oluştur',
          action: 'create',
          module: 'beneficiaries',
          parameters: command.parameters,
          dependencies: ['validate-data']
        },
        {
          id: 'send-welcome-message',
          name: 'Karşılama Mesajı',
          action: 'sendMessage',
          module: 'messages',
          parameters: {
            type: 'sms',
            template: 'welcome'
          },
          dependencies: ['create-beneficiary']
        }
      )
    }

    // Toplu işlemler için workflow
    if (command.parameters.bulk || command.intent === 'AUTOMATE') {
      steps.push(
        {
          id: 'prepare-bulk-operation',
          name: 'Toplu İşlem Hazırlığı',
          action: 'prepareBulk',
          module: command.module,
          parameters: command.parameters
        },
        {
          id: 'execute-bulk-operation',
          name: 'Toplu İşlem Yürütme',
          action: 'executeBulk',
          module: command.module,
          dependencies: ['prepare-bulk-operation']
        },
        {
          id: 'generate-bulk-report',
          name: 'İşlem Raporu',
          action: 'generateReport',
          module: command.module,
          dependencies: ['execute-bulk-operation']
        }
      )
    }

    // Rapor workflow'ları
    if (command.intent === 'REPORT') {
      steps.push(
        {
          id: 'collect-data',
          name: 'Veri Toplama',
          action: 'collectReportData',
          module: command.module,
          parameters: command.parameters
        },
        {
          id: 'process-data',
          name: 'Veri İşleme',
          action: 'processReportData',
          module: command.module,
          dependencies: ['collect-data']
        },
        {
          id: 'generate-report',
          name: 'Rapor Oluşturma',
          action: 'generateReport',
          module: command.module,
          dependencies: ['process-data']
        },
        {
          id: 'export-report',
          name: 'Rapor Dışa Aktarma',
          action: 'exportReport',
          module: command.module,
          dependencies: ['generate-report']
        }
      )
    }

    const execution: WorkflowExecution = {
      id: workflowId,
      name: this.generateWorkflowName(command),
      status: 'pending',
      steps,
      results: {},
      errors: [],
      startTime: new Date(),
      context: { command }
    }

    this.executions.set(workflowId, execution)
    return execution
  }

  private async executeWorkflow(
    workflow: WorkflowExecution, 
    context: ActionContext,
    _userId?: string
  ): Promise<WorkflowExecution> {
    workflow.status = 'running'
    
    try {
      for (const step of workflow.steps) {
        // Dependency kontrolü
        if (step.dependencies) {
          const depResults = step.dependencies.map(dep => workflow.results[dep])
          if (depResults.some(result => !result || result.error)) {
            throw new Error(`Dependency failed for step: ${step.name}`)
          }
        }

        workflow.currentStep = step.id
        
        // Adımı yürüt
        const stepResult = await this.executeWorkflowStep(step, workflow.results, context)
        workflow.results[step.id] = stepResult

        // Hata kontrolü
        if (stepResult.error) {
          workflow.errors.push(`Step ${step.name}: ${stepResult.error}`)
          
          // Error handling adımları varsa çalıştır
          if (step.onError) {
            for (const errorStep of step.onError) {
              await this.executeWorkflowStep(errorStep, workflow.results, context)
            }
          }
          break
        }

        // Success adımları varsa çalıştır
        if (step.onSuccess) {
          for (const successStep of step.onSuccess) {
            await this.executeWorkflowStep(successStep, workflow.results, context)
          }
        }

        // Progress notification
        toast.loading(
          `${step.name} tamamlandı (${workflow.steps.indexOf(step) + 1}/${workflow.steps.length})`,
          { id: `workflow-${workflow.id}` }
        )
      }

      workflow.status = workflow.errors.length > 0 ? 'failed' : 'completed'
      workflow.endTime = new Date()

      if (workflow.status === 'completed') {
        toast.success(`Workflow tamamlandı: ${workflow.name}`, { id: `workflow-${workflow.id}` })
      } else {
        toast.error(`Workflow hatalarla tamamlandı: ${workflow.name}`, { id: `workflow-${workflow.id}` })
      }

    } catch (error: any) {
      workflow.status = 'failed'
      workflow.errors.push(error.message)
      workflow.endTime = new Date()
      
      toast.error(`Workflow başarısız: ${error.message}`, { id: `workflow-${workflow.id}` })
    }

    return workflow
  }

  private async executeWorkflowStep(
    step: WorkflowStep,
    previousResults: Record<string, any>,
    context: ActionContext
  ): Promise<any> {
    try {
      // Timeout ayarla
      const timeout = step.timeout || 30000 // 30 saniye default
      
      return await Promise.race([
        this.executeStepAction(step, previousResults, context),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Step timeout')), timeout)
        )
      ])

    } catch (error: any) {
      // Retry mekanizması
      const retryCount = step.retryCount || 0
      if (retryCount > 0) {
        for (let i = 0; i < retryCount; i++) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
            return await this.executeStepAction(step, previousResults, context)
          } catch (retryError) {
            if (i === retryCount - 1) throw retryError
          }
        }
      }
      
      return { error: error.message }
    }
  }

  private async executeStepAction(
    step: WorkflowStep,
    previousResults: Record<string, any>,
    context: ActionContext
  ): Promise<any> {
    const command: ProcessedCommand = {
      intent: step.action.toUpperCase(),
      confidence: 1.0,
      parameters: step.parameters || {},
      action: step.action,
      module: step.module,
      conditions: step.conditions,
      metadata: {
        workflowStep: step.id,
        previousResults
      }
    }

    if (step.module) {
      return await moduleController.executeCommand(command)
    } else {
      // Sistem komutları
      switch (step.action) {
        case 'navigate':
          context.navigateTo(step.parameters.path)
          return { success: true }
        
        case 'setTheme':
          context.setTheme(step.parameters.theme)
          return { success: true }
        
        case 'delay':
          await new Promise(resolve => setTimeout(resolve, step.parameters.ms || 1000))
          return { success: true }
        
        default:
          throw new Error(`Unknown action: ${step.action}`)
      }
    }
  }

  private generateWorkflowName(command: ProcessedCommand): string {
    const moduleNames: Record<string, string> = {
      beneficiaries: 'Hak Sahibi',
      donations: 'Bağış',
      meetings: 'Toplantı',
      tasks: 'Görev',
      messages: 'Mesaj'
    }

    const actionNames: Record<string, string> = {
      CREATE: 'Oluşturma',
      UPDATE: 'Güncelleme',
      DELETE: 'Silme',
      REPORT: 'Rapor',
      AUTOMATE: 'Otomatik İşlem',
      EXPORT: 'Dışa Aktarma'
    }

    const moduleName = moduleNames[command.module || ''] || command.module
    const actionName = actionNames[command.intent] || command.intent

    return `${actionName} - ${moduleName || 'Sistem'}`
  }

  private getNavigationPath(command: ProcessedCommand): string {
    const pathMap: Record<string, string> = {
      'dashboard': '/',
      'anasayfa': '/',
      'donations': '/donations',
      'bağış': '/donations',
      'beneficiaries': '/aid/beneficiaries',
      'hak sahibi': '/aid/beneficiaries',
      'meetings': '/meetings',
      'toplantı': '/meetings',
      'tasks': '/tasks',
      'görev': '/tasks',
      'messages': '/messages',
      'mesaj': '/messages'
    }

    const target = command.target?.toLowerCase() || ''
    return pathMap[target] || pathMap[command.module || ''] || '/'
  }

  private startEngine() {
    if (this.isRunning) return
    
    this.isRunning = true
    // Periyodik automation kurallarını kontrol et
    setInterval(() => {
      this.checkAutomationRules()
    }, 60000) // Her dakika kontrol et
  }

  private async checkAutomationRules() {
    const now = new Date()
    
    for (const rule of this.automationRules) {
      if (!rule.active) continue
      
      if (rule.trigger.type === 'schedule') {
        // Basit schedule kontrolü (production'da cron library kullanılmalı)
        const shouldRun = this.shouldRunScheduledRule(rule, now)
        if (shouldRun) {
          await this.executeAutomationRule(rule)
        }
      }
    }
  }

  private shouldRunScheduledRule(rule: AutomationRule, now: Date): boolean {
    if (!rule.lastRun) return true
    
    // Günlük çalışan kurallar için basit kontrol
    if (rule.trigger.schedule?.includes('* * *')) {
      const lastRunDate = new Date(rule.lastRun).toDateString()
      const nowDate = now.toDateString()
      return lastRunDate !== nowDate
    }
    
    return false
  }

  private async executeAutomationRule(rule: AutomationRule) {
    try {
      const workflow: WorkflowExecution = {
        id: `auto-${rule.id}-${Date.now()}`,
        name: `Auto: ${rule.name}`,
        status: 'pending',
        steps: rule.workflow,
        results: {},
        errors: [],
        startTime: new Date(),
        context: { automationRule: rule }
      }

      await this.executeWorkflow(workflow, {} as ActionContext)
      
      rule.lastRun = new Date()
      rule.runCount++
      
    } catch (error: any) {
      logSystemError(error as Error, {
        component: 'WorkflowEngine',
        action: 'executeAutomationRule',
        additionalData: { ruleName: rule.name }
      })
    }
  }

  // Public methods
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id)
  }

  getActiveExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter(
      exec => exec.status === 'running' || exec.status === 'pending'
    )
  }

  getAutomationRules(): AutomationRule[] {
    return this.automationRules
  }

  addAutomationRule(rule: AutomationRule) {
    this.automationRules.push(rule)
  }

  updateAutomationRule(id: string, updates: Partial<AutomationRule>) {
    const index = this.automationRules.findIndex(rule => rule.id === id)
    if (index !== -1) {
      this.automationRules[index] = { ...this.automationRules[index], ...updates }
    }
  }

  deleteAutomationRule(id: string) {
    this.automationRules = this.automationRules.filter(rule => rule.id !== id)
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine()
