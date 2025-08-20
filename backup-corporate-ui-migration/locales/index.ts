import { tr } from './tr'
import { ru } from './ru'
import { en } from './en'
import { LANGUAGES, Language } from '@/constants/languages'

export const translations = {
  [LANGUAGES.TR]: tr,
  [LANGUAGES.RU]: ru,
  [LANGUAGES.EN]: en
} as const

export type TranslationKey = keyof typeof tr

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to Turkish if key not found
      value = getNestedValue(translations[LANGUAGES.TR], keys)
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

const getNestedValue = (obj: any, keys: string[]): string => {
  let value: any = obj
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return keys.join('.')
    }
  }
  
  return typeof value === 'string' ? value : keys.join('.')
}

export { tr, ru, en }
