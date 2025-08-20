import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse, QueryParams, FilterParams } from '../api/types';
import { handleApiError } from '../api/supabase';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

// Generic API hook for data fetching
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiState<T> {
  const { immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        const errorMessage = handleApiError(response.error);
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for API mutations (create, update, delete)
interface UseMutationState<T, V = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (variables?: V) => Promise<T | null>;
  reset: () => void;
}

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onSettled?: () => void;
}

export function useMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options: UseMutationOptions<T> = {}
): UseMutationState<T, V> {
  const { onSuccess, onError, onSettled } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables?: V): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mutationFn(variables as V);
      
      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = handleApiError(response.error);
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset
  };
}

// Hook for paginated data
interface UsePaginatedApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  refetch: () => Promise<void>;
  setFilters: (filters: FilterParams) => void;
  setSearch: (search: string) => void;
}

interface UsePaginatedApiOptions<T> {
  limit?: number;
  initialFilters?: FilterParams;
  onSuccess?: (data: T[]) => void;
  onError?: (error: string) => void;
}

export function usePaginatedApi<T>(
  apiCall: (params: QueryParams) => Promise<ApiResponse<T[]>>,
  countCall: (params: QueryParams) => Promise<ApiResponse<number>>,
  options: UsePaginatedApiOptions<T> = {}
): UsePaginatedApiState<T> {
  const { limit = 10, initialFilters = {}, onSuccess, onError } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * limit;
      const params: QueryParams = {
        limit,
        offset,
        filters,
        search: search.trim() || undefined
      };
      
      const [dataResponse, countResponse] = await Promise.all([
        apiCall(params),
        countCall(params)
      ]);
      
      if (dataResponse.success && countResponse.success) {
        setData(dataResponse.data);
        setTotalCount(countResponse.data);
        onSuccess?.(dataResponse.data);
      } else {
        const errorMessage = handleApiError(dataResponse.error || countResponse.error);
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, countCall, page, limit, filters, search, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const updateFilters = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
  }, []);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    refetch: fetchData,
    setFilters: updateFilters,
    setSearch: updateSearch
  };
}