/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design Token Integration - Modern sistem renkleri
      colors: {
        // Base system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--focus-ring))",
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--ink-2))",
        
        // Primary brand
        primary: {
          DEFAULT: "hsl(var(--brand-500))",
          foreground: "hsl(var(--surface))",
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        
        // Surface colors - Çok beyaz hissini azaltan katmanlar
        surface: {
          DEFAULT: "hsl(var(--surface))",
          secondary: "hsl(var(--surface-secondary))",
        },
        
        // Text hierarchy colors
        ink: {
          1: "hsl(var(--ink-1))", // Ana başlıklar
          2: "hsl(var(--ink-2))", // Gövde metni  
          3: "hsl(var(--ink-3))", // İkincil metin
          4: "hsl(var(--ink-4))", // Placeholder
        },
        
        // Status colors
        success: {
          DEFAULT: "hsl(var(--ok))",
          background: "hsl(var(--ok-bg))",
        },
        warning: {
          DEFAULT: "hsl(var(--warn))",
          background: "hsl(var(--warn-bg))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          background: "hsl(var(--danger-bg))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          background: "hsl(var(--info-bg))",
        },
        
        // Legacy color mapping for backward compatibility
        secondary: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--ink-2))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--surface))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--ink-3))",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-50))",
          foreground: "hsl(var(--brand-700))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--ink-2))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--ink-2))",
        },
      },
      
      // Typography tokens - Inter font sistemi
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-relaxed)' }],
        'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-normal)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
      },
      
      fontWeight: {
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      
      // Spacing tokens
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
      },
      
      // Border radius tokens
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)', 
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },
      
      // Shadow tokens
      boxShadow: {
        'card': 'var(--shadow-card)',
        'header': 'var(--shadow-header)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      
      // Container tokens - Uzun sayfalar için optimizasyon
      maxWidth: {
        'content': 'var(--max-w-content)',
        'text': 'var(--max-w-text)',
        'reading': 'var(--max-w-reading)',
      },
      
      // Animation tokens
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'var(--ease-in-out)',
        'ease-out': 'var(--ease-out)',
        'ease-in': 'var(--ease-in)',
      },
      
      // Focus ring utilities
      outlineOffset: {
        'focus': 'var(--focus-ring-offset)',
      },
      
      outlineWidth: {
        'focus': 'var(--focus-ring-width)',
      },
            200: "hsl(var(--brand-secondary-200))",
            300: "hsl(var(--brand-secondary-300))",
            400: "hsl(var(--brand-secondary-400))",
            500: "hsl(var(--brand-secondary-500))",
            600: "hsl(var(--brand-secondary-600))",
            700: "hsl(var(--brand-secondary-700))",
            800: "hsl(var(--brand-secondary-800))",
            900: "hsl(var(--brand-secondary-900))",
            DEFAULT: "hsl(var(--brand-secondary))",
          },
          'accent': {
            50: "hsl(var(--brand-accent-50))",
            100: "hsl(var(--brand-accent-100))",
            200: "hsl(var(--brand-accent-200))",
            300: "hsl(var(--brand-accent-300))",
            400: "hsl(var(--brand-accent-400))",
            500: "hsl(var(--brand-accent-500))",
            600: "hsl(var(--brand-accent-600))",
            700: "hsl(var(--brand-accent-700))",
            800: "hsl(var(--brand-accent-800))",
            900: "hsl(var(--brand-accent-900))",
            DEFAULT: "hsl(var(--brand-accent))",
          },
        },
        // Semantic Colors
        'semantic': {
          'success': "hsl(var(--semantic-success))",
          'success-light': "hsl(var(--semantic-success-light))",
          'success-bg': "hsl(var(--semantic-success-bg))",
          'warning': "hsl(var(--semantic-warning))",
          'warning-light': "hsl(var(--semantic-warning-light))",
          'warning-bg': "hsl(var(--semantic-warning-bg))",
          'danger': "hsl(var(--semantic-danger))",
          'danger-light': "hsl(var(--semantic-danger-light))",
          'danger-bg': "hsl(var(--semantic-danger-bg))",
          'destructive': "hsl(var(--semantic-destructive))",
          'info': "hsl(var(--semantic-info))",
          'info-light': "hsl(var(--semantic-info-light))",
          'info-bg': "hsl(var(--semantic-info-bg))",
        },
        // Neutral Colors
        'neutral': {
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
        },
        // Sidebar Colors
        'sidebar': {
          'bg': "hsl(var(--sidebar-bg))",
          'text': "hsl(var(--sidebar-text))",
          'text-muted': "hsl(var(--sidebar-text-muted))",
          'text-active': "hsl(var(--sidebar-text-active))",
          'accent': "hsl(var(--sidebar-accent))",
          'accent-light': "hsl(var(--sidebar-accent-light))",
          'border': "hsl(var(--sidebar-border))",
          'bg-hover': "hsl(var(--sidebar-bg-hover))",
        },
        // Corporate Colors - Sidebar Aligned
        'corporate': {
          'primary': {
            50: "hsl(var(--corporate-primary-50))",
            100: "hsl(var(--corporate-primary-100))",
            200: "hsl(var(--corporate-primary-200))",
            300: "hsl(var(--corporate-primary-300))",
            400: "hsl(var(--corporate-primary-400))",
            500: "hsl(var(--corporate-primary-500))",
            600: "hsl(var(--corporate-primary-600))",
            700: "hsl(var(--corporate-primary-700))",
            800: "hsl(var(--corporate-primary-800))",
            900: "hsl(var(--corporate-primary-900))",
            DEFAULT: "hsl(var(--corporate-primary-600))",
          },
          'secondary': {
            50: "hsl(var(--corporate-secondary-50))",
            100: "hsl(var(--corporate-secondary-100))",
            200: "hsl(var(--corporate-secondary-200))",
            300: "hsl(var(--corporate-secondary-300))",
            400: "hsl(var(--corporate-secondary-400))",
            500: "hsl(var(--corporate-secondary-500))",
            600: "hsl(var(--corporate-secondary-600))",
            700: "hsl(var(--corporate-secondary-700))",
            800: "hsl(var(--corporate-secondary-800))",
            900: "hsl(var(--corporate-secondary-900))",
            DEFAULT: "hsl(var(--corporate-secondary-600))",
          },
          'accent': {
            50: "hsl(var(--corporate-accent-50))",
            100: "hsl(var(--corporate-accent-100))",
            200: "hsl(var(--corporate-accent-200))",
            300: "hsl(var(--corporate-accent-300))",
            400: "hsl(var(--corporate-accent-400))",
            500: "hsl(var(--corporate-accent-500))",
            600: "hsl(var(--corporate-accent-600))",
            700: "hsl(var(--corporate-accent-700))",
            800: "hsl(var(--corporate-accent-800))",
            900: "hsl(var(--corporate-accent-900))",
            DEFAULT: "hsl(var(--corporate-accent-600))",
          },
          'neutral': {
            50: "hsl(var(--corporate-neutral-50))",
            100: "hsl(var(--corporate-neutral-100))",
            200: "hsl(var(--corporate-neutral-200))",
            300: "hsl(var(--corporate-neutral-300))",
            400: "hsl(var(--corporate-neutral-400))",
            500: "hsl(var(--corporate-neutral-500))",
            600: "hsl(var(--corporate-neutral-600))",
            700: "hsl(var(--corporate-neutral-700))",
            800: "hsl(var(--corporate-neutral-800))",
            900: "hsl(var(--corporate-neutral-900))",
            950: "hsl(var(--corporate-neutral-950))",
          },
          'success': "hsl(var(--corporate-success))",
          'warning': "hsl(var(--corporate-warning))",
          'danger': "hsl(var(--corporate-danger))",
          'info': "hsl(var(--corporate-info))",
        },
        // Interactive Colors
        'interactive': {
          'hover': "hsl(var(--interactive-hover))",
          'active': "hsl(var(--interactive-active))",
          'focus': "hsl(var(--interactive-focus))",
          'disabled': "hsl(var(--interactive-disabled))",
        },
        // Chart Colors
        'chart': {
          1: "hsl(var(--chart-color-1))",
          2: "hsl(var(--chart-color-2))",
          3: "hsl(var(--chart-color-3))",
          4: "hsl(var(--chart-color-4))",
          5: "hsl(var(--chart-color-5))",
          6: "hsl(var(--chart-color-6))",
          7: "hsl(var(--chart-color-7))",
          8: "hsl(var(--chart-color-8))",
        },
        // Financial Colors
        'financial': {
          'income': "hsl(var(--financial-income))",
          'expense': "hsl(var(--financial-expense))",
          'transfer': "hsl(var(--financial-transfer))",
          'pending': "hsl(var(--financial-pending))",
        },
        // Status Colors
        'status': {
          'active': "hsl(var(--status-active))",
          'inactive': "hsl(var(--status-inactive))",
          'pending': "hsl(var(--status-pending))",
          'error': "hsl(var(--status-error))",
          'processing': "hsl(var(--status-processing))",
        },
      },
      fontFamily: {
        'sans': 'var(--font-family-sans)',
        'mono': 'var(--font-family-mono)',
        'display': 'var(--font-family-display)',
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
      },
      lineHeight: {
        'none': 'var(--line-height-none)',
        'tight': 'var(--line-height-tight)',
        'snug': 'var(--line-height-snug)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)',
        'loose': 'var(--line-height-loose)',
      },
      fontWeight: {
        'light': 'var(--font-weight-light)',
        'normal': 'var(--font-weight-normal)',
        'medium': 'var(--font-weight-medium)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)',
        'extrabold': 'var(--font-weight-extrabold)',
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'focus': 'var(--shadow-focus)',
        'glow': 'var(--shadow-glow)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
        'fade-out': 'fadeOut var(--duration-normal) var(--ease-in)',
        'slide-up': 'slideUp var(--duration-normal) var(--ease-out)',
        'slide-down': 'slideDown var(--duration-normal) var(--ease-out)',
        'slide-left': 'slideLeft var(--duration-normal) var(--ease-out)',
        'slide-right': 'slideRight var(--duration-normal) var(--ease-out)',
        'scale-in': 'scaleIn var(--duration-fast) var(--ease-bounce)',
        'scale-out': 'scaleOut var(--duration-fast) var(--ease-in)',
        'bounce-in': 'bounceIn var(--duration-normal) var(--ease-bounce)',
        'shimmer': 'shimmer var(--duration-slow) ease-in-out infinite',
        'pulse-slow': 'pulse var(--duration-slow) ease-in-out infinite',
        'spin-slow': 'spin var(--duration-slow) linear infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'progress': 'progress var(--duration-normal) var(--ease-out)',
        'toast-in': 'toastIn var(--duration-fast) var(--ease-bounce)',
        'toast-out': 'toastOut var(--duration-fast) var(--ease-in)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        'ease-in': 'var(--ease-in)',
        'ease-out': 'var(--ease-out)',
        'ease-in-out': 'var(--ease-in-out)',
        'ease-bounce': 'var(--ease-bounce)',
        'ease-elastic': 'var(--ease-elastic)',
      },
    },
  },
  plugins: [],
}
