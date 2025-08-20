import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { toast } from 'sonner'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Request/Response interfaces
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorToast?: boolean
  retries?: number
  cache?: boolean
  cacheTime?: number
}

// Create axios instance with optimized defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br'
  }
})

// Request interceptor for auth and optimization
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: Date.now() }
    
    // Enable compression
    config.headers['Accept-Encoding'] = 'gzip, deflate, br'
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling and performance monitoring
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log performance metrics
    const duration = Date.now() - response.config.metadata?.startTime
    if (duration > 5000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`)
    }
    
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as RequestConfig
    
    // Retry logic for network errors
    if (shouldRetry(error) && config && (config.retries || 0) < MAX_RETRIES) {
      config.retries = (config.retries || 0) + 1
      
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, config.retries - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return apiClient(config)
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Show error toast unless disabled
    if (!config?.skipErrorToast) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
    
    return Promise.reject(error)
  }
)

// Helper functions
function shouldRetry(error: AxiosError): boolean {
  // Retry on network errors or 5xx server errors
  return (
    !error.response ||
    error.code === 'NETWORK_ERROR' ||
    error.code === 'TIMEOUT' ||
    (error.response.status >= 500 && error.response.status < 600)
  )
}

function getErrorMessage(error: AxiosError): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  switch (error.response?.status) {
    case 400:
      return 'Geçersiz istek'
    case 401:
      return 'Oturum süreniz dolmuş'
    case 403:
      return 'Bu işlem için yetkiniz yok'
    case 404:
      return 'İstenen kaynak bulunamadı'
    case 429:
      return 'Çok fazla istek gönderildi'
    case 500:
      return 'Sunucu hatası'
    default:
      return error.message || 'Bilinmeyen bir hata oluştu'
  }
}

// API utility functions
export const api = {
  // GET request with caching support
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data
  },
  
  // POST request
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },
  
  // PUT request
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },
  
  // PATCH request
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  },
  
  // DELETE request
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },
  
  // Upload file with progress
  async upload<T>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })
    
    return response.data
  },
  
  // Download file
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    const response = await apiClient.get(url, {
      ...config,
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  },
  
  // Batch requests
  async batch<T>(requests: Array<() => Promise<any>>): Promise<T[]> {
    const results = await Promise.allSettled(requests.map(req => req()))
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.error(`Batch request ${index} failed:`, result.reason)
        throw result.reason
      }
    })
  }
}

// Query key factories for React Query
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Donations queries
  donations: {
    all: ['donations'] as const,
    lists: () => [...queryKeys.donations.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.donations.lists(), filters] as const,
    details: () => [...queryKeys.donations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.donations.details(), id] as const,
    stats: () => [...queryKeys.donations.all, 'stats'] as const,
  },
  
  // Beneficiaries queries
  beneficiaries: {
    all: ['beneficiaries'] as const,
    lists: () => [...queryKeys.beneficiaries.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.beneficiaries.lists(), filters] as const,
    details: () => [...queryKeys.beneficiaries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.beneficiaries.details(), id] as const,
  },
  
  // Financial queries
  financial: {
    all: ['financial'] as const,
    reports: () => [...queryKeys.financial.all, 'reports'] as const,
    report: (type: string, period: string) => [...queryKeys.financial.reports(), type, period] as const,
    transactions: () => [...queryKeys.financial.all, 'transactions'] as const,
    transaction: (id: string) => [...queryKeys.financial.transactions(), id] as const,
  }
}

// Cache invalidation helpers
export const invalidateQueries = {
  users: () => queryKeys.users.all,
  donations: () => queryKeys.donations.all,
  beneficiaries: () => queryKeys.beneficiaries.all,
  financial: () => queryKeys.financial.all,
  all: () => []
}

// Performance monitoring
export const performanceMonitor = {
  logSlowQueries: true,
  slowQueryThreshold: 2000, // 2 seconds
  
  logQuery: (queryKey: string[], duration: number) => {
    if (performanceMonitor.logSlowQueries && duration > performanceMonitor.slowQueryThreshold) {
      console.warn(`Slow query detected: ${queryKey.join('.')} took ${duration}ms`)
    }
  }
}

export default api