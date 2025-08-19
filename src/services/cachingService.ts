import { queryClient } from '../lib/queryClient'

/**
 * Cache türleri
 */
export type CacheType = 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB'

/**
 * Cache entry interface
 */
interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
  version?: string
  size?: number
}

/**
 * Cache stratejileri
 */
export interface CacheStrategy {
  type: CacheType
  ttl: number
  maxSize?: number
  compression?: boolean
  encryption?: boolean
}

/**
 * Caching service sınıfı
 */
class CachingServiceClass {
  private memoryCache = new Map<string, CacheEntry>()
  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024 // 50MB
  private readonly COMPRESSION_THRESHOLD = 1024 // 1KB
  private currentMemorySize = 0

  /**
   * Veriyi cache'e kaydet
   */
  async set<T>(
    key: string,
    data: T,
    strategy: CacheStrategy = { type: 'memory', ttl: 300000 } // Default 5 minutes
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: strategy.ttl,
      version: this.getDataVersion(data),
    }

    // Compression uygula
    if (strategy.compression && this.shouldCompress(data)) {
      entry.data = await this.compress(data)
    }

    // Encryption uygula
    if (strategy.encryption) {
      entry.data = await this.encrypt(entry.data)
    }

    // Size hesapla
    entry.size = this.calculateSize(entry.data)

