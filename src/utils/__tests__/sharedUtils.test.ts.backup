import { describe, expect, it } from 'vitest'
import {
    applySearchFilters,
    capitalizeWords,
    debounce,
    extractErrorMessage,
    formatCurrency,
    formatDate,
    formatFileSize,
    generateRandomString,
    getFileExtension,
    getRelativeTime,
    groupBy,
    isToday,
    isValidEmail,
    isValidFileSize,
    isValidFileType,
    isValidPhoneNumber,
    isValidTurkishId,
    maskSensitiveData,
    removeDuplicates,
    sanitizeHtml,
    sortByMultiple,
    throttle,
    toSlug,
    truncateText,
    validateRequiredFields
} from '../sharedUtils'

describe('Validation Utilities', () => {
    describe('isValidEmail', () => {
        it('validates correct email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true)
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
            expect(isValidEmail('test+tag@example.org')).toBe(true)
        })

        it('rejects invalid email addresses', () => {
            expect(isValidEmail('invalid-email')).toBe(false)
            expect(isValidEmail('test@')).toBe(false)
            expect(isValidEmail('@example.com')).toBe(false)
            expect(isValidEmail('')).toBe(false)
        })
    })

    describe('isValidPhoneNumber', () => {
        it('validates Turkish phone numbers', () => {
            expect(isValidPhoneNumber('05551234567')).toBe(true)
            expect(isValidPhoneNumber('+905551234567')).toBe(true)
            expect(isValidPhoneNumber('0555 123 45 67')).toBe(true)
        })

        it('rejects invalid phone numbers', () => {
            expect(isValidPhoneNumber('1234567890')).toBe(false)
            expect(isValidPhoneNumber('0555123456')).toBe(false)
            expect(isValidPhoneNumber('055512345678')).toBe(false)
        })
    })

    describe('isValidTurkishId', () => {
        it('validates correct Turkish ID numbers', () => {
            expect(isValidTurkishId('12345678901')).toBe(true)
        })

        it('rejects invalid Turkish ID numbers', () => {
            expect(isValidTurkishId('1234567890')).toBe(false)
            expect(isValidTurkishId('123456789012')).toBe(false)
            expect(isValidTurkishId('1234567890a')).toBe(false)
        })
    })

    describe('validateRequiredFields', () => {
        it('validates required fields correctly', () => {
            const data = { name: 'John', email: '', age: 25 }
            const required = ['name', 'email', 'age']

            const result = validateRequiredFields(data, required)

            expect(result.isValid).toBe(false)
            expect(result.errors).toHaveLength(1)
            expect(result.errors[0].field).toBe('email')
        })

        it('returns valid for complete data', () => {
            const data = { name: 'John', email: 'john@example.com', age: 25 }
            const required = ['name', 'email', 'age']

            const result = validateRequiredFields(data, required)

            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
        })
    })
})

describe('String Utilities', () => {
    describe('capitalizeWords', () => {
        it('capitalizes first letter of each word', () => {
            expect(capitalizeWords('hello world')).toBe('Hello World')
            expect(capitalizeWords('JOHN DOE')).toBe('John Doe')
            expect(capitalizeWords('test-string')).toBe('Test-String')
        })
    })

    describe('toSlug', () => {
        it('converts string to slug format', () => {
            expect(toSlug('Hello World')).toBe('hello-world')
            expect(toSlug('Test String 123')).toBe('test-string-123')
            expect(toSlug('Special@Characters!')).toBe('specialcharacters')
        })
    })

    describe('truncateText', () => {
        it('truncates text to specified length', () => {
            expect(truncateText('Hello World', 5)).toBe('He...')
            expect(truncateText('Short', 10)).toBe('Short')
            expect(truncateText('Long text here', 8, '***')).toBe('Long ***')
        })
    })

    describe('formatCurrency', () => {
        it('formats currency correctly', () => {
            expect(formatCurrency(1234.56, 'TRY')).toContain('₺')
            expect(formatCurrency(1000, 'USD')).toContain('$')
            expect(formatCurrency(500, 'EUR')).toContain('€')
        })
    })
})

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('formats date correctly', () => {
            const date = new Date('2024-01-15')
            const result = formatDate(date)
            expect(result).toContain('15')
            expect(result).toContain('Ocak')
            expect(result).toContain('2024')
        })

        it('includes time when requested', () => {
            const date = new Date('2024-01-15T10:30:00')
            const result = formatDate(date, true)
            expect(result).toContain('10:30')
        })
    })

    describe('getRelativeTime', () => {
        it('returns correct relative time', () => {
            const now = new Date()
            const oneHourAgo = new Date(now.getTime() - 3600000)

            expect(getRelativeTime(oneHourAgo)).toContain('saat önce')
        })
    })

    describe('isToday', () => {
        it('checks if date is today', () => {
            const today = new Date()
            const yesterday = new Date(today.getTime() - 86400000)

            expect(isToday(today)).toBe(true)
            expect(isToday(yesterday)).toBe(false)
        })
    })
})

