import { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { parseApiError, logError } from '../utils/errorUtils';
import { env } from '../lib/env';

// Extend the InternalAxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Request interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Add request timestamp for debugging
  (config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() };

  // Log request in development
  if (env.isDevelopment) console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, { headers: config.headers, data: config.data, params: config.params });

  return config;
};

// Request error interceptor
const requestErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  const appError = parseApiError({
    response: error.response ? {
      status: error.response.status,
      data: error.response.data as { message?: string; code?: string }
    } : undefined,
    request: error.request,
    config: error.config ? {
      url: error.config.url,
      method: error.config.method
    } : undefined,
    message: error.message
  });
  logError({
    ...appError,
    id: crypto.randomUUID(),
    timestamp: new Date()
  }, 'Request Interceptor');
  
  return Promise.reject(error);
};

// Response interceptor
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Calculate request duration
  const config = response.config as ExtendedAxiosRequestConfig;
  const duration = config.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;

  // Log response in development
  if (env.isDevelopment) console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, { status: response.status, data: response.data });

  return response;
};

// Response error interceptor
const responseErrorInterceptor = async (error: AxiosError): Promise<AxiosError> => {
  const config = error.config as ExtendedAxiosRequestConfig;
  const duration = config?.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;

  // Log error in development
  if (env.isDevelopment) console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`, { status: error.response?.status, message: error.message, data: error.response?.data });

  // Handle specific error cases
  if (error.response?.status === 401) {
    // Clear auth token and redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }

  // Parse and log the error
  const appError = parseApiError({
    response: error.response ? {
      status: error.response.status,
      data: error.response.data as { message?: string; code?: string }
    } : undefined,
    request: error.request,
    config: error.config ? {
      url: error.config.url,
      method: error.config.method
    } : undefined,
    message: error.message
  });
  logError({
    ...appError,
    id: crypto.randomUUID(),
    timestamp: new Date()
  }, 'Response Interceptor');

  return Promise.reject(error);
};

// Setup interceptors function
export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // Request interceptors
  axiosInstance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );

  // Response interceptors
  axiosInstance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  );
};

// Export individual interceptors for testing
export {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor
};