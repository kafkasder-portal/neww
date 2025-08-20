import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { queryKeys } from '../lib/queryClient'
import { cacheStrategies } from '../lib/cacheStrategies'
import { toast } from 'sonner'

/**
 * React Query tabanlı API hook'ları
 */

// Generic API query hook
export const useApiQuery = <T = unknown>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    strategy?: keyof typeof cacheStrategies
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) => {
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  return useQuery({
    queryKey: key,
    queryFn,
    enabled: options?.enabled,
    ...strategy,
    meta: {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    },
  })
}

// Generic API mutation hook
export const useApiMutation = <TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void
    invalidateQueries?: readonly unknown[][]
    optimisticUpdate?: {
      queryKey: readonly unknown[]
      updater: (oldData: unknown, variables: TVariables) => unknown
    }
    successMessage?: string
    errorMessage?: string
  }
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (options?.optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: options.optimisticUpdate.queryKey })
        const previousData = queryClient.getQueryData(options.optimisticUpdate.queryKey)
        queryClient.setQueryData(
          options.optimisticUpdate.queryKey,
          options.optimisticUpdate.updater(previousData, variables)
        )
        return { previousData }
      }
    },
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables)
      
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (options?.optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(options.optimisticUpdate.queryKey, context.previousData)
      }
      
      options?.onError?.(error, variables)
      toast.error(options?.errorMessage || 'İşlem başarısız oldu')
    },
    onSettled: options?.onSettled,
  })
}

// Paginated query hook
export const usePaginatedQuery = <T = unknown>(
  baseKey: readonly unknown[],
  queryFn: (page: number, filters?: Record<string, unknown>) => Promise<{ items: T[]; total: number; page: number; totalPages: number }>,
  options?: {
    initialPage?: number
    pageSize?: number
    filters?: Record<string, unknown>
    enabled?: boolean
    strategy?: keyof typeof cacheStrategies
  }
) => {
  const [page, setPage] = useState(options?.initialPage ?? 1)
  const [filters, setFilters] = useState(options?.filters ?? {})
  
  const queryKey = [...baseKey, { page, filters }]
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  const query = useQuery({
    queryKey,
    queryFn: () => queryFn(page, filters),
    enabled: options?.enabled,
    ...strategy,
    placeholderData: (previousData) => previousData,
  })
  
  const nextPage = () => {
    if (query.data && page < query.data.totalPages) {
      setPage(prev => prev + 1)
    }
  }
  
  const previousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }
  
  const goToPage = (newPage: number) => {
    if (query.data && newPage >= 1 && newPage <= query.data.totalPages) {
      setPage(newPage)
    }
  }
  
  return {
    ...query,
    page,
    nextPage,
    previousPage,
    goToPage,
    setFilters,
    hasNextPage: query.data ? page < query.data.totalPages : false,
    hasPreviousPage: page > 1,
  }
}

