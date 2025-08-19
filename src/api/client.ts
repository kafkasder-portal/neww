import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_TIMEOUTS } from '../constants/api';
import { env } from '../lib/env';
import { setupInterceptors } from './interceptors';
import { setupAPIPerformanceTracking } from './performanceInterceptors';

// Base API configuration (prefer relative /api; fall back to env)
const API_BASE_URL = env.API_BASE_URL || '/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.default,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Setup interceptors
setupInterceptors(apiClient);

// Setup performance tracking
setupAPIPerformanceTracking(apiClient);

// Request/Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Generic API methods
class ApiClient {
  private instance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.instance = axiosInstance;
  }

  // GET request
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Upload file
  async upload<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    
    return response.data;
  }

  // Download file
  async download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const response = await this.instance.get(url, {
      ...config,
      responseType: 'blob'
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Paginated GET request
  async getPaginated<T = any>(
    url: string,
    params?: PaginationParams,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T[]>> {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      ...(params?.sort && { sort: params.sort }),
      ...(params?.order && { order: params.order }),
      ...(params?.search && { search: params.search }),
      ...(params?.filters && params.filters)
    };

    return this.get<T[]>(url, {
      ...config,
      params: queryParams
    });
  }

  // Batch requests
  async batch<T = any>(
    requests: Array<{
      method: 'get' | 'post' | 'put' | 'patch' | 'delete';
      url: string;
      data?: any;
      config?: AxiosRequestConfig;
    }>
  ): Promise<ApiResponse<T>[]> {
    const promises = requests.map(({ method, url, data, config }) => {
      switch (method) {
        case 'get':
          return this.get<T>(url, config);
        case 'post':
          return this.post<T>(url, data, config);
        case 'put':
          return this.put<T>(url, data, config);
        case 'patch':
          return this.patch<T>(url, data, config);
        case 'delete':
          return this.delete<T>(url, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    });

    return Promise.all(promises);
  }

  // Get raw axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.instance;
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  // Update default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.instance.defaults.headers, headers);
  }

  // Update timeout
  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }
}

// Create and export API client instance
export const api = new ApiClient(apiClient);

// Export axios instance for direct usage if needed
export { apiClient };

// Export default
export default api;
