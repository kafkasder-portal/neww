import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from '../ProtectedRoute'
import { vi, expect, test, beforeEach, describe } from 'vitest'

// Mock Navigate component
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, state }: { to: string; state?: any }) => {
      mockNavigate(to, state)
      return <div data-testid="navigate">{`Redirecting to ${to}`}</div>
    }
  }
})

// Mock auth store
const mockInitialize = vi.fn()
const mockSignOut = vi.fn()

const createMockAuthStore = (overrides = {}) => ({
  user: null,
  session: null,
  profile: null,
  initializing: false,
  initialize: mockInitialize,
  signOut: mockSignOut,
  ...overrides
})

vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn()
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to default mock
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore())
  })

  test('shows loading spinner when initializing', () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({ 
      initializing: true 
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/kimlik doğrulanıyor/i)).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  test('shows loading spinner when checking auth', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore())

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    // Initially shows loading
    expect(screen.getByText(/kimlik doğrulanıyor/i)).toBeInTheDocument()
  })

  test('redirects to login when user is not authenticated', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      user: null,
      session: null,
      initializing: false
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByText(/redirecting to \/login/i)).toBeInTheDocument()
    })
  })

  test('shows deactivated account message when user is inactive', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' },
      profile: { 
        id: '1', 
        full_name: 'Test User', 
        role: 'viewer', 
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      initializing: false
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/hesap deaktif/i)).toBeInTheDocument()
      expect(screen.getByText(/hesabınız deaktif edilmiştir/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /çıkış yap/i })).toBeInTheDocument()
    })
  })

  test('renders protected content when user is authenticated and active', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' },
      profile: { 
        id: '1', 
        full_name: 'Test User', 
        role: 'admin', 
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      initializing: false
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  test('calls initialize when initializing is true', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      initializing: true,
      initialize: mockInitialize
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled()
    })
  })

  test('handles logout from deactivated account screen', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' },
      profile: { 
        id: '1', 
        full_name: 'Test User', 
        role: 'viewer', 
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      initializing: false
    }))

    const { fireEvent } = require('@testing-library/react')

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/hesap deaktif/i)).toBeInTheDocument()
    })

    const logoutButton = screen.getByRole('button', { name: /çıkış yap/i })
    fireEvent.click(logoutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })

  test('handles different user roles', async () => {
    const { useAuthStore } = require('../../store/auth')
    useAuthStore.mockReturnValue(createMockAuthStore({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' },
      profile: { 
        id: '1', 
        full_name: 'Test User', 
        role: 'manager', 
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      initializing: false
    }))

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div data-testid="protected-content">Manager Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.getByText('Manager Content')).toBeInTheDocument()
    })
  })
})
