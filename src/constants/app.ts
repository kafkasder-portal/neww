// Application-wide constants

export const APP_CONFIG = {
  name: 'KAFKASDER Yardım Yönetim Sistemi',
  version: '1.0.0',
  description: 'Çeçen Kafkas Muhacirleri Yardımlaşma ve Dayanışma Derneği Yönetim Paneli',
  author: 'KAFKASDER',
  supportEmail: 'destek@kafkasder.org',
  website: 'https://kafkasder.org'
} as const;

export const ENVIRONMENT = {
  development: 'development',
  production: 'production',
  test: 'test'
} as const;

export const STORAGE_KEYS = {
  auth: 'kafkasder_auth',
  user: 'kafkasder_user',
  preferences: 'kafkasder_preferences',
  theme: 'kafkasder_theme',
  language: 'kafkasder_language',
  sidebar: 'kafkasder_sidebar',
  recentItems: 'kafkasder_recent',
  searchHistory: 'kafkasder_search_history'
} as const;

export const DATE_FORMATS = {
  display: 'DD.MM.YYYY',
  displayWithTime: 'DD.MM.YYYY HH:mm',
  api: 'YYYY-MM-DD',
  apiWithTime: 'YYYY-MM-DD HH:mm:ss',
  iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
} as const;

export const CURRENCY = {
  code: 'TRY',
  symbol: '₺',
  locale: 'tr-TR'
} as const;

export const LANGUAGES = {
  turkish: {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷'
  },
  english: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
} as const;

export const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system'
} as const;

export const DEFAULT_SETTINGS = {
  theme: THEMES.light,
  language: LANGUAGES.turkish.code,
  pageSize: 10,
  sidebarCollapsed: false,
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  autoSave: true,
  autoSaveInterval: 30000 // 30 seconds
} as const;

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    all: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },
  maxFiles: 5
} as const;

export const CONTACT_INFO = {
  phone: '+90 212 555 0123',
  email: 'info@kafkasder.org',
  address: 'İstanbul, Türkiye',
  website: 'https://kafkasder.org',
  socialMedia: {
    facebook: 'https://facebook.com/kafkasder',
    twitter: 'https://twitter.com/kafkasder',
    instagram: 'https://instagram.com/kafkasder',
    linkedin: 'https://linkedin.com/company/kafkasder'
  }
} as const;

export const REGEX_PATTERNS = {
  phone: /^[+]?[0-9\s\-()]{10,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  identityNo: /^[0-9]{11}$/,
  iban: /^TR[0-9]{2}[0-9]{4}[0-9]{1}[0-9]{16}$/,
  postalCode: /^[0-9]{5}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
} as const;

export const DEBOUNCE_DELAYS = {
  search: 300,
  validation: 500,
  autoSave: 2000,
  api: 300
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;