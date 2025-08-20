import { supabase } from '@/lib/supabase'
import { NotificationService } from './notificationService'
import { InventoryItem, StockAlert, StockAlertRule } from '@/types/inventory'

export interface StockAlertConfig {
  lowStockThreshold: number
  criticalStockThreshold: number
  expiryWarningDays: number
  overStockThreshold: number
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  enableSystemNotifications: boolean
  recipients: string[]
}

export interface AlertTrigger {
  type: 'low_stock' | 'critical_stock' | 'out_of_stock' | 'expiry_warning' | 'expired' | 'overstock'
  item: InventoryItem
  threshold?: number
  daysUntilExpiry?: number
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class StockAlertService {
  private static instance: StockAlertService
  private alertRules: StockAlertRule[] = []
  private config: StockAlertConfig = {
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    expiryWarningDays: 30,
    overStockThreshold: 1000,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enableSystemNotifications: true,
    recipients: []
  }

  static getInstance(): StockAlertService {
    if (!StockAlertService.instance) {
      StockAlertService.instance = new StockAlertService()
    }
    return StockAlertService.instance
  }

  // Konfigürasyon yönetimi
  async loadConfig(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('stock_alert_config')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        this.config = { ...this.config, ...data }
      }
    } catch (error) {
      console.error('Stok uyarı konfigürasyonu yüklenemedi:', error)
    }
  }

  async saveConfig(config: Partial<StockAlertConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config }
      
      const { error } = await supabase
        .from('stock_alert_config')
        .upsert(this.config)

      if (error) throw error
    } catch (error) {
      console.error('Stok uyarı konfigürasyonu kaydedilemedi:', error)
      throw error
    }
  }

  getConfig(): StockAlertConfig {
    return { ...this.config }
  }

  // Uyarı kuralları yönetimi
  async loadAlertRules(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('stock_alert_rules')
        .select('*')
        .eq('is_active', true)

      if (error) throw error
      this.alertRules = data || []
    } catch (error) {
      console.error('Stok uyarı kuralları yüklenemedi:', error)
    }
  }

  async createAlertRule(rule: Omit<StockAlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockAlertRule> {
    try {
      const { data, error } = await supabase
        .from('stock_alert_rules')
        .insert({
          ...rule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      this.alertRules.push(data)
      return data
    } catch (error) {
      console.error('Stok uyarı kuralı oluşturulamadı:', error)
      throw error
    }
  }

  async updateAlertRule(id: string, updates: Partial<StockAlertRule>): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alert_rules')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      const index = this.alertRules.findIndex(rule => rule.id === id)
      if (index !== -1) {
        this.alertRules[index] = { ...this.alertRules[index], ...updates }
      }
    } catch (error) {
      console.error('Stok uyarı kuralı güncellenemedi:', error)
      throw error
    }
  }

  async deleteAlertRule(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alert_rules')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      this.alertRules = this.alertRules.filter(rule => rule.id !== id)
    } catch (error) {
      console.error('Stok uyarı kuralı silinemedi:', error)
      throw error
    }
  }

  // Stok kontrolü ve uyarı oluşturma
  async checkStockLevels(items: InventoryItem[]): Promise<AlertTrigger[]> {
    const triggers: AlertTrigger[] = []
    const now = new Date()

    for (const item of items) {
      // Stok seviyesi kontrolleri
      if (item.currentStock <= 0) {
        triggers.push({
          type: 'out_of_stock',
          item,
          message: `${item.name} stokta kalmadı`,
          severity: 'critical'
        })
      } else if (item.currentStock <= this.config.criticalStockThreshold) {
        triggers.push({
          type: 'critical_stock',
          item,
          threshold: this.config.criticalStockThreshold,
          message: `${item.name} kritik stok seviyesinde (${item.currentStock} adet)`,
          severity: 'critical'
        })
      } else if (item.currentStock <= this.config.lowStockThreshold) {
        triggers.push({
          type: 'low_stock',
          item,
          threshold: this.config.lowStockThreshold,
          message: `${item.name} düşük stok seviyesinde (${item.currentStock} adet)`,
          severity: 'high'
        })
      } else if (item.currentStock >= this.config.overStockThreshold) {
        triggers.push({
          type: 'overstock',
          item,
          threshold: this.config.overStockThreshold,
          message: `${item.name} aşırı stok seviyesinde (${item.currentStock} adet)`,
          severity: 'medium'
        })
      }

      // Son kullanma tarihi kontrolleri
      // Note: expiryDate is not part of the InventoryItem interface
      // This would need to be added to the database schema and type definition
      // if (item.expiryDate) {
      //   const expiryDate = new Date(item.expiryDate)
      //   const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      //   if (daysUntilExpiry < 0) {
      //     triggers.push({
      //       type: 'expired',
      //       item,
      //       daysUntilExpiry,
      //       message: `${item.name} son kullanma tarihi geçmiş (${Math.abs(daysUntilExpiry)} gün önce)`,
      //       severity: 'critical'
      //       })
      //   } else if (daysUntilExpiry <= this.config.expiryWarningDays) {
      //     triggers.push({
      //       type: 'expiry_warning',
      //       item,
      //       daysUntilExpiry,
      //       message: `${item.name} son kullanma tarihi yaklaşıyor (${daysUntilExpiry} gün kaldı)`,
      //       severity: daysUntilExpiry <= 7 ? 'high' : 'medium'
      //     })
      //   }
      // }

      // Özel kuralları kontrol et
      for (const rule of this.alertRules) {
        if (this.shouldTriggerRule(rule, item)) {
          triggers.push({
            type: rule.type as any,
            item,
            threshold: rule.threshold,
            message: this.generateRuleMessage(rule, item),
            severity: this.getRuleSeverity(rule, item)
          })
        }
      }
    }

    return triggers
  }

  private shouldTriggerRule(rule: StockAlertRule, item: InventoryItem): boolean {
    if (!rule.isActive) return false

    // Kategori filtresi
    if (rule.categoryFilter && rule.categoryFilter.length > 0) {
      if (!rule.categoryFilter.includes(item.categoryId)) {
        return false
      }
    }

    // Lokasyon filtresi
    if (rule.locationFilter && rule.locationFilter.length > 0) {
      if (!rule.locationFilter.includes(item.locationId)) {
        return false
      }
    }

    // Kural tipine göre kontrol
    switch (rule.type) {
      case 'low_stock':
        return item.currentStock <= rule.threshold
      case 'critical_stock':
        return item.currentStock <= rule.threshold
      case 'out_of_stock':
        return item.currentStock <= 0
      case 'overstock':
        return item.currentStock >= rule.threshold
      case 'expiry_warning':
        // Note: expiryDate is not part of the InventoryItem interface
        // if (item.expiryDate) {
        //   const daysUntilExpiry = Math.ceil(
        //     (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        //   )
        //   return daysUntilExpiry <= rule.threshold
        // }
        return false
      default:
        return false
    }
  }

  private generateRuleMessage(rule: StockAlertRule, item: InventoryItem): string {
    switch (rule.type) {
      case 'low_stock':
        return `${item.name} düşük stok seviyesinde (${item.currentStock}/${rule.threshold})`
      case 'critical_stock':
        return `${item.name} kritik stok seviyesinde (${item.currentStock}/${rule.threshold})`
      case 'out_of_stock':
        return `${item.name} stokta kalmadı`
      case 'overstock':
        return `${item.name} aşırı stok seviyesinde (${item.currentStock}/${rule.threshold})`
      case 'expiry_warning':
        // Note: expiryDate is not part of the InventoryItem interface
        // if (item.expiryDate) {
        //   const daysUntilExpiry = Math.ceil(
        //     (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        //   )
        //   return `${item.name} son kullanma tarihi yaklaşıyor (${daysUntilExpiry} gün)`
        // }
        return `${item.name} son kullanma tarihi kontrolü gerekli`
      default:
        return `${item.name} için ${rule.name} kuralı tetiklendi`
    }
  }

  private getRuleSeverity(rule: StockAlertRule, item: InventoryItem): 'low' | 'medium' | 'high' | 'critical' {
    switch (rule.type) {
      case 'out_of_stock':
        return 'critical'
      case 'critical_stock':
        return 'critical'
      case 'low_stock':
        return 'high'
      case 'expiry_warning':
        // Note: expiryDate is not part of the InventoryItem interface
        // if (item.expiryDate) {
        //   const daysUntilExpiry = Math.ceil(
        //     (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        //   )
        //   return daysUntilExpiry <= 3 ? 'critical' : daysUntilExpiry <= 7 ? 'high' : 'medium'
        // }
        return 'medium'
      case 'overstock':
        return 'medium'
      default:
        return 'medium'
    }
  }

  // Uyarı oluşturma ve bildirim gönderme
  async createAlert(trigger: AlertTrigger): Promise<StockAlert> {
    try {
      // Convert 'expired' type to 'expiry_warning' to match StockAlert interface
      const alertType = trigger.type === 'expired' ? 'expiry_warning' : trigger.type;
      
      const alert: Omit<StockAlert, 'id'> = {
        itemId: trigger.item.id,
        itemName: trigger.item.name,
        itemCode: trigger.item.code || trigger.item.itemCode || '',
        locationName: trigger.item.location?.name || '',
        type: alertType,
        alertType: alertType,
        severity: trigger.severity,
        message: trigger.message,
        threshold: trigger.threshold || 0, // Provide default value of 0 when threshold is undefined
        currentStock: trigger.item.currentStock,
        isResolved: false,
        isRead: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        resolvedAt: undefined,
        resolvedBy: undefined
      }

      const { data, error } = await supabase
        .from('stock_alerts')
        .insert(alert)
        .select()
        .single()

      if (error) throw error

      // Bildirim gönder
      await this.sendNotifications(data, trigger)

      return data
    } catch (error) {
      console.error('Stok uyarısı oluşturulamadı:', error)
      throw error
    }
  }

  private async sendNotifications(alert: StockAlert, trigger: AlertTrigger): Promise<void> {
    try {
      // Sistem bildirimi
      if (this.config.enableSystemNotifications) {
        await NotificationService.createNotification({
          user_id: 'system', // veya admin user ID
          type: 'system',
          title: this.getNotificationTitle(trigger.type),
          message: trigger.message,
          data: {
            alert_id: alert.id,
            item_id: trigger.item.id,
            severity: trigger.severity
          }
        })
      }

      // E-posta bildirimi
      if (this.config.enableEmailNotifications && this.config.recipients.length > 0) {
        // E-posta gönderme servisi burada çağrılabilir
        console.debug('E-posta bildirimi gönderiliyor:', {
          message: trigger.message,
          alert
        })
      }

      // SMS bildirimi
      if (this.config.enableSMSNotifications && this.config.recipients.length > 0) {
        // SMS gönderme servisi burada çağrılabilir
        }
    } catch (error) {
      console.error('Bildirim gönderilirken hata oluştu:', error)
    }
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'out_of_stock':
        return 'Stok Tükendi'
      case 'critical_stock':
        return 'Kritik Stok Seviyesi'
      case 'low_stock':
        return 'Düşük Stok Seviyesi'
      case 'overstock':
        return 'Aşırı Stok Uyarısı'
      case 'expiry_warning':
        return 'Son Kullanma Tarihi Uyarısı'
      case 'expired':
        return 'Ürün Süresi Doldu'
      default:
        return 'Stok Uyarısı'
    }
  }

  // Uyarı çözümleme
  async resolveAlert(alertId: string, resolvedBy: string, note?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
          resolution_note: note
        })
        .eq('id', alertId)

      if (error) throw error
    } catch (error) {
      console.error('Stok uyarısı çözümlenemedi:', error)
      throw error
    }
  }

  // Toplu stok kontrolü
  async runStockCheck(): Promise<{ alerts: StockAlert[], triggers: AlertTrigger[] }> {
    try {
      // Tüm aktif stok öğelerini al
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      // Uyarı tetikleyicilerini kontrol et
      const triggers = await this.checkStockLevels(items || [])
      
      // Yeni uyarılar oluştur
      const alerts: StockAlert[] = []
      for (const trigger of triggers) {
        // Aynı öğe için son 24 saat içinde benzer uyarı var mı kontrol et
        const { data: existingAlerts } = await supabase
          .from('stock_alerts')
          .select('id')
          .eq('item_id', trigger.item.id)
          .eq('type', trigger.type)
          .eq('is_resolved', false)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

        if (!existingAlerts || existingAlerts.length === 0) {
          const alert = await this.createAlert(trigger)
          alerts.push(alert)
        }
      }

      return { alerts, triggers }
    } catch (error) {
      console.error('Stok kontrolü çalıştırılamadı:', error)
      throw error
    }
  }

  // Uyarı istatistikleri
  async getAlertStats(): Promise<{
    total: number
    unresolved: number
    critical: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  }> {
    try {
      const { data: alerts, error } = await supabase
        .from('stock_alerts')
        .select('type, severity, is_resolved')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Son 30 gün

      if (error) throw error

      const stats = {
        total: alerts?.length || 0,
        unresolved: alerts?.filter(a => !a.is_resolved).length || 0,
        critical: alerts?.filter(a => a.severity === 'critical').length || 0,
        byType: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>
      }

      alerts?.forEach(alert => {
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1
        stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Uyarı istatistikleri alınamadı:', error)
      throw error
    }
  }
}

export const stockAlertService = StockAlertService.getInstance()
export default stockAlertService