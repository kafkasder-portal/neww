/**
 * Utility functions for formatting various data types
 */

/**
 * Formats a date object or string into a readable format
 */
export function formatDate(date: Date | string | null | undefined, format: string = 'dd/MM/yyyy'): string {
  try {
    if (!date) return 'Geçersiz tarih';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Geçersiz tarih';
    }
    
    if (format === 'yyyy-MM-dd') {
      return dateObj.toISOString().split('T')[0];
    }
    
    if (format === 'dd/MM/yyyy') {
      return dateObj.toLocaleDateString('tr-TR');
    }
    
    if (format === 'MMM d, yyyy') {
      return dateObj.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
    
    // Default Turkish format
    return dateObj.toLocaleDateString('tr-TR');
  } catch {
    return 'Geçersiz tarih';
  }
}

/**
 * Formats a date object or string with time
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  try {
    if (!date) return 'Geçersiz tarih';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Geçersiz tarih';
    }
    
    return dateObj.toLocaleString('tr-TR');
  } catch {
    return 'Geçersiz tarih';
  }
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | null | undefined, decimals?: number, locale: string = 'tr-TR'): string {
  if (value == null) return '0';
  if (isNaN(value)) return '0';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'TRY',
  locale: string = 'tr-TR'
): string {
  if (amount == null) return '₺0,00'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a phone number string (Turkish format priority)
 */
export function formatPhoneNumber(phone: string, country: string = 'TR'): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Turkish phone number formats
  if (country === 'TR' || digits.startsWith('90')) {
    if (digits.length === 10) {
      // 5551234567 -> (555) 123-4567
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    if (digits.length === 12 && digits.startsWith('90')) {
      // 905551234567 -> +90 (555) 123-4567
      return `+90 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`;
    }
    
    if (digits.length === 13 && digits.startsWith('90')) {
      // +905551234567 -> +90 (555) 123-4567
      return `+90 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`;
    }
  }
  
  // US phone number formats
  if (country === 'US') {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 10)}`;
    }
  }
  
  // Return original if format is not recognized
  return digits;
}

/**
 * Formats file size in bytes to human readable format
 */
export function formatFileSize(bytes: number | null | undefined, decimals: number = 1): string {
  if (bytes == null || bytes < 0 || isNaN(bytes)) return '0 B';
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${value} ${sizes[i]}`;
}

/**
 * Formats duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);
  
  return parts.join(' ');
}

/**
 * Formats a decimal number as percentage (Turkish format)
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 2): string {
  if (value == null) return '%0,00';
  
  const percentage = (value * 100).toFixed(decimals).replace('.', ',');
  return `%${percentage}`;
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number, suffix: string = '...'): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirst(text: string | null | undefined): string {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts text to URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}