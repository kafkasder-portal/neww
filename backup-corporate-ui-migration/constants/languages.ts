export const LANGUAGES = {
  TR: 'tr',
  RU: 'ru',
  EN: 'en'
} as const

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES]

export const LANGUAGE_NAMES = {
  [LANGUAGES.TR]: 'Türkçe',
  [LANGUAGES.RU]: 'Русский',
  [LANGUAGES.EN]: 'English'
} as const

export const LANGUAGE_FLAGS = {
  [LANGUAGES.TR]: '🇹🇷',
  [LANGUAGES.RU]: '🇷🇺',
  [LANGUAGES.EN]: '🇺🇸'
} as const

export const RTL_LANGUAGES = [
  // Gelecekte Arapça gibi RTL diller eklenebilir
] as const

export const DEFAULT_LANGUAGE = LANGUAGES.TR
