import React from 'react'
import { useLanguageContext } from '@/contexts/LanguageContext'
import { LANGUAGE_NAMES, LANGUAGE_FLAGS } from '@/constants/languages'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger 
} from '@/components/ui/select'
import { ChevronDown } from 'lucide-react'

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguageContext()

  const handleLanguageChange = (language: string) => {
    changeLanguage(language as any)
  }

  return (
    <div className="relative">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-9">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{LANGUAGE_FLAGS[currentLanguage]}</span>
            <span className="text-sm font-medium">
              {LANGUAGE_NAMES[currentLanguage]}
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((language) => (
            <SelectItem key={language} value={language}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
                <span>{LANGUAGE_NAMES[language]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Compact version for mobile
export const CompactLanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguageContext()

  const handleLanguageChange = (language: string) => {
    changeLanguage(language as any)
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-16 h-8">
        <span className="text-lg">{LANGUAGE_FLAGS[currentLanguage]}</span>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((language) => (
          <SelectItem key={language} value={language}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
              <span className="text-xs">{LANGUAGE_NAMES[language]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
