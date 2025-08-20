import { describe, it, expect } from 'vitest'
import {
  formatMessage,
  getStatusColor,
  getInitials,
  groupByDate
} from '../collaboration'

describe('collaboration utils', () => {
  describe('formatMessage', () => {
    it('formats message correctly', () => {
      const message = {
        id: '1',
        content: 'Hello world',
        sender: 'John Doe',
        timestamp: '2023-01-01T00:00:00Z',
        type: 'text'
      }

      const result = formatMessage(message)

      expect(result).toEqual(message)
    })
  })

  describe('getStatusColor', () => {
    it('returns green for online status', () => {
      expect(getStatusColor('online')).toBe('text-green-500')
    })

    it('returns gray for offline status', () => {
      expect(getStatusColor('offline')).toBe('text-gray-400')
    })

    it('returns yellow for away status', () => {
      expect(getStatusColor('away')).toBe('text-yellow-500')
    })

    it('returns default gray for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('text-gray-400')
    })
  })

  describe('getInitials', () => {
    it('should return initials for full name', () => {
      const initials = getInitials('John Doe')
      expect(initials).toBe('JD')
    })

    it('should return single letter for one name', () => {
      const initials = getInitials('John')
      expect(initials).toBe('J')
    })

    it('should handle empty string', () => {
      const initials = getInitials('')
      expect(initials).toBe('')
    })

    it('should handle multiple spaces and limit to 2 characters', () => {
      const initials = getInitials('John   Doe   Smith')
      expect(initials).toBe('JD')
    })
  })

  describe('groupByDate', () => {
    it('groups items by date correctly', () => {
      const items = [
        { id: '1', date: '2023-01-01', name: 'Item 1' },
        { id: '2', date: '2023-01-01', name: 'Item 2' },
        { id: '3', date: '2023-01-02', name: 'Item 3' }
      ]

      const result = groupByDate(items, 'date')

      expect(Object.keys(result)).toHaveLength(2)
      expect(result['2023-01-01']).toHaveLength(2)
      expect(result['2023-01-02']).toHaveLength(1)
    })
  })
})

