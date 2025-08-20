import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { mockAuth, shouldUseMockAuth } from '../lib/mockAuth';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiry: Date | null;
  isNearExpiry: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SessionInfo {
  user: User;
  session: {
    issuedAt: string;
    expiresAt: string;
    timeUntilExpiry: number;
    isNearExpiry: boolean;
    warningThreshold: number;
  };
}

const API_BASE_URL = '/api';
const TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const SESSION_CHECK_INTERVAL = 60000; // Check every minute
const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem(TOKEN_STORAGE_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
    isAuthenticated: false,
    isLoading: true,
    sessionExpiry: null,
    isNearExpiry: false
  });

  const sessionCheckRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
      sessionCheckRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // Make authenticated API request
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = authState.accessToken || localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    // Check for token expiry warning in response headers
    const tokenWarning = response.headers.get('X-Token-Warning');
    const tokenExpiresAt = response.headers.get('X-Token-Expires-At');
    
    if (tokenWarning && tokenExpiresAt && !warningShownRef.current) {
      const expiryTime = new Date(parseInt(tokenExpiresAt) * 1000);
      const timeUntilExpiry = expiryTime.getTime() - Date.now();
      
      if (timeUntilExpiry <= WARNING_THRESHOLD) {
        toast.warning('Your session will expire soon. Please save your work.', {
          duration: 10000,
          action: {
            label: 'Extend Session',
            onClick: () => refreshAccessToken()
          }
        });
        warningShownRef.current = true;
        
        setAuthState(prev => ({
          ...prev,
          isNearExpiry: true,
          sessionExpiry: expiryTime
        }));
      }
    }

    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.type === 'token_expired') {
        // Try to refresh token
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          // Retry the original request with new token
          return makeAuthenticatedRequest(url, options);
        } else {
          // Refresh failed, logout user
          await logout();
          throw new Error('Session expired. Please login again.');
        }
      } else {
        await logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }, [authState.accessToken]);

  // Refresh access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = authState.refreshToken || localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update tokens
        localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
        
        setAuthState(prev => ({
          ...prev,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isNearExpiry: false
        }));
        
        warningShownRef.current = false;
        toast.success('Session extended successfully');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [authState.refreshToken]);

  // Get session info
  const getSessionInfo = useCallback(async (): Promise<SessionInfo | null> => {
    try {
      const response = await makeAuthenticatedRequest('/auth/session');
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get session info:', error);
      return null;
    }
  }, [makeAuthenticatedRequest]);

  // Validate current session
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await makeAuthenticatedRequest('/auth/validate');
      
      if (response.ok) {
        const data = await response.json();
        
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false
        }));
        return false;
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }));
      return false;
    }
  }, [makeAuthenticatedRequest]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Use mock auth if enabled or Supabase not configured
      if (shouldUseMockAuth()) {
        console.log('🔧 Using mock authentication');
        const result = await mockAuth.login(credentials);

        // Store tokens
        localStorage.setItem(TOKEN_STORAGE_KEY, result.accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, result.refreshToken);

        setAuthState({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          sessionExpiry: null,
          isNearExpiry: false
        });

        toast.success('Login successful! (Mock Mode)');
        return true;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();

        // Store tokens
        localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);

        setAuthState({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          sessionExpiry: null,
          isNearExpiry: false
        });

        toast.success('Login successful!');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        toast.error(errorData.error || 'Login failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if authenticated
      if (authState.accessToken) {
        await makeAuthenticatedRequest('/auth/logout', {
          method: 'POST'
        }).catch(() => {
          // Ignore errors on logout
        });
      }
    } catch (_error) {
      // Ignore logout errors
    } finally {
      // Clear local storage and state
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      
      clearTimers();
      warningShownRef.current = false;
      
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        sessionExpiry: null,
        isNearExpiry: false
      });
      
      toast.info('Logged out successfully');
    }
  }, [authState.accessToken, makeAuthenticatedRequest, clearTimers]);

  // Setup session monitoring
  const setupSessionMonitoring = useCallback(() => {
    clearTimers();
    
    if (authState.isAuthenticated && authState.accessToken) {
      // Check session status periodically
      sessionCheckRef.current = setInterval(async () => {
        const sessionInfo = await getSessionInfo();
        
        if (sessionInfo) {
          const expiryTime = new Date(sessionInfo.session.expiresAt);
          const timeUntilExpiry = expiryTime.getTime() - Date.now();
          
          setAuthState(prev => ({
            ...prev,
            sessionExpiry: expiryTime,
            isNearExpiry: timeUntilExpiry <= WARNING_THRESHOLD
          }));
          
          // Show warning if session is about to expire
          if (timeUntilExpiry <= WARNING_THRESHOLD && !warningShownRef.current) {
            toast.warning('Your session will expire soon. Please save your work.', {
              duration: 10000,
              action: {
                label: 'Extend Session',
                onClick: () => refreshAccessToken()
              }
            });
            warningShownRef.current = true;
          }
          
          // Auto-refresh token when close to expiry
          if (timeUntilExpiry <= 60000 && timeUntilExpiry > 0) { // 1 minute before expiry
            refreshAccessToken();
          }
        }
      }, SESSION_CHECK_INTERVAL);
    }
  }, [authState.isAuthenticated, authState.accessToken, getSessionInfo, refreshAccessToken, clearTimers]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (token) {
        setAuthState(prev => ({ ...prev, accessToken: token }));
        await validateSession();
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, [validateSession]);

  // Setup session monitoring when authenticated
  useEffect(() => {
    setupSessionMonitoring();
    
    return () => {
      clearTimers();
    };
  }, [setupSessionMonitoring, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    ...authState,
    login,
    logout,
    refreshAccessToken,
    validateSession,
    getSessionInfo,
    makeAuthenticatedRequest
  };
};