describe('Array & Object Utilities', () => {
    describe('removeDuplicates', () => {
        it('removes duplicates from array', () => {
            const array = [1, 2, 2, 3, 3, 4]
            expect(removeDuplicates(array)).toEqual([1, 2, 3, 4])
        })

        it('removes duplicates by key', () => {
            const array = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 1, name: 'John' }
            ]
            const result = removeDuplicates(array, 'id')
            expect(result).toHaveLength(2)
        })
    })

    describe('groupBy', () => {
        it('groups array by key', () => {
            const array = [
                { category: 'A', value: 1 },
                { category: 'B', value: 2 },
                { category: 'A', value: 3 }
            ]
            const result = groupBy(array, 'category')

            expect(result.A).toHaveLength(2)
            expect(result.B).toHaveLength(1)
        })
    })

    describe('sortByMultiple', () => {
        it('sorts by multiple keys', () => {
            const array = [
                { name: 'John', age: 30 },
                { name: 'Jane', age: 25 },
                { name: 'John', age: 25 }
            ]
            const result = sortByMultiple(array, 'name', 'age')

            expect(result[0].name).toBe('Jane')
            expect(result[1].name).toBe('John')
            expect(result[1].age).toBe(25)
        })
    })
})

describe('Search & Filter Utilities', () => {
    describe('applySearchFilters', () => {
        const items = [
            { id: '1', name: 'John', status: 'active', createdAt: '2024-01-01' },
            { id: '2', name: 'Jane', status: 'inactive', createdAt: '2024-01-02' },
            { id: '3', name: 'Bob', status: 'active', createdAt: '2024-01-03' }
        ]

        it('filters by search query', () => {
            const filters = { query: 'john' }
            const result = applySearchFilters(items, filters, ['name'])

            expect(result.items).toHaveLength(1)
            expect(result.items[0].name).toBe('John')
        })

        it('filters by date range', () => {
            const filters = { dateFrom: '2024-01-02' }
            const result = applySearchFilters(items, filters, ['name'])

            expect(result.items).toHaveLength(2)
        })

        it('applies pagination', () => {
            const filters = { page: 1, limit: 2 }
            const result = applySearchFilters(items, filters, ['name'])

            expect(result.items).toHaveLength(2)
            expect(result.total).toBe(3)
            expect(result.hasNext).toBe(true)
        })
    })
})

describe('Security Utilities', () => {
    describe('sanitizeHtml', () => {
        it('removes script tags', () => {
            const html = '<p>Hello</p><script>alert("xss")</script>'
            const result = sanitizeHtml(html)

            expect(result).not.toContain('<script>')
            expect(result).toContain('<p>Hello</p>')
        })
    })

    describe('generateRandomString', () => {
        it('generates string of correct length', () => {
            const result = generateRandomString(10)
            expect(result).toHaveLength(10)
        })
    })

    describe('maskSensitiveData', () => {
        it('masks email correctly', () => {
            expect(maskSensitiveData('john@example.com', 'email')).toBe('j***@example.com')
        })

        it('masks phone number correctly', () => {
            expect(maskSensitiveData('05551234567', 'phone')).toBe('055***4567')
        })
    })
})

describe('File Utilities', () => {
    describe('getFileExtension', () => {
        it('extracts file extension', () => {
            expect(getFileExtension('document.pdf')).toBe('pdf')
            expect(getFileExtension('image.jpg')).toBe('jpg')
        })
    })

    describe('formatFileSize', () => {
        it('formats file size correctly', () => {
            expect(formatFileSize(1024)).toBe('1 KB')
            expect(formatFileSize(1048576)).toBe('1 MB')
        })
    })

    describe('isValidFileType', () => {
        it('validates file types', () => {
            expect(isValidFileType('document.pdf', ['pdf', 'doc'])).toBe(true)
            expect(isValidFileType('image.jpg', ['png', 'gif'])).toBe(false)
        })
    })

    describe('isValidFileSize', () => {
        it('validates file size', () => {
            expect(isValidFileSize(1024, 2048)).toBe(true)
            expect(isValidFileSize(2048, 1024)).toBe(false)
        })
    })
})

describe('Error Handling Utilities', () => {
    describe('extractErrorMessage', () => {
        it('extracts message from various error types', () => {
            expect(extractErrorMessage('Simple error')).toBe('Simple error')
            expect(extractErrorMessage({ message: 'Error message' })).toBe('Error message')
            expect(extractErrorMessage({ error: 'Error detail' })).toBe('Error detail')
        })
    })
})

describe('Performance Utilities', () => {
    describe('debounce', () => {
        it('debounces function calls', async () => {
            let callCount = 0
            const debouncedFn = debounce(() => { callCount++ }, 100)

            debouncedFn()
            debouncedFn()
            debouncedFn()

            expect(callCount).toBe(0)

            await new Promise(resolve => setTimeout(resolve, 150))
            expect(callCount).toBe(1)
        })
    })

    describe('throttle', () => {
        it('throttles function calls', async () => {
            let callCount = 0
            const throttledFn = throttle(() => { callCount++ }, 100)

            throttledFn()
            throttledFn()
            throttledFn()

            expect(callCount).toBe(1)

            await new Promise(resolve => setTimeout(resolve, 150))
            throttledFn()
            expect(callCount).toBe(2)
        })
    })
})
