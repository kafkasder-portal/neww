/**
 * TASARIM SİSTEMİ HOOK'U
 * Inline stilleri düzeltmek ve tutarlılık sağlamak için
 */

import { useMemo } from 'react';
import { COLORS, STATUS, utils } from '../constants/design-system';

export const useDesignSystem = () => {
  const designSystem = useMemo(() => {
    return {
      // Color utilities
      colors: {
        // Brand colors
        brand: COLORS.brand,
        semantic: COLORS.semantic,
        neutral: COLORS.neutral,
        ui: COLORS.ui,
        financial: COLORS.financial,
        chart: COLORS.chart,
        sidebar: COLORS.sidebar,
        
        // Status colors
        status: STATUS,
        
        // Utility functions
        getStatusColor: (status: keyof typeof STATUS) => STATUS[status],
        getBrandColor: (shade: keyof typeof COLORS.brand) => COLORS.brand[shade],
        getSemanticColor: (type: keyof typeof COLORS.semantic) => COLORS.semantic[type],
      },

      // Style utilities for inline styles
      styles: {
        // Status styles
        statusSuccess: {
          backgroundColor: STATUS.success.bg,
          color: STATUS.success.text,
          borderColor: STATUS.success.border,
        },
        statusWarning: {
          backgroundColor: STATUS.warning.bg,
          color: STATUS.warning.text,
          borderColor: STATUS.warning.border,
        },
        statusError: {
          backgroundColor: STATUS.error.bg,
          color: STATUS.error.text,
          borderColor: STATUS.error.border,
        },
        statusInfo: {
          backgroundColor: STATUS.info.bg,
          color: STATUS.info.text,
          borderColor: STATUS.info.border,
        },
        statusNeutral: {
          backgroundColor: STATUS.neutral.bg,
          color: STATUS.neutral.text,
          borderColor: STATUS.neutral.border,
        },

        // Financial styles
        financialIncome: {
          color: COLORS.financial.income,
        },
        financialExpense: {
          color: COLORS.financial.expense,
        },
        financialTransfer: {
          color: COLORS.financial.transfer,
        },
        financialPending: {
          color: COLORS.financial.pending,
        },

        // Chart styles
        chartColors: {
          1: { color: COLORS.chart[1] },
          2: { color: COLORS.chart[2] },
          3: { color: COLORS.chart[3] },
          4: { color: COLORS.chart[4] },
          5: { color: COLORS.chart[5] },
          6: { color: COLORS.chart[6] },
          7: { color: COLORS.chart[7] },
          8: { color: COLORS.chart[8] },
        },

        // Brand styles
        brandPrimary: {
          color: COLORS.brand.primary,
        },
        brandPrimaryBg: {
          backgroundColor: COLORS.brand.primary,
          color: 'white',
        },
      },

      // Utility functions
      utils: {
        // Color conversion utilities
        hexToHsl: (hex: string) => {
          // Remove # if present
          hex = hex.replace('#', '');
          
          // Parse hex values
          const r = parseInt(hex.substr(0, 2), 16) / 255;
          const g = parseInt(hex.substr(2, 2), 16) / 255;
          const b = parseInt(hex.substr(4, 2), 16) / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0, s = 0, l = (max + min) / 2;
          
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
          }
          
          return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
          };
        },

        // Progress bar styles
        getProgressStyle: (percentage: number, color?: string) => ({
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: color || COLORS.brand.primary,
        }),

        // Status badge styles
        getStatusBadgeStyle: (status: keyof typeof STATUS) => ({
          backgroundColor: STATUS[status].bg,
          color: STATUS[status].text,
          border: `1px solid ${STATUS[status].border}`,
          borderRadius: '9999px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
        }),

        // Card styles
        getCardStyle: (variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default') => {
          const baseStyle = {
            borderRadius: '0.5rem',
            border: '1px solid',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            padding: '1.5rem',
          };

          switch (variant) {
            case 'success':
              return {
                ...baseStyle,
                backgroundColor: STATUS.success.bg,
                borderColor: STATUS.success.border,
              };
            case 'warning':
              return {
                ...baseStyle,
                backgroundColor: STATUS.warning.bg,
                borderColor: STATUS.warning.border,
              };
            case 'error':
              return {
                ...baseStyle,
                backgroundColor: STATUS.error.bg,
                borderColor: STATUS.error.border,
              };
            case 'info':
              return {
                ...baseStyle,
                backgroundColor: STATUS.info.bg,
                borderColor: STATUS.info.border,
              };
            default:
              return {
                ...baseStyle,
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              };
          }
        },
      },
    };
  }, []);

  return designSystem;
};

export default useDesignSystem;
