import { test, expect } from '@playwright/test';

test.describe('Financial Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'admin@test.com',
        role: 'super_admin',
        is_active: true
      }));
    });

    // Mock API responses
    await page.route('**/api/auth/verify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'admin@test.com',
            role: 'super_admin',
            is_active: true
          }
        })
      });
    });

    await page.route('**/api/financial/transactions', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              type: 'income',
              category: 'donation',
              amount: 5000,
              currency: 'TRY',
              description: 'Monthly donation from corporate sponsor',
              reference_id: 'DON-2024-001',
              account_id: 'acc_main',
              account_name: 'Main Account',
              date: '2024-01-15T10:00:00Z',
              status: 'completed',
              created_by: 'admin@test.com',
              tags: ['corporate', 'monthly'],
              attachments: ['receipt_001.pdf']
            },
            {
              id: '2',
              type: 'expense',
              category: 'program',
              amount: 2500,
              currency: 'TRY',
              description: 'Emergency relief supplies',
              reference_id: 'EXP-2024-001',
              account_id: 'acc_program',
              account_name: 'Program Account',
              date: '2024-01-16T14:30:00Z',
              status: 'pending',
              created_by: 'program@test.com',
              tags: ['emergency', 'supplies'],
              vendor: 'Relief Supplies Co.',
              invoice_number: 'INV-2024-001'
            }
          ],
          total: 2,
          page: 1,
          limit: 10
        })
      });
    });

    await page.route('**/api/financial/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_income: 125000,
          total_expenses: 89000,
          net_income: 36000,
          current_balance: 156000,
          monthly_summary: {
            income: 15000,
            expenses: 12000,
            net: 3000,
            growth: 8.5
          },
          account_balances: [
            { id: 'acc_main', name: 'Main Account', balance: 85000, currency: 'TRY' },
            { id: 'acc_program', name: 'Program Account', balance: 45000, currency: 'TRY' },
            { id: 'acc_emergency', name: 'Emergency Fund', balance: 26000, currency: 'TRY' }
          ],
          category_breakdown: {
            income: [
              { category: 'donation', amount: 95000, percentage: 76 },
              { category: 'grant', amount: 25000, percentage: 20 },
              { category: 'fundraising', amount: 5000, percentage: 4 }
            ],
            expenses: [
              { category: 'program', amount: 45000, percentage: 51 },
              { category: 'administrative', amount: 25000, percentage: 28 },
              { category: 'fundraising', amount: 19000, percentage: 21 }
            ]
          }
        })
      });
    });

    await page.route('**/api/financial/accounts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'acc_main',
              name: 'Main Account',
              type: 'checking',
              balance: 85000,
              currency: 'TRY',
              bank_name: 'Ziraat Bank',
              account_number: '****1234',
              status: 'active',
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: 'acc_program',
              name: 'Program Account',
              type: 'savings',
              balance: 45000,
              currency: 'TRY',
              bank_name: 'İş Bank',
              account_number: '****5678',
              status: 'active',
              created_at: '2024-01-01T00:00:00Z'
            }
          ]
        })
      });
    });

    await page.goto('/financial');
  });

  test('should display financial dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Financial Management');
    await expect(page.locator('[data-testid="summary-card"]')).toHaveCount(4);
  });

  test('should show financial summary', async ({ page }) => {
    await expect(page.locator('text=₺125,000')).toBeVisible(); // Total income
    await expect(page.locator('text=₺89,000')).toBeVisible(); // Total expenses
    await expect(page.locator('text=₺36,000')).toBeVisible(); // Net income
    await expect(page.locator('text=₺156,000')).toBeVisible(); // Current balance
  });

  test('should display transactions list', async ({ page }) => {
    await expect(page.locator('text=Monthly donation from corporate sponsor')).toBeVisible();
    await expect(page.locator('text=Emergency relief supplies')).toBeVisible();
    await expect(page.locator('text=₺5,000')).toBeVisible();
    await expect(page.locator('text=₺2,500')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-item"]')).toHaveCount(2);
  });

  test('should show transaction types', async ({ page }) => {
    await expect(page.locator('[data-testid="type-income"]')).toBeVisible();
    await expect(page.locator('[data-testid="type-expense"]')).toBeVisible();
  });

  test('should show transaction status', async ({ page }) => {
    await expect(page.locator('[data-testid="status-completed"]')).toBeVisible();
    await expect(page.locator('[data-testid="status-pending"]')).toBeVisible();
  });

  test('should filter transactions by type', async ({ page }) => {
    await page.selectOption('select[name="type_filter"]', 'income');
    
    await expect(page.locator('text=Monthly donation from corporate sponsor')).toBeVisible();
    await expect(page.locator('text=Emergency relief supplies')).not.toBeVisible();
  });

  test('should filter transactions by category', async ({ page }) => {
    await page.selectOption('select[name="category_filter"]', 'donation');
    
    await expect(page.locator('text=Monthly donation from corporate sponsor')).toBeVisible();
    await expect(page.locator('text=Emergency relief supplies')).not.toBeVisible();
  });

  test('should filter transactions by status', async ({ page }) => {
    await page.selectOption('select[name="status_filter"]', 'completed');
    
    await expect(page.locator('text=Monthly donation from corporate sponsor')).toBeVisible();
    await expect(page.locator('text=Emergency relief supplies')).not.toBeVisible();
  });

  test('should search transactions', async ({ page }) => {
    await page.fill('input[name="search"]', 'donation');
    
    await expect(page.locator('text=Monthly donation from corporate sponsor')).toBeVisible();
    await expect(page.locator('text=Emergency relief supplies')).not.toBeVisible();
  });

  test('should open transaction details modal', async ({ page }) => {
    await page.route('**/api/financial/transactions/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          type: 'income',
          category: 'donation',
          amount: 5000,
          currency: 'TRY',
          description: 'Monthly donation from corporate sponsor',
          reference_id: 'DON-2024-001',
          account_id: 'acc_main',
          account_name: 'Main Account',
          date: '2024-01-15T10:00:00Z',
          status: 'completed',
          created_by: 'admin@test.com',
          tags: ['corporate', 'monthly'],
          attachments: ['receipt_001.pdf'],
          notes: 'Regular monthly donation from XYZ Corporation',
          approval_status: 'approved',
          approved_by: 'finance@test.com',
          approved_at: '2024-01-15T09:30:00Z'
        })
      });
    });

    await page.click('[data-testid="view-transaction-1"]');
    
    await expect(page.locator('[data-testid="transaction-modal"]')).toBeVisible();
    await expect(page.locator('text=DON-2024-001')).toBeVisible();
    await expect(page.locator('text=XYZ Corporation')).toBeVisible();
    await expect(page.locator('text=receipt_001.pdf')).toBeVisible();
  });

  test('should create new income transaction', async ({ page }) => {
    await page.route('**/api/financial/transactions', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            type: 'income',
            category: 'grant',
            amount: 10000,
            currency: 'TRY',
            description: 'Government grant for education program',
            status: 'pending'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('text=Add Transaction');
    
    await expect(page.locator('[data-testid="transaction-form-modal"]')).toBeVisible();
    
    await page.selectOption('select[name="type"]', 'income');
    await page.selectOption('select[name="category"]', 'grant');
    await page.fill('input[name="amount"]', '10000');
    await page.fill('textarea[name="description"]', 'Government grant for education program');
    await page.selectOption('select[name="account_id"]', 'acc_main');
    await page.fill('input[name="reference_id"]', 'GRT-2024-001');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Transaction created successfully')).toBeVisible();
  });

  test('should create new expense transaction', async ({ page }) => {
    await page.route('**/api/financial/transactions', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '4',
            type: 'expense',
            category: 'administrative',
            amount: 1500,
            currency: 'TRY',
            description: 'Office rent payment',
            status: 'pending'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('text=Add Transaction');
    
    await page.selectOption('select[name="type"]', 'expense');
    await page.selectOption('select[name="category"]', 'administrative');
    await page.fill('input[name="amount"]', '1500');
    await page.fill('textarea[name="description"]', 'Office rent payment');
    await page.selectOption('select[name="account_id"]', 'acc_main');
    await page.fill('input[name="vendor"]', 'Property Management Co.');
    await page.fill('input[name="invoice_number"]', 'INV-2024-002');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Transaction created successfully')).toBeVisible();
  });

  test('should validate transaction form', async ({ page }) => {
    await page.click('text=Add Transaction');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Type is required')).toBeVisible();
    await expect(page.locator('text=Category is required')).toBeVisible();
    await expect(page.locator('text=Amount is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
    await expect(page.locator('text=Account is required')).toBeVisible();
  });

  test('should validate amount format', async ({ page }) => {
    await page.click('text=Add Transaction');
    
    await page.fill('input[name="amount"]', 'invalid-amount');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid amount format')).toBeVisible();
  });

  test('should validate minimum amount', async ({ page }) => {
    await page.click('text=Add Transaction');
    
    await page.fill('input[name="amount"]', '0');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
  });

  test('should edit transaction', async ({ page }) => {
    await page.route('**/api/financial/transactions/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            description: 'Updated donation description',
            amount: 5500
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('[data-testid="edit-transaction-1"]');
    
    await page.fill('textarea[name="description"]', 'Updated donation description');
    await page.fill('input[name="amount"]', '5500');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Transaction updated successfully')).toBeVisible();
  });

  test('should approve transaction', async ({ page }) => {
    await page.route('**/api/financial/transactions/2/approve', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          status: 'completed',
          approved_by: 'admin@test.com',
          approved_at: '2024-01-20T10:00:00Z'
        })
      });
    });

    await page.click('[data-testid="approve-transaction-2"]');
    await page.fill('textarea[name="approval_notes"]', 'Approved for emergency relief');
    await page.click('text=Approve');
    
    await expect(page.locator('text=Transaction approved successfully')).toBeVisible();
  });

  test('should reject transaction', async ({ page }) => {
    await page.route('**/api/financial/transactions/2/reject', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          status: 'rejected',
          rejected_by: 'admin@test.com',
          rejected_at: '2024-01-20T10:00:00Z'
        })
      });
    });

    await page.click('[data-testid="reject-transaction-2"]');
    await page.fill('textarea[name="rejection_reason"]', 'Insufficient documentation');
    await page.click('text=Reject');
    
    await expect(page.locator('text=Transaction rejected successfully')).toBeVisible();
  });

  test('should show account balances', async ({ page }) => {
    await expect(page.locator('text=Main Account: ₺85,000')).toBeVisible();
    await expect(page.locator('text=Program Account: ₺45,000')).toBeVisible();
    await expect(page.locator('text=Emergency Fund: ₺26,000')).toBeVisible();
  });

  test('should display category breakdown charts', async ({ page }) => {
    await expect(page.locator('[data-testid="income-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="expense-chart"]')).toBeVisible();
    await expect(page.locator('text=Donations: 76%')).toBeVisible();
    await expect(page.locator('text=Programs: 51%')).toBeVisible();
  });

  test('should export financial report', async ({ page }) => {
    await page.route('**/api/financial/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: 'mock-excel-data'
      });
    });

    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Export Report');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('financial-report');
  });

  test('should handle date range filtering', async ({ page }) => {
    await page.fill('input[name="start_date"]', '2024-01-15');
    await page.fill('input[name="end_date"]', '2024-01-16');
    await page.click('text=Apply Filter');
    
    // Should show filtered results
    await expect(page.locator('[data-testid="transaction-item"]')).toHaveCount(2);
  });

  test('should handle pagination', async ({ page }) => {
    await page.route('**/api/financial/transactions?page=2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '3',
              type: 'income',
              category: 'grant',
              amount: 8000,
              currency: 'TRY',
              description: 'Page 2 transaction',
              date: '2024-01-17T10:00:00Z',
              status: 'completed'
            }
          ],
          total: 3,
          page: 2,
          limit: 10
        })
      });
    });

    await page.click('text=Next');
    
    await expect(page.locator('text=Page 2 transaction')).toBeVisible();
  });

  test('should manage accounts', async ({ page }) => {
    await page.click('text=Manage Accounts');
    
    await expect(page.locator('[data-testid="accounts-modal"]')).toBeVisible();
    await expect(page.locator('text=Main Account')).toBeVisible();
    await expect(page.locator('text=Program Account')).toBeVisible();
    await expect(page.locator('text=Ziraat Bank')).toBeVisible();
    await expect(page.locator('text=****1234')).toBeVisible();
  });

  test('should create new account', async ({ page }) => {
    await page.route('**/api/financial/accounts', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'acc_new',
            name: 'New Account',
            type: 'savings',
            balance: 0,
            currency: 'TRY',
            bank_name: 'Garanti Bank',
            account_number: '****9999'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('text=Manage Accounts');
    await page.click('text=Add Account');
    
    await page.fill('input[name="name"]', 'New Account');
    await page.selectOption('select[name="type"]', 'savings');
    await page.fill('input[name="bank_name"]', 'Garanti Bank');
    await page.fill('input[name="account_number"]', '1234567890');
    await page.fill('input[name="initial_balance"]', '0');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Account created successfully')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/financial/transactions', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.reload();
    
    await expect(page.locator('text=Failed to load transactions')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Delay the API response to test loading state
    await page.route('**/api/financial/transactions', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.reload();
    
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should upload transaction attachments', async ({ page }) => {
    await page.click('text=Add Transaction');
    
    // Mock file upload
    await page.setInputFiles('input[type="file"]', {
      name: 'receipt.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mock pdf content')
    });
    
    await expect(page.locator('text=receipt.pdf')).toBeVisible();
  });

  test('should bulk approve transactions', async ({ page }) => {
    await page.route('**/api/financial/transactions/bulk-approve', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          approved_count: 2,
          message: 'Transactions approved successfully'
        })
      });
    });

    await page.check('[data-testid="select-transaction-1"]');
    await page.check('[data-testid="select-transaction-2"]');
    await page.click('text=Bulk Actions');
    await page.click('text=Approve Selected');
    await page.click('text=Confirm');
    
    await expect(page.locator('text=2 transactions approved successfully')).toBeVisible();
  });

  test('should show monthly growth indicators', async ({ page }) => {
    await expect(page.locator('text=+8.5%')).toBeVisible(); // Growth percentage
    await expect(page.locator('[data-testid="growth-indicator"]')).toHaveClass(/positive/);
  });
});