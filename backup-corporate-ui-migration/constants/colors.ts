/**
 * DEPRECATED - YENİ TASARIM SİSTEMİ KULLANIN
 * 
 * Bu dosya artık kullanımdan kaldırılmıştır.
 * Lütfen src/constants/design-system.ts dosyasını kullanın.
 * 
 * @deprecated Use design-system.ts instead
 */

import { COLORS, STATUS } from './design-system';

// Legacy exports for backward compatibility
export const CHART_COLORS = [
  COLORS.chart[1],
  COLORS.chart[2],
  COLORS.chart[3],
  COLORS.chart[4],
  COLORS.chart[5],
  COLORS.chart[6],
  COLORS.chart[7],
  COLORS.chart[8],
] as const;

// Legacy hex colors for Recharts compatibility
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

// Legacy status colors
export const STATUS_COLORS = {
  success: STATUS.success,
  warning: STATUS.warning,
  error: STATUS.error,
  info: STATUS.info,
  neutral: STATUS.neutral,
} as const;

// Legacy severity colors
export const SEVERITY_COLORS = {
  low: {
    tailwind: 'bg-blue-50 text-blue-700 border-blue-200',
    css: STATUS.info,
  },
  medium: {
    tailwind: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    css: STATUS.warning,
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
    css: STATUS.error,
  },
} as const;

// Legacy performance colors
export const PERFORMANCE_COLORS = {
  excellent: STATUS.success,
  good: {
    bg: 'hsl(142 50% 90%)',
    text: 'hsl(142 60% 30%)',
    border: 'hsl(142 60% 30% / 0.3)',
  },
  fair: STATUS.warning,
  poor: {
    bg: 'hsl(15 84% 90%)',
    text: 'hsl(15 89% 35%)',
    border: 'hsl(15 89% 35% / 0.3)',
  },
  critical: STATUS.error,
} as const;

// Legacy activity colors
export const ACTIVITY_COLORS = {
  user: COLORS.brand.primary,
  system: COLORS.semantic.success,
  admin: COLORS.chart[5],
  warning: COLORS.semantic.warning,
  error: COLORS.semantic.danger,
  info: COLORS.semantic.info,
} as const;

// Legacy semantic classes
export const SEMANTIC_STATUS_CLASSES = {
  success: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
  warning: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
  error: 'bg-semantic-danger/10 text-semantic-danger border-semantic-danger/20',
  info: 'bg-semantic-info/10 text-semantic-info border-semantic-info/20',
  neutral: 'bg-neutral-50 text-neutral-700 border-neutral-200',
} as const;

// Legacy icon colors
export const SEMANTIC_ICON_COLORS = {
  primary: 'text-brand-primary',
  success: 'text-semantic-success',
  warning: 'text-semantic-warning',
  error: 'text-semantic-danger',
  info: 'text-semantic-info',
  muted: 'text-neutral-500',
  secondary: 'text-brand-secondary',
  accent: 'text-brand-accent',
} as const;

// Legacy CSS variables
export const CSS_VARIABLES = {
  brandPrimary: COLORS.brand.primary,
  brandPrimary50: COLORS.brand.primary50,
  brandPrimary100: COLORS.brand.primary100,
  brandPrimary500: COLORS.brand.primary500,
  brandPrimary900: COLORS.brand.primary900,
  financialSuccess: COLORS.financial.income,
  financialWarning: COLORS.financial.pending,
  financialError: COLORS.financial.expense,
  financialInfo: COLORS.financial.transfer,
  neutral50: COLORS.neutral[50],
  neutral100: COLORS.neutral[100],
  neutral500: COLORS.neutral[500],
  neutral900: COLORS.neutral[900],
  sidebarBg: COLORS.sidebar.bg,
  sidebarText: COLORS.sidebar.text,
  sidebarHover: COLORS.sidebar.bgHover,
  sidebarActive: COLORS.sidebar.accent,
} as const;

// Type definitions
export type ChartColor = typeof CHART_COLORS[number];
export type ChartColorHex = typeof CHART_COLORS_HEX[number];
export type StatusType = keyof typeof STATUS_COLORS;
export type SeverityLevel = keyof typeof SEVERITY_COLORS;
export type PerformanceLevel = keyof typeof PERFORMANCE_COLORS;
export type ActivityType = keyof typeof ACTIVITY_COLORS;
export type IconColorType = keyof typeof SEMANTIC_ICON_COLORS;

// Deprecation warning - removed to prevent console spam
