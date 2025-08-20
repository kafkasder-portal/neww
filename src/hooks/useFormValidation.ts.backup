import { useState, useCallback, useEffect } from 'react';
import type { ZodSchema } from 'zod';
import { ZodError, z } from 'zod';
import { useFormErrorHandler } from './useErrorHandler';
import { useDebounce } from './useDebounce';

// Form field state interface removed - using inline types instead

// Form state
interface FormState<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  validating: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// Validation options
interface ValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  debounceMs?: number;
  revalidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

// Form validation hook options
interface UseFormValidationOptions<T> extends ValidationOptions {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit?: (values: T) => Promise<void> | void;
  onValidationError?: (errors: Record<keyof T, string | null>) => void;
  onFieldValidation?: (field: keyof T, error: string | null) => void;
}

// Form validation hook return type
interface UseFormValidationReturn<T> {
  // Form state
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  validating: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
  
  // Field methods
  setValue: (field: keyof T, value: unknown) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string | null) => void;
  setErrors: (errors: Partial<Record<keyof T, string | null>>) => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  setFieldValidating: (field: keyof T, validating: boolean) => void;
  
  // Validation methods
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  validateSchema: (values?: T) => Promise<boolean>;
  
  // Form methods
  handleChange: (field: keyof T) => (value: unknown) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (values?: T) => void;
  resetField: (field: keyof T) => void;
  
  // Utility methods
  getFieldProps: (field: keyof T) => {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error: string | null;
    touched: boolean;
    dirty: boolean;
    validating: boolean;
  };
  
  // State checks
  isDirty: boolean;
  hasErrors: boolean;
  canSubmit: boolean;
}

