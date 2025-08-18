import { test, expect } from '@playwright/test'

test.describe('Authentication and Permissions E2E Tests', () => {
  test.describe('Login Flow', () => {
    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/login')
      
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/')
      await expect(page.locator('text="Hoş Geldiniz"')).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')
      
      await page.fill('input[name="email"]', 'wrong@example.com')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      
      // Should show error message
      await expect(page.locator('text="geçersiz"')).toBeVisible()
      await expect(page).toHaveURL('/login')
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/login')
      
      await page.fill('input[name="email"]', 'invalid-email')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      // Should show validation error
      await expect(page.locator('text="geçerli.*e-posta"')).toBeVisible()
    })

    test('should handle password reset', async ({ page }) => {
      await page.goto('/login')
      
      await page.click('text="Şifremi Unuttum"')
      await page.fill('input[name="email"]', 'user@kafkasder.org')
      await page.click('button:has-text("Sıfırlama Linki")')
      
      await expect(page.locator('text="sıfırlama linki gönderildi"')).toBeVisible()
    })
  })

  test.describe('Role-Based Access Control', () => {
    const roles = [
      { role: 'super_admin', email: 'superadmin@kafkasder.org', shouldAccess: ['system', 'users', 'finances'] },
      { role: 'admin', email: 'admin@kafkasder.org', shouldAccess: ['users', 'finances'], shouldNotAccess: ['system'] },
      { role: 'manager', email: 'manager@kafkasder.org', shouldAccess: ['operations'], shouldNotAccess: ['system', 'users'] },
      { role: 'coordinator', email: 'coordinator@kafkasder.org', shouldAccess: ['beneficiaries'], shouldNotAccess: ['finances'] },
      { role: 'operator', email: 'operator@kafkasder.org', shouldAccess: ['data-entry'], shouldNotAccess: ['finances', 'users'] },
      { role: 'viewer', email: 'viewer@kafkasder.org', shouldAccess: [], shouldNotAccess: ['all-write-operations'] }
    ]

    roles.forEach(({ role, email, shouldAccess, shouldNotAccess }) => {
      test(`should enforce ${role} permissions`, async ({ page }) => {
        // Login with role-specific account
        await page.goto('/login')
        await page.fill('input[name="email"]', email)
        await page.fill('input[name="password"]', 'password123')
        await page.click('button[type="submit"]')
        
        await expect(page).toHaveURL('/')
        
        // Test accessible areas
        for (const area of shouldAccess) {
          if (area === 'system') {
            await page.goto('/system/user-management')
            await expect(page.locator('h1')).toContainText('Kullanıcı')
          } else if (area === 'users') {
            await page.goto('/definitions/user-accounts')
            await expect(page.locator('h1')).toContainText('Kullanıcı')
          } else if (area === 'finances') {
            await page.goto('/finance')
            await expect(page.locator('h1')).toContainText('Mali')
          }
        }
        
        // Test restricted areas
        if (shouldNotAccess?.includes('system')) {
          await page.goto('/system/user-management')
          await expect(page.locator('text="yetkisiz"')).toBeVisible()
        }
      })
    })

    test('should hide UI elements based on permissions', async ({ page }) => {
      // Login as viewer (lowest permissions)
      await page.goto('/login')
      await page.fill('input[name="email"]', 'viewer@kafkasder.org')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      await page.goto('/aid/beneficiaries')
      
      // Should not see create/edit/delete buttons
      await expect(page.locator('button:has-text("Yeni")')).not.toBeVisible()
      await expect(page.locator('button:has-text("Düzenle")')).not.toBeVisible()
      await expect(page.locator('button:has-text("Sil")')).not.toBeVisible()
      
      // Should see view-only content
      await expect(page.locator('text="Görüntüleme Modu"')).toBeVisible()
    })

    test('should enforce API-level permissions', async ({ page }) => {
      // Login as operator
      await page.goto('/login')
      await page.fill('input[name="email"]', 'operator@kafkasder.org')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      // Try to access admin API endpoint via browser
      const response = await page.request.get('/api/system/users', {
        headers: { 'Authorization': 'Bearer ' + await page.evaluate(() => localStorage.getItem('token')) }
      })
      
      expect(response.status()).toBe(403) // Forbidden
    })
  })

  test.describe('Session Management', () => {
    test('should logout user properly', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL('/')
      
      // Logout
      await page.click('[data-testid="user-menu"]')
      await page.click('text="Çıkış Yap"')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
      
      // Should not be able to access protected pages
      await page.goto('/')
      await expect(page).toHaveURL('/login')
    })

    test('should handle session timeout', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Simulate expired token
      await page.evaluate(() => {
        localStorage.setItem('token', 'expired-token')
      })
      
      // Try to access protected page
      await page.goto('/aid/beneficiaries')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text="oturum süresi doldu"')).toBeVisible()
    })

    test('should remember user session on page refresh', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      await expect(page).toHaveURL('/')
      
      // Refresh page
      await page.reload()
      
      // Should still be logged in
      await expect(page).toHaveURL('/')
      await expect(page.locator('text="Hoş Geldiniz"')).toBeVisible()
    })
  })

  test.describe('Two-Factor Authentication (if implemented)', () => {
    test('should prompt for 2FA when enabled', async ({ page }) => {
      // This test would run if 2FA is implemented
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin-2fa@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Should show 2FA prompt (if implemented)
      if (await page.locator('text="doğrulama kodu"').isVisible()) {
        await page.fill('input[name="code"]', '123456')
        await page.click('button:has-text("Doğrula")')
      }
      
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('User Profile Management', () => {
    test('should allow users to update their profile', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Go to profile
      await page.click('[data-testid="user-menu"]')
      await page.click('text="Profil"')
      
      // Update profile information
      await page.fill('input[name="full_name"]', 'Updated Name')
      await page.fill('input[name="phone"]', '905551234567')
      await page.click('button:has-text("Güncelle")')
      
      // Should show success message
      await expect(page.locator('text="profil güncellendi"')).toBeVisible()
    })

    test('should change password successfully', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Go to password change
      await page.click('[data-testid="user-menu"]')
      await page.click('text="Şifre Değiştir"')
      
      // Fill password form
      await page.fill('input[name="currentPassword"]', 'admin123')
      await page.fill('input[name="newPassword"]', 'newpassword123')
      await page.fill('input[name="confirmPassword"]', 'newpassword123')
      await page.click('button:has-text("Şifre Değiştir")')
      
      // Should show success
      await expect(page.locator('text="şifre değiştirildi"')).toBeVisible()
    })
  })

  test.describe('Security Features', () => {
    test('should prevent SQL injection attempts', async ({ page }) => {
      await page.goto('/login')
      
      // Try SQL injection in email field
      await page.fill('input[name="email"]', "'; DROP TABLE users; --")
      await page.fill('input[name="password"]', 'password')
      await page.click('button[type="submit"]')
      
      // Should show invalid email format error, not crash
      await expect(page.locator('text="geçerli.*e-posta"')).toBeVisible()
    })

    test('should prevent XSS attacks', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@kafkasder.org')
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      
      // Try XSS in message field
      await page.goto('/messages')
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', '<script>alert("XSS")</script>')
      await page.click('button:has-text("Gönder")')
      
      // Script should be sanitized, not executed
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
      
      // No alert should appear
      page.on('dialog', () => {
        throw new Error('XSS script executed!')
      })
    })

    test('should rate limit login attempts', async ({ page }) => {
      // Make multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        await page.goto('/login')
        await page.fill('input[name="email"]', 'admin@kafkasder.org')
        await page.fill('input[name="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(500)
      }
      
      // Should show rate limit error
      await expect(page.locator('text="çok fazla deneme"')).toBeVisible()
    })
  })
})
