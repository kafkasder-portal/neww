import { useCallback, useMemo } from 'react';
import {
  sanitizeInput,
  sanitizeObject,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeUrl,
  SANITIZATION_CONFIGS,
  type SanitizationOptions,
} from '../utils/sanitization';

/**
 * Hook for input sanitization with different configurations
 */
export function useSanitization() {
  // Memoized sanitization functions
  const sanitizeText = useCallback(
    (input: string | null | undefined) => 
      sanitizeInput(input, SANITIZATION_CONFIGS.TEXT_ONLY),
    []
  );

  const sanitizeRichText = useCallback(
    (input: string | null | undefined) => 
      sanitizeInput(input, SANITIZATION_CONFIGS.RICH_TEXT),
    []
  );

  const sanitizeHtmlWithLinks = useCallback(
    (input: string | null | undefined) => 
      sanitizeInput(input, SANITIZATION_CONFIGS.HTML_WITH_LINKS),
    []
  );

  const sanitizeCustom = useCallback(
    (input: string | null | undefined, config: SanitizationOptions) => 
      sanitizeInput(input, config),
    []
  );

  const sanitizeFormData = useCallback(
    <T extends Record<string, unknown>>(data: T, config?: SanitizationOptions) => 
      sanitizeObject(data, config || SANITIZATION_CONFIGS.TEXT_ONLY),
    []
  );

  const sanitizeEmailInput = useCallback(
    (email: string | null | undefined) => sanitizeEmail(email),
    []
  );

  const sanitizePhoneInput = useCallback(
    (phone: string | null | undefined) => sanitizePhoneNumber(phone),
    []
  );

  const sanitizeUrlInput = useCallback(
    (url: string | null | undefined) => sanitizeUrl(url),
    []
  );

  return useMemo(
    () => ({
      sanitizeText,
      sanitizeRichText,
      sanitizeHtmlWithLinks,
      sanitizeCustom,
      sanitizeFormData,
      sanitizeEmail: sanitizeEmailInput,
      sanitizePhone: sanitizePhoneInput,
      sanitizeUrl: sanitizeUrlInput,
      configs: SANITIZATION_CONFIGS,
    }),
    [
      sanitizeText,
      sanitizeRichText,
      sanitizeHtmlWithLinks,
      sanitizeCustom,
      sanitizeFormData,
      sanitizeEmailInput,
      sanitizePhoneInput,
      sanitizeUrlInput,
    ]
  );
}

/**
 * Hook for form input sanitization with real-time validation
 */
export function useFormSanitization() {
  const { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeUrl } = useSanitization();

  const sanitizeFormField = useCallback(
    (value: string, fieldType: 'text' | 'email' | 'phone' | 'url' = 'text') => {
      switch (fieldType) {
        case 'email':
          return sanitizeEmail(value);
        case 'phone':
          return sanitizePhone(value);
        case 'url':
          return sanitizeUrl(value);
        default:
          return sanitizeText(value);
      }
    },
    [sanitizeText, sanitizeEmail, sanitizePhone, sanitizeUrl]
  );

  const createSanitizedChangeHandler = useCallback(
    (
      onChange: (value: string) => void,
      fieldType: 'text' | 'email' | 'phone' | 'url' = 'text'
    ) => {
      return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const sanitizedValue = sanitizeFormField(event.target.value, fieldType);
        onChange(sanitizedValue);
      };
    },
    [sanitizeFormField]
  );

  return useMemo(
    () => ({
      sanitizeFormField,
      createSanitizedChangeHandler,
    }),
    [sanitizeFormField, createSanitizedChangeHandler]
  );
}

/**
 * Hook for message template sanitization
 */
export function useMessageSanitization() {
  const { sanitizeRichText, sanitizeText } = useSanitization();

  const sanitizeMessageTemplate = useCallback(
    (template: string | null | undefined, allowRichText = true) => {
      return allowRichText ? sanitizeRichText(template) : sanitizeText(template);
    },
    [sanitizeRichText, sanitizeText]
  );

  const sanitizeMessageData = useCallback(
    (messageData: Record<string, unknown>) => {
      const sanitized = { ...messageData };
      
      // Sanitize common message fields
      if (typeof sanitized.title === 'string') {
        sanitized.title = sanitizeText(sanitized.title);
      }
      
      if (typeof sanitized.content === 'string') {
        sanitized.content = sanitizeRichText(sanitized.content);
      }
      
      if (typeof sanitized.description === 'string') {
        sanitized.description = sanitizeText(sanitized.description);
      }
      
      if (sanitized.tags && Array.isArray(sanitized.tags)) {
        sanitized.tags = sanitized.tags.map((tag: unknown) => 
          typeof tag === 'string' ? sanitizeText(tag) : tag
        );
      }
      
      return sanitized;
    },
    [sanitizeText, sanitizeRichText]
  );

  return useMemo(
    () => ({
      sanitizeMessageTemplate,
      sanitizeMessageData,
    }),
    [sanitizeMessageTemplate, sanitizeMessageData]
  );
}