import { Request, Response, NextFunction } from 'express'
import { gzip, deflate } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)
const deflateAsync = promisify(deflate)

interface CompressionOptions {
  threshold?: number // Minimum response size to compress (bytes)
  level?: number // Compression level (1-9)
  filter?: (req: Request, res: Response) => boolean // Custom filter function
  chunkSize?: number // Chunk size for streaming
}

interface CompressionStats {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  algorithm: string
}

/**
 * High-performance response compression service
 */
export class CompressionService {
  private stats = {
    totalRequests: 0,
    compressedRequests: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    averageCompressionRatio: 0
  }

  /**
   * Check if response should be compressed
   */
  private shouldCompress(req: Request, res: Response, options: CompressionOptions): boolean {
    const { threshold = 1024, filter } = options
    
    // Use custom filter if provided
    if (filter && !filter(req, res)) {
      return false
    }
    
    // Don't compress if client doesn't support it
    const acceptEncoding = req.headers['accept-encoding'] || ''
    if (!acceptEncoding.includes('gzip') && !acceptEncoding.includes('deflate')) {
      return false
    }
    
    // Don't compress already compressed content
    const contentEncoding = res.getHeader('content-encoding')
    if (contentEncoding) {
      return false
    }
    
    // Don't compress small responses
    const contentLength = res.getHeader('content-length')
    if (contentLength && parseInt(contentLength.toString()) < threshold) {
      return false
    }
    
    // Check content type
    const contentType = res.getHeader('content-type') || ''
    return this.isCompressibleType(contentType.toString())
  }

  /**
   * Check if content type is compressible
   */
  private isCompressibleType(contentType: string): boolean {
    const compressibleTypes = [
      'text/',
      'application/json',
      'application/javascript',
      'application/xml',
      'application/rss+xml',
      'application/atom+xml',
      'image/svg+xml'
    ]
    
    return compressibleTypes.some(type => contentType.toLowerCase().includes(type))
  }

  /**
   * Get best compression algorithm based on client support
   */
  private getBestAlgorithm(acceptEncoding: string): 'gzip' | 'deflate' | null {
    if (acceptEncoding.includes('gzip')) {
      return 'gzip'
    }
    if (acceptEncoding.includes('deflate')) {
      return 'deflate'
    }
    return null
  }

  /**
   * Compress data using specified algorithm
   */
  private async compressData(data: Buffer, algorithm: 'gzip' | 'deflate', level: number): Promise<Buffer> {
    const options = { level }
    
    switch (algorithm) {
      case 'gzip':
        return await gzipAsync(data, options)
      case 'deflate':
        return await deflateAsync(data, options)
      default:
        throw new Error(`Unsupported compression algorithm: ${algorithm}`)
    }
  }

  /**
   * Update compression statistics
   */
  private updateStats(originalSize: number, compressedSize: number): void {
    this.stats.totalRequests++
    this.stats.compressedRequests++
    this.stats.totalOriginalSize += originalSize
    this.stats.totalCompressedSize += compressedSize
    
    // Calculate average compression ratio
    this.stats.averageCompressionRatio = this.stats.totalOriginalSize > 0 
      ? (this.stats.totalCompressedSize / this.stats.totalOriginalSize) * 100
      : 0
  }

