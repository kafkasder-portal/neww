import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';

// Mock auth store instead of Supabase directly
vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn()
}));

import { useAuthStore } from '../../store/auth';

const mockAuthStore = {
  user: null,
  session: null,
  profile: null,
  loading: false,
  initializing: false,
  error: null,
  initialize: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
  clearError: vi.fn()
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore);
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('handles successful login', async () => {
    mockAuthStore.login.mockResolvedValue(true);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles login error', async () => {
    mockAuthStore.login.mockResolvedValue(false);
    mockAuthStore.error = 'Invalid credentials';

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('test@example.com', 'wrong-password');
      expect(success).toBe(false);
    });

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'wrong-password');
  });

  it('handles successful registration', async () => {
    mockAuthStore.user = { id: '1', email: 'test@example.com' };
    
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({ id: '1', email: 'test@example.com' });
  });

  it('handles loading state', async () => {
    mockAuthStore.loading = true;

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it('handles logout', async () => {
    mockAuthStore.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAuthStore.logout).toHaveBeenCalled();
  });

  it('handles logout error', async () => {
    mockAuthStore.logout.mockRejectedValue(new Error('Logout failed'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.logout();
      } catch (error) {
        expect(error.message).toBe('Logout failed');
      }
    });

    expect(mockAuthStore.logout).toHaveBeenCalled();
  });

  it('provides error state', () => {
    mockAuthStore.error = 'Authentication error';

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.error).toBe('Authentication error');
  });

  it('clears errors', () => {
    mockAuthStore.clearError = vi.fn();

    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.clearError();
    });
    
    expect(mockAuthStore.clearError).toHaveBeenCalled();
  });
});