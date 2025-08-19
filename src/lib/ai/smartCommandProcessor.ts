import { enhancedNlpProcessor, type EnhancedNLPResult } from './enhancedNlpProcessor'
// import { moduleController } from './moduleController'
import type { ProcessedCommand } from './commandProcessor'

export interface SmartCommand {
  originalText: string
  nlpResult: EnhancedNLPResult
  processedCommand: ProcessedCommand
  executionPlan: ExecutionStep[]
  confidence: number
  requiredConfirmation: boolean
  estimatedDuration: number // in seconds
}

export interface ExecutionStep {
  id: string
  type: 'validation' | 'data_collection' | 'execution' | 'notification' | 'follow_up'
  description: string
  module?: string
  action?: string
  parameters?: any
  dependencies?: string[]
  optional?: boolean
}

export interface SmartCommandResult {
  success: boolean
  status: 'ok' | 'error' | 'warning'
  message: string
  data?: any
  nextSteps?: string[]
  suggestions?: string[]
  executionSteps: ExecutionStep[]
  followUpActions: string[]
  learnedPatterns: string[]
  userFeedback?: 'positive' | 'negative' | 'neutral'
  timestamp: Date
  error?: string
}

export class SmartCommandProcessor {
  private static instance: SmartCommandProcessor
  // private executionHistory: Array<{
  //   command: string
  //   result: SmartCommandResult
  //   timestamp: Date
  //   userId?: string
  // }> = []
  
  // private learnedPatterns: Map<string, {
  //   pattern: string
  //   successRate: number
  //   usageCount: number
  //   lastUsed: Date
  // }> = new Map()

  static getInstance(): SmartCommandProcessor {
    if (!SmartCommandProcessor.instance) {
      SmartCommandProcessor.instance = new SmartCommandProcessor()
    }
    return SmartCommandProcessor.instance
  }

  async processSmartCommand(
    text: string, 
    _userId?: string, 
    _context?: any
  ): Promise<SmartCommand> {
    // 1. Gelişmiş NLP analizi
    const nlpResult = enhancedNlpProcessor.process(text)
    
    // 2. Komut türünü belirle
    const processedCommand = this.createProcessedCommand(nlpResult, _context)
    
    // 3. Execution plan oluştur
    const executionPlan = this.createExecutionPlan(nlpResult, processedCommand)
    
    // 4. Confidence hesapla
    const confidence = this.calculateConfidence(nlpResult, processedCommand)
    
    const smartCommand: SmartCommand = {
      originalText: text,
      nlpResult,
      processedCommand,
      executionPlan,
      confidence,
      requiredConfirmation: confidence < 0.8,
      estimatedDuration: this.estimateExecutionTime(executionPlan)
    }

    return smartCommand
  }

  async executeSmartCommand(smartCommand: SmartCommand, _userId?: string): Promise<SmartCommandResult> {
    try {
      const result: SmartCommandResult = {
        success: true,
        status: 'ok',
        message: 'Command executed successfully',
        data: {},
        executionSteps: smartCommand.executionPlan,
        followUpActions: [],
        learnedPatterns: [],
        timestamp: new Date()
      }

      // Execute based on the smart command
      const executionResult = await this.performExecution(smartCommand)
      
      if (executionResult) {
        result.success = true
        result.status = 'ok'
        result.message = 'Command completed successfully'
        result.data = executionResult
      }

      return result
    } catch (error) {
      return {
        success: false,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionSteps: [],
        followUpActions: [],
        learnedPatterns: [],
        timestamp: new Date()
      }
    }
  }

  private createProcessedCommand(nlpResult: EnhancedNLPResult, _context?: any): ProcessedCommand {
    return {
      command: {
        id: Date.now().toString(),
        text: nlpResult.originalText || '',
        timestamp: new Date(),
        userId: 'anonymous'
      },
      intent: {
        type: nlpResult.intent.primary as any,
        confidence: nlpResult.intent.confidence,
        entities: {} // Simplified for now
      },
      confidence: nlpResult.confidence,
      metadata: {
        entities: nlpResult.entities,
        sentiment: nlpResult.sentiment
      }
    }
  }

  private createExecutionPlan(_nlpResult: EnhancedNLPResult, _processedCommand: ProcessedCommand): ExecutionStep[] {
    return [
      {
        id: 'validation',
        type: 'validation',
        description: 'Validate command parameters'
      },
      {
        id: 'execution',
        type: 'execution', 
        description: 'Execute the command'
      }
    ]
  }

  private calculateConfidence(_nlpResult: EnhancedNLPResult, _processedCommand: ProcessedCommand): number {
    return 0.85 // Mock confidence
  }

  private estimateExecutionTime(_executionPlan: ExecutionStep[]): number {
    return 2 // Mock 2 seconds
  }

  private async performExecution(_smartCommand: SmartCommand): Promise<any> {
    // Mock execution
    return { success: true, message: 'Command executed' }
  }
}

export const smartCommandProcessor = SmartCommandProcessor.getInstance()
