import { QueryClient } from '@tanstack/react-query'

// Cache stratejileri için interface'ler
export interface CacheStrategy {
  name: string
  description: string
  staleTime: number
  gcTime: number
  refetchOnWindowFocus: boolean
  refetchOnReconnect: boolean
  refetchOnMount: boolean
  retry: boolean | number | ((failureCount: number, error: unknown) => boolean)
  retryDelay?: number | ((attemptIndex: number) => number)
}

export interface CacheConfig {
  [key: string]: CacheStrategy
}

// Farklı veri türleri için cache stratejileri
export const cacheStrategies: CacheConfig = {
  // Kullanıcı verileri - uzun süreli cache
  user: {
    name: 'User Data',
    description: 'Kullanıcı profili ve yetkileri - uzun süreli cache',
    staleTime: 30 * 60 * 1000, // 30 dakika
    gcTime: 60 * 60 * 1000, // 1 saat
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: 2
  },

  // Liste verileri - orta süreli cache
  list: {
    name: 'List Data',
    description: 'Tablo listeleri - orta süreli cache',
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 15 * 60 * 1000, // 15 dakika
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3
  },

  // Detay verileri - kısa süreli cache
  detail: {
    name: 'Detail Data',
    description: 'Detay sayfaları - kısa süreli cache',
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 2
  },

  // Rapor verileri - uzun süreli cache
  report: {
    name: 'Report Data',
    description: 'Raporlar ve analizler - uzun süreli cache',
    staleTime: 15 * 60 * 1000, // 15 dakika
    gcTime: 30 * 60 * 1000, // 30 dakika
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: 1
  },

  // Gerçek zamanlı veriler - minimum cache
  realtime: {
    name: 'Real-time Data',
    description: 'Gerçek zamanlı veriler - minimum cache',
    staleTime: 30 * 1000, // 30 saniye
    gcTime: 2 * 60 * 1000, // 2 dakika
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 1
  },

  // Statik veriler - çok uzun süreli cache
  static: {
    name: 'Static Data',
    description: 'Statik veriler - çok uzun süreli cache',
    staleTime: 24 * 60 * 60 * 1000, // 24 saat
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 gün
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1
  },

  // Arama sonuçları - kısa süreli cache
  search: {
    name: 'Search Results',
    description: 'Arama sonuçları - kısa süreli cache',
    staleTime: 1 * 60 * 1000, // 1 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1
  }
}

