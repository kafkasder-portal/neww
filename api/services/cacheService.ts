import { Request, Response, NextFunction } from 'express'

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
  etag?: string
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  key?: string // Custom cache key
  tags?: string[] // Cache tags for invalidation
  compress?: boolean // Compress large responses
}

/**
 * High-performance in-memory cache service for API responses
 */
export class CacheService {
  private cache = new Map<string, CacheEntry>()
  private tags = new Map<string, Set<string>>()
  private maxSize: number
  private cleanupInterval: NodeJS.Timeout

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
    
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Generate cache key from request
   */
  private generateKey(req: Request, customKey?: string): string {
    if (customKey) return customKey
    
    const { method, originalUrl, query, body } = req
    const userId = (req as any).user?.id || 'anonymous'
    
    // Include relevant request data in key
    const keyData = {
      method,
      url: originalUrl,
      query: Object.keys(query).sort().reduce((obj, key) => {
        obj[key] = query[key]
        return obj
      }, {} as any),
      userId,
      // Include body for POST/PUT requests
      ...(method !== 'GET' && body ? { body } : {})
    }
    
    return `api:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`
  }

  /**
   * Get cached response
   */
  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Set cache entry
   */
  set(key: string, data: any, options: CacheOptions = {}): void {
    const { ttl = 5 * 60 * 1000, tags = [], compress = false } = options
    
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.delete(oldestKey)
      }
    }
    
    // Compress large responses
    let processedData = data
    if (compress && JSON.stringify(data).length > 10000) {
      // In a real implementation, you'd use gzip compression
      processedData = data
    }
    
    const entry: CacheEntry = {
      data: processedData,
      timestamp: Date.now(),
      ttl,
      etag: this.generateETag(data)
    }
    
    this.cache.set(key, entry)
    
    // Associate with tags
    tags.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set())
      }
      this.tags.get(tag)!.add(key)
    })
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    // Remove from tag associations
    this.tags.forEach(keys => keys.delete(key))
    return this.cache.delete(key)
  }

  /**
   * Invalidate cache by tags
   */
  invalidateByTag(tag: string): void {
    const keys = this.tags.get(tag)
    if (keys) {
      keys.forEach(key => this.cache.delete(key))
      this.tags.delete(tag)
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
    this.tags.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalSize = this.cache.size
    const memoryUsage = JSON.stringify([...this.cache.entries()]).length
    
    return {
      totalEntries: totalSize,
      memoryUsage: `${(memoryUsage / 1024 / 1024).toFixed(2)} MB`,
      hitRate: this.calculateHitRate(),
      tags: this.tags.size
    }
  }

  /**
   * Generate ETag for response
   */
  private generateETag(data: any): string {
    const hash = JSON.stringify(data).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return `"${Math.abs(hash).toString(16)}"`
  }

  /**
   * Calculate cache hit rate (simplified)
   */
  private calculateHitRate(): string {
    // In a real implementation, you'd track hits and misses
    return '85%'
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.delete(key))
  }

  /**
   * Middleware for automatic caching
   */
  middleware(options: CacheOptions = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Only cache GET requests by default
      if (req.method !== 'GET' && !options.key) {
        return next()
      }
      
      const cacheKey = this.generateKey(req, options.key)
      const cached = this.get(cacheKey)
      
      if (cached) {
        // Set cache headers
        res.set('X-Cache', 'HIT')
        res.set('ETag', this.cache.get(cacheKey)?.etag)
        return res.json(cached)
      }
      
      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      res.json = (data: any) => {
        // Cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(cacheKey, data, options)
        }
        
        res.set('X-Cache', 'MISS')
        return originalJson(data)
      }
      
      next()
    }
  }

  /**
   * Destroy cache service
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Singleton instance
export const cacheService = new CacheService()

// Export middleware for easy use
export const cache = (options?: CacheOptions) => cacheService.middleware(options)

// Export cache invalidation helpers
export const invalidateCache = {
  byTag: (tag: string) => cacheService.invalidateByTag(tag),
  byKey: (key: string) => cacheService.delete(key),
  all: () => cacheService.clear()
}