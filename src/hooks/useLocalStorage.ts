import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageOptions {
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
}

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Serialization options
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: SetValue<T>) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, deserialize]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for storing and retrieving user preferences
 */
export function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('userPreferences', {
    theme: 'light',
    language: 'tr',
    pageSize: 10,
    sidebarCollapsed: false,
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  const updatePreference = useCallback(
    (key: string, value: unknown) => {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    },
    [setPreferences]
  );

  const updateNestedPreference = useCallback(
    (parentKey: string, childKey: string, value: unknown) => {
      setPreferences(prev => {
        const parentValue = prev[parentKey as keyof typeof prev];
        const safeParentValue = (typeof parentValue === 'object' && parentValue !== null) ? parentValue as Record<string, unknown> : {};
        
        return {
          ...prev,
          [parentKey]: {
            ...safeParentValue,
            [childKey]: value
          }
        };
      });
    },
    [setPreferences]
  );

  return {
    preferences,
    setPreferences,
    removePreferences,
    updatePreference,
    updateNestedPreference
  };
}

/**
 * Hook for managing form data in localStorage
 */
export function useFormStorage<T extends Record<string, unknown>>(
  formKey: string,
  initialFormData: T
) {
  const [formData, setFormData, removeFormData] = useLocalStorage(
    `form_${formKey}`,
    initialFormData
  );

  const updateField = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    },
    [setFormData]
  );

  const updateFields = useCallback(
    (fields: Partial<T>) => {
      setFormData(prev => ({
        ...prev,
        ...fields
      }));
    },
    [setFormData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, [setFormData, initialFormData]);

  const clearForm = useCallback(() => {
    removeFormData();
  }, [removeFormData]);

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    clearForm
  };
}

/**
 * Hook for managing recently viewed items
 */
export function useRecentItems<T extends { id: string | number }>(
  key: string,
  maxItems: number = 10
) {
  const [recentItems, setRecentItems] = useLocalStorage<T[]>(`recent_${key}`, []);

  const addRecentItem = useCallback(
    (item: T) => {
      setRecentItems(prev => {
        // Remove existing item if it exists
        const filtered = prev.filter(existing => existing.id !== item.id);
        // Add new item to the beginning
        const updated = [item, ...filtered];
        // Limit to maxItems
        return updated.slice(0, maxItems);
      });
    },
    [setRecentItems, maxItems]
  );

  const removeRecentItem = useCallback(
    (id: string | number) => {
      setRecentItems(prev => prev.filter(item => item.id !== id));
    },
    [setRecentItems]
  );

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    clearRecentItems
  };
}

/**
 * Hook for managing search history
 */
export function useSearchHistory(key: string, maxHistory: number = 20) {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(`search_${key}`, []);

  const addSearchTerm = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      
      setSearchHistory(prev => {
        // Remove existing term if it exists
        const filtered = prev.filter(existing => existing !== term);
        // Add new term to the beginning
        const updated = [term, ...filtered];
        // Limit to maxHistory
        return updated.slice(0, maxHistory);
      });
    },
    [setSearchHistory, maxHistory]
  );

  const removeSearchTerm = useCallback(
    (term: string) => {
      setSearchHistory(prev => prev.filter(existing => existing !== term));
    },
    [setSearchHistory]
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  return {
    searchHistory,
    addSearchTerm,
    removeSearchTerm,
    clearSearchHistory
  };
}