import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { startTransition } from 'react'
import { logAuthError, logSystemError } from '../services/errorService'

export type UserProfile = {
  id: string
  full_name: string
  department?: string
  phone?: string
  role: 'super_admin' | 'admin' | 'manager' | 'coordinator' | 'volunteer' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
  avatar_url?: string
}

export type AuthUser = User & {
  profile?: UserProfile
}

type AuthState = {
  user: AuthUser | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  initializing: boolean
  error: string | null
}

type AuthActions = {
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<Session | null>
  signUp: (email: string, password: string, userData: { full_name: string; department?: string; phone?: string }) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  initializing: true,
  error: null,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        logAuthError(sessionError as unknown as Error, { component: 'authStore', action: 'initialize.getSession' })
        startTransition(() => {
          set({ initializing: false, error: sessionError.message })
        })
        return
      }

      if (session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          const errorMsg = `Database error querying schema: ${JSON.stringify(profileError)}`
          logSystemError(new Error(errorMsg), { component: 'authStore', action: 'initialize.fetchProfile', additionalData: { supabaseError: profileError } })
          // Create profile if it doesn't exist
          const newProfile: Partial<UserProfile> = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: 'user',
            is_active: true
          }

          const { data: createdProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert(newProfile)
            .select()
            .single()

          if (createError) {
            const createErrorMsg = `Database error creating profile: ${JSON.stringify(createError)}`
            logSystemError(new Error(createErrorMsg), { component: 'authStore', action: 'initialize.createProfile', additionalData: { supabaseError: createError } })
            startTransition(() => {
              set({ initializing: false, error: 'Failed to create user profile' })
            })
            return
          }

          startTransition(() => {
            set({
              user: { ...session.user, profile: createdProfile },
              session,
              profile: createdProfile,
              initializing: false
            })
          })
        } else {
          // Check if user is active
          if (!profile.is_active) {
            await supabase.auth.signOut()
            startTransition(() => {
              set({ 
                user: null, 
                session: null, 
                profile: null, 
                initializing: false, 
                error: 'Account has been deactivated' 
              })
            })
            return
          }

          startTransition(() => {
            set({
              user: { ...session.user, profile },
              session,
              profile,
              initializing: false
            })
          })
        }
      } else {
        startTransition(() => {
          set({ initializing: false })
        })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileError) {
            const errorMsg = `Database error in auth state change: ${JSON.stringify(profileError)}`
            logSystemError(new Error(errorMsg), { component: 'authStore', action: 'onAuthStateChange.fetchProfile', additionalData: { supabaseError: profileError } })
          } else if (profile) {
            startTransition(() => {
              set({
                user: { ...session.user, profile },
                session,
                profile,
                loading: false,
                error: null
              })
            })
          }
        } else if (event === 'SIGNED_OUT') {
          startTransition(() => {
            set({
              user: null,
              session: null,
              profile: null,
              loading: false,
              error: null
            })
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          startTransition(() => {
            set({ session })
          })
        }
      })

    } catch (error) {
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'initialize' })
      startTransition(() => {
        set({ 
          initializing: false, 
          error: error instanceof Error ? error.message : 'Authentication initialization failed' 
        })
      })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      startTransition(() => {
        set({ loading: true, error: null })
      })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        throw error
      }

      if (!data.session) {
        throw new Error('Login failed - no session returned')
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        const errorMsg = `Database error fetching profile: ${JSON.stringify(profileError)}`
        logSystemError(new Error(errorMsg), { component: 'authStore', action: 'signIn.fetchProfile', additionalData: { supabaseError: profileError } })
        throw new Error('Failed to fetch user profile')
      }

      // Check if user is active
      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('Account has been deactivated')
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id)

      startTransition(() => {
        set({
          user: { ...data.user, profile },
          session: data.session,
          profile,
          loading: false,
          error: null
        })
      })

      toast.success('Giriş başarılı!')
      return data.session

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'signIn' })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
      return null
    }
  },

  signUp: async (email: string, password: string, userData: { full_name: string; department?: string; phone?: string }) => {
    try {
      startTransition(() => {
        set({ loading: true, error: null })
      })

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error('Registration failed - no user returned')
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          full_name: userData.full_name,
          department: userData.department,
          phone: userData.phone,
          role: 'user', // Default role
          is_active: true
        })

      if (profileError) {
        const errorMsg = `Database error creating signup profile: ${JSON.stringify(profileError)}`
        logSystemError(new Error(errorMsg), { component: 'authStore', action: 'signUp.createProfile', additionalData: { supabaseError: profileError } })
        // Don't throw here, user can still use the account
      }

      startTransition(() => {
        set({ loading: false, error: null })
      })
      toast.success('Kayıt başarılı! Lütfen email adresinizi kontrol edin.')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'signUp' })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
      throw error
    }
  },

  signOut: async () => {
    try {
      startTransition(() => {
        set({ loading: true, error: null })
      })

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      startTransition(() => {
        set({
          user: null,
          session: null,
          profile: null,
          loading: false,
          error: null
        })
      })

      toast.success('Çıkış yapıldı')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'signOut' })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const { user, profile } = get()
      if (!user || !profile) {
        throw new Error('No user logged in')
      }

      startTransition(() => {
        set({ loading: true, error: null })
      })

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedProfile = { ...profile, ...data }
      startTransition(() => {
        set({
          profile: updatedProfile,
          user: { ...user, profile: updatedProfile },
          loading: false,
          error: null
        })
      })

      toast.success('Profil güncellendi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      const enhancedError = error instanceof Error ? error : new Error(`Profile update error: ${JSON.stringify(error)}`)
      logSystemError(enhancedError, { component: 'authStore', action: 'updateProfile', additionalData: { originalError: error } })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
      throw error
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { user } = get()
      if (!user?.email) {
        throw new Error('No user logged in')
      }

      startTransition(() => {
        set({ loading: true, error: null })
      })

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (verifyError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      startTransition(() => {
        set({ loading: false, error: null })
      })
      toast.success('Şifre değiştirildi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed'
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'changePassword' })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      startTransition(() => {
        set({ loading: true, error: null })
      })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      startTransition(() => {
        set({ loading: false, error: null })
      })
      toast.success('Şifre sıfırlama bağlantısı email adresinize gönderildi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      logAuthError(error instanceof Error ? error : new Error(String(error)), { component: 'authStore', action: 'resetPassword' })
      
      startTransition(() => {
        set({ loading: false, error: errorMessage })
      })
      toast.error(errorMessage)
      throw error
    }
  },

  clearError: () => {
    startTransition(() => {
      set({ error: null })
    })
  }
}))
