import { zodResolver } from '@hookform/resolvers/zod'
import { Building, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
  CorporateButton,
  CorporateCard,
  CorporateCardContent,
  CorporateCardHeader,
  CorporateCardTitle,
  FormGroup,
  FormLabel,
  FormInput,
  CorporateAlert
} from '../components/ui/corporate/CorporateComponents'
import { useAuthStore } from '../store/auth'
import { useLanguage } from '../hooks/useLanguage'

// These will be created dynamically with translations
const createValidationSchemas = (t: (key: string) => string) => ({
  loginSchema: z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(6, t('validation.passwordTooShort'))
  }),

  registerSchema: z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(6, t('validation.passwordTooShort')),
    confirmPassword: z.string().min(6, t('validation.required')),
    full_name: z.string().min(2, t('validation.nameMinLength')),
    department: z.string().optional(),
    phone: z.string().optional()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ["confirmPassword"],
  }),

  forgotPasswordSchema: z.object({
    email: z.string().email(t('validation.email'))
  })
})

// Type definitions based on Zod schemas
type LoginForm = {
  email: string
  password: string
}

type RegisterForm = {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  department?: string
  phone?: string
}

type ForgotPasswordForm = {
  email: string
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, session, loading, error, signIn, signUp, resetPassword, clearError } = useAuthStore()
  const { t } = useLanguage()

  // Create validation schemas with current translations
  const { loginSchema, registerSchema, forgotPasswordSchema } = createValidationSchemas(t)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      department: '',
      phone: ''
    }
  })

  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  // Clear errors when switching modes
  useEffect(() => {
    clearError()
  }, [mode, clearError])

  // Redirect if already authenticated
  if (session && user) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  const onLogin = async (data: LoginForm) => {
    try {
      const session = await signIn(data.email, data.password)
      if (session) {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }
    } catch (_error) {
      // Error is handled in the store
    }
  }

  const onRegister = async (data: RegisterForm) => {
    try {
      await signUp(data.email, data.password, {
        full_name: data.full_name,
        department: data.department,
        phone: data.phone
      })
      setMode('login')
      registerForm.reset()
    } catch (_error) {
      // Error is handled in the store
    }
  }

  const onForgotPassword = async (data: ForgotPasswordForm) => {
    try {
      await resetPassword(data.email)
      setMode('login')
      forgotForm.reset()
    } catch (_error) {
      // Error is handled in the store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-muted p-4">
      <div className="w-full max-w-md">
        <CorporateCard className="p-8 shadow-xl border bg-white/95 backdrop-blur-sm">
          <CorporateCardHeader className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-bg-primary to-bg-primary rounded-2xl flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <CorporateCardTitle className="text-2xl font-bold text-text-foreground">
              {mode === 'login' && t('auth.welcome')}
              {mode === 'register' && t('auth.signUp')}
              {mode === 'forgot' && t('auth.resetPassword')}
            </CorporateCardTitle>
            <p className="text-text-muted-foreground mt-2">
              {mode === 'login' && 'Dernek Yönetim Paneli'}
              {mode === 'register' && 'Yeni hesap oluşturmak için bilgilerinizi giriniz'}
              {mode === 'forgot' && 'Email adresinizi girerek şifrenizi sıfırlayın'}
            </p>
          </CorporateCardHeader>

          <CorporateCardContent>
            {error && (
              <CorporateAlert variant="danger" className="mb-6">
                <p className="text-sm">{error}</p>
              </CorporateAlert>
            )}

            {mode === 'login' && (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <FormGroup>
                  <FormLabel htmlFor="login-email">
                    {t('auth.emailAddress')}
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                    <FormInput
                      {...loginForm.register('email')}
                      id="login-email"
                      type="email"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-bg-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="login-password">
                    {t('auth.password')}
                  </FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                    <FormInput
                      {...loginForm.register('password')}
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground hover:text-text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-bg-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </FormGroup>

                <CorporateButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    'Giriş Yap'
                  )}
                </CorporateButton>

                <div className="text-center">
                  <div className="text-text-muted-foreground text-sm">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-bg-primary hover:text-bg-primary/80 text-sm font-medium"
                    >
                      Şifremi unuttum
                    </button>
                    <span className="mx-2">|</span>
                    Hesabınız yok mu?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-bg-primary hover:text-bg-primary/80 font-medium"
                    >
                      Kayıt olun
                    </button>
                  </div>
                </div>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormGroup>
                  <FormLabel>
                    Ad Soyad *
                  </FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                    <FormInput
                      {...registerForm.register('full_name')}
                      type="text"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  {registerForm.formState.errors.full_name && (
                    <p className="text-bg-red-500 text-sm mt-1">{registerForm.formState.errors.full_name.message}</p>
                  )}
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    Email Adresi *
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                    <FormInput
                      {...registerForm.register('email')}
                      type="email"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-bg-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </FormGroup>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormGroup>
                    <FormLabel>
                      Şifre *
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                      <FormInput
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground hover:text-text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-bg-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Şifre Tekrar *
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                      <FormInput
                        {...registerForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground hover:text-text-muted-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-bg-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </FormGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormGroup>
                    <FormLabel>
                      Departman
                    </FormLabel>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                      <FormInput
                        {...registerForm.register('department')}
                        type="text"
                        placeholder="Departmanınız"
                      />
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Telefon
                    </FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                      <FormInput
                        {...registerForm.register('phone')}
                        type="tel"
                        placeholder="+90 555 123 45 67"
                      />
                    </div>
                  </FormGroup>
                </div>

                <CorporateButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    'Hesap Oluştur'
                  )}
                </CorporateButton>

                <div className="text-center">
                  <div className="text-text-muted-foreground text-sm">
                    Zaten hesabınız var mı?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-bg-primary hover:text-bg-primary/80 font-medium"
                    >
                      Giriş yapın
                    </button>
                  </div>
                </div>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={forgotForm.handleSubmit(onForgotPassword)} className="space-y-6">
                <FormGroup>
                  <FormLabel htmlFor="email">
                    {t('auth.emailAddress')}
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-foreground w-5 h-5" />
                    <FormInput
                      {...forgotForm.register('email')}
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {forgotForm.formState.errors.email && (
                    <p className="text-bg-red-500 text-sm mt-1">{forgotForm.formState.errors.email.message}</p>
                  )}
                </FormGroup>

                <CorporateButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Şifre Sıfırlama Bağlantısı Gönder'
                  )}
                </CorporateButton>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-bg-primary hover:text-bg-primary/80 text-sm font-medium"
                  >
                    ← Giriş sayfasına dön
                  </button>
                </div>
              </form>
            )}
          </CorporateCardContent>
        </CorporateCard>
      </div>
    </div>
  )
}
