import { useCallback } from 'react';
import { sanitizeInput, SANITIZATION_CONFIGS } from '../utils/sanitization';

export type SanitizationType = 'text' | 'email' | 'phone' | 'url' | 'html';

/**
 * Hook for sanitizing form inputs
 */
export function useFormSanitization() {
  /**
   * Create a sanitized change handler for form inputs
   */
  const createSanitizedChangeHandler = useCallback(
    (onChange: (value: string) => void, type: SanitizationType = 'text') => {
      return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        let sanitizedValue: string;

        switch (type) {
          case 'email':
            sanitizedValue = sanitizeInput(value, SANITIZATION_CONFIGS.EMAIL);
            break;
          case 'phone':
            sanitizedValue = sanitizeInput(value, SANITIZATION_CONFIGS.PHONE);
            break;
          case 'url':
            sanitizedValue = sanitizeInput(value, SANITIZATION_CONFIGS.URL);
            break;
          case 'html':
            sanitizedValue = sanitizeInput(value, SANITIZATION_CONFIGS.HTML_WITH_LINKS);
            break;
          case 'text':
          default:
            sanitizedValue = sanitizeInput(value, SANITIZATION_CONFIGS.TEXT_ONLY);
            break;
        }

        onChange(sanitizedValue);
      };
    },
    []
  );

  /**
   * Sanitize a single value
   */
  const sanitizeValue = useCallback(
    (value: string, type: SanitizationType = 'text'): string => {
      switch (type) {
        case 'email':
          return sanitizeInput(value, SANITIZATION_CONFIGS.EMAIL);
        case 'phone':
          return sanitizeInput(value, SANITIZATION_CONFIGS.PHONE);
        case 'url':
          return sanitizeInput(value, SANITIZATION_CONFIGS.URL);
        case 'html':
          return sanitizeInput(value, SANITIZATION_CONFIGS.HTML_WITH_LINKS);
        case 'text':
        default:
          return sanitizeInput(value, SANITIZATION_CONFIGS.TEXT_ONLY);
      }
    },
    []
  );

  return {
    createSanitizedChangeHandler,
    sanitizeValue,
  };
}