// Cache yönetimi sınıfı
export class CacheManager {
  private queryClient: QueryClient
  private cacheStats: Map<string, { hits: number; misses: number; size: number }> = new Map()

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    this.initializeCacheStats()
  }

  // Cache istatistiklerini başlat
  private initializeCacheStats() {
    Object.keys(cacheStrategies).forEach(strategy => {
      this.cacheStats.set(strategy, { hits: 0, misses: 0, size: 0 })
    })
  }

  // Stratejiye göre cache ayarlarını al
  getCacheConfig(strategy: string): CacheStrategy | null {
    return cacheStrategies[strategy] || null
  }

  // Query için cache ayarlarını uygula
  applyCacheStrategy(queryKey: string[], strategy: string) {
    const config = this.getCacheConfig(strategy)
    if (!config) return

    // Query'yi cache stratejisi ile yapılandır
    this.queryClient.setQueryDefaults(queryKey, {
      staleTime: config.staleTime,
      gcTime: config.gcTime,
      refetchOnWindowFocus: config.refetchOnWindowFocus,
      refetchOnReconnect: config.refetchOnReconnect,
      refetchOnMount: config.refetchOnMount,
      retry: config.retry,
      retryDelay: config.retryDelay
    })
  }

  // Cache'i temizle
  clearCache(pattern?: string) {
    if (pattern) {
      this.queryClient.removeQueries({ queryKey: [pattern] })
    } else {
      this.queryClient.clear()
    }
  }

  // Belirli bir query'yi invalidate et
  invalidateQuery(queryKey: string[]) {
    this.queryClient.invalidateQueries({ queryKey })
  }

  // Cache boyutunu al
  getCacheSize(): number {
    const queries = this.queryClient.getQueryCache().getAll()
    return queries.length
  }

  // Cache istatistiklerini al
  getCacheStats() {
    return Object.fromEntries(this.cacheStats)
  }

  // Cache hit/miss kaydet
  recordCacheHit(strategy: string) {
    const stats = this.cacheStats.get(strategy)
    if (stats) {
      stats.hits++
      this.cacheStats.set(strategy, stats)
    }
  }

  recordCacheMiss(strategy: string) {
    const stats = this.cacheStats.get(strategy)
    if (stats) {
      stats.misses++
      this.cacheStats.set(strategy, stats)
    }
  }

  // Cache performans raporu
  getCachePerformanceReport() {
    const report: Record<string, any> = {}
    
    Object.entries(this.cacheStats).forEach(([strategy, stats]) => {
      const total = stats.hits + stats.misses
      const hitRate = total > 0 ? (stats.hits / total) * 100 : 0
      
      report[strategy] = {
        hits: stats.hits,
        misses: stats.misses,
        hitRate: `${hitRate.toFixed(2)}%`,
        size: stats.size
      }
    })

    return report
  }

  // Intelligent prefetching
  async prefetchQuery(queryKey: string[], strategy: string = 'list') {
    const config = this.getCacheConfig(strategy)
    if (!config) return

    try {
      await this.queryClient.prefetchQuery({
        queryKey,
        staleTime: config.staleTime,
        gcTime: config.gcTime
      })
    } catch (error) {
      console.warn('Prefetch failed:', error)
    }
  }

  // Background sync
  async backgroundSync(queryKey: string[]) {
    try {
      await this.queryClient.refetchQueries({ queryKey })
    } catch (error) {
      console.warn('Background sync failed:', error)
    }
  }

  // Cache optimization
  optimizeCache() {
    const queries = this.queryClient.getQueryCache().getAll()
    const now = Date.now()

    // Eski query'leri temizle
    queries.forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt
      const age = now - lastUpdated
      
      // 1 saatten eski query'leri temizle
      if (age > 60 * 60 * 1000) {
        this.queryClient.removeQueries({ queryKey: query.queryKey })
      }
    })
  }

  // Memory usage monitoring
  getMemoryUsage() {
    const queries = this.queryClient.getQueryCache().getAll()
    let totalSize = 0

    queries.forEach(query => {
      if (query.state.data) {
        totalSize += JSON.stringify(query.state.data).length
      }
    })

    return {
      queryCount: queries.length,
      totalSize: totalSize,
      averageSize: queries.length > 0 ? totalSize / queries.length : 0
    }
  }
}

// Cache hooks
export function useCacheStrategy(strategy: string) {
  return cacheStrategies[strategy] || cacheStrategies.list
}

export function useCacheManager(queryClient: QueryClient) {
  return new CacheManager(queryClient)
}

// Cache utilities
export const cacheUtils = {
  // Query key'den strateji tahmin et
  guessStrategy(queryKey: string[]): string {
    const key = queryKey.join(' ').toLowerCase()
    
    if (key.includes('user') || key.includes('auth')) return 'user'
    if (key.includes('report') || key.includes('analytics')) return 'report'
    if (key.includes('detail') || key.includes('show')) return 'detail'
    if (key.includes('search') || key.includes('filter')) return 'search'
    if (key.includes('realtime') || key.includes('live')) return 'realtime'
    if (key.includes('static') || key.includes('config')) return 'static'
    
    return 'list'
  },

  // Cache key oluştur
  createCacheKey(module: string, action: string, params?: Record<string, any>): string[] {
    const key = [module, action]
    if (params) {
      key.push(JSON.stringify(params))
    }
    return key
  },

  // Cache key'den parametreleri çıkar
  extractParams(queryKey: string[]): Record<string, any> | null {
    if (queryKey.length > 2) {
      try {
        return JSON.parse(queryKey[2])
      } catch {
        return null
      }
    }
    return null
  },

  // Cache key'leri karşılaştır
  isSameQuery(key1: string[], key2: string[]): boolean {
    if (key1.length !== key2.length) return false
    
    return key1.every((part, index) => {
      if (index === 2) {
        // Parametreleri JSON olarak karşılaştır
        try {
          const params1 = JSON.parse(part)
          const params2 = JSON.parse(key2[index])
          return JSON.stringify(params1) === JSON.stringify(params2)
        } catch {
          return part === key2[index]
        }
      }
      return part === key2[index]
    })
  }
}