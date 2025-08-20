import { useState, useEffect, useCallback } from 'react'
import { LANGUAGES, Language, DEFAULT_LANGUAGE } from '@/constants/languages'
import { getTranslation } from '@/locales'

const LANGUAGE_STORAGE_KEY = 'app_language'

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [isRTL, setIsRTL] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = currentLanguage
  }, [currentLanguage, isRTL])

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    
    // Update RTL status (currently no RTL languages, but ready for future)
    setIsRTL(false)
  }, [])

  const t = useCallback((key: string): string => {
    return getTranslation(currentLanguage, key)
  }, [currentLanguage])

  const resetLanguage = useCallback(() => {
    changeLanguage(DEFAULT_LANGUAGE)
  }, [changeLanguage])

  return {
    currentLanguage,
    changeLanguage,
    resetLanguage,
    t,
    isRTL,
    availableLanguages: Object.values(LANGUAGES)
  }
}
