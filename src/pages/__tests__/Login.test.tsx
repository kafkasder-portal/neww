import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from '../Login'
import { vi, expect, test, beforeEach, describe } from 'vitest'

// Mock useAuthStore
const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockResetPassword = vi.fn()
const mockClearError = vi.fn()

vi.mock('../../store/auth', () => ({
  useAuthStore: () => ({
    user: null,
    session: null,
    loading: false,
    error: null,
    signIn: mockSignIn,
    signUp: mockSignUp,
    resetPassword: mockResetPassword,
    clearError: mockClearError
  })
}))

// Test wrapper with necessary providers
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders login form by default', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    expect(screen.getByText('Giriş Yap')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /giriş yap/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/geçerli bir email adresi giriniz/i)).toBeInTheDocument()
    })
  })

  test('validates password length', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const passwordInput = screen.getByLabelText(/şifre/i)
    const submitButton = screen.getByRole('button', { name: /giriş yap/i })

    await user.type(passwordInput, '123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/şifre en az 6 karakter olmalıdır/i)).toBeInTheDocument()
    })
  })

  test('calls signIn with correct credentials', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ user: { id: '1' }, session: { access_token: 'token' } })
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/şifre/i)
    const submitButton = screen.getByRole('button', { name: /giriş yap/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  test('toggles password visibility', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const passwordInput = screen.getByLabelText(/şifre/i) as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /şifreyi göster/i })

    expect(passwordInput.type).toBe('password')

    await user.click(toggleButton)
    expect(passwordInput.type).toBe('text')

    await user.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  test('switches to register mode', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const registerLink = screen.getByText(/kayıt olun/i)
    await user.click(registerLink)

    expect(screen.getByText('Yeni Hesap')).toBeInTheDocument()
    expect(screen.getByLabelText(/ad soyad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/şifre tekrarı/i)).toBeInTheDocument()
  })

  test('switches to forgot password mode', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const forgotLink = screen.getByText(/şifremi unuttum/i)
    await user.click(forgotLink)

    expect(screen.getByText('Şifre Sıfırlama')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sıfırlama bağlantısı gönder/i })).toBeInTheDocument()
  })

  test('validates register form', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Switch to register mode
    const registerLink = screen.getByText(/kayıt olun/i)
    await user.click(registerLink)

    const submitButton = screen.getByRole('button', { name: /hesap oluştur/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/geçerli bir email adresi giriniz/i)).toBeInTheDocument()
      expect(screen.getByText(/ad soyad en az 2 karakter olmalıdır/i)).toBeInTheDocument()
    })
  })

  test('validates password confirmation', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Switch to register mode
    const registerLink = screen.getByText(/kayıt olun/i)
    await user.click(registerLink)

    const passwordInput = screen.getByLabelText(/^şifre$/i)
    const confirmPasswordInput = screen.getByLabelText(/şifre tekrarı/i)
    const submitButton = screen.getByRole('button', { name: /hesap oluştur/i })

    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/şifreler eşleşmiyor/i)).toBeInTheDocument()
    })
  })

  test('handles forgot password submission', async () => {
    const user = userEvent.setup()
    mockResetPassword.mockResolvedValue(undefined)
    
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Switch to forgot password mode
    const forgotLink = screen.getByText(/şifremi unuttum/i)
    await user.click(forgotLink)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sıfırlama bağlantısı gönder/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com')
    })
  })
})