    // Cache türüne göre kaydet
    switch (strategy.type) {
      case 'memory':
        await this.setMemoryCache(key, entry, strategy.maxSize)
        break
      case 'localStorage':
        await this.setLocalStorageCache(key, entry)
        break
      case 'sessionStorage':
        await this.setSessionStorageCache(key, entry)
        break
      case 'indexedDB':
        await this.setIndexedDBCache()
        break
    }
  }

  /**
   * Cache'den veri al
   */
  async get<T>(key: string, strategy?: CacheStrategy): Promise<T | null> {
    let entry: CacheEntry<T> | null = null

    // Önce memory cache'e bak
    if (this.memoryCache.has(key)) {
      entry = this.memoryCache.get(key) as CacheEntry<T>
    } else if (strategy) {
      // Diğer cache türlerinden al
      switch (strategy.type) {
        case 'localStorage':
          entry = await this.getLocalStorageCache<T>(key)
          break
        case 'sessionStorage':
          entry = await this.getSessionStorageCache<T>(key)
          break
        case 'indexedDB':
          entry = await this.getIndexedDBCache<T>()
          break
      }
    }

    if (!entry) return null

    // TTL kontrolü
    if (this.isExpired(entry)) {
      await this.delete(key, strategy)
      return null
    }

    // Decrypt ve decompress
    let data = entry.data
    if (strategy?.encryption) {
      data = await this.decrypt(data)
    }
    if (strategy?.compression) {
      data = await this.decompress(data)
    }

    // Memory cache'e de kaydet (performance için)
    if (strategy?.type !== 'memory') {
      this.memoryCache.set(key, { ...entry, data })
    }

    return data
  }

  /**
   * Cache'den veri sil
   */
  async delete(key: string, strategy?: CacheStrategy): Promise<void> {
    // Memory cache'den sil
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)
      if (entry?.size) {
        this.currentMemorySize -= entry.size
      }
      this.memoryCache.delete(key)
    }

    // Diğer cache türlerinden sil
    if (strategy) {
      switch (strategy.type) {
        case 'localStorage':
          localStorage.removeItem(`cache_${key}`)
          break
        case 'sessionStorage':
          sessionStorage.removeItem(`cache_${key}`)
          break
        case 'indexedDB':
          await this.deleteIndexedDBCache()
          break
      }
    }
  }

  /**
   * Cache'i temizle
   */
  async clear(strategy?: CacheStrategy): Promise<void> {
    if (!strategy || strategy.type === 'memory') {
      this.memoryCache.clear()
      this.currentMemorySize = 0
    }

    if (!strategy || strategy.type === 'localStorage') {
      this.clearPrefixedStorage(localStorage, 'cache_')
    }

    if (!strategy || strategy.type === 'sessionStorage') {
      this.clearPrefixedStorage(sessionStorage, 'cache_')
    }

    if (!strategy || strategy.type === 'indexedDB') {
      await this.clearIndexedDBCache()
    }
  }

  /**
   * Cache istatistikleri
   */
  getStats() {
    const memoryEntries = Array.from(this.memoryCache.values())
    const localStorageSize = this.getStorageSize(localStorage, 'cache_')
    const sessionStorageSize = this.getStorageSize(sessionStorage, 'cache_')

    return {
      memory: {
        entries: this.memoryCache.size,
        size: this.currentMemorySize,
        maxSize: this.MAX_MEMORY_SIZE,
        utilization: (this.currentMemorySize / this.MAX_MEMORY_SIZE) * 100,
        expired: memoryEntries.filter(entry => this.isExpired(entry)).length,
      },
      localStorage: {
        size: localStorageSize,
        entries: this.countPrefixedEntries(localStorage, 'cache_'),
      },
      sessionStorage: {
        size: sessionStorageSize,
        entries: this.countPrefixedEntries(sessionStorage, 'cache_'),
      },
      total: {
        entries: this.memoryCache.size + 
                this.countPrefixedEntries(localStorage, 'cache_') + 
                this.countPrefixedEntries(sessionStorage, 'cache_'),
        size: this.currentMemorySize + localStorageSize + sessionStorageSize,
      },
    }
  }

  /**
   * Expired cache'leri temizle
   */
  async cleanup(): Promise<void> {
    // Memory cache cleanup
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key)
        if (entry.size) {
          this.currentMemorySize -= entry.size
        }
      }
    }

    // LocalStorage cleanup
    this.cleanupStorage(localStorage, 'cache_')
    
    // SessionStorage cleanup  
    this.cleanupStorage(sessionStorage, 'cache_')

    // IndexedDB cleanup
    await this.cleanupIndexedDBCache()
  }

  /**
   * Memory cache'e kaydet
   */
  private async setMemoryCache<T>(
    key: string,
    entry: CacheEntry<T>,
    maxSize?: number
  ): Promise<void> {
    const size = entry.size || 0
    const effectiveMaxSize = maxSize || this.MAX_MEMORY_SIZE

    // Size kontrolü
    if (this.currentMemorySize + size > effectiveMaxSize) {
      await this.evictMemoryCache(size)
    }

    // Eski entry varsa size'ını çıkar
    if (this.memoryCache.has(key)) {
      const oldEntry = this.memoryCache.get(key)
      if (oldEntry?.size) {
        this.currentMemorySize -= oldEntry.size
      }
    }

    this.memoryCache.set(key, entry)
    this.currentMemorySize += size
  }

  /**
   * Memory cache eviction (LRU)
   */
  private async evictMemoryCache(requiredSpace: number): Promise<void> {
    const entries = Array.from(this.memoryCache.entries())
    
    // Timestamp'e göre sırala (en eski ilk)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp)

    let freedSpace = 0
    for (const [key, entry] of entries) {
      this.memoryCache.delete(key)
      const size = entry.size || 0
      this.currentMemorySize -= size
      freedSpace += size

      if (freedSpace >= requiredSpace) {
        break
      }
    }
  }

  /**
   * LocalStorage cache
   */
  private async setLocalStorageCache<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      // QuotaExceededError durumunda eski cache'leri temizle
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupStorage(localStorage, 'cache_')
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
        } catch (retryError) {
          console.warn('LocalStorage cache kaydedilemedi:', retryError)
        }
      }
    }
  }

  private async getLocalStorageCache<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const item = localStorage.getItem(`cache_${key}`)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn('LocalStorage cache okunamadı:', error)
      return null
    }
  }

  /**
   * SessionStorage cache
   */
  private async setSessionStorageCache<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      sessionStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupStorage(sessionStorage, 'cache_')
        try {
          sessionStorage.setItem(`cache_${key}`, JSON.stringify(entry))
        } catch (retryError) {
          console.warn('SessionStorage cache kaydedilemedi:', retryError)
        }
      }
    }
  }

  private async getSessionStorageCache<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const item = sessionStorage.getItem(`cache_${key}`)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn('SessionStorage cache okunamadı:', error)
      return null
    }
  }

  /**
   * IndexedDB cache (future implementation)
   */
  private async setIndexedDBCache(): Promise<void> {
    // Implementation would go here
    console.log('Setting IndexedDB cache')
  }

  private async getIndexedDBCache<T>(): Promise<CacheEntry<T> | null> {
    // Implementation would go here
    console.log('Getting IndexedDB cache')
    return null
  }

  private async deleteIndexedDBCache(): Promise<void> {
    // Implementation would go here
    console.log('Deleting IndexedDB cache')
  }

  private async clearIndexedDBCache(): Promise<void> {
    // IndexedDB implementation placeholder
  }

  private async cleanupIndexedDBCache(): Promise<void> {
    // IndexedDB implementation placeholder
  }

  /**
   * Utility methods
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private getDataVersion(data: unknown): string {
    // Simple version hash
    return btoa(JSON.stringify(data)).slice(0, 8)
  }

  private shouldCompress(data: unknown): boolean {
    return this.calculateSize(data) > this.COMPRESSION_THRESHOLD
  }

  private calculateSize(data: unknown): number {
    return new Blob([JSON.stringify(data)]).size
  }

  private async compress<T>(data: T): Promise<T> {
    // Simple compression placeholder
    // Real implementation would use CompressionStream
    return data
  }

  private async decompress<T>(data: T): Promise<T> {
    // Simple decompression placeholder
    return data
  }

  private async encrypt<T>(data: T): Promise<T> {
    // Simple encryption placeholder
    // Real implementation would use Web Crypto API
    return data
  }

  private async decrypt<T>(data: T): Promise<T> {
    // Simple decryption placeholder
    return data
  }

  private clearPrefixedStorage(storage: Storage, prefix: string): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => storage.removeItem(key))
  }

  private cleanupStorage(storage: Storage, prefix: string): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(prefix)) {
        try {
          const item = storage.getItem(key)
          if (item) {
            const entry = JSON.parse(item)
            if (this.isExpired(entry)) {
              keysToRemove.push(key)
            }
          }
        } catch (_error) {
          // Corrupted entry, remove it
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach(key => storage.removeItem(key))
  }

  private getStorageSize(storage: Storage, prefix: string): number {
    let size = 0
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(prefix)) {
        const item = storage.getItem(key)
        if (item) {
          size += new Blob([item]).size
        }
      }
    }
    return size
  }

  private countPrefixedEntries(storage: Storage, prefix: string): number {
    let count = 0
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(prefix)) {
        count++
      }
    }
    return count
  }
}

// Singleton instance
export const CachingService = new CachingServiceClass()

/**
 * React Query cache ile entegrasyon
 */
