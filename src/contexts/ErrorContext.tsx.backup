import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

// Error types
export interface AppError {
  id: string;
  message: string;
  type: 'validation' | 'network' | 'authentication' | 'authorization' | 'server' | 'unknown';
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
  stack?: string;
  retryable?: boolean;
}

// Error state
interface ErrorState {
  errors: AppError[];
  globalError: AppError | null;
  isLoading: boolean;
}

// Error actions
type ErrorAction =
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_GLOBAL_ERROR'; payload: AppError | null }
  | { type: 'SET_LOADING'; payload: boolean };

// Error reducer
const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload]
      };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
        globalError: null
      };
    case 'SET_GLOBAL_ERROR':
      return {
        ...state,
        globalError: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

// Error context interface
interface ErrorContextType {
  state: ErrorState;
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  setGlobalError: (error: AppError | null) => void;
  setLoading: (loading: boolean) => void;
  handleError: (error: unknown, context?: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

// Create context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Initial state
const initialState: ErrorState = {
  errors: [],
  globalError: null,
  isLoading: false
};

// Error provider props
interface ErrorProviderProps {
  children: ReactNode;
}

// Error provider component
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Generate unique error ID
  const generateErrorId = (): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add error
  const addError = (error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError: AppError = {
      ...error,
      id: generateErrorId(),
      timestamp: new Date()
    };
    
    dispatch({ type: 'ADD_ERROR', payload: newError });
    
    // Show toast notification for user-facing errors
    if (error.type !== 'unknown') {
      showToast(error.message, 'error');
    }
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error added:', newError);
    }
  };

  // Remove error
  const removeError = (id: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: id });
  };

  // Clear all errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Set global error
  const setGlobalError = (error: AppError | null) => {
    dispatch({ type: 'SET_GLOBAL_ERROR', payload: error });
    
    if (error) {
      showToast(error.message, 'error');
    }
  };

  // Set loading state
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  // Handle different types of errors
  const handleError = (error: unknown, context?: string) => {
    let appError: Omit<AppError, 'id' | 'timestamp'>;

    if (error instanceof Error) {
      // Handle JavaScript errors
      appError = {
        message: error.message,
        type: 'unknown',
        stack: error.stack,
        details: { context }
      };
    } else if (typeof error === 'object' && error !== null) {
      // Handle API errors or custom error objects
      const errorObj = error as any;
      
      if (errorObj.response) {
        // Axios error
        const status = errorObj.response.status;
        const data = errorObj.response.data;
        
        appError = {
          message: data?.message || getErrorMessageByStatus(status),
          type: getErrorTypeByStatus(status),
          code: status.toString(),
          details: {
            context,
            url: errorObj.config?.url,
            method: errorObj.config?.method,
            data: data
          },
          retryable: isRetryableStatus(status)
        };
      } else if (errorObj.message) {
        // Custom error object
        appError = {
          message: errorObj.message,
          type: errorObj.type || 'unknown',
          code: errorObj.code,
          details: { context, ...errorObj.details }
        };
      } else {
        // Unknown object error
        appError = {
          message: 'Bilinmeyen bir hata oluştu',
          type: 'unknown',
          details: { context, error: JSON.stringify(error) }
        };
      }
    } else {
      // Handle primitive errors
      appError = {
        message: String(error) || 'Bilinmeyen bir hata oluştu',
        type: 'unknown',
        details: { context }
      };
    }

    addError(appError);
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
      default:
        toast.info(message);
        break;
    }
  };

  const value: ErrorContextType = {
    state,
    addError,
    removeError,
    clearErrors,
    setGlobalError,
    setLoading,
    handleError,
    showToast
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook to use error context
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Utility functions
const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
    case 401:
      return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
    case 403:
      return 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.';
    case 404:
      return 'Aradığınız kaynak bulunamadı.';
    case 409:
      return 'Bu işlem çakışma nedeniyle gerçekleştirilemedi.';
    case 422:
      return 'Gönderilen veriler geçersiz.';
    case 429:
      return 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.';
    case 500:
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    case 502:
      return 'Sunucu geçici olarak kullanılamıyor.';
    case 503:
      return 'Servis geçici olarak kullanılamıyor.';
    case 504:
      return 'İstek zaman aşımına uğradı.';
    default:
      return 'Beklenmeyen bir hata oluştu.';
  }
};

const getErrorTypeByStatus = (status: number): AppError['type'] => {
  if (status === 401) return 'authentication';
  if (status === 403) return 'authorization';
  if (status >= 400 && status < 500) return 'validation';
  if (status >= 500) return 'server';
  return 'network';
};

const isRetryableStatus = (status: number): boolean => {
  return [408, 429, 500, 502, 503, 504].includes(status);
};

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    
    // You can log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">Bir hata oluştu</h3>
              <p className="mt-2 text-sm text-gray-500">
                Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={this.resetError}
                  className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Tekrar Dene
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sayfayı Yenile
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
