import { QueryClient } from '@tanstack/react-query'
import type { FilterParams } from '../api/types'

/**
 * React Query client konfigürasyonu
 * Advanced caching, background refetching ve offline support ile
 */

// Query client konfigürasyonu
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache süresi - 5 dakika
      staleTime: 5 * 60 * 1000,
      // Garbage collection süresi - 10 dakika
      gcTime: 10 * 60 * 1000,
      // Background refetch ayarları
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      // Retry ayarları
      retry: (failureCount, error: unknown) => {
        // 404 hatalarında retry yapma
        if ((error as any)?.status === 404) return false
        // 401/403 hatalarında retry yapma (auth sorunları)
        if ((error as any)?.status === 401 || (error as any)?.status === 403) return false
        // Maksimum 3 retry
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Network durumu kontrolü
      networkMode: 'online',
    },
    mutations: {
      // Mutation retry ayarları
      retry: (failureCount, error: unknown) => {
        // Auth hatalarında retry yapma
        if ((error as any)?.status === 401 || (error as any)?.status === 403) return false
        // Validation hatalarında retry yapma
        if ((error as any)?.status === 400 || (error as any)?.status === 422) return false
        // Maksimum 2 retry
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      // Network durumu kontrolü
      networkMode: 'online',
    },
  },
})

/**
 * Query key factory - tutarlı query key'leri için
 */
export const queryKeys = {
  // Auth
  auth: {
    user: () => ['auth', 'user'] as const,
    permissions: () => ['auth', 'permissions'] as const,
  },
  
  // Users
  users: {
    all: () => ['users'] as const,
    lists: () => [...queryKeys.users.all(), 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.users.lists(), { filters }] as const,
    count: () => [...queryKeys.users.all(), 'count'] as const,
    details: () => [...queryKeys.users.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Institutions
  institutions: {
    all: () => ['institutions'] as const,
    lists: () => [...queryKeys.institutions.all(), 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.institutions.lists(), { filters }] as const,
    count: () => [...queryKeys.institutions.all(), 'count'] as const,
    details: () => [...queryKeys.institutions.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.institutions.details(), id] as const,
  },
  
  // Messages
  messages: {
    all: () => ['messages'] as const,
    templates: {
      all: () => [...queryKeys.messages.all(), 'templates'] as const,
      lists: () => [...queryKeys.messages.templates.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.messages.templates.lists(), { filters }] as const,
      count: () => [...queryKeys.messages.templates.all(), 'count'] as const,
      details: () => [...queryKeys.messages.templates.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.messages.templates.details(), id] as const,
    },
    deliveries: {
      all: () => [...queryKeys.messages.all(), 'deliveries'] as const,
      lists: () => [...queryKeys.messages.deliveries.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.messages.deliveries.lists(), { filters }] as const,
    },
  },
  
  // Donations
  donations: {
    all: () => ['donations'] as const,
    lists: () => [...queryKeys.donations.all(), 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.donations.lists(), { filters }] as const,
    details: () => [...queryKeys.donations.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.donations.details(), id] as const,
    stats: () => [...queryKeys.donations.all(), 'stats'] as const,
  },
  
  // Aid
  aid: {
    all: () => ['aid'] as const,
    applications: {
      all: () => [...queryKeys.aid.all(), 'applications'] as const,
      lists: () => [...queryKeys.aid.applications.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.aid.applications.lists(), { filters }] as const,
      details: () => [...queryKeys.aid.applications.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.aid.applications.details(), id] as const,
    },
    beneficiaries: {
      all: () => [...queryKeys.aid.all(), 'beneficiaries'] as const,
      lists: () => [...queryKeys.aid.beneficiaries.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.aid.beneficiaries.lists(), { filters }] as const,
      details: () => [...queryKeys.aid.beneficiaries.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.aid.beneficiaries.details(), id] as const,
    },
  },
  
  // Scholarship
  scholarship: {
    all: () => ['scholarship'] as const,
    applications: {
      all: () => [...queryKeys.scholarship.all(), 'applications'] as const,
      lists: () => [...queryKeys.scholarship.applications.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.scholarship.applications.lists(), { filters }] as const,
      details: () => [...queryKeys.scholarship.applications.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.scholarship.applications.details(), id] as const,
    },
    students: {
      all: () => [...queryKeys.scholarship.all(), 'students'] as const,
      lists: () => [...queryKeys.scholarship.students.all(), 'list'] as const,
      list: (filters: FilterParams) => [...queryKeys.scholarship.students.lists(), { filters }] as const,
      details: () => [...queryKeys.scholarship.students.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.scholarship.students.details(), id] as const,
    },
  },
  
  // Dashboard
  dashboard: {
    all: () => ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all(), 'stats'] as const,
    charts: () => [...queryKeys.dashboard.all(), 'charts'] as const,
    recent: () => [...queryKeys.dashboard.all(), 'recent'] as const,
  },
}

/**
 * Cache invalidation helper'ları
 */
export const invalidateQueries = {
  // Tüm cache'i temizle
  all: () => queryClient.invalidateQueries(),
  
  // Belirli modül cache'ini temizle
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all() }),
  institutions: () => queryClient.invalidateQueries({ queryKey: queryKeys.institutions.all() }),
  messages: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages.all() }),
  donations: () => queryClient.invalidateQueries({ queryKey: queryKeys.donations.all() }),
  aid: () => queryClient.invalidateQueries({ queryKey: queryKeys.aid.all() }),
  scholarship: () => queryClient.invalidateQueries({ queryKey: queryKeys.scholarship.all() }),
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() }),
  
  // Auth cache'ini temizle
  auth: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.permissions() })
  },
}

/**
 * Prefetch helper'ları
 */
export const prefetchQueries = {
  // Dashboard verilerini prefetch et
  dashboard: async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
        staleTime: 2 * 60 * 1000, // 2 dakika
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.recent(),
        queryFn: () => fetch('/api/dashboard/recent').then(res => res.json()),
        staleTime: 1 * 60 * 1000, // 1 dakika
      }),
    ])
  },
}

/**
 * Offline support için cache persistence
 */
export const cacheUtils = {
  // Cache'i localStorage'a kaydet
  saveToStorage: () => {
    try {
      const cache = queryClient.getQueryCache()
      const queries = cache.getAll()
      const serializedQueries = queries.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      }))
      localStorage.setItem('react-query-cache', JSON.stringify(serializedQueries))
    } catch (error) {
      console.warn('Cache kaydedilemedi:', error)
    }
  },
  
  // Cache'i localStorage'dan yükle
  loadFromStorage: () => {
    try {
      const cached = localStorage.getItem('react-query-cache')
      if (cached) {
        const queries = JSON.parse(cached)
        queries.forEach((query: { queryKey: unknown; data: unknown }) => {
          queryClient.setQueryData(query.queryKey as readonly unknown[], query.data)
        })
      }
    } catch (error) {
      console.warn('Cache yüklenemedi:', error)
    }
  },
  
  // Cache'i temizle
  clearStorage: () => {
    try {
      localStorage.removeItem('react-query-cache')
    } catch (error) {
      console.warn('Cache temizlenemedi:', error)
    }
  },
}