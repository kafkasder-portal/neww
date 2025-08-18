import { Command, CommandResult, Intent, ModuleController } from './types';

// Export types for other modules
export type { Command, CommandResult, Intent, ModuleController } from './types';

export interface ProcessedCommand {
  command: Command;
  intent: Intent;
  confidence: number;
  metadata: Record<string, unknown>;
}

interface CommandContext {
  userId: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export class CommandProcessor {
  private moduleController: ModuleController;
  private commandHistory: Command[] = [];
  private maxHistorySize = 100;

  constructor(moduleController: ModuleController) {
    this.moduleController = moduleController;
  }

  async processCommand(command: Command, context: CommandContext): Promise<CommandResult> {
    try {
      // Add command to history
      this.addToHistory(command);

      // Parse command intent
      const intent = await this.parseIntent(command.text, context);

      // Execute command based on intent
      const result = await this.executeCommand(intent, context);

      return {
        success: true,
        data: result,
        message: 'Command executed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Command execution failed',
        timestamp: new Date()
      };
    }
  }

  private async parseIntent(text: string, _context: CommandContext): Promise<Intent> {
    // Basic intent parsing logic
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('create') || lowerText.includes('add')) {
      return {
        type: 'CREATE',
        confidence: 0.8,
        entities: { action: 'create' }
      };
    }
    
    if (lowerText.includes('read') || lowerText.includes('get') || lowerText.includes('show')) {
      return {
        type: 'READ',
        confidence: 0.8,
        entities: { action: 'read' }
      };
    }
    
    if (lowerText.includes('update') || lowerText.includes('edit') || lowerText.includes('modify')) {
      return {
        type: 'UPDATE',
        confidence: 0.8,
        entities: { action: 'update' }
      };
    }
    
    if (lowerText.includes('delete') || lowerText.includes('remove')) {
      return {
        type: 'DELETE',
        confidence: 0.8,
        entities: { action: 'delete' }
      };
    }

    return {
      type: 'UNKNOWN',
      confidence: 0.1,
      entities: {}
    };
  }

  private async executeCommand(intent: Intent, context: CommandContext): Promise<unknown> {
    switch (intent.type) {
      case 'CREATE':
        return this.moduleController.create(intent.entities, context);
      case 'READ':
        return this.moduleController.read(intent.entities, context);
      case 'UPDATE':
        return this.moduleController.update(intent.entities, context);
      case 'DELETE':
        return this.moduleController.delete(intent.entities, context);
      default:
        throw new Error(`Unknown intent type: ${intent.type}`);
    }
  }

  private addToHistory(command: Command): void {
    this.commandHistory.push(command);
    
    // Keep history size manageable
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  getCommandHistory(): Command[] {
    return [...this.commandHistory];
  }

  clearHistory(): void {
    this.commandHistory = [];
  }

  async processBatchCommands(commands: Command[], context: CommandContext): Promise<CommandResult[]> {
    const results: CommandResult[] = [];
    
    for (const command of commands) {
      const result = await this.processCommand(command, context);
      results.push(result);
      
      // Stop processing if a command fails
      if (!result.success) {
        break;
      }
    }
    
    return results;
  }

  async validateCommand(command: Command): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    if (!command.text || command.text.trim().length === 0) {
      errors.push('Command text is required');
    }
    
    if (command.text && command.text.length > 1000) {
      errors.push('Command text is too long (max 1000 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async suggestCommands(partialText: string, _context: CommandContext): Promise<string[]> {
    const suggestions: string[] = [];
    
    if (partialText.toLowerCase().includes('create')) {
      suggestions.push('Create new user');
      suggestions.push('Create new meeting');
      suggestions.push('Create new task');
    }
    
    if (partialText.toLowerCase().includes('show')) {
      suggestions.push('Show users');
      suggestions.push('Show meetings');
      suggestions.push('Show tasks');
    }
    
    if (partialText.toLowerCase().includes('update')) {
      suggestions.push('Update user profile');
      suggestions.push('Update meeting details');
      suggestions.push('Update task status');
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  async getCommandStatistics(): Promise<{
    totalCommands: number;
    successfulCommands: number;
    failedCommands: number;
    averageExecutionTime: number;
  }> {
    // This would typically query a database or analytics service
    return {
      totalCommands: this.commandHistory.length,
      successfulCommands: this.commandHistory.length, // Simplified
      failedCommands: 0, // Simplified
      averageExecutionTime: 150 // milliseconds
    };
  }
}

// Utility functions for backward compatibility
export function createCommandProcessor(moduleController: ModuleController): CommandProcessor {
  return new CommandProcessor(moduleController);
}

export function getCommandSuggestions(partialText: string): string[] {
  const suggestions: string[] = [];

  if (partialText.toLowerCase().includes('create')) {
    suggestions.push('Create new user');
    suggestions.push('Create new meeting');
    suggestions.push('Create new task');
  }

  if (partialText.toLowerCase().includes('show')) {
    suggestions.push('Show users');
    suggestions.push('Show meetings');
    suggestions.push('Show tasks');
  }

  if (partialText.toLowerCase().includes('update')) {
    suggestions.push('Update user profile');
    suggestions.push('Update meeting details');
    suggestions.push('Update task status');
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}
