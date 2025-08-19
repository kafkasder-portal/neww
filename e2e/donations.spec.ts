import { test, expect } from '@playwright/test';

test.describe('Donations Management', () => {
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

    await page.route('**/api/donations', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              donor_name: 'John Doe',
              donor_email: 'john@example.com',
              donor_phone: '+905551234567',
              amount: 1000,
              currency: 'TRY',
              type: 'one_time',
              status: 'completed',
              payment_method: 'credit_card',
              campaign_id: 'camp1',
              campaign_name: 'Emergency Relief',
              created_at: '2024-01-15T10:00:00Z',
              completed_at: '2024-01-15T10:05:00Z'
            },
            {
              id: '2',
              donor_name: 'Jane Smith',
              donor_email: 'jane@example.com',
              amount: 500,
              currency: 'TRY',
              type: 'monthly',
              status: 'pending',
              payment_method: 'bank_transfer',
              campaign_id: 'camp2',
              campaign_name: 'Education Fund',
              created_at: '2024-01-16T14:30:00Z'
            }
          ],
          total: 2,
          page: 1,
          limit: 10
        })
      });
    });

    await page.route('**/api/donations/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_amount: 125000,
          total_donations: 245,
          monthly_recurring: 45,
          average_donation: 510,
          this_month: {
            amount: 15000,
            count: 32,
            growth: 12.5
          },
          top_campaigns: [
            { name: 'Emergency Relief', amount: 45000, count: 89 },
            { name: 'Education Fund', amount: 32000, count: 67 },
            { name: 'Healthcare Support', amount: 28000, count: 54 }
          ]
        })
      });
    });

    await page.route('**/api/campaigns', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'camp1',
              name: 'Emergency Relief',
              description: 'Emergency relief for disaster victims',
              target_amount: 100000,
              raised_amount: 45000,
              status: 'active',
              start_date: '2024-01-01',
              end_date: '2024-03-31'
            },
            {
              id: 'camp2',
              name: 'Education Fund',
              description: 'Supporting education for underprivileged children',
              target_amount: 75000,
              raised_amount: 32000,
              status: 'active',
              start_date: '2024-01-15',
              end_date: '2024-06-30'
            }
          ]
        })
      });
    });

    await page.goto('/donations');
  });

  test('should display donations dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Donations');
    await expect(page.locator('[data-testid="stats-card"]')).toHaveCount(4);
  });

  test('should show donation statistics', async ({ page }) => {
    await expect(page.locator('text=₺125,000')).toBeVisible(); // Total amount
    await expect(page.locator('text=245')).toBeVisible(); // Total donations
    await expect(page.locator('text=45')).toBeVisible(); // Monthly recurring
    await expect(page.locator('text=₺510')).toBeVisible(); // Average donation
  });

  test('should display donations list', async ({ page }) => {
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=₺1,000')).toBeVisible();
    await expect(page.locator('text=₺500')).toBeVisible();
    await expect(page.locator('[data-testid="donation-item"]')).toHaveCount(2);
  });

  test('should show donation status badges', async ({ page }) => {
    await expect(page.locator('[data-testid="status-completed"]')).toBeVisible();
    await expect(page.locator('[data-testid="status-pending"]')).toBeVisible();
  });

  test('should show payment method information', async ({ page }) => {
    await expect(page.locator('text=Credit Card')).toBeVisible();
    await expect(page.locator('text=Bank Transfer')).toBeVisible();
  });

  test('should filter donations by status', async ({ page }) => {
    await page.selectOption('select[name="status_filter"]', 'completed');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });

  test('should filter donations by payment method', async ({ page }) => {
    await page.selectOption('select[name="payment_method_filter"]', 'credit_card');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });

  test('should filter donations by type', async ({ page }) => {
    await page.selectOption('select[name="type_filter"]', 'monthly');
    
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('should search donations by donor name', async ({ page }) => {
    await page.fill('input[name="search"]', 'John');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });

  test('should search donations by email', async ({ page }) => {
    await page.fill('input[name="search"]', 'jane@example.com');
    
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('should open donation details modal', async ({ page }) => {
    await page.route('**/api/donations/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          donor_name: 'John Doe',
          donor_email: 'john@example.com',
          donor_phone: '+905551234567',
          amount: 1000,
          currency: 'TRY',
          type: 'one_time',
          status: 'completed',
          payment_method: 'credit_card',
          transaction_id: 'txn_123456',
          campaign_id: 'camp1',
          campaign_name: 'Emergency Relief',
          notes: 'Donation for earthquake victims',
          created_at: '2024-01-15T10:00:00Z',
          completed_at: '2024-01-15T10:05:00Z'
        })
      });
    });

    await page.click('[data-testid="view-donation-1"]');
    
    await expect(page.locator('[data-testid="donation-modal"]')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=john@example.com')).toBeVisible();
    await expect(page.locator('text=txn_123456')).toBeVisible();
    await expect(page.locator('text=Donation for earthquake victims')).toBeVisible();
  });

  test('should create new donation', async ({ page }) => {
    await page.route('**/api/donations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            donor_name: 'New Donor',
            donor_email: 'new@example.com',
            amount: 750,
            currency: 'TRY',
            type: 'one_time',
            status: 'pending',
            payment_method: 'credit_card',
            campaign_id: 'camp1'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('text=Add Donation');
    
    await expect(page.locator('[data-testid="donation-form-modal"]')).toBeVisible();
    
    await page.fill('input[name="donor_name"]', 'New Donor');
    await page.fill('input[name="donor_email"]', 'new@example.com');
    await page.fill('input[name="donor_phone"]', '+905559876543');
    await page.fill('input[name="amount"]', '750');
    await page.selectOption('select[name="campaign_id"]', 'camp1');
    await page.selectOption('select[name="payment_method"]', 'credit_card');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Donation created successfully')).toBeVisible();
  });

  test('should validate donation form', async ({ page }) => {
    await page.click('text=Add Donation');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Donor name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Amount is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('text=Add Donation');
    
    await page.fill('input[name="donor_email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should validate phone number format', async ({ page }) => {
    await page.click('text=Add Donation');
    
    await page.fill('input[name="donor_phone"]', 'invalid-phone');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid phone number format')).toBeVisible();
  });

  test('should validate minimum donation amount', async ({ page }) => {
    await page.click('text=Add Donation');
    
    await page.fill('input[name="amount"]', '5');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Minimum donation amount is ₺10')).toBeVisible();
  });

  test('should update donation status', async ({ page }) => {
    await page.route('**/api/donations/2/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          status: 'completed',
          completed_at: '2024-01-16T15:00:00Z'
        })
      });
    });

    await page.click('[data-testid="update-status-2"]');
    await page.selectOption('select[name="status"]', 'completed');
    await page.click('text=Update Status');
    
    await expect(page.locator('text=Status updated successfully')).toBeVisible();
  });

  test('should export donations data', async ({ page }) => {
    await page.route('**/api/donations/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: 'mock-excel-data'
      });
    });

    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Export');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('donations');
  });

  test('should show top campaigns', async ({ page }) => {
    await expect(page.locator('text=Emergency Relief')).toBeVisible();
    await expect(page.locator('text=₺45,000')).toBeVisible();
    await expect(page.locator('text=89 donations')).toBeVisible();
  });

  test('should handle date range filtering', async ({ page }) => {
    await page.fill('input[name="start_date"]', '2024-01-15');
    await page.fill('input[name="end_date"]', '2024-01-16');
    await page.click('text=Apply Filter');
    
    // Should show filtered results
    await expect(page.locator('[data-testid="donation-item"]')).toHaveCount(2);
  });

  test('should handle pagination', async ({ page }) => {
    await page.route('**/api/donations?page=2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '3',
              donor_name: 'Page 2 Donor',
              donor_email: 'page2@example.com',
              amount: 300,
              currency: 'TRY',
              type: 'one_time',
              status: 'completed',
              payment_method: 'bank_transfer',
              created_at: '2024-01-17T09:00:00Z'
            }
          ],
          total: 3,
          page: 2,
          limit: 10
        })
      });
    });

    await page.click('text=Next');
    
    await expect(page.locator('text=Page 2 Donor')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/donations', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.reload();
    
    await expect(page.locator('text=Failed to load donations')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Delay the API response to test loading state
    await page.route('**/api/donations', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.reload();
    
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should handle recurring donation setup', async ({ page }) => {
    await page.click('text=Add Donation');
    
    await page.selectOption('select[name="type"]', 'monthly');
    
    await expect(page.locator('text=Recurring Settings')).toBeVisible();
    await expect(page.locator('select[name="frequency"]')).toBeVisible();
    await expect(page.locator('input[name="start_date"]')).toBeVisible();
  });

  test('should cancel recurring donation', async ({ page }) => {
    await page.route('**/api/donations/2/cancel', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          status: 'cancelled',
          cancelled_at: '2024-01-16T16:00:00Z'
        })
      });
    });

    await page.click('[data-testid="cancel-recurring-2"]');
    await page.click('text=Confirm Cancellation');
    
    await expect(page.locator('text=Recurring donation cancelled')).toBeVisible();
  });
});