import { test, expect } from '@playwright/test';

test.describe('Beneficiaries Management', () => {
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

    await page.route('**/api/beneficiaries', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              first_name: 'Ahmet',
              last_name: 'Yılmaz',
              email: 'ahmet@example.com',
              phone: '+905551234567',
              national_id: '12345678901',
              birth_date: '1985-05-15',
              gender: 'male',
              marital_status: 'married',
              address: {
                street: 'Atatürk Caddesi No:123',
                district: 'Çankaya',
                city: 'Ankara',
                postal_code: '06100',
                country: 'Turkey'
              },
              emergency_contact: {
                name: 'Fatma Yılmaz',
                phone: '+905559876543',
                relationship: 'spouse'
              },
              status: 'active',
              registration_date: '2024-01-15T10:00:00Z',
              last_contact: '2024-01-20T14:30:00Z',
              notes: 'Earthquake victim, needs temporary housing',
              tags: ['earthquake', 'housing', 'urgent'],
              case_worker: 'Mehmet Demir',
              priority_level: 'high'
            },
            {
              id: '2',
              first_name: 'Ayşe',
              last_name: 'Kaya',
              email: 'ayse@example.com',
              phone: '+905557654321',
              national_id: '98765432109',
              birth_date: '1990-08-22',
              gender: 'female',
              marital_status: 'single',
              address: {
                street: 'İnönü Sokak No:45',
                district: 'Kadıköy',
                city: 'Istanbul',
                postal_code: '34710',
                country: 'Turkey'
              },
              status: 'pending',
              registration_date: '2024-01-18T09:15:00Z',
              notes: 'Single mother, needs financial assistance',
              tags: ['single-parent', 'financial-aid'],
              case_worker: 'Zeynep Özkan',
              priority_level: 'medium'
            }
          ],
          total: 2,
          page: 1,
          limit: 10
        })
      });
    });

    await page.route('**/api/beneficiaries/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_beneficiaries: 1247,
          active_cases: 892,
          pending_applications: 156,
          completed_cases: 199,
          priority_breakdown: {
            high: 89,
            medium: 456,
            low: 347
          },
          monthly_registrations: {
            current: 45,
            previous: 38,
            growth: 18.4
          },
          top_categories: [
            { name: 'Housing', count: 234 },
            { name: 'Financial Aid', count: 189 },
            { name: 'Healthcare', count: 156 },
            { name: 'Education', count: 123 }
          ]
        })
      });
    });

    await page.goto('/beneficiaries');
  });

  test('should display beneficiaries dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Beneficiaries');
    await expect(page.locator('[data-testid="stats-card"]')).toHaveCount(4);
  });

  test('should show beneficiary statistics', async ({ page }) => {
    await expect(page.locator('text=1,247')).toBeVisible(); // Total beneficiaries
    await expect(page.locator('text=892')).toBeVisible(); // Active cases
    await expect(page.locator('text=156')).toBeVisible(); // Pending applications
    await expect(page.locator('text=199')).toBeVisible(); // Completed cases
  });

  test('should display beneficiaries list', async ({ page }) => {
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).toBeVisible();
    await expect(page.locator('text=ahmet@example.com')).toBeVisible();
    await expect(page.locator('text=ayse@example.com')).toBeVisible();
    await expect(page.locator('[data-testid="beneficiary-item"]')).toHaveCount(2);
  });

  test('should show status badges', async ({ page }) => {
    await expect(page.locator('[data-testid="status-active"]')).toBeVisible();
    await expect(page.locator('[data-testid="status-pending"]')).toBeVisible();
  });

  test('should show priority levels', async ({ page }) => {
    await expect(page.locator('[data-testid="priority-high"]')).toBeVisible();
    await expect(page.locator('[data-testid="priority-medium"]')).toBeVisible();
  });

  test('should filter beneficiaries by status', async ({ page }) => {
    await page.selectOption('select[name="status_filter"]', 'active');
    
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).not.toBeVisible();
  });

  test('should filter beneficiaries by priority', async ({ page }) => {
    await page.selectOption('select[name="priority_filter"]', 'high');
    
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).not.toBeVisible();
  });

  test('should search beneficiaries by name', async ({ page }) => {
    await page.fill('input[name="search"]', 'Ahmet');
    
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).not.toBeVisible();
  });

  test('should search beneficiaries by email', async ({ page }) => {
    await page.fill('input[name="search"]', 'ayse@example.com');
    
    await expect(page.locator('text=Ayşe Kaya')).toBeVisible();
    await expect(page.locator('text=Ahmet Yılmaz')).not.toBeVisible();
  });

  test('should search beneficiaries by national ID', async ({ page }) => {
    await page.fill('input[name="search"]', '12345678901');
    
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).not.toBeVisible();
  });

  test('should open beneficiary details modal', async ({ page }) => {
    await page.route('**/api/beneficiaries/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          email: 'ahmet@example.com',
          phone: '+905551234567',
          national_id: '12345678901',
          birth_date: '1985-05-15',
          gender: 'male',
          marital_status: 'married',
          address: {
            street: 'Atatürk Caddesi No:123',
            district: 'Çankaya',
            city: 'Ankara',
            postal_code: '06100',
            country: 'Turkey'
          },
          emergency_contact: {
            name: 'Fatma Yılmaz',
            phone: '+905559876543',
            relationship: 'spouse'
          },
          status: 'active',
          registration_date: '2024-01-15T10:00:00Z',
          last_contact: '2024-01-20T14:30:00Z',
          notes: 'Earthquake victim, needs temporary housing',
          tags: ['earthquake', 'housing', 'urgent'],
          case_worker: 'Mehmet Demir',
          priority_level: 'high',
          assistance_history: [
            {
              date: '2024-01-15',
              type: 'Emergency Housing',
              amount: 5000,
              status: 'completed',
              notes: 'Temporary accommodation provided'
            },
            {
              date: '2024-01-18',
              type: 'Food Package',
              status: 'delivered',
              notes: 'Monthly food package delivered'
            }
          ]
        })
      });
    });

    await page.click('[data-testid="view-beneficiary-1"]');
    
    await expect(page.locator('[data-testid="beneficiary-modal"]')).toBeVisible();
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=ahmet@example.com')).toBeVisible();
    await expect(page.locator('text=12345678901')).toBeVisible();
    await expect(page.locator('text=Atatürk Caddesi No:123')).toBeVisible();
    await expect(page.locator('text=Fatma Yılmaz')).toBeVisible();
    await expect(page.locator('text=Emergency Housing')).toBeVisible();
  });

  test('should create new beneficiary', async ({ page }) => {
    await page.route('**/api/beneficiaries', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            first_name: 'Mehmet',
            last_name: 'Özkan',
            email: 'mehmet@example.com',
            phone: '+905558765432',
            national_id: '11223344556',
            status: 'pending'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('text=Add Beneficiary');
    
    await expect(page.locator('[data-testid="beneficiary-form-modal"]')).toBeVisible();
    
    // Fill personal information
    await page.fill('input[name="first_name"]', 'Mehmet');
    await page.fill('input[name="last_name"]', 'Özkan');
    await page.fill('input[name="email"]', 'mehmet@example.com');
    await page.fill('input[name="phone"]', '+905558765432');
    await page.fill('input[name="national_id"]', '11223344556');
    await page.fill('input[name="birth_date"]', '1988-03-10');
    await page.selectOption('select[name="gender"]', 'male');
    await page.selectOption('select[name="marital_status"]', 'single');
    
    // Fill address information
    await page.fill('input[name="address.street"]', 'Cumhuriyet Caddesi No:67');
    await page.fill('input[name="address.district"]', 'Beşiktaş');
    await page.fill('input[name="address.city"]', 'Istanbul');
    await page.fill('input[name="address.postal_code"]', '34349');
    
    // Fill emergency contact
    await page.fill('input[name="emergency_contact.name"]', 'Ali Özkan');
    await page.fill('input[name="emergency_contact.phone"]', '+905554321098');
    await page.selectOption('select[name="emergency_contact.relationship"]', 'brother');
    
    await page.fill('textarea[name="notes"]', 'Needs job placement assistance');
    await page.selectOption('select[name="priority_level"]', 'medium');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Beneficiary created successfully')).toBeVisible();
  });

  test('should validate beneficiary form', async ({ page }) => {
    await page.click('text=Add Beneficiary');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Phone is required')).toBeVisible();
    await expect(page.locator('text=National ID is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('text=Add Beneficiary');
    
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should validate phone number format', async ({ page }) => {
    await page.click('text=Add Beneficiary');
    
    await page.fill('input[name="phone"]', 'invalid-phone');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid phone number format')).toBeVisible();
  });

  test('should validate national ID format', async ({ page }) => {
    await page.click('text=Add Beneficiary');
    
    await page.fill('input[name="national_id"]', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=National ID must be 11 digits')).toBeVisible();
  });

  test('should edit beneficiary information', async ({ page }) => {
    await page.route('**/api/beneficiaries/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            first_name: 'Ahmet Updated',
            last_name: 'Yılmaz',
            email: 'ahmet.updated@example.com'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('[data-testid="edit-beneficiary-1"]');
    
    await page.fill('input[name="first_name"]', 'Ahmet Updated');
    await page.fill('input[name="email"]', 'ahmet.updated@example.com');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Beneficiary updated successfully')).toBeVisible();
  });

  test('should update beneficiary status', async ({ page }) => {
    await page.route('**/api/beneficiaries/2/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          status: 'active',
          updated_at: '2024-01-20T10:00:00Z'
        })
      });
    });

    await page.click('[data-testid="update-status-2"]');
    await page.selectOption('select[name="status"]', 'active');
    await page.click('text=Update Status');
    
    await expect(page.locator('text=Status updated successfully')).toBeVisible();
  });

  test('should assign case worker', async ({ page }) => {
    await page.route('**/api/beneficiaries/2/assign-worker', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          case_worker: 'Ahmet Kaya',
          assigned_at: '2024-01-20T11:00:00Z'
        })
      });
    });

    await page.click('[data-testid="assign-worker-2"]');
    await page.selectOption('select[name="case_worker"]', 'Ahmet Kaya');
    await page.click('text=Assign Worker');
    
    await expect(page.locator('text=Case worker assigned successfully')).toBeVisible();
  });

  test('should add assistance record', async ({ page }) => {
    await page.route('**/api/beneficiaries/1/assistance', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'assist_1',
          beneficiary_id: '1',
          type: 'Financial Aid',
          amount: 2000,
          status: 'approved',
          date: '2024-01-20T12:00:00Z'
        })
      });
    });

    await page.click('[data-testid="add-assistance-1"]');
    
    await page.selectOption('select[name="type"]', 'Financial Aid');
    await page.fill('input[name="amount"]', '2000');
    await page.fill('textarea[name="notes"]', 'Emergency financial assistance');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Assistance record added successfully')).toBeVisible();
  });

  test('should export beneficiaries data', async ({ page }) => {
    await page.route('**/api/beneficiaries/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: 'mock-excel-data'
      });
    });

    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Export');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('beneficiaries');
  });

  test('should show priority breakdown', async ({ page }) => {
    await expect(page.locator('text=High Priority: 89')).toBeVisible();
    await expect(page.locator('text=Medium Priority: 456')).toBeVisible();
    await expect(page.locator('text=Low Priority: 347')).toBeVisible();
  });

  test('should show top categories', async ({ page }) => {
    await expect(page.locator('text=Housing: 234')).toBeVisible();
    await expect(page.locator('text=Financial Aid: 189')).toBeVisible();
    await expect(page.locator('text=Healthcare: 156')).toBeVisible();
    await expect(page.locator('text=Education: 123')).toBeVisible();
  });

  test('should handle date range filtering', async ({ page }) => {
    await page.fill('input[name="start_date"]', '2024-01-15');
    await page.fill('input[name="end_date"]', '2024-01-20');
    await page.click('text=Apply Filter');
    
    // Should show filtered results
    await expect(page.locator('[data-testid="beneficiary-item"]')).toHaveCount(2);
  });

  test('should handle pagination', async ({ page }) => {
    await page.route('**/api/beneficiaries?page=2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '3',
              first_name: 'Page 2',
              last_name: 'Beneficiary',
              email: 'page2@example.com',
              phone: '+905551111111',
              status: 'active',
              registration_date: '2024-01-19T10:00:00Z'
            }
          ],
          total: 3,
          page: 2,
          limit: 10
        })
      });
    });

    await page.click('text=Next');
    
    await expect(page.locator('text=Page 2 Beneficiary')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/beneficiaries', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.reload();
    
    await expect(page.locator('text=Failed to load beneficiaries')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Delay the API response to test loading state
    await page.route('**/api/beneficiaries', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.reload();
    
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should filter by tags', async ({ page }) => {
    await page.click('[data-testid="tag-filter"]');
    await page.click('text=earthquake');
    
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
    await expect(page.locator('text=Ayşe Kaya')).not.toBeVisible();
  });

  test('should bulk update status', async ({ page }) => {
    await page.route('**/api/beneficiaries/bulk-update', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          updated_count: 2,
          message: 'Beneficiaries updated successfully'
        })
      });
    });

    await page.check('[data-testid="select-beneficiary-1"]');
    await page.check('[data-testid="select-beneficiary-2"]');
    await page.click('text=Bulk Actions');
    await page.click('text=Update Status');
    await page.selectOption('select[name="bulk_status"]', 'active');
    await page.click('text=Apply');
    
    await expect(page.locator('text=2 beneficiaries updated successfully')).toBeVisible();
  });
});