// Infinite query hook
export const useInfiniteApiQuery = <T = unknown>(
  key: readonly unknown[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{ items: T[]; nextPage?: number; hasMore: boolean }>,
  options?: {
    enabled?: boolean
    initialPageParam?: number
    strategy?: keyof typeof cacheStrategies
  }
) => {
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  return useInfiniteQuery({
    queryKey: key,
    queryFn,
    initialPageParam: options?.initialPageParam ?? 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: options?.enabled,
    ...strategy,
  })
}

// Specific hooks for different entities

// Users
export const useUsers = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.users.lists(),
    () => fetch(`/api/users?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}

export const useUsersCount = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.users.count(),
    () => fetch(`/api/users/count?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}



export const useUser = (id: string, options: Record<string, unknown> = {}) => {
  return useApiQuery(
    queryKeys.users.detail(id),
    () => fetch(`/api/users/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateUser = () => {
  return useApiMutation(
    (userData: Record<string, unknown>) => fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla oluşturuldu',
      invalidateQueries: [[...queryKeys.users.all()]],
    }
  )
}

export const useUpdateUser = () => {
  return useApiMutation(
    ({ id, ...userData }: { id: string } & Record<string, unknown>) => fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla güncellendi',
      invalidateQueries: [[...queryKeys.users.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.users.lists(),
        updater: (oldData: unknown, variables: { id: string } & Record<string, unknown>) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string } & Record<string, unknown>> }
          return {
            ...data,
            items: data.items.map((user) =>
              user.id === variables.id ? { ...user, ...variables } : user
            ),
          }
        },
      },
    }
  )
}

export const useDeleteUser = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/users/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla silindi',
      invalidateQueries: [[...queryKeys.users.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.users.lists(),
        updater: (oldData: unknown, id: string) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData) || !('total' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string }>; total: number }
          return {
            ...data,
            items: data.items.filter((user) => user.id !== id),
            total: data.total - 1,
          }
        },
      },
    }
  )
}

// Institutions
export const useInstitutions = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.institutions.lists(),
    () => fetch(`/api/institutions?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}

export const useInstitutionsCount = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.institutions.count(),
    () => fetch(`/api/institutions/count?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}



export const useInstitution = (id: string, options: Record<string, unknown> = {}) => {
  return useApiQuery(
    queryKeys.institutions.detail(id),
    () => fetch(`/api/institutions/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateInstitution = () => {
  return useApiMutation(
    (institutionData: Record<string, unknown>) => fetch('/api/institutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institutionData),
    }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla oluşturuldu',
      invalidateQueries: [[...queryKeys.institutions.all()]],
    }
  )
}

export const useUpdateInstitution = () => {
  return useApiMutation(
    ({ id, ...institutionData }: { id: string } & Record<string, unknown>) => fetch(`/api/institutions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institutionData),
    }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla güncellendi',
      invalidateQueries: [[...queryKeys.institutions.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.institutions.lists(),
        updater: (oldData: unknown, variables: { id: string } & Record<string, unknown>) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string } & Record<string, unknown>> }
          return {
            ...data,
            items: data.items.map((institution) =>
              institution.id === variables.id ? { ...institution, ...variables } : institution
            ),
          }
        },
      },
    }
  )
}

export const useDeleteInstitution = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/institutions/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla silindi',
      invalidateQueries: [[...queryKeys.institutions.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.institutions.lists(),
        updater: (oldData: unknown, id: string) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData) || !('total' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string }>; total: number }
          return {
            ...data,
            items: data.items.filter((institution) => institution.id !== id),
            total: data.total - 1,
          }
        },
      },
    }
  )
}

// Message Templates
export const useMessageTemplates = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.lists(),
    () => fetch(`/api/message-templates?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}

export const useMessageTemplatesCount = (filters: Record<string, string> = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.count(),
    () => fetch(`/api/message-templates/count?${new URLSearchParams(filters)}`).then(res => res.json())
  )
}



export const useMessageTemplate = (id: string, options: Record<string, unknown> = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.detail(id),
    () => fetch(`/api/message-templates/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateMessageTemplate = () => {
  return useApiMutation(
    (templateData: Record<string, unknown>) => fetch('/api/message-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    }).then(res => res.json()),
    {
      successMessage: 'Mesaj şablonu başarıyla oluşturuldu',
      invalidateQueries: [[...queryKeys.messages.templates.all()]],
    }
  )
}

export const useUpdateMessageTemplate = () => {
  return useApiMutation(
    ({ id, ...templateData }: { id: string } & Record<string, unknown>) => fetch(`/api/message-templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    }).then(res => res.json()),
    {
      successMessage: 'Mesaj şablonu başarıyla güncellendi',
      invalidateQueries: [[...queryKeys.messages.templates.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.messages.templates.lists(),
        updater: (oldData: unknown, variables: { id: string } & Record<string, unknown>) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string } & Record<string, unknown>> }
          return {
            ...data,
            items: data.items.map((template) =>
              template.id === variables.id ? { ...template, ...variables } : template
            ),
          }
        },
      },
    }
  )
}

export const useDeleteMessageTemplate = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/message-templates/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Mesaj şablonu başarıyla silindi',
      invalidateQueries: [[...queryKeys.messages.templates.all()]],
      optimisticUpdate: {
        queryKey: queryKeys.messages.templates.lists(),
        updater: (oldData: unknown, id: string) => {
          if (!oldData || typeof oldData !== 'object' || !('items' in oldData) || !('total' in oldData)) return oldData
          const data = oldData as { items: Array<{ id: string }>; total: number }
          return {
            ...data,
            items: data.items.filter((template) => template.id !== id),
            total: data.total - 1,
          }
        },
      },
    }
  )
}

// Dashboard
export const useDashboardStats = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.stats(),
    () => fetch('/api/dashboard/stats').then(res => res.json()),
    { ...options, strategy: 'dynamic' } // 2 dakika cache
  )

export const useDashboardCharts = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.charts(),
    () => fetch('/api/dashboard/charts').then(res => res.json()),
    { ...options, strategy: 'static' } // 5 dakika cache
  )

export const useDashboardRecentActivities = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.recent(),
    () => fetch('/api/dashboard/recent-activities').then(res => res.json()),
    { ...options, strategy: 'realTime' } // 1 dakika cache
  )

// Alias exports for backward compatibility
export const useUserMutation = useCreateUser
export const useInstitutionMutation = useCreateInstitution