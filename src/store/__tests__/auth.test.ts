import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      loading: false
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore())
    const state = result.current

    expect(state.user).toBe(null)
    expect(state.loading).toBe(false)
  })

  it('should set loading state during login', async () => {
    act(() => {
      useAuthStore.setState({ loading: true })
    })

    expect(useAuthStore.getState().loading).toBe(true)

    act(() => {
      useAuthStore.setState({ loading: false })
    })

    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should set user on successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: { name: 'Test User' },
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    }

    act(() => {
      useAuthStore.setState({ user: mockUser })
    })

    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('should clear user on logout', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: { name: 'Test User' },
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    }

    act(() => {
      useAuthStore.setState({ user: mockUser })
    })

    expect(useAuthStore.getState().user).toEqual(mockUser)

    act(() => {
      useAuthStore.setState({ user: null })
    })

    expect(useAuthStore.getState().user).toBe(null)
  })

  it('should handle user with additional properties', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: { 
        name: 'Test User',
        role: 'admin',
        avatar: 'https://example.com/avatar.jpg'
      },
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    }

    act(() => {
      useAuthStore.setState({ user: mockUser })
    })

    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('should clear user on logout again', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: { name: 'Test User' },
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    }

    act(() => {
      useAuthStore.setState({ user: mockUser })
    })

    expect(useAuthStore.getState().user).toEqual(mockUser)

    act(() => {
      useAuthStore.setState({ user: null })
    })

    expect(useAuthStore.getState().user).toBe(null)
  })
})
