import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface CSRFTokenResponse {
  csrfToken: string;
  expires: string;
}

interface UseCSRFReturn {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  getHeaders: () => Record<string, string>;
}

export const useCSRF = (): UseCSRFReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCSRFToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data: CSRFTokenResponse = await response.json();
      setToken(data.csrfToken);
      
      // Store token in sessionStorage for persistence across page reloads
      sessionStorage.setItem('csrf-token', data.csrfToken);
      sessionStorage.setItem('csrf-expires', data.expires);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CSRF token';
      setError(errorMessage);
      console.error('CSRF Token Error:', err);
      
      // Show user-friendly error message
      toast.error('Security token error. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    await fetchCSRFToken();
  }, [fetchCSRFToken]);

  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['X-CSRF-Token'] = token;
    }

    return headers;
  }, [token]);

  // Check if stored token is still valid
  const checkStoredToken = useCallback(() => {
    const storedToken = sessionStorage.getItem('csrf-token');
    const storedExpires = sessionStorage.getItem('csrf-expires');

    if (storedToken && storedExpires) {
      const expiresDate = new Date(storedExpires);
      const now = new Date();
      
      // Check if token is still valid (with 5 minute buffer)
      if (expiresDate.getTime() - now.getTime() > 5 * 60 * 1000) {
        setToken(storedToken);
        setIsLoading(false);
        return true;
      } else {
        // Token expired, clear storage
        sessionStorage.removeItem('csrf-token');
        sessionStorage.removeItem('csrf-expires');
      }
    }
    return false;
  }, []);

  // Initialize CSRF token
  useEffect(() => {
    // First check if we have a valid stored token
    if (!checkStoredToken()) {
      // If no valid stored token, fetch a new one
      fetchCSRFToken();
    }
  }, [checkStoredToken, fetchCSRFToken]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const storedExpires = sessionStorage.getItem('csrf-expires');
    if (!storedExpires) return;

    const expiresDate = new Date(storedExpires);
    const now = new Date();
    const timeUntilExpiry = expiresDate.getTime() - now.getTime();
    
    // Refresh token 10 minutes before expiration
    const refreshTime = Math.max(timeUntilExpiry - 10 * 60 * 1000, 60 * 1000); // At least 1 minute

    const timeoutId = setTimeout(() => {
      console.log('Auto-refreshing CSRF token...');
      fetchCSRFToken();
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [token, fetchCSRFToken]);

  // Handle page visibility change to refresh token if needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if token is still valid when page becomes visible
        if (!checkStoredToken()) {
          fetchCSRFToken();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkStoredToken, fetchCSRFToken]);

  return {
    token,
    isLoading,
    error,
    refreshToken,
    getHeaders,
  };
};

// Enhanced fetch function with CSRF protection
export const csrfFetch = async (
  url: string, 
  options: RequestInit = {}, 
  csrfToken?: string
): Promise<Response> => {
  const headers = new Headers(options.headers);
  
  // Add CSRF token if available and method is not GET/HEAD/OPTIONS
  const method = options.method?.toUpperCase() || 'GET';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  
  // Ensure credentials are included for session cookies
  const enhancedOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  const response = await fetch(url, enhancedOptions);
  
  // Handle CSRF errors
  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.type?.includes('csrf')) {
      toast.error('Security token expired. Please refresh the page.');
      // Optionally trigger a page reload
      setTimeout(() => window.location.reload(), 2000);
    }
  }
  
  return response;
};

// Hook for making CSRF-protected API calls
export const useCSRFApi = () => {
  const { token, getHeaders, refreshToken } = useCSRF();
  
  const apiCall = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      return await csrfFetch(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options.headers,
        },
      }, token || undefined);
    } catch (error) {
      // If CSRF error, try refreshing token once
      if (error instanceof Error && error.message.includes('csrf')) {
        await refreshToken();
        // Retry the request with new token
        return await csrfFetch(url, {
          ...options,
          headers: {
            ...getHeaders(),
            ...options.headers,
          },
        }, token || undefined);
      }
      throw error;
    }
  }, [token, getHeaders, refreshToken]);
  
  return { apiCall, token, refreshToken };
};