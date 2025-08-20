# 🧪 Test Stratejisi ve Kalite Kontrol Planı

## 🎯 Test Hedefleri ve KPI'lar

### 📊 Kalite Metrikleri
- **Code Coverage:** >90% (Target: >95%)
- **Test Pass Rate:** >99% (Target: 100%)
- **Bug Detection Rate:** >95% (Target: >98%)
- **Performance Test Success:** >95% (Target: 100%)
- **Security Test Score:** >95% (Target: 100%)

### 🚀 Performance Targets
- **Unit Test Execution:** <30 saniye
- **Integration Test Execution:** <5 dakika
- **E2E Test Execution:** <15 dakika
- **Load Test Duration:** 30 dakika
- **Security Scan Duration:** <10 dakika

---

## 🏗️ Test Piramidi Stratejisi

### 🔹 Unit Tests (70%)
**Hedef:** Bireysel fonksiyonlar ve bileşenlerin doğruluğu

#### Frontend Unit Tests
```typescript
// React component testing with Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BeneficiaryForm } from '../BeneficiaryForm'

describe('BeneficiaryForm', () => {
  const mockOnSubmit = vi.fn()
  
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })
  
  it('should render all required fields', () => {
    render(<BeneficiaryForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/ad soyad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/adres/i)).toBeInTheDocument()
  })
  
  it('should validate required fields', async () => {
    render(<BeneficiaryForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /kaydet/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ad soyad gereklidir/i)).toBeInTheDocument()
      expect(screen.getByText(/e-posta gereklidir/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
  
  it('should submit form with valid data', async () => {
    const validData = {
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+905551234567',
      address: 'İstanbul, Türkiye'
    }
    
    render(<BeneficiaryForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/ad soyad/i), {
      target: { value: validData.name }
    })
    fireEvent.change(screen.getByLabelText(/e-posta/i), {
      target: { value: validData.email }
    })
    fireEvent.change(screen.getByLabelText(/telefon/i), {
      target: { value: validData.phone }
    })
    fireEvent.change(screen.getByLabelText(/adres/i), {
      target: { value: validData.address }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validData)
    })
  })
})
```

#### Backend Unit Tests
```typescript
// Service layer testing
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BeneficiaryService } from '../services/BeneficiaryService'
import { supabase } from '../config/supabase'

// Mock Supabase
vi.mock('../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  }
}))

describe('BeneficiaryService', () => {
  let beneficiaryService: BeneficiaryService
  
  beforeEach(() => {
    beneficiaryService = new BeneficiaryService()
    vi.clearAllMocks()
  })
  
  describe('createBeneficiary', () => {
    it('should create a new beneficiary successfully', async () => {
      const mockBeneficiary = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+905551234567'
      }
      
      const mockResponse = {
        data: { id: '123', ...mockBeneficiary },
        error: null
      }
      
      supabase.from().insert.mockResolvedValue(mockResponse)
      
      const result = await beneficiaryService.createBeneficiary(mockBeneficiary)
      
      expect(supabase.from).toHaveBeenCalledWith('beneficiaries')
      expect(result.data).toEqual(mockResponse.data)
      expect(result.error).toBeNull()
    })
    
    it('should handle validation errors', async () => {
      const invalidBeneficiary = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: malformed email
        phone: '123' // Invalid: short phone
      }
      
      await expect(
        beneficiaryService.createBeneficiary(invalidBeneficiary)
      ).rejects.toThrow('Validation failed')
    })
  })
  
  describe('getBeneficiaries', () => {
    it('should return paginated beneficiaries', async () => {
      const mockBeneficiaries = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' }
      ]
      
      const mockResponse = {
        data: mockBeneficiaries,
        error: null,
        count: 2
      }
      
      supabase.from().select.mockResolvedValue(mockResponse)
      
      const result = await beneficiaryService.getBeneficiaries({
        page: 1,
        limit: 10
      })
      
      expect(result.data).toEqual(mockBeneficiaries)
      expect(result.pagination.total).toBe(2)
    })
  })
})
```

### 🔸 Integration Tests (20%)
**Hedef:** Bileşenler arası etkileşimlerin doğruluğu

