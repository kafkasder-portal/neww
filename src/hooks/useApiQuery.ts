import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { api, queryKeys, ApiResponse, performanceMonitor } from '../utils/apiUtils'
import { toast } from 'sonner'
import { useCallback, useEffect, useRef } from 'react'

// Generic query hook with performance monitoring
export function useApiQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
) {
  const startTime = useRef<number>()
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      startTime.current = Date.now()
      const result = await queryFn()
      
      // Log performance
      const duration = Date.now() - startTime.current
      performanceMonitor.logQuery(queryKey.map(String), duration)
      
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
  
  return query
}

// Generic mutation hook with optimistic updates
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables, { previousData: unknown } | undefined> & {
    invalidateQueries?: readonly unknown[][]
    optimisticUpdate?: {
      queryKey: readonly unknown[]
      updater: (oldData: any, variables: TVariables) => any
    }
    successMessage?: string
    errorMessage?: string
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation<ApiResponse<TData>, Error, TVariables, { previousData: unknown } | undefined>({
    mutationFn,
    onMutate: async (variables) => {
      // Optimistic update
      if (options?.optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: options.optimisticUpdate.queryKey })
        
        const previousData = queryClient.getQueryData(options.optimisticUpdate.queryKey)
        
        queryClient.setQueryData(
          options.optimisticUpdate.queryKey,
          (oldData: any) => options.optimisticUpdate!.updater(oldData, variables)
        )
        
        return { previousData }
      }
      
      return options?.onMutate?.(variables)
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      const mutationContext = context as { previousData: unknown } | undefined
      if (options?.optimisticUpdate && mutationContext?.previousData) {
        queryClient.setQueryData(options.optimisticUpdate.queryKey, mutationContext.previousData)
      }
      
      // Show error message
      if (options?.errorMessage) {
        toast.error(options.errorMessage)
      }
      
      options?.onError?.(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      
      // Show success message
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
      
      options?.onSuccess?.(data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error, variables, context)
    }
  })
}

// Infinite query hook for pagination
export function useInfiniteApiQuery<T>(
  queryKey: readonly unknown[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<ApiResponse<T[]>>,
  options?: {
    initialPageParam?: number
    getNextPageParam?: (lastPage: ApiResponse<T[]>, pages: ApiResponse<T[]>[]) => number | undefined
    getPreviousPageParam?: (firstPage: ApiResponse<T[]>, pages: ApiResponse<T[]>[]) => number | undefined
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // For infinite queries, we'll implement a simple version
      // In a real implementation, you'd use useInfiniteQuery
      return await queryFn({ pageParam: options?.initialPageParam || 1 })
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

// Prefetch hook for preloading data
export function usePrefetch() {
  const queryClient = useQueryClient()
  
  const prefetch = useCallback(
    <T>(queryKey: readonly unknown[], queryFn: () => Promise<ApiResponse<T>>) => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000
      })
    },
    [queryClient]
  )
  
  return { prefetch }
}

// Background sync hook
export function useBackgroundSync() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries()
    }
    
    const handleOnline = () => {
      queryClient.invalidateQueries()
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
    }
  }, [queryClient])
}

// Specific API hooks

// Users
export const useUsers = (filters?: Record<string, any>) => {
  return useApiQuery(
    queryKeys.users.list(filters || {}),
    () => api.get('/users', { params: filters }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for user data
    }
  )
}

export const useUser = (id: string) => {
  return useApiQuery(
    queryKeys.users.detail(id),
    () => api.get(`/users/${id}`),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000
    }
  )
}

export const useCreateUser = () => {
  return useApiMutation(
    (userData: any) => api.post('/users', userData),
    {
      invalidateQueries: [[...queryKeys.users.all] as unknown[]],
      successMessage: 'Kullanıcı başarıyla oluşturuldu',
      errorMessage: 'Kullanıcı oluşturulurken hata oluştu'
    }
  )
}

export const useUpdateUser = () => {
  return useApiMutation(
    ({ id, ...userData }: { id: string } & any) => api.put(`/users/${id}`, userData),
    {
      invalidateQueries: [[...queryKeys.users.all] as unknown[]],
      successMessage: 'Kullanıcı başarıyla güncellendi',
      errorMessage: 'Kullanıcı güncellenirken hata oluştu'
    }
  )
}

export const useDeleteUser = () => {
  return useApiMutation(
    (id: string) => api.delete(`/users/${id}`),
    {
      invalidateQueries: [[...queryKeys.users.all] as unknown[]],
      successMessage: 'Kullanıcı başarıyla silindi',
      errorMessage: 'Kullanıcı silinirken hata oluştu'
    }
  )
}

// Donations
export const useDonations = (filters?: Record<string, any>) => {
  return useApiQuery(
    queryKeys.donations.list(filters || {}),
    () => api.get('/donations', { params: filters }),
    {
      staleTime: 1 * 60 * 1000, // 1 minute for donation data
    }
  )
}

export const useDonation = (id: string) => {
  return useApiQuery(
    queryKeys.donations.detail(id),
    () => api.get(`/donations/${id}`),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000
    }
  )
}

export const useCreateDonation = () => {
  return useApiMutation(
    (donationData: any) => api.post('/donations', donationData),
    {
      invalidateQueries: [[...queryKeys.donations.all] as unknown[], [...queryKeys.financial.all] as unknown[]],
      successMessage: 'Bağış başarıyla kaydedildi',
      errorMessage: 'Bağış kaydedilirken hata oluştu'
    }
  )
}

export const useDonationStats = () => {
  return useApiQuery(
    queryKeys.donations.stats(),
    () => api.get('/donations/stats'),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    }
  )
}

// Beneficiaries
export const useBeneficiaries = (filters?: Record<string, any>) => {
  return useApiQuery(
    queryKeys.beneficiaries.list(filters || {}),
    () => api.get('/beneficiaries', { params: filters }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes for beneficiary data
    }
  )
}

export const useBeneficiary = (id: string) => {
  return useApiQuery(
    queryKeys.beneficiaries.detail(id),
    () => api.get(`/beneficiaries/${id}`),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000
    }
  )
}

export const useCreateBeneficiary = () => {
  return useApiMutation(
    (beneficiaryData: any) => api.post('/beneficiaries', beneficiaryData),
    {
      invalidateQueries: [[...queryKeys.beneficiaries.all] as unknown[]],
      successMessage: 'Yararlanıcı başarıyla eklendi',
      errorMessage: 'Yararlanıcı eklenirken hata oluştu'
    }
  )
}

// Financial
export const useFinancialReport = (type: string, period: string) => {
  return useApiQuery(
    queryKeys.financial.report(type, period),
    () => api.get(`/financial/reports/${type}`, { params: { period } }),
    {
      enabled: !!type && !!period,
      staleTime: 15 * 60 * 1000, // 15 minutes for financial reports
    }
  )
}

export const useTransactions = (filters?: Record<string, any>) => {
  return useApiQuery(
    queryKeys.financial.transactions(),
    () => api.get('/financial/transactions', { params: filters }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for transaction data
    }
  )
}

// File upload hook
export const useFileUpload = () => {
  return useApiMutation(
    ({ file, endpoint }: { file: File; endpoint: string }) => 
      api.upload(endpoint, file),
    {
      successMessage: 'Dosya başarıyla yüklendi',
      errorMessage: 'Dosya yüklenirken hata oluştu'
    }
  )
}