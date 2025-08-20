export interface Command {
  id: string;
  text: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface CommandResult {
  success: boolean
  message: string
  data?: any
  nextSteps?: string[]
  suggestions?: string[]
  timestamp: Date
  confidence?: number
}

export interface ProcessedCommand {
  command: Command
  intent: Intent
  metadata: any
  confidence: number
}

export interface DataInsight {
  id: string
  type: 'pattern' | 'trend' | 'anomaly' | 'prediction' | 'recommendation'
  title: string
  description: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  data: any
  timestamp: Date
  category: string
  actionable: boolean
  action: string
}

export interface ErrorContext {
  userId?: string
  sessionId?: string
  command?: string
  context?: string
  preferenceType?: string
  metric?: any
}

export interface Intent {
  type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'UNKNOWN' | string;
  confidence: number;
  entities: Record<string, unknown>;
}

export interface ModuleController {
  create(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  read(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  update(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  delete(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  userId?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'ACTION' | 'CONDITION' | 'LOOP';
  configuration: Record<string, unknown>;
  next?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime: Date;
  endTime?: Date;
  currentStep?: string;
  context: Record<string, unknown>;
}
