/**
 * MERKEZİ TASARIM SİSTEMİ - DERNEK YÖNETİM PANELİ
 * Tüm UI/UX bileşenleri için tek kaynak
 * WCAG AA uyumlu, tutarlı ve ölçeklenebilir
 */

// ========================================
// RENK SİSTEMİ - CSS Custom Properties
// ========================================
export const COLORS = {
  // Brand Colors - Ana marka renkleri
  brand: {
    primary: 'hsl(var(--brand-primary))',
    primary50: 'hsl(var(--brand-primary-50))',
    primary100: 'hsl(var(--brand-primary-100))',
    primary200: 'hsl(var(--brand-primary-200))',
    primary300: 'hsl(var(--brand-primary-300))',
    primary400: 'hsl(var(--brand-primary-400))',
    primary500: 'hsl(var(--brand-primary-500))',
    primary600: 'hsl(var(--brand-primary-600))',
    primary700: 'hsl(var(--brand-primary-700))',
    primary800: 'hsl(var(--brand-primary-800))',
    primary900: 'hsl(var(--brand-primary-900))',
  },

  // Semantic Colors - Anlamlı renkler
  semantic: {
    success: 'hsl(var(--semantic-success))',
    successLight: 'hsl(var(--semantic-success-light))',
    successBg: 'hsl(var(--semantic-success-bg))',
    warning: 'hsl(var(--semantic-warning))',
    warningLight: 'hsl(var(--semantic-warning-light))',
    warningBg: 'hsl(var(--semantic-warning-bg))',
    danger: 'hsl(var(--semantic-danger))',
    dangerLight: 'hsl(var(--semantic-danger-light))',
    dangerBg: 'hsl(var(--semantic-danger-bg))',
    info: 'hsl(var(--semantic-info))',
    infoLight: 'hsl(var(--semantic-info-light))',
    infoBg: 'hsl(var(--semantic-info-bg))',
  },

  // Neutral Colors - Nötr renkler
  neutral: {
    50: 'hsl(var(--neutral-50))',
    100: 'hsl(var(--neutral-100))',
    200: 'hsl(var(--neutral-200))',
    300: 'hsl(var(--neutral-300))',
    400: 'hsl(var(--neutral-400))',
    500: 'hsl(var(--neutral-500))',
    600: 'hsl(var(--neutral-600))',
    700: 'hsl(var(--neutral-700))',
    800: 'hsl(var(--neutral-800))',
    900: 'hsl(var(--neutral-900))',
  },

  // UI Colors - Arayüz renkleri
  ui: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
  },

  // Financial Colors - Finansal renkler
  financial: {
    income: 'hsl(var(--financial-income))',
    expense: 'hsl(var(--financial-expense))',
    transfer: 'hsl(var(--financial-transfer))',
    pending: 'hsl(var(--financial-pending))',
  },

  // Chart Colors - Grafik renkleri
  chart: {
    1: 'hsl(var(--chart-color-1))',
    2: 'hsl(var(--chart-color-2))',
    3: 'hsl(var(--chart-color-3))',
    4: 'hsl(var(--chart-color-4))',
    5: 'hsl(var(--chart-color-5))',
    6: 'hsl(var(--chart-color-6))',
    7: 'hsl(var(--chart-color-7))',
    8: 'hsl(var(--chart-color-8))',
  },

  // Sidebar Colors - Kenar çubuğu renkleri
  sidebar: {
    bg: 'hsl(var(--sidebar-bg))',
    bgHover: 'hsl(var(--sidebar-bg-hover))',
    text: 'hsl(var(--sidebar-text))',
    textMuted: 'hsl(var(--sidebar-text-muted))',
    textActive: 'hsl(var(--sidebar-text-active))',
    accent: 'hsl(var(--sidebar-accent))',
    accentLight: 'hsl(var(--sidebar-accent-light))',
    border: 'hsl(var(--sidebar-border))',
  },
} as const;

// ========================================
// TİPOGRAFİ SİSTEMİ
// ========================================
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    sans: 'var(--font-family-sans)',
    mono: 'var(--font-family-mono)',
    display: 'var(--font-family-display)',
  },

  // Font Sizes
  fontSize: {
    xs: 'var(--font-size-xs)',      // 12px
    sm: 'var(--font-size-sm)',      // 14px
    base: 'var(--font-size-base)',  // 16px
    lg: 'var(--font-size-lg)',      // 18px
    xl: 'var(--font-size-xl)',      // 20px
    '2xl': 'var(--font-size-2xl)',  // 24px
    '3xl': 'var(--font-size-3xl)',  // 30px
    '4xl': 'var(--font-size-4xl)',  // 36px
    '5xl': 'var(--font-size-5xl)',  // 48px
  },

  // Font Weights
  fontWeight: {
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
  },

  // Line Heights
  lineHeight: {
    none: 'var(--line-height-none)',
    tight: 'var(--line-height-tight)',
    snug: 'var(--line-height-snug)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
    loose: 'var(--line-height-loose)',
  },

  // Typography Scale
  scale: {
    h1: {
      fontSize: 'var(--font-size-4xl)',
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 'var(--line-height-tight)',
    },
    h2: {
      fontSize: 'var(--font-size-3xl)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-tight)',
    },
    h3: {
      fontSize: 'var(--font-size-2xl)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-snug)',
    },
    h4: {
      fontSize: 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-snug)',
    },
    body: {
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-normal)',
    },
    small: {
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-normal)',
    },
    caption: {
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-normal)',
    },
  },
} as const;

