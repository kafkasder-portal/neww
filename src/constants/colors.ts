/**
 * OPTİMİZE EDİLMİŞ RENK KONSTANTLARİ
 * WCAG AA uyumlu renk paleti ve semantik renk eşlemeleri
 */

// Chart renkleri - HSL format (Tailwind uyumlu)
export const CHART_COLORS = [
  'hsl(220 98% 29%)',   // Brand Primary - Mavi
  'hsl(142 71% 25%)',   // Success - Yeşil  
  'hsl(43 89% 35%)',    // Warning - Sarı
  'hsl(0 87% 35%)',     // Error - Kırmızı
  'hsl(285 89% 35%)',   // Purple - Mor
  'hsl(195 89% 35%)',   // Teal - Turkuaz
  'hsl(15 89% 35%)',    // Orange - Turuncu
  'hsl(340 89% 35%)',   // Pink - Pembe
] as const;

// Chart renkleri - Hex format (Recharts uyumlu)
export const CHART_COLORS_HEX = [
  '#0F3A7A', // Brand Primary
  '#1D8348', // Success
  '#B7950B', // Warning  
  '#C0392B', // Error
  '#7D3C98', // Purple
  '#1ABC9C', // Teal
  '#E67E22', // Orange
  '#E74C3C', // Pink
] as const;

// Status renkleri - Semantic mapping
export const STATUS_COLORS = {
  success: {
    bg: 'hsl(142 68% 88%)',    // Açık yeşil arka plan
    text: 'hsl(142 71% 25%)',  // Koyu yeşil metin
    border: 'hsl(142 71% 25% / 0.3)', // Şeffaf kenarlık
  },
  warning: {
    bg: 'hsl(43 84% 90%)',
    text: 'hsl(43 89% 35%)',
    border: 'hsl(43 89% 35% / 0.3)',
  },
  error: {
    bg: 'hsl(0 84% 90%)',
    text: 'hsl(0 87% 35%)',
    border: 'hsl(0 87% 35% / 0.3)',
  },
  info: {
    bg: 'hsl(207 84% 90%)',
    text: 'hsl(207 89% 35%)',
    border: 'hsl(207 89% 35% / 0.3)',
  },
  neutral: {
    bg: 'hsl(210 18% 95%)',
    text: 'hsl(210 12% 35%)',
    border: 'hsl(210 16% 88%)',
  },
} as const;

// Severity seviyeleri - Hata yönetimi için
export const SEVERITY_COLORS = {
  low: {
    tailwind: 'bg-blue-50 text-blue-700 border-blue-200',
    css: STATUS_COLORS.info,
  },
  medium: {
    tailwind: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    css: STATUS_COLORS.warning,
  },
  high: {
    tailwind: 'bg-orange-50 text-orange-700 border-orange-200',
    css: {
      bg: 'hsl(15 84% 90%)',
      text: 'hsl(15 89% 35%)',
      border: 'hsl(15 89% 35% / 0.3)',
    },
  },
  critical: {
    tailwind: 'bg-red-50 text-red-700 border-red-200',
    css: STATUS_COLORS.error,
  },
} as const;

// Performans monitor renkleri
export const PERFORMANCE_COLORS = {
  excellent: STATUS_COLORS.success,
  good: {
    bg: 'hsl(142 50% 90%)',
    text: 'hsl(142 60% 30%)',
    border: 'hsl(142 60% 30% / 0.3)',
  },
  fair: STATUS_COLORS.warning,
  poor: {
    bg: 'hsl(15 84% 90%)',
    text: 'hsl(15 89% 35%)',
    border: 'hsl(15 89% 35% / 0.3)',
  },
  critical: STATUS_COLORS.error,
} as const;

// Activity feed renkleri
export const ACTIVITY_COLORS = {
  user: 'hsl(220 98% 50%)',      // Mavi - Kullanıcı eylemleri
  system: 'hsl(142 71% 35%)',    // Yeşil - Sistem eylemleri  
  admin: 'hsl(285 89% 45%)',     // Mor - Admin eylemleri
  warning: 'hsl(43 89% 45%)',    // Sarı - Uyarılar
  error: 'hsl(0 87% 45%)',       // Kırmızı - Hatalar
  info: 'hsl(207 89% 45%)',      // Mavi - Bilgilendirme
} as const;

// Tailwind class mappings - Optimized semantic classes
export const TAILWIND_STATUS_CLASSES = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200',
} as const;

// Icon renkleri - Consistent color mapping
export const ICON_COLORS = {
  primary: 'text-blue-600',
  success: 'text-green-600', 
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  muted: 'text-gray-500',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
} as const;

// CSS Custom Properties Helper
export const CSS_VARIABLES = {
  // Brand colors
  brandPrimary: 'var(--brand-primary)',
  brandPrimary50: 'var(--brand-primary-50)',
  brandPrimary100: 'var(--brand-primary-100)',
  brandPrimary500: 'var(--brand-primary-500)',
  brandPrimary900: 'var(--brand-primary-900)',
  
  // Financial colors
  financialSuccess: 'var(--financial-success)',
  financialWarning: 'var(--financial-warning)',
  financialError: 'var(--financial-error)',
  financialInfo: 'var(--financial-info)',
  
  // Neutral colors
  neutral50: 'var(--neutral-50)',
  neutral100: 'var(--neutral-100)',
  neutral500: 'var(--neutral-500)',
  neutral900: 'var(--neutral-900)',
  
  // Sidebar colors
  sidebarBg: 'var(--sidebar-bg)',
  sidebarText: 'var(--sidebar-text)',
  sidebarHover: 'var(--sidebar-hover)',
  sidebarActive: 'var(--sidebar-active)',
} as const;

// Type definitions
export type ChartColor = typeof CHART_COLORS[number];
export type ChartColorHex = typeof CHART_COLORS_HEX[number];
export type StatusType = keyof typeof STATUS_COLORS;
export type SeverityLevel = keyof typeof SEVERITY_COLORS;
export type PerformanceLevel = keyof typeof PERFORMANCE_COLORS;
export type ActivityType = keyof typeof ACTIVITY_COLORS;
export type IconColorType = keyof typeof ICON_COLORS;
