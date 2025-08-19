import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          email: 'test@example.com',
          full_name: 'Test User',
          role: 'admin'
        })
      });
    });

    // Mock dashboard stats
    await page.route('**/api/dashboard/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalMembers: 150,
          activeTasks: 25,
          upcomingMeetings: 5,
          pendingPayments: 12
        })
      });
    });

    await page.goto('/dashboard');
  });

  test('should display dashboard stats cards', async ({ page }) => {
    await expect(page.locator('text=Total Members')).toBeVisible();
    await expect(page.locator('text=150')).toBeVisible();
    
    await expect(page.locator('text=Active Tasks')).toBeVisible();
    await expect(page.locator('text=25')).toBeVisible();
    
    await expect(page.locator('text=Upcoming Meetings')).toBeVisible();
    await expect(page.locator('text=5')).toBeVisible();
    
    await expect(page.locator('text=Pending Payments')).toBeVisible();
    await expect(page.locator('text=12')).toBeVisible();
  });

  test('should display navigation sidebar', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Members')).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
    await expect(page.locator('text=Meetings')).toBeVisible();
    await expect(page.locator('text=Messages')).toBeVisible();
  });

  test('should navigate to members page', async ({ page }) => {
    await page.click('text=Members');
    await expect(page).toHaveURL(/.*members/);
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.click('text=Tasks');
    await expect(page).toHaveURL(/.*tasks/);
  });

  test('should navigate to meetings page', async ({ page }) => {
    await page.click('text=Meetings');
    await expect(page).toHaveURL(/.*meetings/);
  });

  test('should navigate to messages page', async ({ page }) => {
    await page.click('text=Messages');
    await expect(page).toHaveURL(/.*messages/);
  });

  test('should display user profile in header', async ({ page }) => {
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should show logout option in user menu', async ({ page }) => {
    // Click on user profile/avatar
    await page.click('[data-testid="user-menu"]');
    
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    // Mock logout request
    await page.route('**/api/auth/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu toggle is visible
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    // Stats cards should stack vertically on mobile
    const statsCards = page.locator('[data-testid="stats-card"]');
    await expect(statsCards).toHaveCount(4);
  });

  test('should display recent activities', async ({ page }) => {
    // Mock recent activities
    await page.route('**/api/dashboard/activities', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            type: 'task_created',
            message: 'New task created: Website Update',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'meeting_scheduled',
            message: 'Meeting scheduled for tomorrow',
            timestamp: new Date().toISOString()
          }
        ])
      });
    });

    await page.reload();
    
    await expect(page.locator('text=Recent Activities')).toBeVisible();
    await expect(page.locator('text=New task created: Website Update')).toBeVisible();
    await expect(page.locator('text=Meeting scheduled for tomorrow')).toBeVisible();
  });
});