// Custom hook for form validation with Zod
export const useFormValidation = <T extends Record<string, unknown>>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> => {
  const {
    schema,
    initialValues,
    onSubmit,
    onValidationError,
    onFieldValidation,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
    debounceMs = 300,
    revalidateMode = 'onChange'
  } = options;

  const { handleSubmitError } = useFormErrorHandler('form-validation');

  // Form state
  const [formState, setFormState] = useState<FormState<T>>(() => ({
    values: { ...initialValues },
    errors: {} as Record<keyof T, string | null>,
    touched: {} as Record<keyof T, boolean>,
    dirty: {} as Record<keyof T, boolean>,
    validating: {} as Record<keyof T, boolean>,
    isValid: false,
    isSubmitting: false,
    submitCount: 0
  }));

  // Debounced validation
  const debouncedValidateField = useDebounce(
    async (field: keyof T, value: unknown) => {
      await validateFieldInternal(field, value);
    },
    debounceMs
  );

  // Internal field validation
  const validateFieldInternal = useCallback(async (
    field: keyof T,
    value?: unknown
  ): Promise<boolean> => {
    const fieldValue = value !== undefined ? value : formState.values[field];
    
    setFormState(prev => ({
      ...prev,
      validating: { ...prev.validating, [field]: true }
    }));

    try {
      // Create a partial schema for the specific field
      // Create a simple field validation by extracting the field from the schema
      const fieldSchema = z.object({ [field]: (schema as any).shape[field] });
      await fieldSchema.parseAsync({ [field]: fieldValue });
      
      // Field is valid
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: null },
        validating: { ...prev.validating, [field]: false }
      }));
      
      if (onFieldValidation) {
        onFieldValidation(field, null);
      }
      
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues.find(issue => 
          issue.path.includes(field as string)
        );
        
        const errorMessage = fieldError?.message || 'Geçersiz değer';
        
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: errorMessage },
          validating: { ...prev.validating, [field]: false }
        }));
        
        if (onFieldValidation) {
          onFieldValidation(field, errorMessage);
        }
        
        return false;
      }
      
      // Unknown error
      const errorMessage = 'Doğrulama hatası oluştu';
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: errorMessage },
        validating: { ...prev.validating, [field]: false }
      }));
      
      return false;
    }
  }, [schema, formState.values, onFieldValidation]);

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await schema.parseAsync(formState.values);
      
      // Form is valid
      setFormState(prev => ({
        ...prev,
        errors: {} as Record<keyof T, string | null>,
        isValid: true
      }));
      
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;
        
        error.issues.forEach(issue => {
          const field = issue.path[0] as keyof T;
          if (field && !newErrors[field]) {
            newErrors[field] = issue.message;
          }
        });
        
        setFormState(prev => ({
          ...prev,
          errors: newErrors,
          isValid: false
        }));
        
        if (onValidationError) {
          onValidationError(newErrors);
        }
        
        handleSubmitError(error);
        return false;
      }
      
      return false;
    }
  }, [schema, formState.values, onValidationError, handleSubmitError]);

  // Validate with custom schema
  const validateSchema = useCallback(async (values?: T): Promise<boolean> => {
    const valuesToValidate = values || formState.values;
    
    try {
      await schema.parseAsync(valuesToValidate);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        handleSubmitError(error);
      }
      return false;
    }
  }, [schema, formState.values, handleSubmitError]);

  // Set single field value
  const setValue = useCallback((field: keyof T, value: unknown) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const isDirty = JSON.stringify(newValues[field]) !== JSON.stringify(initialValues[field]);
      
      return {
        ...prev,
        values: newValues,
        dirty: { ...prev.dirty, [field]: isDirty }
      };
    });
    
    // Validate on change if enabled
    if (validateOnChange && (revalidateMode === 'onChange' || formState.touched[field])) {
      debouncedValidateField(field, value);
    }
  }, [validateOnChange, revalidateMode, formState.touched, debouncedValidateField, initialValues]);

  // Set multiple field values
  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => {
      const newValues = { ...prev.values, ...values };
      const newDirty = { ...prev.dirty };
      
      Object.keys(values).forEach(key => {
        const field = key as keyof T;
        newDirty[field] = JSON.stringify(newValues[field]) !== JSON.stringify(initialValues[field]);
      });
      
      return {
        ...prev,
        values: newValues,
        dirty: newDirty
      };
    });
    
    // Validate changed fields if needed
    if (validateOnChange) {
      Object.keys(values).forEach(key => {
        const field = key as keyof T;
        if (revalidateMode === 'onChange' || formState.touched[field]) {
          debouncedValidateField(field, values[field]);
        }
      });
    }
  }, [validateOnChange, revalidateMode, formState.touched, debouncedValidateField, initialValues]);

  // Set field error
  const setError = useCallback((field: keyof T, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error }
    }));
  }, []);

  // Set multiple errors
  const setErrors = useCallback((errors: Partial<Record<keyof T, string | null>>) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors }
    }));
  }, []);

  // Set field touched
  const setTouched = useCallback((field: keyof T, touched = true) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched }
    }));
  }, []);

  // Set field validating state
  const setFieldValidating = useCallback((field: keyof T, validating: boolean) => {
    setFormState(prev => ({
      ...prev,
      validating: { ...prev.validating, [field]: validating }
    }));
  }, []);

  // Handle field change
  const handleChange = useCallback((field: keyof T) => (value: unknown) => {
    setValue(field, value);
  }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(field, true);
    
    if (validateOnBlur && revalidateMode === 'onBlur') {
      validateFieldInternal(field);
    }
  }, [validateOnBlur, revalidateMode, validateFieldInternal, setTouched]);

  // Handle form submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1
    }));
    
    try {
      // Mark all fields as touched
      const allTouched = Object.keys(formState.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      
      setFormState(prev => ({
        ...prev,
        touched: allTouched
      }));
      
      // Validate form
      const isValid = await validateForm();
      
      if (isValid && onSubmit) {
        await onSubmit(formState.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false
      }));
    }
  }, [formState.values, validateForm, onSubmit]);

  // Reset form
  const reset = useCallback((values?: T) => {
    const resetValues = values || initialValues;
    
    setFormState({
      values: { ...resetValues },
      errors: {} as Record<keyof T, string | null>,
      touched: {} as Record<keyof T, boolean>,
      dirty: {} as Record<keyof T, boolean>,
      validating: {} as Record<keyof T, boolean>,
      isValid: false,
      isSubmitting: false,
      submitCount: 0
    });
    
  }, [initialValues]);

  // Reset single field
  const resetField = useCallback((field: keyof T) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: initialValues[field] },
      errors: { ...prev.errors, [field]: null },
      touched: { ...prev.touched, [field]: false },
      dirty: { ...prev.dirty, [field]: false },
      validating: { ...prev.validating, [field]: false }
    }));
  }, [initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((field: keyof T) => ({
    value: formState.values[field],
    onChange: handleChange(field),
    onBlur: handleBlur(field),
    error: formState.errors[field],
    touched: formState.touched[field],
    dirty: formState.dirty[field],
    validating: formState.validating[field]
  }), [formState, handleChange, handleBlur]);

  // Computed properties
  const isDirty = Object.values(formState.dirty).some(Boolean);
  const hasErrors = Object.values(formState.errors).some(error => error !== null);
  const canSubmit = formState.isValid && !formState.isSubmitting && !hasErrors;

  // Validate on mount if enabled
  useEffect(() => {
    if (validateOnMount) {
      validateForm();
    }
  }, [validateOnMount, validateForm]);

  // Update isValid when errors change
  useEffect(() => {
    const isValid = !hasErrors;
    setFormState(prev => ({
      ...prev,
      isValid
    }));
  }, [hasErrors]);

  return {
    // Form state
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    dirty: formState.dirty,
    validating: formState.validating,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    submitCount: formState.submitCount,
    
    // Field methods
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setFieldValidating,
    
    // Validation methods
    validateField: validateFieldInternal,
    validateForm,
    validateSchema,
    
    // Form methods
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    resetField,
    
    // Utility methods
    getFieldProps,
    
    // State checks
    isDirty,
    hasErrors,
    canSubmit
  };
};

export default useFormValidation;