#### API Integration Tests
```typescript
// API endpoint testing
import request from 'supertest'
import { app } from '../app'
import { setupTestDatabase, cleanupTestDatabase } from '../test-utils/database'

describe('Beneficiaries API', () => {
  let authToken: string
  
  beforeAll(async () => {
    await setupTestDatabase()
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'testpassword'
      })
    
    authToken = loginResponse.body.accessToken
  })
  
  afterAll(async () => {
    await cleanupTestDatabase()
  })
  
  describe('POST /api/beneficiaries', () => {
    it('should create a new beneficiary', async () => {
      const newBeneficiary = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        phone: '+905551234567',
        address: {
          street: 'Test Street 123',
          city: 'İstanbul',
          postal_code: '34000'
        }
      }
      
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBeneficiary)
        .expect(201)
      
      expect(response.body.data).toMatchObject({
        name: newBeneficiary.name,
        email: newBeneficiary.email,
        phone: newBeneficiary.phone
      })
      expect(response.body.data.id).toBeDefined()
    })
    
    it('should return 400 for invalid data', async () => {
      const invalidBeneficiary = {
        name: '', // Invalid
        email: 'invalid-email', // Invalid
        phone: '123' // Invalid
      }
      
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidBeneficiary)
        .expect(400)
      
      expect(response.body.error).toBe('Validation failed')
      expect(response.body.details).toBeDefined()
    })
    
    it('should return 401 without auth token', async () => {
      await request(app)
        .post('/api/beneficiaries')
        .send({ name: 'Test' })
        .expect(401)
    })
  })
  
  describe('GET /api/beneficiaries', () => {
    it('should return paginated beneficiaries', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number)
      })
    })
    
    it('should filter beneficiaries by status', async () => {
      const response = await request(app)
        .get('/api/beneficiaries?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      
      response.body.data.forEach((beneficiary: any) => {
        expect(beneficiary.status).toBe('active')
      })
    })
  })
})
```

#### Database Integration Tests
```typescript
// Database operation testing
import { supabase } from '../config/supabase'
import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository'

describe('BeneficiaryRepository Integration', () => {
  let repository: BeneficiaryRepository
  let testBeneficiaryId: string
  
  beforeAll(() => {
    repository = new BeneficiaryRepository()
  })
  
  afterEach(async () => {
    // Cleanup test data
    if (testBeneficiaryId) {
      await supabase
        .from('beneficiaries')
        .delete()
        .eq('id', testBeneficiaryId)
    }
  })
  
  it('should perform CRUD operations correctly', async () => {
    // Create
    const newBeneficiary = {
      name: 'DB Test User',
      email: 'dbtest@example.com',
      phone: '+905551234567'
    }
    
    const created = await repository.create(newBeneficiary)
    expect(created.id).toBeDefined()
    testBeneficiaryId = created.id
    
    // Read
    const found = await repository.findById(testBeneficiaryId)
    expect(found).toMatchObject(newBeneficiary)
    
    // Update
    const updated = await repository.update(testBeneficiaryId, {
      name: 'Updated Name'
    })
    expect(updated.name).toBe('Updated Name')
    
    // Delete
    await repository.delete(testBeneficiaryId)
    const deleted = await repository.findById(testBeneficiaryId)
    expect(deleted).toBeNull()
    
    testBeneficiaryId = '' // Prevent cleanup
  })
  
  it('should handle database constraints', async () => {
    // Test unique email constraint
    const beneficiary1 = {
      name: 'User 1',
      email: 'duplicate@example.com',
      phone: '+905551234567'
    }
    
    const beneficiary2 = {
      name: 'User 2',
      email: 'duplicate@example.com', // Same email
      phone: '+905551234568'
    }
    
    await repository.create(beneficiary1)
    
    await expect(
      repository.create(beneficiary2)
    ).rejects.toThrow('Email already exists')
  })
})
```

### 🔺 End-to-End Tests (10%)
**Hedef:** Kullanıcı senaryolarının tam akışı

