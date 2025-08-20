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
        },
    },
    plugins: [
        // Focus-visible plugin for accessibility
        function ({ addBase, addUtilities, theme }) {
            addBase({
                ':root': {
                    '--header-height': '64px',
                    '--sidebar-width': '280px',
                }
            })

            addUtilities({
                '.focus-ring': {
                    outline: `${theme('outlineWidth.focus')} solid hsl(var(--focus-ring))`,
                    outlineOffset: theme('outlineOffset.focus'),
                },
                '.text-hierarchy-h1': {
                    fontSize: theme('fontSize.3xl')[0],
                    fontWeight: theme('fontWeight.bold'),
                    lineHeight: theme('fontSize.3xl')[1].lineHeight,
                    color: 'hsl(var(--ink-1))',
                    letterSpacing: '-0.025em',
                },
                '.text-hierarchy-h2': {
                    fontSize: theme('fontSize.2xl')[0],
                    fontWeight: theme('fontWeight.semibold'),
                    lineHeight: theme('fontSize.2xl')[1].lineHeight,
                    color: 'hsl(var(--ink-1))',
                    letterSpacing: '-0.025em',
                },
                '.text-hierarchy-h3': {
                    fontSize: theme('fontSize.xl')[0],
                    fontWeight: theme('fontWeight.semibold'),
                    lineHeight: theme('fontSize.xl')[1].lineHeight,
                    color: 'hsl(var(--ink-1))',
                },
                '.text-hierarchy-body': {
                    fontSize: theme('fontSize.base')[0],
                    fontWeight: theme('fontWeight.normal'),
                    lineHeight: theme('fontSize.base')[1].lineHeight,
                    color: 'hsl(var(--ink-2))',
                    maxWidth: theme('maxWidth.text'),
                },
                '.text-hierarchy-caption': {
                    fontSize: theme('fontSize.sm')[0],
                    fontWeight: theme('fontWeight.normal'),
                    lineHeight: theme('fontSize.sm')[1].lineHeight,
                    color: 'hsl(var(--ink-3))',
                },
                '.text-hierarchy-small': {
                    fontSize: theme('fontSize.xs')[0],
                    fontWeight: theme('fontWeight.medium'),
                    lineHeight: theme('fontSize.xs')[1].lineHeight,
                    color: 'hsl(var(--ink-3))',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                },
                '.container-content': {
                    maxWidth: theme('maxWidth.content'),
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: theme('spacing.6'),
                    paddingRight: theme('spacing.6'),
                },
                '.text-reading': {
                    maxWidth: theme('maxWidth.reading'),
                },
                '.shadow-card': {
                    boxShadow: theme('boxShadow.card'),
                },
                '.shadow-header': {
                    boxShadow: theme('boxShadow.header'),
                },
            })
        }
    ],
}
