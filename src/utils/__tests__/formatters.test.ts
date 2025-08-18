import { 
  formatCurrency, 
  formatDate, 
  formatDateTime, 
  formatPhoneNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalizeFirst,
  formatNumber
} from '../formatters'
import { expect, test, describe } from 'vitest'

describe('Formatters Utilities', () => {
  describe('formatCurrency', () => {
    test('formats currency in TRY', () => {
      expect(formatCurrency(1234.56)).toBe('₺1.234,56')
      expect(formatCurrency(0)).toBe('₺0,00')
      expect(formatCurrency(1000000)).toBe('₺1.000.000,00')
    })

    test('formats currency in different currencies', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1.234,56')
    })

    test('handles negative values', () => {
      expect(formatCurrency(-1234.56)).toBe('-₺1.234,56')
    })

    test('handles null/undefined values', () => {
      expect(formatCurrency(null)).toBe('₺0,00')
      expect(formatCurrency(undefined)).toBe('₺0,00')
    })
  })

  describe('formatDate', () => {
    test('formats date string', () => {
      const date = '2023-12-25T10:30:00Z'
      expect(formatDate(date)).toMatch(/25[.\/]12[.\/]2023/)
    })

    test('formats Date object', () => {
      const date = new Date('2023-12-25T10:30:00Z')
      expect(formatDate(date)).toMatch(/25[.\/]12[.\/]2023/)
    })

    test('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Geçersiz tarih')
      expect(formatDate(null)).toBe('Geçersiz tarih')
      expect(formatDate(undefined)).toBe('Geçersiz tarih')
    })

    test('formats with custom format', () => {
      const date = '2023-12-25T10:30:00Z'
      expect(formatDate(date, 'dd/MM/yyyy')).toBe('25.12.2023')
      expect(formatDate(date, 'MMM d, yyyy')).toMatch(/25 Ara 2023|25 Dec 2023/)
    })
  })

  describe('formatDateTime', () => {
    test('formats date and time', () => {
      const date = '2023-12-25T10:30:00Z'
      const result = formatDateTime(date)
      expect(result).toMatch(/25[.\/]12[.\/]2023.*1[0-3][:.]30/)
    })

    test('handles invalid dates', () => {
      expect(formatDateTime('invalid-date')).toBe('Geçersiz tarih')
    })
  })

  describe('formatPhoneNumber', () => {
    test('formats Turkish phone numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
      expect(formatPhoneNumber('905551234567')).toBe('+90 (555) 123-4567')
      expect(formatPhoneNumber('+905551234567')).toBe('+90 (555) 123-4567')
    })

    test('formats international numbers', () => {
      expect(formatPhoneNumber('12345678901', 'US')).toBe('+1 (234) 567-890')
    })

    test('handles invalid phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('')).toBe('')
    })
  })

  describe('formatPercentage', () => {
    test('formats percentage values', () => {
      expect(formatPercentage(0.5)).toBe('%50,00')
      expect(formatPercentage(0.125)).toBe('%12,50')
      expect(formatPercentage(1)).toBe('%100,00')
    })

    test('formats with custom decimal places', () => {
      expect(formatPercentage(0.12345, 1)).toBe('%12,3')
      expect(formatPercentage(0.12345, 3)).toBe('%12,345')
    })

    test('handles edge cases', () => {
      expect(formatPercentage(0)).toBe('%0,00')
      expect(formatPercentage(null)).toBe('%0,00')
      expect(formatPercentage(undefined)).toBe('%0,00')
    })
  })

  describe('formatFileSize', () => {
    test('formats bytes', () => {
      expect(formatFileSize(512)).toBe('512 B')
      expect(formatFileSize(0)).toBe('0 B')
    })

    test('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    test('formats megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })

    test('formats gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    test('handles large sizes', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
    })

    test('handles invalid sizes', () => {
      expect(formatFileSize(-1)).toBe('0 B')
      expect(formatFileSize(null)).toBe('0 B')
      expect(formatFileSize(undefined)).toBe('0 B')
    })
  })

  describe('truncateText', () => {
    test('truncates long text', () => {
      const longText = 'Bu çok uzun bir metin örneğidir'
      expect(truncateText(longText, 10)).toBe('Bu çok ...')
    })

    test('returns short text unchanged', () => {
      const shortText = 'Kısa'
      expect(truncateText(shortText, 10)).toBe('Kısa')
    })

    test('handles edge cases', () => {
      expect(truncateText('', 10)).toBe('')
      expect(truncateText(null, 10)).toBe('')
      expect(truncateText(undefined, 10)).toBe('')
    })

    test('uses custom suffix', () => {
      const text = 'Uzun metin örneği'
      expect(truncateText(text, 7, '***')).toBe('Uzun***')
    })
  })

  describe('capitalizeFirst', () => {
    test('capitalizes first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
      expect(capitalizeFirst('HELLO')).toBe('Hello')
      expect(capitalizeFirst('hELLO')).toBe('Hello')
    })

    test('handles special characters', () => {
      expect(capitalizeFirst('çok güzel')).toBe('Çok güzel')
      expect(capitalizeFirst('özel karakter')).toBe('Özel karakter')
    })

    test('handles edge cases', () => {
      expect(capitalizeFirst('')).toBe('')
      expect(capitalizeFirst('a')).toBe('A')
      expect(capitalizeFirst(null)).toBe('')
      expect(capitalizeFirst(undefined)).toBe('')
    })
  })

  describe('formatNumber', () => {
    test('formats numbers with separators', () => {
      expect(formatNumber(1234)).toBe('1.234')
      expect(formatNumber(1234567)).toBe('1.234.567')
      expect(formatNumber(1234.56)).toBe('1.234,56')
    })

    test('handles decimal places', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1.234,57')
      expect(formatNumber(1234.1, 2)).toBe('1.234,10')
    })

    test('handles negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1.234')
      expect(formatNumber(-1234.56)).toBe('-1.234,56')
    })

    test('handles edge cases', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(null)).toBe('0')
      expect(formatNumber(undefined)).toBe('0')
    })
  })
})