#### Playwright E2E Tests
```typescript
// E2E testing with Playwright
import { test, expect, Page } from '@playwright/test'

test.describe('Beneficiary Management Flow', () => {
  let page: Page
  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Login
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@test.com')
    await page.fill('[data-testid="password-input"]', 'testpassword')
    await page.click('[data-testid="login-button"]')
    
    // Wait for dashboard
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()
  })
  
  test('should create, edit, and delete beneficiary', async () => {
    // Navigate to beneficiaries page
    await page.click('[data-testid="nav-beneficiaries"]')
    await expect(page.locator('h1')).toContainText('Yararlanıcılar')
    
    // Create new beneficiary
    await page.click('[data-testid="add-beneficiary-button"]')
    
    await page.fill('[data-testid="name-input"]', 'E2E Test User')
    await page.fill('[data-testid="email-input"]', 'e2e@test.com')
    await page.fill('[data-testid="phone-input"]', '+905551234567')
    await page.fill('[data-testid="address-input"]', 'Test Address 123')
    
    await page.click('[data-testid="save-button"]')
    
    // Verify creation
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Yararlanıcı başarıyla oluşturuldu')
    
    // Search for created beneficiary
    await page.fill('[data-testid="search-input"]', 'E2E Test User')
    await page.press('[data-testid="search-input"]', 'Enter')
    
    const beneficiaryRow = page.locator('[data-testid="beneficiary-row"]').first()
    await expect(beneficiaryRow).toContainText('E2E Test User')
    
    // Edit beneficiary
    await beneficiaryRow.locator('[data-testid="edit-button"]').click()
    
    await page.fill('[data-testid="name-input"]', 'E2E Test User Updated')
    await page.click('[data-testid="save-button"]')
    
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Yararlanıcı başarıyla güncellendi')
    
    // Verify update
    await expect(beneficiaryRow).toContainText('E2E Test User Updated')
    
    // Delete beneficiary
    await beneficiaryRow.locator('[data-testid="delete-button"]').click()
    await page.click('[data-testid="confirm-delete-button"]')
    
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Yararlanıcı başarıyla silindi')
    
    // Verify deletion
    await expect(beneficiaryRow).not.toBeVisible()
  })
  
  test('should handle form validation errors', async () => {
    await page.click('[data-testid="nav-beneficiaries"]')
    await page.click('[data-testid="add-beneficiary-button"]')
    
    // Try to submit empty form
    await page.click('[data-testid="save-button"]')
    
    // Check validation errors
    await expect(page.locator('[data-testid="name-error"]'))
      .toContainText('Ad soyad gereklidir')
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('E-posta gereklidir')
    
    // Fill invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.click('[data-testid="save-button"]')
    
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Geçerli bir e-posta adresi giriniz')
  })
  
  test('should filter and sort beneficiaries', async () => {
    await page.click('[data-testid="nav-beneficiaries"]')
    
    // Test status filter
    await page.selectOption('[data-testid="status-filter"]', 'active')
    
    const rows = page.locator('[data-testid="beneficiary-row"]')
    const count = await rows.count()
    
    for (let i = 0; i < count; i++) {
      const statusBadge = rows.nth(i).locator('[data-testid="status-badge"]')
      await expect(statusBadge).toContainText('Aktif')
    }
    
    // Test sorting
    await page.click('[data-testid="sort-by-name"]')
    
    const firstRowName = await rows.first().locator('[data-testid="name-cell"]').textContent()
    const lastRowName = await rows.last().locator('[data-testid="name-cell"]').textContent()
    
    expect(firstRowName?.localeCompare(lastRowName || '')).toBeLessThanOrEqual(0)
  })
})
```

---

## 🚀 Performance Testing

### ⚡ Frontend Performance Tests

#### Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/beneficiaries',
        'http://localhost:3000/donations'
      ],
      startServerCommand: 'npm run dev',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

#### Web Vitals Testing
```typescript
// Web Vitals performance testing
import { test, expect } from '@playwright/test'
import { injectSpeedInsights } from '@vercel/speed-insights'

test.describe('Performance Metrics', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to page
    await page.goto('/')
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {
            FCP: 0,
            LCP: 0,
            FID: 0,
            CLS: 0
          }
          
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.CLS += entry.value
            }
          })
          
          resolve(vitals)
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
      })
    })
    
    // Assert Core Web Vitals thresholds
    expect(metrics.FCP).toBeLessThan(1800) // Good: < 1.8s
    expect(metrics.LCP).toBeLessThan(2500) // Good: < 2.5s
    expect(metrics.FID).toBeLessThan(100)  // Good: < 100ms
    expect(metrics.CLS).toBeLessThan(0.1)  // Good: < 0.1
  })
  
  test('should load critical resources quickly', async ({ page }) => {
    const response = await page.goto('/')
    
    // Check response time
    expect(response?.status()).toBe(200)
    
    // Measure resource loading times
    const resourceTimings = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource')
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize
      }))
    })
    
    // Critical resources should load quickly
    const criticalResources = resourceTimings.filter(resource => 
      resource.name.includes('.js') || resource.name.includes('.css')
    )
    
    criticalResources.forEach(resource => {
      expect(resource.duration).toBeLessThan(1000) // < 1s
    })
  })
})
```

