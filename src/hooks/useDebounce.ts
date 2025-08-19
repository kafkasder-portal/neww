import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );

  return debouncedCallback;
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with search value, debounced value, and setter
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, delay);

  const clearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
    clearSearch,
    isSearching: searchValue !== debouncedSearchValue
  };
}

/**
 * Custom hook for debounced API calls
 * @param apiCall - The API function to call
 * @param searchTerm - The search term to debounce
 * @param delay - Debounce delay in milliseconds
 * @param options - Additional options
 */
interface UseDebouncedApiOptions {
  minLength?: number;
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export function useDebouncedApi<T>(
  apiCall: (searchTerm: string) => Promise<T>,
  searchTerm: string,
  delay: number = 300,
  options: UseDebouncedApiOptions = {}
) {
  const { minLength = 1, immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(async (term: string) => {
    if (term.length < minLength) {
      setData(null);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall(term);
      
      // Check if request was aborted
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'Arama sırasında hata oluştu';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiCall, minLength, onSuccess, onError]);

  useEffect(() => {
    if (immediate || debouncedSearchTerm) {
      executeSearch(debouncedSearchTerm);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchTerm, executeSearch, immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    data,
    loading,
    error,
    reset,
    isSearching: searchTerm !== debouncedSearchTerm || loading
  };
}

/**
 * Custom hook for debounced form validation
 * @param formData - Form data object
 * @param validationFn - Validation function
 * @param delay - Debounce delay in milliseconds
 */
export function useDebouncedValidation<T extends Record<string, unknown>>(
  formData: T,
  validationFn: (data: T) => Record<string, string> | null,
  delay: number = 500
) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const debouncedFormData = useDebounce(formData, delay);

  useEffect(() => {
    setIsValidating(true);
    
    const validateData = async () => {
      try {
        const validationErrors = validationFn(debouncedFormData);
        setErrors(validationErrors);
      } catch (error) {
        console.error('Validation error:', error);
        setErrors({ general: 'Doğrulama sırasında hata oluştu' });
      } finally {
        setIsValidating(false);
      }
    };

    validateData();
  }, [debouncedFormData, validationFn]);

  const hasErrors = errors && Object.keys(errors).length > 0;
  const isValid = !hasErrors && !isValidating;

  return {
    errors,
    isValidating,
    hasErrors,
    isValid,
    isFormChanged: JSON.stringify(formData) !== JSON.stringify(debouncedFormData)
  };
}

/**
 * Custom hook for debounced auto-save functionality
 * @param data - Data to auto-save
 * @param saveFn - Save function
 * @param delay - Debounce delay in milliseconds
 * @param options - Additional options
 */
interface UseAutoSaveOptions {
  enabled?: boolean;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
}

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000,
  options: UseAutoSaveOptions = {}
) {
  const { enabled = true, onSaveStart, onSaveSuccess, onSaveError } = options;
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const debouncedData = useDebounce(data, delay);
  const initialDataRef = useRef(data);
  const hasChanges = JSON.stringify(data) !== JSON.stringify(initialDataRef.current);

  const saveData = useCallback(async (dataToSave: T) => {
    if (!enabled) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      onSaveStart?.();
      
      await saveFn(dataToSave);
      
      setLastSaved(new Date());
      initialDataRef.current = dataToSave;
      onSaveSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kaydetme sırasında hata oluştu';
      setSaveError(errorMessage);
      onSaveError?.(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [enabled, saveFn, onSaveStart, onSaveSuccess, onSaveError]);

  useEffect(() => {
    if (enabled && hasChanges) {
      saveData(debouncedData);
    }
  }, [debouncedData, enabled, hasChanges, saveData]);

  const forceSave = useCallback(() => {
    if (hasChanges) {
      saveData(data);
    }
  }, [data, hasChanges, saveData]);

  return {
    isSaving,
    lastSaved,
    saveError,
    hasChanges,
    hasUnsavedChanges: JSON.stringify(data) !== JSON.stringify(debouncedData),
    forceSave
  };
}