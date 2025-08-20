import { useCallback } from 'react';
import { sanitizeInput, SANITIZATION_CONFIGS } from '../utils/sanitization';

/**
 * Hook for sanitizing message-related content
 */
export function useMessageSanitization() {
  /**
   * Sanitize message template content
   */
  const sanitizeMessageTemplate = useCallback(
    (template: string | null | undefined, allowRichText: boolean = false): string => {
      if (!template) return '';
      
      const config = allowRichText 
        ? SANITIZATION_CONFIGS.HTML_WITH_LINKS 
        : SANITIZATION_CONFIGS.TEXT_ONLY;
      
      return sanitizeInput(template, config);
    },
    []
  );

  /**
   * Sanitize message content
   */
  const sanitizeMessageContent = useCallback(
    (content: string | null | undefined, allowRichText: boolean = false): string => {
      if (!content) return '';
      
      const config = allowRichText 
        ? SANITIZATION_CONFIGS.HTML_WITH_LINKS 
        : SANITIZATION_CONFIGS.TEXT_ONLY;
      
      return sanitizeInput(content, config);
    },
    []
  );

  /**
   * Sanitize message data object
   */
  const sanitizeMessageData = useCallback(
    (messageData: Record<string, unknown>) => {
      const sanitized: Record<string, unknown> = {};
      
      for (const [key, value] of Object.entries(messageData)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value, SANITIZATION_CONFIGS.TEXT_ONLY);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    },
    []
  );

  return {
    sanitizeMessageTemplate,
    sanitizeMessageContent,
    sanitizeMessageData,
  };
}