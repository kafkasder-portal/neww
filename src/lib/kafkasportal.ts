import { env } from './env'

// Type definitions for kafkasportal.com API responses
export interface KafkasPortalResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface KafkasPortalUser {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
}

// API Client for kafkasportal.com
export class KafkasPortalAPI {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = env.EXTERNAL_DOMAIN || 'https://kafkasportal.com'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Add authentication token if available
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<KafkasPortalResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error('KafkasPortal API Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<KafkasPortalResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<KafkasPortalResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<KafkasPortalResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<KafkasPortalResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Health check to verify connection
  async healthCheck(): Promise<KafkasPortalResponse<{ status: string; timestamp: string }>> {
    return this.get('/api/health')
  }

  // Authentication methods
  async login(credentials: { username: string; password: string }): Promise<KafkasPortalResponse<{ token: string; user: KafkasPortalUser }>> {
    return this.post('/api/auth/login', credentials)
  }

  async logout(): Promise<KafkasPortalResponse<void>> {
    const response = await this.post<void>('/api/auth/logout')
    // Clear auth token after logout
    delete this.headers['Authorization']
    return response
  }

  // User profile methods
  async getProfile(): Promise<KafkasPortalResponse<KafkasPortalUser>> {
    return this.get('/api/user/profile')
  }

  // Test connection to kafkasportal.com
  async testConnection(): Promise<boolean> {
    try {
      await fetch(this.baseUrl, {
        method: 'HEAD',
        mode: 'no-cors'
      })
      return true
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

// Create singleton instance
export const kafkasPortalAPI = new KafkasPortalAPI()

// Utility functions
export const validateDomainConnection = async (): Promise<{
  isConnected: boolean
  domain: string
  error?: string
}> => {
  const domain = env.EXTERNAL_DOMAIN || 'https://kafkasportal.com'
  
  try {
    const isConnected = await kafkasPortalAPI.testConnection()
    return {
      isConnected,
      domain,
    }
  } catch (error) {
    return {
      isConnected: false,
      domain,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Hook for React components to use kafkasportal.com API
export const useKafkasPortal = () => {
  return {
    api: kafkasPortalAPI,
    validateConnection: validateDomainConnection,
    baseUrl: env.EXTERNAL_DOMAIN || 'https://kafkasportal.com',
    webUrl: env.WEB_URL || 'https://kafkasportal.com',
  }
}
