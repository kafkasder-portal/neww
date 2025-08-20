/**
 * DEPRECATED - YENİ TASARIM SİSTEMİ KULLANIN
 * 
 * Bu dosya artık kullanımdan kaldırılmıştır.
 * Lütfen src/constants/design-system.ts dosyasını kullanın.
 * 
 * @deprecated Use design-system.ts instead
 */

import { ANIMATIONS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from './design-system';

// Legacy exports for backward compatibility
export const COLORS_LEGACY = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: 'COLORS.semantic.success',
    600: 'COLORS.semantic.success',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: 'COLORS.semantic.warning',
    600: 'COLORS.semantic.warning',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: 'COLORS.semantic.danger',
    600: 'COLORS.semantic.danger',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  gray: {
    50: 'COLORS.neutral[50]',
    100: 'COLORS.neutral[100]',
    200: 'COLORS.neutral[200]',
    300: 'COLORS.neutral[300]',
    400: 'COLORS.neutral[400]',
    500: 'COLORS.neutral[500]',
    600: 'COLORS.neutral[600]',
    700: 'COLORS.neutral[700]',
    800: 'COLORS.neutral[800]',
    900: 'COLORS.neutral[900]'
  }
} as const;

export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Legacy spacing - use SPACING from design-system instead
export const SPACING_LEGACY = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem'
} as const;

// Legacy font sizes - use TYPOGRAPHY.fontSize from design-system instead
export const FONT_SIZES = {
  xs: TYPOGRAPHY.fontSize.xs,
  sm: TYPOGRAPHY.fontSize.sm,
  base: TYPOGRAPHY.fontSize.base,
  lg: TYPOGRAPHY.fontSize.lg,
  xl: TYPOGRAPHY.fontSize.xl,
  '2xl': TYPOGRAPHY.fontSize['2xl'],
  '3xl': TYPOGRAPHY.fontSize['3xl'],
  '4xl': TYPOGRAPHY.fontSize['4xl'],
  '5xl': TYPOGRAPHY.fontSize['5xl'],
  '6xl': '3.75rem'
} as const;

// Legacy font weights - use TYPOGRAPHY.fontWeight from design-system instead
export const FONT_WEIGHTS = {
  thin: '100',
  extralight: '200',
  light: TYPOGRAPHY.fontWeight.light,
  normal: TYPOGRAPHY.fontWeight.normal,
  medium: TYPOGRAPHY.fontWeight.medium,
  semibold: TYPOGRAPHY.fontWeight.semibold,
  bold: TYPOGRAPHY.fontWeight.bold,
  extrabold: TYPOGRAPHY.fontWeight.extrabold,
  black: '900'
} as const;

// Legacy border radius - use BORDER_RADIUS from design-system instead
export const BORDER_RADIUS_LEGACY = {
  none: BORDER_RADIUS.none,
  sm: BORDER_RADIUS.sm,
  base: BORDER_RADIUS.sm,
  md: BORDER_RADIUS.md,
  lg: BORDER_RADIUS.lg,
  xl: BORDER_RADIUS.xl,
  '2xl': BORDER_RADIUS['2xl'],
  '3xl': '1.5rem',
  full: BORDER_RADIUS.full
} as const;

// Legacy shadows - use SHADOWS from design-system instead
export const SHADOWS_LEGACY = {
  sm: SHADOWS.sm,
  base: SHADOWS.md,
  md: SHADOWS.md,
  lg: SHADOWS.lg,
  xl: SHADOWS.xl,
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000'
} as const;

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
} as const;

// Legacy transitions - use ANIMATIONS from design-system instead
export const TRANSITIONS = {
  none: 'none',
  all: `all ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`,
  default: `all ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`,
  colors: `color ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}, background-color ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}, border-color ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`,
  opacity: `opacity ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`,
  shadow: `box-shadow ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`,
  transform: `transform ${ANIMATIONS.duration.fast} ${ANIMATIONS.easing.default}`
} as const;

export const COMPONENT_SIZES = {
  button: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  },
  input: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  },
  modal: {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  }
} as const;

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40
} as const;

export const LAYOUT_CONSTANTS = {
  sidebar: {
    width: {
      collapsed: '64px',
      expanded: '256px'
    },
    breakpoint: 'lg'
  },
  topbar: {
    height: '64px'
  },
  content: {
    maxWidth: '1200px',
    padding: '24px'
  }
} as const;

export const TABLE_CONSTANTS = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
  rowHeight: {
    compact: '40px',
    normal: '48px',
    comfortable: '56px'
  }
} as const;

export const FORM_CONSTANTS = {
  fieldSpacing: 'space-y-4',
  labelClasses: 'block text-sm font-medium text-gray-700',
  inputClasses: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
  errorClasses: 'mt-1 text-sm text-red-600',
  helpTextClasses: 'mt-1 text-sm text-gray-500'
} as const;

export const LOADING_STATES = {
  skeleton: {
    lines: [1, 2, 3, 4, 5],
    widths: ['w-full', 'w-3/4', 'w-1/2', 'w-1/4']
  },
  spinner: {
    sizes: ['sm', 'md', 'lg'],
    colors: ['primary', 'secondary', 'white']
  }
} as const;

export const TOAST_POSITIONS = {
  'top-left': 'top-left',
  'top-center': 'top-center',
  'top-right': 'top-right',
  'bottom-left': 'bottom-left',
  'bottom-center': 'bottom-center',
  'bottom-right': 'bottom-right'
} as const;

export const TOAST_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  loading: 'loading'
} as const;

export const MODAL_ANIMATIONS = {
  fade: 'fade',
  scale: 'scale',
  slide: 'slide'
} as const;

// Deprecation warning
console.warn(
  'DEPRECATED: src/constants/ui.ts is deprecated. ' +
  'Please use src/constants/design-system.ts instead for better type safety and consistency.'
);