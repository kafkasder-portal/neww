import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '../usePermissions'
import { useAuthStore } from '@store/auth'

// Mock the auth store
vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('usePermissions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns all permissions for super_admin', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: '1',
        email: 'admin@test.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        profile: {
          id: '1',
          full_name: 'Admin',
          role: 'super_admin',
          email: 'admin@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      },
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    })

    const { result } = renderHook(() => usePermissions())

    expect(result.current.permissions).toContain('create_user')
    expect(result.current.permissions).toContain('delete_user')
    expect(result.current.permissions).toContain('manage_meeting_participants')
    expect(result.current.permissions).toContain('assign_tasks')
    expect(result.current.hasPermission('create_user')).toBe(true)
    expect(result.current.canManageUsers).toBe(true)
  })

  it('returns limited permissions for viewer role', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: '1',
        email: 'viewer@test.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        profile: {
          id: '1',
          full_name: 'Viewer',
          role: 'viewer',
          email: 'viewer@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      },
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    })

    const { result: _result } = renderHook(() => usePermissions())

    expect(_result.current.permissions).toContain('view_dashboard')
    expect(_result.current.permissions).not.toContain('create_user')
    expect(_result.current.permissions).not.toContain('delete_user')
    expect(_result.current.hasPermission('view_dashboard')).toBe(true)
    expect(_result.current.hasPermission('create_user')).toBe(false)
    expect(_result.current.canManageUsers).toBe(false)
  })

  it('returns no permissions for unauthenticated user', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    })

    const { result: _result2 } = renderHook(() => usePermissions())

    expect(_result2.current.permissions).toEqual([])
    expect(_result2.current.hasPermission('view_dashboard')).toBe(false)
    expect(_result2.current.canManageUsers).toBe(false)
  })

  it('returns correct permissions for admin role', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: '1',
        email: 'admin@test.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        profile: {
          id: '1',
          full_name: 'Admin',
          role: 'admin',
          email: 'admin@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      },
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    })

    const { result: _result3 } = renderHook(() => usePermissions())

    expect(_result3.current.permissions).toContain('create_user')
    expect(_result3.current.permissions).toContain('edit_user')
    expect(_result3.current.permissions).not.toContain('delete_user') // Only super_admin can delete
    expect(_result3.current.hasPermission('create_user')).toBe(true)
    expect(_result3.current.hasPermission('delete_user')).toBe(false)
    expect(_result3.current.canManageUsers).toBe(true)
  })

  it('returns correct permissions for manager role', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: '1',
        email: 'manager@test.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        profile: {
          id: '1',
          full_name: 'Manager',
          role: 'manager',
          email: 'manager@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      },
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    })

    const { result: _result4 } = renderHook(() => usePermissions())

    expect(_result4.current.permissions).toContain('view_meetings')
    expect(_result4.current.permissions).toContain('view_tasks')
    expect(_result4.current.permissions).not.toContain('create_user')
    expect(_result4.current.hasPermission('view_meetings')).toBe(true)
    expect(_result4.current.hasPermission('create_user')).toBe(false)
    expect(_result4.current.canManageUsers).toBe(false)
  })

  it('updates permissions when user role changes', () => {
    const mockStore = {
      user: {
        id: '1',
        email: 'user@test.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        profile: {
          id: '1',
          full_name: 'User',
          role: 'viewer',
          email: 'user@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      },
      session: null,
      profile: null,
      initializing: false,
      loading: false,
      error: null,
      initialize: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      resetPassword: vi.fn(),
      clearError: vi.fn()
    }

    vi.mocked(useAuthStore).mockReturnValue(mockStore)

    const { result, rerender } = renderHook(() => usePermissions())

    // Initially viewer permissions
    expect(result.current.hasPermission('create_user')).toBe(false)
    expect(result.current.canManageUsers).toBe(false)

    // Change role to admin
    if (mockStore.user?.profile) {
      mockStore.user.profile.role = 'admin'
    }
    rerender()

    expect(result.current.hasPermission('create_user')).toBe(true)
    expect(result.current.canManageUsers).toBe(true)
  })
})