### 🔥 Backend Load Testing

#### K6 Load Test Scenarios
```javascript
// k6-load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const responseTime = new Trend('response_time')

export let options = {
  scenarios: {
    // Smoke test
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
      tags: { test_type: 'smoke' }
    },
    
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 }
      ],
      tags: { test_type: 'load' }
    },
    
    // Stress test
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '5m', target: 400 },
        { duration: '2m', target: 0 }
      ],
      tags: { test_type: 'stress' }
    },
    
    // Spike test
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },
        { duration: '30s', target: 1000 }, // Spike
        { duration: '1m', target: 100 },
        { duration: '1m', target: 0 }
      ],
      tags: { test_type: 'spike' }
    }
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
    errors: ['rate<0.01'],
    response_time: ['p(95)<500']
  }
}

const BASE_URL = 'http://localhost:3001'
let authToken

export function setup() {
  // Login to get auth token
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
    email: 'loadtest@example.com',
    password: 'loadtestpassword'
  })
  
  check(loginRes, {
    'login successful': (r) => r.status === 200
  })
  
  return { token: loginRes.json('accessToken') }
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json'
  }
  
  // Test different API endpoints
  const scenarios = [
    () => testGetBeneficiaries(headers),
    () => testGetDonations(headers),
    () => testGetDashboardStats(headers),
    () => testCreateBeneficiary(headers),
    () => testUpdateBeneficiary(headers)
  ]
  
  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  scenario()
  
  sleep(Math.random() * 2 + 1) // 1-3 seconds
}

function testGetBeneficiaries(headers) {
  const response = http.get(`${BASE_URL}/api/beneficiaries?page=1&limit=20`, { headers })
  
  const success = check(response, {
    'get beneficiaries status 200': (r) => r.status === 200,
    'get beneficiaries response time < 500ms': (r) => r.timings.duration < 500,
    'get beneficiaries has data': (r) => r.json('data') !== undefined
  })
  
  errorRate.add(!success)
  responseTime.add(response.timings.duration)
}

function testCreateBeneficiary(headers) {
  const payload = {
    name: `Load Test User ${Math.random()}`,
    email: `loadtest${Math.random()}@example.com`,
    phone: `+9055512${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    address: 'Load Test Address'
  }
  
  const response = http.post(`${BASE_URL}/api/beneficiaries`, JSON.stringify(payload), { headers })
  
  const success = check(response, {
    'create beneficiary status 201': (r) => r.status === 201,
    'create beneficiary response time < 1000ms': (r) => r.timings.duration < 1000,
    'create beneficiary returns id': (r) => r.json('data.id') !== undefined
  })
  
  errorRate.add(!success)
  responseTime.add(response.timings.duration)
}

export function teardown(data) {
  // Cleanup test data if needed
  console.log('Load test completed')
}
```

---

## 🔒 Security Testing

### 🛡️ OWASP Security Tests

#### Security Test Suite
```typescript
// Security testing with custom framework
import request from 'supertest'
import { app } from '../app'

describe('Security Tests', () => {
  describe('Authentication & Authorization', () => {
    it('should prevent SQL injection in login', async () => {
      const maliciousPayload = {
        email: "admin@test.com'; DROP TABLE users; --",
        password: 'password'
      }
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousPayload)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Validation failed')
    })
    
    it('should prevent XSS in user input', async () => {
      const xssPayload = {
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        phone: '+905551234567'
      }
      
      const authToken = await getAuthToken()
      
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(xssPayload)
      
      if (response.status === 201) {
        expect(response.body.data.name).not.toContain('<script>')
        expect(response.body.data.name).toBe('alert("XSS")')
      }
    })
    
    it('should enforce rate limiting', async () => {
      const requests = []
      
      // Send 10 rapid requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrong' })
        )
      }
      
      const responses = await Promise.all(requests)
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
    
    it('should validate JWT tokens properly', async () => {
      const invalidTokens = [
        'invalid.jwt.token',
        'Bearer invalid',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        '' // Empty token
      ]
      
      for (const token of invalidTokens) {
        const response = await request(app)
          .get('/api/beneficiaries')
          .set('Authorization', token)
        
        expect(response.status).toBe(401)
      }
    })
  })
  
  describe('Input Validation', () => {
    it('should validate email format strictly', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..double.dot@domain.com',
        'user@domain',
        'user name@domain.com' // Space in email
      ]
      
      const authToken = await getAuthToken()
      
      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/beneficiaries')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test User',
            email: email,
            phone: '+905551234567'
          })
        
        expect(response.status).toBe(400)
        expect(response.body.error).toContain('Validation failed')
      }
    })
    
    it('should prevent oversized payloads', async () => {
      const largePayload = {
        name: 'A'.repeat(10000), // Very long name
        email: 'test@example.com',
        phone: '+905551234567',
        description: 'B'.repeat(50000) // Very long description
      }
      
      const authToken = await getAuthToken()
      
      const response = await request(app)
        .post('/api/beneficiaries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largePayload)
      
      expect(response.status).toBe(413) // Payload too large
    })
  })
  
  describe('CORS & Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/api/health')
      
      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['x-xss-protection']).toBe('1; mode=block')
      expect(response.headers['strict-transport-security']).toBeDefined()
    })
    
    it('should enforce CORS policy', async () => {
      const response = await request(app)
        .options('/api/beneficiaries')
        .set('Origin', 'https://malicious-site.com')
      
      expect(response.headers['access-control-allow-origin']).not.toBe('https://malicious-site.com')
    })
  })
})

