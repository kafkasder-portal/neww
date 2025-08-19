/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Optimized Brand Colors
        'brand': {
          50: "hsl(var(--brand-primary-50))",
          100: "hsl(var(--brand-primary-100))",
          200: "hsl(var(--brand-primary-200))",
          300: "hsl(var(--brand-primary-300))",
          400: "hsl(var(--brand-primary-400))",
          500: "hsl(var(--brand-primary-500))",
          600: "hsl(var(--brand-primary-600))",
          700: "hsl(var(--brand-primary-700))",
          800: "hsl(var(--brand-primary-800))",
          900: "hsl(var(--brand-primary-900))",
          DEFAULT: "hsl(var(--brand-primary))",
        },

        // Financial Status Colors - WCAG AA Compliant
        'financial': {
          'primary': "hsl(var(--brand-primary))",
          'success': "hsl(var(--financial-success))",
          'success-light': "hsl(var(--financial-success-light))",
          'warning': "hsl(var(--financial-warning))",
          'warning-light': "hsl(var(--financial-warning-light))",
          'error': "hsl(var(--financial-error))",
          'error-light': "hsl(var(--financial-error-light))",
          'info': "hsl(var(--financial-info))",
          'info-light': "hsl(var(--financial-info-light))",
        },

        // Backward compatibility - Legacy financial gray colors
        'financial-gray': {
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

        // Status Colors - Legacy support
        'status': {
          'success': "hsl(var(--financial-success))",
          'warning': "hsl(var(--financial-warning))",
          'error': "hsl(var(--financial-error))",
          'info': "hsl(var(--financial-info))",
        },

        // Neutral Color Scale
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

        // Sidebar Navigation Colors
        'sidebar': {
          'bg': "hsl(var(--sidebar-bg))",
          'text': "hsl(var(--sidebar-text))",
          'text-muted': "hsl(var(--sidebar-text-muted))",
          'hover': "hsl(var(--sidebar-hover))",
          'active': "hsl(var(--sidebar-active))",
          'border': "hsl(var(--sidebar-border))",
        },

        // Chart Colors
        'chart': {
          1: "hsl(var(--chart-primary))",
          2: "hsl(var(--chart-secondary))",
          3: "hsl(var(--chart-tertiary))",
          4: "hsl(var(--chart-quaternary))",
          5: "hsl(var(--chart-quinary))",
          6: "hsl(var(--chart-senary))",
          7: "hsl(var(--chart-septenary))",
          8: "hsl(var(--chart-octonary))",
        },


      },
      fontFamily: {
        'financial': 'var(--font-financial-primary)',
        'financial-mono': 'var(--font-financial-mono)',
      },
      fontSize: {
        'financial-xs': 'var(--text-financial-xs)',
        'financial-sm': 'var(--text-financial-sm)',
        'financial-base': 'var(--text-financial-base)',
        'financial-lg': 'var(--text-financial-lg)',
        'financial-xl': 'var(--text-financial-xl)',
        'financial-2xl': 'var(--text-financial-2xl)',
        'financial-3xl': 'var(--text-financial-3xl)',
        'financial-4xl': 'var(--text-financial-4xl)',
      },
      lineHeight: {
        'financial-tight': 'var(--leading-financial-tight)',
        'financial-normal': 'var(--leading-financial-normal)',
        'financial-relaxed': 'var(--leading-financial-relaxed)',
      },
      letterSpacing: {
        'financial-tight': 'var(--tracking-financial-tight)',
        'financial-normal': 'var(--tracking-financial-normal)',
        'financial-wide': 'var(--tracking-financial-wide)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
