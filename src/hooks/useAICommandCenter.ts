import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTheme } from '../contexts/ThemeContext'
import type { ActionContext } from '../lib/ai/actions'

export function useAICommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setTheme } = useTheme()

  // Simple chat toggle function - you may need to adjust this based on your chat implementation
  const toggleChat = useCallback(() => {
    // This should trigger the chat functionality
    // For now, we'll emit a custom event that can be caught by the chat component
    const event = new CustomEvent('toggle-chat')
    window.dispatchEvent(event)
  }, [])

  // ActionContext oluştur
  const actionContext: ActionContext = {
    navigateTo: useCallback((path: string) => {
      navigate(path)
      setIsOpen(false) // Navigasyon sonrası kapat
    }, [navigate]),
    
    setTheme: useCallback((newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme)
    }, [setTheme]),
    
    toggleChat: useCallback(() => {
      toggleChat()
    }, [toggleChat])
  }

  // Klavye kısayolu (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      
      // ESC ile kapat
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const openCommandCenter = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCommandCenter = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    openCommandCenter,
    closeCommandCenter,
    actionContext,
    userId: user?.id
  }
}
