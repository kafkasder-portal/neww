import { test, expect } from '@playwright/test'

test.describe('Communications Module E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@kafkasder.org')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test.describe('SMS Functionality', () => {
    test('should send single SMS message', async ({ page }) => {
      // Navigate to messages
      await page.goto('/messages')
      
      // Wait for page to load
      await expect(page.locator('h1')).toContainText('Mesajlar')
      
      // Click SMS tab or button
      await page.click('text="SMS Gönderimi"')
      
      // Fill SMS form
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test SMS mesajı')
      
      // Send SMS
      await page.click('button:has-text("Gönder")')
      
      // Verify success message
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })

    test('should send bulk SMS messages', async ({ page }) => {
      await page.goto('/messages/bulk-send')
      
      // Switch to SMS mode
      await page.click('text="SMS"')
      
      // Add multiple recipients
      await page.fill('textarea[placeholder*="alıcı"]', '905551234567\n905557654321')
      await page.fill('textarea[placeholder*="mesaj"]', 'Toplu SMS testi')
      
      // Send bulk SMS
      await page.click('button:has-text("Toplu Gönder")')
      
      // Verify bulk send success
      await expect(page.locator('text="2 alıcıya gönderildi"')).toBeVisible()
    })

    test('should use SMS templates', async ({ page }) => {
      await page.goto('/messages/templates')
      
      // Create new SMS template
      await page.click('button:has-text("Yeni Şablon")')
      await page.selectOption('select[name="type"]', 'sms')
      await page.fill('input[name="name"]', 'Test SMS Şablonu')
      await page.fill('textarea[name="content"]', 'Merhaba {{name}}, bu bir test mesajıdır.')
      
      // Save template
      await page.click('button:has-text("Kaydet")')
      
      // Verify template created
      await expect(page.locator('text="Test SMS Şablonu"')).toBeVisible()
    })

    test('should view SMS delivery reports', async ({ page }) => {
      await page.goto('/messages/sms-deliveries')
      
      // Check delivery statistics
      await expect(page.locator('text="Gönderilen SMS"')).toBeVisible()
      await expect(page.locator('text="Teslim Edilen"')).toBeVisible()
      await expect(page.locator('text="Başarısız"')).toBeVisible()
      
      // Filter by date range
      await page.fill('input[type="date"]:first-of-type', '2024-01-01')
      await page.fill('input[type="date"]:last-of-type', '2024-12-31')
      await page.click('button:has-text("Filtrele")')
      
      // Verify filtered results
      await expect(page.locator('.sms-logs-table')).toBeVisible()
    })
  })

  test.describe('Email Functionality', () => {
    test('should send single email', async ({ page }) => {
      await page.goto('/messages')
      
      // Click Email tab
      await page.click('text="E-posta Gönderimi"')
      
      // Fill email form
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[placeholder*="konu"]', 'Test E-posta Konusu')
      await page.fill('textarea[placeholder*="içerik"]', 'Test e-posta içeriği')
      
      // Send email
      await page.click('button:has-text("E-posta Gönder")')
      
      // Verify success
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })

    test('should send HTML email', async ({ page }) => {
      await page.goto('/messages')
      await page.click('text="E-posta Gönderimi"')
      
      // Switch to HTML mode
      await page.click('text="HTML Modu"')
      
      // Fill form
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[placeholder*="konu"]', 'HTML Test')
      await page.fill('textarea[placeholder*="HTML"]', '<h1>Test HTML Content</h1>')
      
      // Send
      await page.click('button:has-text("E-posta Gönder")')
      
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })

    test('should manage email templates', async ({ page }) => {
      await page.goto('/messages/templates')
      
      // Create email template
      await page.click('button:has-text("Yeni Şablon")')
      await page.selectOption('select[name="type"]', 'email')
      await page.fill('input[name="name"]', 'Test E-posta Şablonu')
      await page.fill('input[name="subject"]', 'Test Konu: {{name}}')
      await page.fill('textarea[name="content"]', 'Merhaba {{name}}, bu bir test e-postasıdır.')
      
      // Add variables
      await page.fill('input[placeholder*="değişken"]', 'name')
      await page.click('button:has-text("Değişken Ekle")')
      
      // Save
      await page.click('button:has-text("Kaydet")')
      
      await expect(page.locator('text="Test E-posta Şablonu"')).toBeVisible()
    })
  })

  test.describe('WhatsApp Functionality', () => {
    test('should check WhatsApp connection status', async ({ page }) => {
      await page.goto('/messages')
      
      // Open WhatsApp tab
      await page.click('text="WhatsApp"')
      
      // Check connection status
      await expect(page.locator('text="Bağlantı Durumu"')).toBeVisible()
      await expect(page.locator('[data-testid="whatsapp-status"]')).toBeVisible()
    })

    test('should send WhatsApp message', async ({ page }) => {
      await page.goto('/messages')
      await page.click('text="WhatsApp"')
      
      // Fill WhatsApp form
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test WhatsApp mesajı 📱')
      
      // Send
      await page.click('button:has-text("WhatsApp Gönder")')
      
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })

    test('should send WhatsApp with media', async ({ page }) => {
      await page.goto('/messages')
      await page.click('text="WhatsApp"')
      
      // Enable media mode
      await page.click('text="Medya Ekle"')
      
      // Fill form
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test mesajı')
      await page.fill('input[placeholder*="medya URL"]', 'https://example.com/image.jpg')
      await page.selectOption('select[name="mediaType"]', 'image')
      
      // Send
      await page.click('button:has-text("Medya ile Gönder")')
      
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })
  })

  test.describe('Analytics and Reporting', () => {
    test('should display communication analytics', async ({ page }) => {
      await page.goto('/messages/analytics')
      
      // Check analytics cards
      await expect(page.locator('text="Toplam SMS"')).toBeVisible()
      await expect(page.locator('text="Toplam E-posta"')).toBeVisible()
      await expect(page.locator('text="WhatsApp Mesajları"')).toBeVisible()
      
      // Check charts
      await expect(page.locator('[data-testid="communication-chart"]')).toBeVisible()
      
      // Filter by date range
      await page.fill('input[name="startDate"]', '2024-01-01')
      await page.fill('input[name="endDate"]', '2024-12-31')
      await page.click('button:has-text("Filtrele")')
      
      // Verify chart updates
      await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible()
    })

    test('should export communication reports', async ({ page }) => {
      await page.goto('/messages/analytics')
      
      // Click export button
      const downloadPromise = page.waitForEvent('download')
      await page.click('button:has-text("Rapor İndir")')
      const download = await downloadPromise
      
      // Verify download
      expect(download.suggestedFilename()).toMatch(/communication.*report.*\.(xlsx|pdf)$/)
    })
  })

  test.describe('Integration Workflows', () => {
    test('should send multi-channel notification', async ({ page }) => {
      await page.goto('/messages/bulk-send')
      
      // Enable multi-channel mode
      await page.check('input[name="enableSMS"]')
      await page.check('input[name="enableEmail"]')
      await page.check('input[name="enableWhatsApp"]')
      
      // Fill recipient data
      await page.fill('textarea[name="phoneNumbers"]', '905551234567')
      await page.fill('textarea[name="emails"]', 'test@example.com')
      
      // Fill message content
      await page.fill('input[name="subject"]', 'Çok Kanallı Test')
      await page.fill('textarea[name="message"]', 'Bu mesaj SMS, E-posta ve WhatsApp ile gönderilmektedir.')
      
      // Send to all channels
      await page.click('button:has-text("Tüm Kanallara Gönder")')
      
      // Verify multi-channel success
      await expect(page.locator('text="3 kanal üzerinden gönderildi"')).toBeVisible()
    })

    test('should handle communication preferences', async ({ page }) => {
      await page.goto('/messages/bulk-send')
      
      // Import recipient list with preferences
      await page.click('button:has-text("Liste İçe Aktar")')
      
      // Upload CSV with communication preferences
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles('test-recipients.csv')
      
      // Map columns
      await page.selectOption('select[name="phoneColumn"]', 'telefon')
      await page.selectOption('select[name="emailColumn"]', 'eposta')
      await page.selectOption('select[name="preferenceColumn"]', 'tercih')
      
      // Import
      await page.click('button:has-text("İçe Aktar")')
      
      // Verify preference-based filtering
      await expect(page.locator('text="Tercihler uygulandı"')).toBeVisible()
    })
  })

  test.describe('Error Scenarios', () => {
    test('should handle network failures gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/sms/send', route => route.abort())
      
      await page.goto('/messages')
      await page.click('text="SMS Gönderimi"')
      
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test mesajı')
      
      await page.click('button:has-text("Gönder")')
      
      // Should show error message
      await expect(page.locator('text="ağ hatası"')).toBeVisible()
    })

    test('should validate input fields', async ({ page }) => {
      await page.goto('/messages')
      
      // Try to send without phone number
      await page.click('button:has-text("Gönder")')
      
      // Should show validation errors
      await expect(page.locator('text="telefon numarası gerekli"')).toBeVisible()
      
      // Try invalid phone number
      await page.fill('input[placeholder*="telefon"]', '123')
      await page.click('button:has-text("Gönder")')
      
      await expect(page.locator('text="geçersiz telefon"')).toBeVisible()
    })

    test('should handle template errors', async ({ page }) => {
      await page.goto('/messages/templates')
      
      // Try to create template without name
      await page.click('button:has-text("Yeni Şablon")')
      await page.click('button:has-text("Kaydet")')
      
      // Should show validation error
      await expect(page.locator('text="şablon adı gerekli"')).toBeVisible()
    })
  })

  test.describe('Performance and UX', () => {
    test('should show loading states during operations', async ({ page }) => {
      await page.goto('/messages')
      
      // Fill form
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test mesajı')
      
      // Click send and immediately check for loading state
      await page.click('button:has-text("Gönder")')
      
      // Should show loading indicator
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
    })

    test('should update message counts in real-time', async ({ page }) => {
      await page.goto('/messages/analytics')
      
      // Get initial count
      const initialCount = await page.locator('[data-testid="total-messages"]').textContent()
      
      // Send a message
      await page.goto('/messages')
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test mesajı')
      await page.click('button:has-text("Gönder")')
      
      // Go back to analytics
      await page.goto('/messages/analytics')
      
      // Count should be updated
      await expect(page.locator('[data-testid="total-messages"]')).not.toHaveText(initialCount || '')
    })

    test('should handle large recipient lists efficiently', async ({ page }) => {
      await page.goto('/messages/bulk-send')
      
      // Generate large recipient list (simulate CSV import)
      const largeRecipientList = Array.from({ length: 100 }, (_, i) => 
        `90555${String(i).padStart(6, '0')}`
      ).join('\n')
      
      await page.fill('textarea[name="recipients"]', largeRecipientList)
      
      // Should show recipient count
      await expect(page.locator('text="100 alıcı"')).toBeVisible()
      
      // Should show progress for bulk operation
      await page.fill('textarea[name="message"]', 'Toplu test mesajı')
      await page.click('button:has-text("Toplu Gönder")')
      
      // Should show progress bar
      await expect(page.locator('[data-testid="bulk-progress"]')).toBeVisible()
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      await page.goto('/messages')
      
      // Should show mobile-optimized layout
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
      
      // Should be able to send SMS on mobile
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Mobil test')
      await page.click('button:has-text("Gönder")')
      
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/messages')
      
      // Tab through form elements
      await page.keyboard.press('Tab') // Focus phone input
      await page.keyboard.type('905551234567')
      
      await page.keyboard.press('Tab') // Focus message textarea
      await page.keyboard.type('Klavye ile test mesajı')
      
      await page.keyboard.press('Tab') // Focus send button
      await page.keyboard.press('Enter') // Send
      
      await expect(page.locator('text="başarıyla gönderildi"')).toBeVisible()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/messages')
      
      // Check for accessibility attributes
      await expect(page.locator('input[aria-label*="telefon"]')).toBeVisible()
      await expect(page.locator('textarea[aria-label*="mesaj"]')).toBeVisible()
      await expect(page.locator('button[aria-label*="gönder"]')).toBeVisible()
    })

    test('should announce status changes to screen readers', async ({ page }) => {
      await page.goto('/messages')
      
      await page.fill('input[placeholder*="telefon"]', '905551234567')
      await page.fill('textarea[placeholder*="mesaj"]', 'Test mesajı')
      await page.click('button:has-text("Gönder")')
      
      // Should have aria-live region for status updates
      await expect(page.locator('[aria-live="polite"]:has-text("gönderildi")')).toBeVisible()
    })
  })
})