async function getAuthToken(): Promise<string> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'testpassword'
    })
  
  return response.body.accessToken
}
```

### 🔍 Automated Security Scanning

#### OWASP ZAP Integration
```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # Weekly scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd api && npm ci
    
    - name: Start application
      run: |
        npm run build
        npm run start &
        cd api && npm run build && npm run start &
        sleep 30
    
    - name: Run OWASP ZAP Scan
      uses: zaproxy/action-full-scan@v0.4.0
      with:
        target: 'http://localhost:3000'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'
    
    - name: Upload ZAP Report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: zap-report
        path: report_html.html
```

---

## 📊 Test Automation Pipeline

### 🔄 CI/CD Test Integration

#### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd api && npm ci
    
    - name: Run unit tests
      run: |
        npm run test:unit -- --coverage
        cd api && npm run test:unit -- --coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info,./api/coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
  
  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd api && npm ci
    
    - name: Setup test database
      run: |
        cd api
        npm run db:migrate:test
        npm run db:seed:test
    
    - name: Run integration tests
      run: |
        cd api
        npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
  
  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd api && npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Build application
      run: |
        npm run build
        cd api && npm run build
    
    - name: Start application
      run: |
        cd api && npm run start &
        npm run start &
        sleep 30
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
  
  performance-tests:
    runs-on: ubuntu-latest
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd api && npm ci
    
    - name: Install k6
      run: |
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Start application
      run: |
        cd api && npm run start &
        npm run start &
        sleep 30
    
    - name: Run load tests
      run: k6 run tests/load/k6-load-test.js
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
```

### 📈 Test Reporting

#### Custom Test Reporter
```typescript
// test-reporter.ts
import { Reporter, TestCase, TestResult } from '@jest/reporters'
import fs from 'fs'
import path from 'path'

class CustomTestReporter implements Reporter {
  private results: TestResult[] = []
  
  onTestResult(test: TestCase, testResult: TestResult): void {
    this.results.push(testResult)
  }
  
  onRunComplete(): void {
    const summary = this.generateSummary()
    const htmlReport = this.generateHTMLReport(summary)
    
    // Save HTML report
    fs.writeFileSync(
      path.join(process.cwd(), 'test-reports', 'summary.html'),
      htmlReport
    )
    
    // Save JSON report
    fs.writeFileSync(
      path.join(process.cwd(), 'test-reports', 'summary.json'),
      JSON.stringify(summary, null, 2)
    )
    
    console.log('\n📊 Test Summary:')
    console.log(`✅ Passed: ${summary.passed}`)
    console.log(`❌ Failed: ${summary.failed}`)
    console.log(`⏭️  Skipped: ${summary.skipped}`)
    console.log(`📈 Coverage: ${summary.coverage}%`)
    console.log(`⏱️  Duration: ${summary.duration}ms`)
  }
  
  private generateSummary(results: TestResult[]) {
    const totalTests = results.reduce((sum, result) => sum + result.numTotalTests, 0)
    const passedTests = results.reduce((sum, result) => sum + result.numPassingTests, 0)
    const failedTests = results.reduce((sum, result) => sum + result.numFailingTests, 0)
    const skippedTests = results.reduce((sum, result) => sum + result.numPendingTests, 0)
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      coverage: this.calculateCoverage(),
      duration: results.reduce((sum, result) => sum + (result.perfStats.end - result.perfStats.start), 0),
      timestamp: new Date().toISOString()
    }
  }
  
  private generateHTMLReport(summary: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; border-radius: 4px; }
        .passed { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        .skipped { background: #fff3cd; color: #856404; }
      </style>
    </head>
    <body>
      <h1>🧪 Test Report</h1>
      <div class="summary">
        <div class="metric passed">✅ Passed: ${summary.passed}</div>
        <div class="metric failed">❌ Failed: ${summary.failed}</div>
        <div class="metric skipped">⏭️ Skipped: ${summary.skipped}</div>
        <div class="metric">📈 Coverage: ${summary.coverage}%</div>
        <div class="metric">⏱️ Duration: ${summary.duration}ms</div>
      </div>
      <p>Generated: ${summary.timestamp}</p>
    </body>
    </html>
    `
  }
  
  private calculateCoverage(): number {
    // Implementation to calculate coverage percentage
    return 85 // Placeholder
  }
}

