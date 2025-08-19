import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../../store/auth'
import { vi, expect, test, beforeEach, describe } from 'vitest'

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }))
}

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}))

// Mock error service
vi.mock('../../services/errorService', () => ({
  logAuthError: vi.fn(),
  logSystemError: vi.fn()
}))

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Zustand store
    useAuthStore.setState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initializing: true,
      error: null
    })
  })

  test('initializes with correct default values', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.initializing).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test('initialize sets session and user when authenticated', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      access_token: 'token'
    }
    
    const mockProfile = {
      id: '1',
      full_name: 'Test User',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    await waitFor(async () => {
      await result.current.initialize()
    })

    await waitFor(() => {
      expect(result.current.user).toEqual({
        ...mockSession.user,
        profile: mockProfile
      })
      expect(result.current.session).toEqual(mockSession)
      expect(result.current.profile).toEqual(mockProfile)
      expect(result.current.initializing).toBe(false)
    })
  })

  test('initialize handles no session gracefully', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    await waitFor(async () => {
      await result.current.initialize()
    })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.session).toBeNull()
      expect(result.current.profile).toBeNull()
      expect(result.current.initializing).toBe(false)
    })
  })

  test('signIn works with valid credentials', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      access_token: 'token'
    }
    
    const mockProfile = {
      id: '1',
      full_name: 'Test User',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockSession.user, session: mockSession },
      error: null
    })

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    mockSupabase.from().update().eq.mockResolvedValue({
      data: {},
      error: null
    })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    const session = await result.current.signIn('test@example.com', 'password')

    expect(session).toEqual(mockSession)
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    })
  })

  test('signIn handles invalid credentials', async () => {
    const mockError = { message: 'Invalid credentials' }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    const session = await result.current.signIn('test@example.com', 'wrong-password')

    expect(session).toBeNull()
    expect(result.current.error).toBe('Invalid credentials')
  })

  test('signIn handles inactive user', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      access_token: 'token'
    }
    
    const mockProfile = {
      id: '1',
      full_name: 'Test User',
      role: 'admin',
      is_active: false, // Inactive user
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockSession.user, session: mockSession },
      error: null
    })

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    const session = await result.current.signIn('test@example.com', 'password')

    expect(session).toBeNull()
    expect(result.current.error).toBe('Account has been deactivated')
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  test('signUp creates new user and profile', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    mockSupabase.from().insert.mockResolvedValue({
      data: {},
      error: null
    })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    const userData = {
      full_name: 'Test User',
      department: 'IT',
      phone: '1234567890'
    }

    await result.current.signUp('test@example.com', 'password', userData)

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: { data: userData }
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
  })

  test('signOut clears user state', async () => {
    // Set initial authenticated state
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com' },
      session: { access_token: 'token' },
      profile: { id: '1', full_name: 'Test User', role: 'admin', is_active: true, created_at: '', updated_at: '' }
    })

    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    await result.current.signOut()

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.session).toBeNull()
      expect(result.current.profile).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  test('resetPassword sends reset email', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    await result.current.resetPassword('test@example.com')

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: `${window.location.origin}/reset-password` }
    )
  })

  test('clearError resets error state', () => {
    useAuthStore.setState({ error: 'Some error' })

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper()
    })

    result.current.clearError()

    expect(result.current.error).toBeNull()
  })
})
