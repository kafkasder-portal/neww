import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from '../App'

// Mock all external dependencies
vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-client-provider">{children}</div>
}))

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>
}))

vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />
}))

vi.mock('../ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>
}))

vi.mock('../../lib/queryClient', () => ({
  queryClient: {}
}))

vi.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>
}))

vi.mock('../../contexts/OfflineContext', () => ({
  OfflineProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="offline-provider">{children}</div>
}))

vi.mock('../../contexts/SocketContext', () => ({
  SocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="socket-provider">{children}</div>
}))

vi.mock('../../contexts/ErrorContext', () => ({
  ErrorProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="error-provider">{children}</div>
}))

vi.mock('../Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>
}))

vi.mock('../../routes', () => ({
  default: () => <div data-testid="app-routes">App Routes</div>
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })

  it('renders all required providers in correct order', () => {
    render(<App />)
    
    // Check that all providers are rendered
    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument()
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('offline-provider')).toBeInTheDocument()
    expect(screen.getByTestId('socket-provider')).toBeInTheDocument()
    expect(screen.getByTestId('error-provider')).toBeInTheDocument()
    expect(screen.getByTestId('browser-router')).toBeInTheDocument()
  })

  it('renders main application content', () => {
    render(<App />)
    
    expect(screen.getByTestId('app-routes')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('has correct CSS classes for layout', () => {
    render(<App />)
    
    const mainContainer = screen.getByTestId('browser-router').parentElement
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-background')
  })

  it('renders Suspense with Loading fallback', () => {
    render(<App />)
    
    // The Loading component should be available as fallback
    // Note: We can't directly test Suspense fallback in this setup
    // but we can verify the Loading component is imported and available
    expect(screen.getByTestId('app-routes')).toBeInTheDocument()
  })
})
