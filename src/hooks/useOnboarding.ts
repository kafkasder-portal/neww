import { useState, useEffect, startTransition } from 'react'
import { useAuthStore } from '@/store/auth'

// OnboardingStep interface kaldırıldı - gerekirse tekrar eklenebilir

interface OnboardingState {
  isCompleted: boolean
  currentStep: number
  completedSteps: string[]
  lastCompletedAt?: string
}

export function useOnboarding() {
  const { user } = useAuthStore()
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    completedSteps: [],
  })
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Load onboarding state from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`onboarding_${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          startTransition(() => {
            setOnboardingState(parsed)
          })
        } catch (error) {
          console.error('Failed to parse onboarding state:', error)
        }
      }
    }
  }, [user])

  // Check if user should see onboarding
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`onboarding_${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          startTransition(() => {
            if (parsed.isCompleted) {
              setShowOnboarding(false)
            } else {
              setShowOnboarding(true)
            }
          })
        } catch (error) {
          console.error('Failed to parse onboarding state:', error)
          startTransition(() => {
            setShowOnboarding(true)
          })
        }
      } else {
        // New user - show onboarding
        startTransition(() => {
          setShowOnboarding(true)
        })
      }
    }
  }, [user])

  const markStepComplete = (stepId: string) => {
    if (!user) return

    startTransition(() => {
      setOnboardingState(prev => {
        const newState = {
          ...prev,
          completedSteps: [...prev.completedSteps, stepId],
          currentStep: prev.currentStep + 1
        }
        
        // Save to localStorage
        localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(newState))
        return newState
      })
    })
  }

  const completeOnboarding = () => {
    if (!user) return

    const completedState: OnboardingState = {
      isCompleted: true,
      currentStep: 0,
      completedSteps: [],
      lastCompletedAt: new Date().toISOString()
    }

    startTransition(() => {
      setOnboardingState(completedState)
      setShowOnboarding(false)
    })
    
    // Save to localStorage
    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(completedState))
  }

  const resetOnboarding = () => {
    if (!user) return

    const resetState: OnboardingState = {
      isCompleted: false,
      currentStep: 0,
      completedSteps: [],
    }

    startTransition(() => {
      setOnboardingState(resetState)
      setShowOnboarding(true)
    })
    
    // Remove from localStorage
    localStorage.removeItem(`onboarding_${user.id}`)
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const closeOnboarding = () => {
    startTransition(() => {
      setShowOnboarding(false)
    })
  }

  return {
    showOnboarding,
    onboardingState,
    markStepComplete,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding,
    setShowOnboarding,
    closeOnboarding
  }
}
