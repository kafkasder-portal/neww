import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../contexts/ThemeContext'
import { OfflineProvider } from '../contexts/OfflineContext'
import { vi } from 'vitest'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <OfflineProvider>
            {children}
          </OfflineProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const mockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
  department: 'Test Department',
  phone: '+90 555 123 4567',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

export const mockMeeting = (overrides = {}) => ({
  id: '1',
  title: 'Test Meeting',
  description: 'Test meeting description',
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
  duration: 60,
  location: 'Test Location',
  organizer_id: '1',
  status: 'scheduled' as const,
  meeting_type: 'physical' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

export const mockTask = (overrides = {}) => ({
  id: '1',
  title: 'Test Task',
  description: 'Test task description',
  status: 'todo' as const,
  priority: 'medium' as const,
  assignee_id: '1',
  due_date: new Date().toISOString(),
  created_by: '1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

export const mockMessage = (overrides = {}) => ({
  id: '1',
  content: 'Test message',
  sender_id: '1',
  conversation_id: '1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

// Mock API responses
export const mockApiResponse = <T,>(data: T, success = true) => ({
  data,
  success,
  error: success ? undefined : 'Test error'
})

// Mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({ data: [], error: null })),
    insert: vi.fn(() => ({ data: [], error: null })),
    update: vi.fn(() => ({ data: [], error: null })),
    delete: vi.fn(() => ({ data: [], error: null })),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(() => ({ data: null, error: null })),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis()
  })),
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      createSignedUrl: vi.fn()
    }))
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn()
  }))
}

// Wait for next tick (useful for async operations)
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock implementation helpers
export const createMockImplementation = <T extends (...args: any[]) => any>(
  returnValue: ReturnType<T>
) => vi.fn().mockImplementation(() => returnValue)

export const createAsyncMockImplementation = <T extends (...args: any[]) => any>(
  returnValue: Awaited<ReturnType<T>>
) => vi.fn().mockImplementation(() => Promise.resolve(returnValue))
