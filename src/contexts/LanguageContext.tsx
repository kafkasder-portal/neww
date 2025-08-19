import React, { createContext, useContext, ReactNode } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Language } from '@/constants/languages'

interface LanguageContextType {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  resetLanguage: () => void
  t: (key: string) => string
  isRTL: boolean
  availableLanguages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguageContext = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const languageUtils = useLanguage()

  return (
    <LanguageContext.Provider value={languageUtils}>
      {children}
    </LanguageContext.Provider>
  )
}
