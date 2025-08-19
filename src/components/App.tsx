import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './ErrorBoundary'
import { queryClient } from '../lib/queryClient'
import { ThemeProvider } from '../contexts/ThemeContext'
import { OfflineProvider } from '../contexts/OfflineContext'
import { SocketProvider } from '../contexts/SocketContext'
import { ErrorProvider } from '../contexts/ErrorContext'
import { Loading } from './Loading'
import AppRoutes from '../routes'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <OfflineProvider>
            <SocketProvider>
              <ErrorProvider>
                <BrowserRouter>
                  <div className="min-h-screen bg-background">
                    <Suspense fallback={<Loading />}>
                      <AppRoutes />
                    </Suspense>
                    <Toaster 
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)'
                        }
                      }}
                    />
                  </div>
                </BrowserRouter>
              </ErrorProvider>
            </SocketProvider>
          </OfflineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
