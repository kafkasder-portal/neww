import { test, expect } from '@playwright/test';

test.describe('Members Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin'
        })
      });
    });

    // Mock members list
    await page.route('**/api/members', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              full_name: 'John Doe',
              email: 'john@example.com',
              phone: '+90 555 123 4567',
              membership_type: 'active',
              join_date: '2024-01-15',
              status: 'active'
            },
            {
              id: '2',
              full_name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+90 555 987 6543',
              membership_type: 'premium',
              join_date: '2024-02-20',
              status: 'active'
            }
          ],
          total: 2,
          page: 1,
          limit: 10
        })
      });
    });

    await page.goto('/members');
  });

  test('should display members list', async ({ page }) => {
    await expect(page.locator('text=Members')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=jane@example.com')).toBeVisible();
    await expect(page.locator('text=+90 555 123 4567')).toBeVisible();
  });

  test('should display add member button', async ({ page }) => {
    await expect(page.locator('button:has-text("Add Member")')).toBeVisible();
  });

  test('should open add member modal', async ({ page }) => {
    await page.click('button:has-text("Add Member")');
    
    await expect(page.locator('text=Add New Member')).toBeVisible();
    await expect(page.locator('input[name="full_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('should validate add member form', async ({ page }) => {
    await page.click('button:has-text("Add Member")');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should add new member successfully', async ({ page }) => {
    // Mock add member request
    await page.route('**/api/members', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            full_name: 'New Member',
            email: 'new@example.com',
            phone: '+90 555 111 2222',
            membership_type: 'active',
            join_date: new Date().toISOString().split('T')[0],
            status: 'active'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('button:has-text("Add Member")');
    
    await page.fill('input[name="full_name"]', 'New Member');
    await page.fill('input[name="email"]', 'new@example.com');
    await page.fill('input[name="phone"]', '+90 555 111 2222');
    await page.selectOption('select[name="membership_type"]', 'active');
    
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Member added successfully')).toBeVisible();
  });

  test('should search members', async ({ page }) => {
    // Mock search request
    await page.route('**/api/members?search=john', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              full_name: 'John Doe',
              email: 'john@example.com',
              phone: '+90 555 123 4567',
              membership_type: 'active',
              join_date: '2024-01-15',
              status: 'active'
            }
          ],
          total: 1,
          page: 1,
          limit: 10
        })
      });
    });

    await page.fill('input[placeholder="Search members..."]', 'john');
    await page.press('input[placeholder="Search members..."]', 'Enter');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });

  test('should filter members by status', async ({ page }) => {
    await page.selectOption('select[name="status_filter"]', 'active');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
  });

  test('should edit member', async ({ page }) => {
    // Mock update member request
    await page.route('**/api/members/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            full_name: 'John Updated',
            email: 'john.updated@example.com',
            phone: '+90 555 123 4567',
            membership_type: 'premium',
            join_date: '2024-01-15',
            status: 'active'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('[data-testid="edit-member-1"]');
    
    await expect(page.locator('text=Edit Member')).toBeVisible();
    
    await page.fill('input[name="full_name"]', 'John Updated');
    await page.fill('input[name="email"]', 'john.updated@example.com');
    await page.selectOption('select[name="membership_type"]', 'premium');
    
    await page.click('button:has-text("Update")');
    
    await expect(page.locator('text=Member updated successfully')).toBeVisible();
  });

  test('should delete member', async ({ page }) => {
    // Mock delete member request
    await page.route('**/api/members/1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    await page.click('[data-testid="delete-member-1"]');
    
    await expect(page.locator('text=Are you sure you want to delete this member?')).toBeVisible();
    
    await page.click('button:has-text("Delete")');
    
    await expect(page.locator('text=Member deleted successfully')).toBeVisible();
  });

  test('should export members list', async ({ page }) => {
    // Mock export request
    await page.route('**/api/members/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('mock excel data')
      });
    });

    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export")');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('members');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile layout is applied
    await expect(page.locator('[data-testid="mobile-members-list"]')).toBeVisible();
    
    // Add member button should be visible
    await expect(page.locator('button:has-text("Add Member")')).toBeVisible();
  });
});