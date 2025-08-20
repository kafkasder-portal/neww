import { useEffect, useCallback } from 'react'

interface KeyboardShortcutHandlers {
  onToggleSidebar?: () => void
  onSearch?: () => void
  onCloseModal?: () => void
  onNavigateToHome?: () => void
  onToggleTheme?: () => void
  onHelp?: () => void
}

interface KeyboardShortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
  handler: () => void
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  // Define all keyboard shortcuts
  const shortcuts = useCallback((): KeyboardShortcut[] => [
    {
      key: 'b',
      ctrlKey: true,
      description: 'Toggle Sidebar',
      handler: handlers.onToggleSidebar || (() => {})
    },
    {
      key: 'k',
      ctrlKey: true,
      description: 'Quick Search',
      handler: handlers.onSearch || (() => {})
    },
    {
      key: 'Escape',
      description: 'Close Modal/Dialog',
      handler: handlers.onCloseModal || (() => {})
    },
    {
      key: 'h',
      ctrlKey: true,
      description: 'Go to Home',
      handler: handlers.onNavigateToHome || (() => {})
    },
    {
      key: 't',
      ctrlKey: true,
      shiftKey: true,
      description: 'Toggle Theme',
      handler: handlers.onToggleTheme || (() => {})
    },
    {
      key: '/',
      ctrlKey: true,
      description: 'Show Help',
      handler: handlers.onHelp || (() => {})
    }
  ], [handlers])

  // Main keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in form elements
    const activeElement = document.activeElement
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true'
    )

    if (isTyping && event.key !== 'Escape') {
      return
    }

    const currentShortcuts = shortcuts()
    
    for (const shortcut of currentShortcuts) {
      const keyMatches = event.key === shortcut.key
      const metaMatches = (shortcut.metaKey || false) === (event.metaKey || false)
      const ctrlMatches = (shortcut.ctrlKey || false) === (event.ctrlKey || false)
      const shiftMatches = (shortcut.shiftKey || false) === (event.shiftKey || false)
      const altMatches = (shortcut.altKey || false) === (event.altKey || false)

      if (keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault()
        shortcut.handler()
        break
      }
    }
  }, [shortcuts])

  // Register keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Get formatted shortcuts for display
  const getShortcutsList = useCallback(() => {
    return shortcuts().map(shortcut => ({
      keys: [
        shortcut.ctrlKey && '⌘',
        shortcut.shiftKey && '⇧',
        shortcut.altKey && '⌥',
        shortcut.key.toUpperCase()
      ].filter(Boolean).join(' + '),
      description: shortcut.description
    }))
  }, [shortcuts])

  // Format single shortcut for display
  const formatShortcut = useCallback((shortcut: Partial<KeyboardShortcut>) => {
    const keys = [
      shortcut.ctrlKey && (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'),
      shortcut.shiftKey && '⇧',
      shortcut.altKey && '⌥',
      shortcut.key?.toUpperCase()
    ].filter(Boolean)
    
    return keys.join(' + ')
  }, [])

  return {
    shortcuts: getShortcutsList(),
    formatShortcut
  }
}

// Hook for individual shortcut
export const useKeyboardShortcut = (
  key: string,
  handler: () => void,
  options: {
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    enabled?: boolean
  } = {}
) => {
  const { ctrlKey, metaKey, shiftKey, altKey, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key === key
      const ctrlMatches = (ctrlKey || false) === (event.ctrlKey || false)
      const metaMatches = (metaKey || false) === (event.metaKey || false)
      const shiftMatches = (shiftKey || false) === (event.shiftKey || false)
      const altMatches = (altKey || false) === (event.altKey || false)

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        event.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, handler, ctrlKey, metaKey, shiftKey, altKey, enabled])
}