export const ReactQueryCacheManager = {
  /**
   * Query cache'ini localStorage'a persist et
   */
  persistQueryCache: async () => {
    try {
      const cache = queryClient.getQueryCache()
      const queries = cache.getAll()
      
      const persistData = queries.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
        error: query.state.error,
      }))

      await CachingService.set(
        'react-query-cache',
        persistData,
        { type: 'localStorage', ttl: 24 * 60 * 60 * 1000 } // 24 hours
      )
    } catch (error) {
      console.warn('Query cache persist edilemedi:', error)
    }
  },

  /**
   * Query cache'ini localStorage'dan restore et
   */
  restoreQueryCache: async () => {
    try {
      const persistData = await CachingService.get<Array<{
        queryKey: unknown
        data: unknown
        dataUpdatedAt: number
        error: unknown
      }>>(
        'react-query-cache',
        { type: 'localStorage', ttl: 24 * 60 * 60 * 1000 }
      )

      if (persistData && Array.isArray(persistData)) {
        persistData.forEach(queryData => {
          queryClient.setQueryData(queryData.queryKey as readonly unknown[], queryData.data)
        })
      }
    } catch (error) {
      console.warn('Query cache restore edilemedi:', error)
    }
  },

  /**
   * Query cache'ini temizle
   */
  clearQueryCache: async () => {
    queryClient.clear()
    await CachingService.delete('react-query-cache', { type: 'localStorage', ttl: 0 })
  },
}

/**
 * Cache stratejileri için preset'ler
 */
export const CacheStrategies = {
  // Kısa süreli veriler (5 dakika)
  shortTerm: { type: 'memory' as CacheType, ttl: 5 * 60 * 1000 },
  
  // Orta vadeli veriler (1 saat)
  mediumTerm: { type: 'localStorage' as CacheType, ttl: 60 * 60 * 1000 },
  
  // Uzun vadeli veriler (24 saat)
  longTerm: { type: 'localStorage' as CacheType, ttl: 24 * 60 * 60 * 1000 },
  
  // Session boyunca
  session: { type: 'sessionStorage' as CacheType, ttl: 8 * 60 * 60 * 1000 },
  
  // Sıkıştırmalı büyük veriler
  compressed: { 
    type: 'localStorage' as CacheType, 
    ttl: 60 * 60 * 1000, 
    compression: true 
  },
  
  // Şifreli hassas veriler
  secure: { 
    type: 'sessionStorage' as CacheType, 
    ttl: 30 * 60 * 1000, 
    encryption: true 
  },
}

// Auto cleanup her 5 dakikada bir
setInterval(() => {
  CachingService.cleanup()
}, 5 * 60 * 1000)

// Page visibility change'de persist et
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    ReactQueryCacheManager.persistQueryCache()
  }
})

// Sayfa yüklendiğinde restore et
window.addEventListener('load', () => {
  ReactQueryCacheManager.restoreQueryCache()
})
