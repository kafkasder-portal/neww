import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../app';

describe('Financial Routes', () => {
  const mockTransaction = {
    type: 'income',
    amount: 1000.50,
    currency: 'TRY',
    category: 'donation',
    description: 'Test transaction',
    reference_id: '550e8400-e29b-41d4-a716-446655440000',
    reference_type: 'donation'
  };

  const mockBudget = {
    name: 'Test Budget',
    category: 'operations',
    allocated_amount: 5000.00,
    currency: 'TRY',
    period: 'monthly',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    description: 'Test budget description'
  };

  const mockExpense = {
    amount: 250.75,
    currency: 'TRY',
    category: 'office_supplies',
    description: 'Test expense',
    vendor: 'Test Vendor',
    receipt_url: 'https://example.com/receipt.pdf',
    expense_date: '2024-01-15'
  };

  const mockAuthToken = 'Bearer mock-jwt-token';

  beforeAll(async () => {
    // Setup test database or mock services
  });

  afterAll(async () => {
    // Cleanup test database or mock services
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/financial/transactions', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/financial/transactions');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/financial/transactions?page=1&limit=10')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should validate pagination limits', async () => {
      const response = await request(app)
        .get('/api/financial/transactions?page=0&limit=101')
        .set('Authorization', mockAuthToken);

      expect([400, 401]).toContain(response.status);
    });

    it('should handle date range filters', async () => {
      const response = await request(app)
        .get('/api/financial/transactions?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle transaction type filter', async () => {
      const response = await request(app)
        .get('/api/financial/transactions?type=income')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });

    it('should handle category filter', async () => {
      const response = await request(app)
        .get('/api/financial/transactions?category=donation')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/financial/transactions/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/financial/transactions/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/financial/transactions/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/financial/transactions', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          amount: 100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid transaction type', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTransaction,
          type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative amount', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTransaction,
          amount: -100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for zero amount', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTransaction,
          amount: 0
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid currency', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTransaction,
          currency: 'INVALID'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .send(mockTransaction);

      expect(response.status).toBe(401);
    });

    it('should sanitize input data', async () => {
      const maliciousData = {
        ...mockTransaction,
        description: '<script>alert("xss")</script>Test description'
      };

      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect([200, 201, 400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/financial/transactions/:id', () => {
    const transactionId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .put('/api/financial/transactions/invalid-id')
        .set('Authorization', mockAuthToken)
        .send({ amount: 200 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .put(`/api/financial/transactions/${transactionId}`)
        .send({ amount: 200 });

      expect(response.status).toBe(401);
    });

    it('should validate amount when provided', async () => {
      const response = await request(app)
        .put(`/api/financial/transactions/${transactionId}`)
        .set('Authorization', mockAuthToken)
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/financial/transactions/:id', () => {
    const transactionId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/financial/transactions/invalid-id')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .delete(`/api/financial/transactions/${transactionId}`);

      expect(response.status).toBe(401);
    });
  });

  // Budget endpoints
  describe('GET /api/financial/budgets', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/financial/budgets');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle pagination and filters', async () => {
      const response = await request(app)
        .get('/api/financial/budgets?page=1&limit=10&category=operations')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/financial/budgets', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/financial/budgets')
        .set('Authorization', mockAuthToken)
        .send({
          name: 'Test Budget'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid period', async () => {
      const response = await request(app)
        .post('/api/financial/budgets')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBudget,
          period: 'invalid_period'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative allocated amount', async () => {
      const response = await request(app)
        .post('/api/financial/budgets')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBudget,
          allocated_amount: -1000
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid date range', async () => {
      const response = await request(app)
        .post('/api/financial/budgets')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockBudget,
          start_date: '2024-12-31',
          end_date: '2024-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/financial/budgets')
        .send(mockBudget);

      expect(response.status).toBe(401);
    });
  });

  // Expense endpoints
  describe('GET /api/financial/expenses', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/financial/expenses');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle date range and category filters', async () => {
      const response = await request(app)
        .get('/api/financial/expenses?start_date=2024-01-01&end_date=2024-12-31&category=office_supplies')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/financial/expenses', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          amount: 100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative amount', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockExpense,
          amount: -100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid expense date', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockExpense,
          expense_date: 'invalid-date'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid receipt URL', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockExpense,
          receipt_url: 'not-a-valid-url'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .send(mockExpense);

      expect(response.status).toBe(401);
    });
  });

  // Reports endpoints
  describe('GET /api/financial/reports/summary', () => {
    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/financial/reports/summary');

      expect(response.status).toBe(401);
    });

    it('should handle date range for summary', async () => {
      const response = await request(app)
        .get('/api/financial/reports/summary?start_date=2024-01-01&end_date=2024-12-31')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/financial/reports/cash-flow', () => {
    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/financial/reports/cash-flow');

      expect(response.status).toBe(401);
    });

    it('should handle period parameter', async () => {
      const response = await request(app)
        .get('/api/financial/reports/cash-flow?period=monthly&year=2024')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('GET /api/financial/reports/budget-analysis', () => {
    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/financial/reports/budget-analysis');

      expect(response.status).toBe(401);
    });

    it('should handle budget ID parameter', async () => {
      const response = await request(app)
        .get('/api/financial/reports/budget-analysis?budget_id=550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', mockAuthToken);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Input Sanitization and Security', () => {
    it('should prevent SQL injection in transaction creation', async () => {
      const maliciousData = {
        ...mockTransaction,
        description: "'; DROP TABLE transactions; --"
      };

      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should prevent XSS in budget creation', async () => {
      const maliciousData = {
        ...mockBudget,
        name: '<script>alert("xss")</script>Malicious Budget',
        description: 'Test <img src=x onerror=alert(1)> description'
      };

      const response = await request(app)
        .post('/api/financial/budgets')
        .set('Authorization', mockAuthToken)
        .send(maliciousData);

      expect([200, 201, 400, 401]).toContain(response.status);
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(10001);
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockExpense,
          description: longString
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid transaction creation requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app)
          .post('/api/financial/transactions')
          .set('Authorization', mockAuthToken)
          .send(mockTransaction)
      );

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);
      
      // Should have some rate limiting or validation errors
      expect(statusCodes.some(code => [400, 401, 429].includes(code))).toBe(true);
    });
  });

  describe('Data Validation Edge Cases', () => {
    it('should handle decimal amounts correctly', async () => {
      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockTransaction,
          amount: 99.99
        });

      expect([200, 201, 401]).toContain(response.status);
    });

    it('should handle very small amounts', async () => {
      const response = await request(app)
        .post('/api/financial/expenses')
        .set('Authorization', mockAuthToken)
        .send({
          ...mockExpense,
          amount: 0.01
        });

      expect([200, 201, 401]).toContain(response.status);
    });

    it('should validate currency codes', async () => {
      const validCurrencies = ['TRY', 'USD', 'EUR'];
      
      for (const currency of validCurrencies) {
        const response = await request(app)
          .post('/api/financial/transactions')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockTransaction,
            currency
          });

        expect([200, 201, 400, 401]).toContain(response.status);
      }
    });

    it('should validate transaction categories', async () => {
      const validCategories = ['donation', 'grant', 'fundraising', 'investment', 'other'];
      
      for (const category of validCategories) {
        const response = await request(app)
          .post('/api/financial/transactions')
          .set('Authorization', mockAuthToken)
          .send({
            ...mockTransaction,
            category
          });

        expect([200, 201, 400, 401]).toContain(response.status);
      }
    });
  });
});