// ========================================
// SPACING SİSTEMİ
// ========================================
export const SPACING = {
  // Base spacing units
  0: 'var(--space-0)',
  1: 'var(--space-1)',   // 4px
  2: 'var(--space-2)',   // 8px
  3: 'var(--space-3)',   // 12px
  4: 'var(--space-4)',   // 16px
  5: 'var(--space-5)',   // 20px
  6: 'var(--space-6)',   // 24px
  8: 'var(--space-8)',   // 32px
  10: 'var(--space-10)', // 40px
  12: 'var(--space-12)', // 48px
  16: 'var(--space-16)', // 64px
  20: 'var(--space-20)', // 80px
  24: 'var(--space-24)', // 96px
} as const;

// ========================================
// BORDER RADIUS SİSTEMİ
// ========================================
export const BORDER_RADIUS = {
  none: 'var(--radius-none)',
  xs: 'var(--radius-xs)',   // 2px
  sm: 'var(--radius-sm)',   // 4px
  md: 'var(--radius-md)',   // 6px
  lg: 'var(--radius-lg)',   // 8px
  xl: 'var(--radius-xl)',   // 12px
  '2xl': 'var(--radius-2xl)', // 16px
  full: 'var(--radius-full)', // 9999px
} as const;

// ========================================
// SHADOW SİSTEMİ
// ========================================
export const SHADOWS = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  focus: 'var(--shadow-focus)',
} as const;

// ========================================
// ANIMATION SİSTEMİ
// ========================================
export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  keyframes: {
    fadeIn: 'fadeIn 0.3s ease-out',
    slideUp: 'slideUp 0.4s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
  },
} as const;

// ========================================
// STATUS SİSTEMİ
// ========================================
export const STATUS = {
  success: {
    bg: 'hsl(var(--semantic-success-light))',
    text: 'hsl(var(--semantic-success))',
    border: 'hsl(var(--semantic-success) / 0.2)',
    solid: 'hsl(var(--semantic-success))',
  },
  warning: {
    bg: 'hsl(var(--semantic-warning-light))',
    text: 'hsl(var(--semantic-warning))',
    border: 'hsl(var(--semantic-warning) / 0.2)',
    solid: 'hsl(var(--semantic-warning))',
  },
  error: {
    bg: 'hsl(var(--semantic-danger-light))',
    text: 'hsl(var(--semantic-danger))',
    border: 'hsl(var(--semantic-danger) / 0.2)',
    solid: 'hsl(var(--semantic-danger))',
  },
  info: {
    bg: 'hsl(var(--semantic-info-light))',
    text: 'hsl(var(--semantic-info))',
    border: 'hsl(var(--semantic-info) / 0.2)',
    solid: 'hsl(var(--semantic-info))',
  },
  neutral: {
    bg: 'hsl(var(--neutral-100))',
    text: 'hsl(var(--neutral-700))',
    border: 'hsl(var(--neutral-200))',
    solid: 'hsl(var(--neutral-500))',
  },
} as const;

// ========================================
// COMPONENT PATTERNS
// ========================================
export const COMPONENTS = {
  // Button patterns
  button: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    variants: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary',
    },
    sizes: {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10',
    },
  },

  // Card patterns
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    header: 'flex flex-col space-y-1.5 p-6',
    title: 'text-2xl font-semibold leading-none tracking-tight',
    description: 'text-sm text-muted-foreground',
    content: 'p-6 pt-0',
    footer: 'flex items-center p-6 pt-0',
  },

  // Input patterns
  input: {
    base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  },

  // Badge patterns
  badge: {
    base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variants: {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground',
    },
  },
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================
export const utils = {
  // Color utilities
  colors: {
    getBrandColor: (shade: keyof typeof COLORS.brand) => COLORS.brand[shade],
    getSemanticColor: (type: keyof typeof COLORS.semantic) => COLORS.semantic[type],
    getStatusColor: (status: keyof typeof STATUS) => STATUS[status],
  },

  // Typography utilities
  typography: {
    getHeadingStyle: (level: 1 | 2 | 3 | 4) => TYPOGRAPHY.scale[`h${level}` as keyof typeof TYPOGRAPHY.scale],
    getTextStyle: (size: keyof typeof TYPOGRAPHY.fontSize) => ({
      fontSize: TYPOGRAPHY.fontSize[size],
      fontWeight: TYPOGRAPHY.fontWeight.normal,
      lineHeight: TYPOGRAPHY.lineHeight.normal,
    }),
  },

  // Spacing utilities
  spacing: {
    getSpace: (size: keyof typeof SPACING) => SPACING[size],
    getPadding: (size: keyof typeof SPACING) => `padding: ${SPACING[size]}`,
    getMargin: (size: keyof typeof SPACING) => `margin: ${SPACING[size]}`,
  },
} as const;

// ========================================
// TYPE DEFINITIONS
// ========================================
export type ColorToken = keyof typeof COLORS;
export type TypographyToken = keyof typeof TYPOGRAPHY;
export type SpacingToken = keyof typeof SPACING;
export type StatusType = keyof typeof STATUS;
export type ComponentVariant = keyof typeof COMPONENTS.button.variants;

// ========================================
// DEFAULT EXPORT
// ========================================
export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  STATUS,
  COMPONENTS,
  utils,
};
