export interface Command {
  id: string;
  text: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface CommandResult {
  success: boolean;
  data?: unknown;
  error?: string;
  message: string;
  timestamp: Date;
}

export interface Intent {
  type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'UNKNOWN';
  confidence: number;
  entities: Record<string, unknown>;
}

export interface ModuleController {
  create(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  read(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  update(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
  delete(entities: Record<string, unknown>, context: unknown): Promise<unknown>;
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