export default CustomTestReporter
```

---

## 📋 Test Configuration Files

### ⚙️ Jest Configuration
```javascript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'Frontend',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      },
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/test-utils/**',
        '!src/**/*.stories.{ts,tsx}'
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    {
      displayName: 'Backend',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/api/src/test-setup.ts'],
      testMatch: ['<rootDir>/api/src/**/*.test.ts'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/api/src/$1'
      },
      collectCoverageFrom: [
        'api/src/**/*.ts',
        '!api/src/**/*.d.ts',
        '!api/src/test-utils/**'
      ],
      coverageThreshold: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    }
  ],
  reporters: [
    'default',
    ['<rootDir>/test-reporter.ts', {}],
    ['jest-html-reporters', {
      publicPath: './test-reports',
      filename: 'jest-report.html'
    }]
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
}
```

### 🎭 Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

---

## 📊 Implementation Timeline

### 🗓️ Faz 1: Test Infrastructure (Hafta 1-2)
- [ ] Jest ve Vitest konfigürasyonu
- [ ] Testing Library setup
- [ ] Playwright kurulumu
- [ ] Test utilities ve helpers
- [ ] CI/CD pipeline entegrasyonu

### 🗓️ Faz 2: Unit Tests (Hafta 3-4)
- [ ] Frontend component testleri
- [ ] Backend service testleri
- [ ] Utility function testleri
- [ ] Hook testleri
- [ ] %90+ code coverage hedefi

### 🗓️ Faz 3: Integration Tests (Hafta 5-6)
- [ ] API endpoint testleri
- [ ] Database integration testleri
- [ ] Authentication flow testleri
- [ ] Error handling testleri
- [ ] Performance benchmarks

### 🗓️ Faz 4: E2E & Security Tests (Hafta 7-8)
- [ ] Critical user journey testleri
- [ ] Cross-browser testing
- [ ] Mobile responsive testleri
- [ ] Security vulnerability testleri
- [ ] Load testing implementation

---

## 📈 Success Metrics

### 🎯 Quality Metrics
- **Code Coverage:** >95% (Target: 98%)
- **Test Execution Time:** <10 dakika (Target: <5 dakika)
- **Bug Detection Rate:** >95% (Target: 98%)
- **False Positive Rate:** <5% (Target: <2%)
- **Test Maintenance Effort:** <20% (Target: <10%)

### 🚀 Performance Metrics
- **Unit Test Speed:** <30 saniye (Target: <15 saniye)
- **Integration Test Speed:** <5 dakika (Target: <3 dakika)
- **E2E Test Speed:** <15 dakika (Target: <10 dakika)
- **CI/CD Pipeline Speed:** <20 dakika (Target: <15 dakika)

### 🔒 Security Metrics
- **Security Test Coverage:** >90% (Target: 95%)
- **Vulnerability Detection:** 100% (Target: 100%)
- **Security Scan Speed:** <10 dakika (Target: <5 dakika)
- **Compliance Score:** >95% (Target: 100%)

---

**📅 Plan Oluşturma Tarihi:** $(date)  
**🧪 Test Sorumlusu:** AI QA Specialist  
**🔄 Son Güncelleme:** $(date)  

> Bu test stratejisi, modern yazılım geliştirme en iyi uygulamaları ve kalite standartları doğrultusunda hazırlanmıştır.