  /**
   * Get compression statistics
   */
  getStats() {
    const compressionRate = this.stats.totalRequests > 0 
      ? (this.stats.compressedRequests / this.stats.totalRequests) * 100
      : 0
    
    const savedBytes = this.stats.totalOriginalSize - this.stats.totalCompressedSize
    
    return {
      ...this.stats,
      compressionRate: `${compressionRate.toFixed(2)}%`,
      averageCompressionRatio: `${this.stats.averageCompressionRatio.toFixed(2)}%`,
      savedBytes: `${(savedBytes / 1024 / 1024).toFixed(2)} MB`,
      averageOriginalSize: `${(this.stats.totalOriginalSize / Math.max(1, this.stats.compressedRequests) / 1024).toFixed(2)} KB`,
      averageCompressedSize: `${(this.stats.totalCompressedSize / Math.max(1, this.stats.compressedRequests) / 1024).toFixed(2)} KB`
    }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      compressedRequests: 0,
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      averageCompressionRatio: 0
    }
  }

  /**
   * Compression middleware
   */
  middleware(options: CompressionOptions = {}) {
    const { threshold = 1024, level = 6 } = options
    
    return (req: Request, res: Response, next: NextFunction) => {
      this.stats.totalRequests++
      
      // Skip if compression not needed
      if (!this.shouldCompress(req, res, options)) {
        return next()
      }
      
      const acceptEncoding = req.headers['accept-encoding'] || ''
      const algorithm = this.getBestAlgorithm(acceptEncoding)
      
      if (!algorithm) {
        return next()
      }
      
      // Override res.json to compress JSON responses
      const originalJson = res.json.bind(res)
      res.json = (data: any): Response => {
        (async () => {
          try {
            const jsonString = JSON.stringify(data);
            const originalBuffer = Buffer.from(jsonString, 'utf8');

            if (originalBuffer.length < threshold) {
              originalJson(data);
              return;
            }

            const compressedBuffer = await this.compressData(
              originalBuffer,
              algorithm,
              level
            );

            this.updateStats(originalBuffer.length, compressedBuffer.length);

            res.set({
              'Content-Encoding': algorithm,
              'Content-Length': compressedBuffer.length.toString(),
              'Vary': 'Accept-Encoding',
              'X-Original-Size': originalBuffer.length.toString(),
              'X-Compressed-Size': compressedBuffer.length.toString(),
              'X-Compression-Ratio': `${(
                (compressedBuffer.length / originalBuffer.length) *
                100
              ).toFixed(2)}%`,
            });

            res.type('application/json');
            res.send(compressedBuffer);
          } catch (error) {
            console.error('Compression error:', error);
            originalJson(data);
          }
        })();
        return res;
      };
      
      // Override res.send for other content types
      const originalSend = res.send.bind(res)
      res.send = (data: any): Response => {
        (async () => {
          try {
            if (typeof data === 'string' || Buffer.isBuffer(data)) {
              const buffer = Buffer.isBuffer(data)
                ? data
                : Buffer.from(data, 'utf8');

              if (buffer.length >= threshold) {
                const compressedBuffer = await this.compressData(
                  buffer,
                  algorithm,
                  level
                );

                this.updateStats(buffer.length, compressedBuffer.length);

                res.set({
                  'Content-Encoding': algorithm,
                  'Content-Length': compressedBuffer.length.toString(),
                  'Vary': 'Accept-Encoding',
                  'X-Original-Size': buffer.length.toString(),
                  'X-Compressed-Size': compressedBuffer.length.toString(),
                  'X-Compression-Ratio': `${(
                    (compressedBuffer.length / buffer.length) *
                    100
                  ).toFixed(2)}%`,
                });

                originalSend(compressedBuffer);
                return;
              }
            }

            originalSend(data);
          } catch (error) {
            console.error('Compression error:', error);
            originalSend(data);
          }
        })();
        return res;
      };
      
      next()
    }
  }
}

// Singleton instance
export const compressionService = new CompressionService()

// Export middleware for easy use
export const compression = (options?: CompressionOptions) => compressionService.middleware(options)

// Predefined compression configurations
export const compressionConfigs = {
  // High compression for production
  production: {
    threshold: 1024, // 1KB
    level: 6, // Balanced compression
    filter: (req: Request, res: Response) => {
      // Don't compress images, videos, or already compressed files
      const contentType = res.getHeader('content-type') || ''
      return !contentType.toString().match(/image|video|audio|zip|rar|7z|gz/)
    }
  },
  
  // Fast compression for development
  development: {
    threshold: 2048, // 2KB
    level: 1, // Fast compression
  },
  
  // Maximum compression for slow connections
  mobile: {
    threshold: 512, // 512B
    level: 9, // Maximum compression
  },
  
  // No compression for debugging
  debug: {
    threshold: Infinity, // Never compress
    level: 0
  }
}