import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return 'system'
    
    const stored = localStorage.getItem('theme') as Theme
    return stored || 'system'
  })

  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply theme to document
  const applyTheme = useCallback((currentTheme: Theme) => {
    const root = window.document.documentElement
    
    root.classList.remove('light', 'dark')
    
    if (currentTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === 'dark')
    } else {
      root.classList.add(currentTheme)
      setIsDarkMode(currentTheme === 'dark')
    }
  }, [])

  // Initialize theme
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme])

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [])

  const toggleDarkMode = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setThemeValue(newTheme)
  }, [isDarkMode, setThemeValue])

  const cycleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setThemeValue(themes[nextIndex])
  }, [theme, setThemeValue])

  return {
    theme,
    isDarkMode,
    setTheme: setThemeValue,
    toggleDarkMode,
    cycleTheme
  }
}
