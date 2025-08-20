import { Request, Response, NextFunction } from 'express'

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  maxRequests?: number // Max requests per window
  keyGenerator?: (req: Request) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  message?: string // Custom error message
  headers?: boolean // Include rate limit headers
}

/**
 * High-performance rate limiting service
 */
export class RateLimitService {
  private limits = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  /**
   * Generate rate limit key
   */
  private generateKey(req: Request, keyGenerator?: (req: Request) => string): string {
    if (keyGenerator) {
      return keyGenerator(req)
    }
    
    // Default: IP + User ID + Route
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const userId = (req as any).user?.id || 'anonymous'
    const route = req.route?.path || req.path
    
    return `${ip}:${userId}:${route}`
  }

  /**
   * Check if request should be rate limited
   */
  isLimited(key: string, options: RateLimitOptions): { limited: boolean; resetTime: number; remaining: number } {
    const { windowMs = 15 * 60 * 1000, maxRequests = 100 } = options
    const now = Date.now()
    
    let entry = this.limits.get(key)
    
    // Create new entry or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
        blocked: false
      }
      this.limits.set(key, entry)
    }
    
    // Check if blocked
    if (entry.blocked && now < entry.resetTime) {
      return {
        limited: true,
        resetTime: entry.resetTime,
        remaining: 0
      }
    }
    
    // Increment counter
    entry.count++
    
    // Check if limit exceeded
    if (entry.count > maxRequests) {
      entry.blocked = true
      return {
        limited: true,
        resetTime: entry.resetTime,
        remaining: 0
      }
    }
    
    return {
      limited: false,
      resetTime: entry.resetTime,
      remaining: Math.max(0, maxRequests - entry.count)
    }
  }

  /**
   * Decrement counter (for successful requests if skipSuccessfulRequests is true)
   */
  decrement(key: string): void {
    const entry = this.limits.get(key)
    if (entry && entry.count > 0) {
      entry.count--
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Get current stats for a key
   */
  getStats(key: string): { count: number; resetTime: number; blocked: boolean } | null {
    return this.limits.get(key) || null
  }

  /**
   * Get global stats
   */
  getGlobalStats() {
    const totalKeys = this.limits.size
    const blockedKeys = Array.from(this.limits.values()).filter(entry => entry.blocked).length
    
    return {
      totalKeys,
      blockedKeys,
      activeKeys: totalKeys - blockedKeys,
      memoryUsage: `${(JSON.stringify([...this.limits.entries()]).length / 1024).toFixed(2)} KB`
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.limits.forEach((entry, key) => {
      if (now >= entry.resetTime) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.limits.delete(key))
  }

  /**
   * Rate limiting middleware
   */
  middleware(options: RateLimitOptions = {}) {
    const {
      windowMs = 15 * 60 * 1000,
      maxRequests = 100,
      keyGenerator,
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      message = 'Too many requests, please try again later.',
      headers = true
    } = options

    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.generateKey(req, keyGenerator)
      const { limited, resetTime, remaining } = this.isLimited(key, options)
      
      // Add rate limit headers
      if (headers) {
        res.set({
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(resetTime).toISOString()
        })
      }
      
      if (limited) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        })
      }
      
      // Handle response to potentially decrement counter
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send.bind(res)
        res.send = (data: any) => {
          const shouldSkip = (
            (skipSuccessfulRequests && res.statusCode >= 200 && res.statusCode < 300) ||
            (skipFailedRequests && res.statusCode >= 400)
          )
          
          if (shouldSkip) {
            this.decrement(key)
          }
          
          return originalSend(data)
        }
      }
      
      next()
    }
  }

  /**
   * Destroy rate limit service
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.limits.clear()
  }
}

// Singleton instance
export const rateLimitService = new RateLimitService()

// Export middleware for easy use
export const rateLimit = (options?: RateLimitOptions) => rateLimitService.middleware(options)

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Strict rate limiting for auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later.'
  },
  
  // Standard rate limiting for API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
    skipSuccessfulRequests: false
  },
  
  // Lenient rate limiting for public endpoints
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // 1000 requests per window
    skipSuccessfulRequests: true
  },
  
  // Very strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 requests per hour
    message: 'Rate limit exceeded for sensitive operation.'
  }
}