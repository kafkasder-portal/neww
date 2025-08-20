import { useState, useEffect, useCallback } from 'react'
import { stockAlertService, StockAlertConfig, AlertTrigger } from '@/services/stockAlertService'
import { StockAlert, StockAlertRule, InventoryItem } from '@/types/inventory'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export interface UseStockAlertsReturn {
  // Uyarılar
  alerts: StockAlert[]
  unreadAlerts: StockAlert[]
  alertStats: {
    total: number
    unresolved: number
    critical: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  } | null
  
  // Kurallar
  alertRules: StockAlertRule[]
  
  // Konfigürasyon
  config: StockAlertConfig | null
  
  // Durum
  loading: boolean
  error: string | null
  
  // Fonksiyonlar
  loadAlerts: () => Promise<void>
  loadAlertRules: () => Promise<void>
  loadConfig: () => Promise<void>
  loadStats: () => Promise<void>
  
  createAlert: (trigger: AlertTrigger) => Promise<StockAlert>
  resolveAlert: (alertId: string, note?: string) => Promise<void>
  dismissAlert: (alertId: string) => Promise<void>
  
  createAlertRule: (rule: Omit<StockAlertRule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<StockAlertRule>
  updateAlertRule: (id: string, updates: Partial<StockAlertRule>) => Promise<void>
  deleteAlertRule: (id: string) => Promise<void>
  
  updateConfig: (config: Partial<StockAlertConfig>) => Promise<void>
  
  runStockCheck: (items?: InventoryItem[]) => Promise<{ alerts: StockAlert[], triggers: AlertTrigger[] }>
  
  markAsRead: (alertId: string) => void
  markAllAsRead: () => void
}

export function useStockAlerts(): UseStockAlertsReturn {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [alertRules, setAlertRules] = useState<StockAlertRule[]>([])
  const [config, setConfig] = useState<StockAlertConfig | null>(null)
  const [alertStats, setAlertStats] = useState<UseStockAlertsReturn['alertStats']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set())

  // Computed values
  const unreadAlerts = alerts.filter(alert => !readAlerts.has(alert.id))

  // Uyarıları yükle
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('stock_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (supabaseError) throw supabaseError
      
      setAlerts(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarılar yüklenemedi'
      setError(errorMessage)
      toast.error('Uyarılar yüklenemedi', {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Uyarı kurallarını yükle
  const loadAlertRules = useCallback(async () => {
    try {
      setError(null)
      await stockAlertService.loadAlertRules()
      // Service'den kuralları al (bu örnekte direkt erişim yok, API çağrısı yapılmalı)
      const { data, error: supabaseError } = await supabase
        .from('stock_alert_rules')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      
      setAlertRules(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı kuralları yüklenemedi'
      setError(errorMessage)
      toast.error('Uyarı kuralları yüklenemedi', {
        description: errorMessage
      })
    }
  }, [])

  // Konfigürasyonu yükle
  const loadConfig = useCallback(async () => {
    try {
      setError(null)
      await stockAlertService.loadConfig()
      const loadedConfig = stockAlertService.getConfig()
      setConfig(loadedConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Konfigürasyon yüklenemedi'
      setError(errorMessage)
      toast.error('Konfigürasyon yüklenemedi', {
        description: errorMessage
      })
    }
  }, [])

  // İstatistikleri yükle
  const loadStats = useCallback(async () => {
    try {
      setError(null)
      const stats = await stockAlertService.getAlertStats()
      setAlertStats(stats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'İstatistikler yüklenemedi'
      setError(errorMessage)
      console.error('İstatistikler yüklenemedi:', err)
    }
  }, [])

  // Uyarı oluştur
  const createAlert = useCallback(async (trigger: AlertTrigger): Promise<StockAlert> => {
    try {
      setError(null)
      const alert = await stockAlertService.createAlert(trigger)
      
      // Listeyi güncelle
      setAlerts(prev => [alert, ...prev])
      
      // Toast bildirimi
      toast.warning(alert.message, {
        description: `${alert.itemName} - ${alert.location}`,
        action: {
          label: 'Görüntüle',
          onClick: () => {
            // Uyarı detayına git
            window.location.href = `/inventory/alerts?alert=${alert.id}`
          }
        }
      })
      
      return alert
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı oluşturulamadı'
      setError(errorMessage)
      toast.error('Uyarı oluşturulamadı', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Uyarıyı çözümle
  const resolveAlert = useCallback(async (alertId: string, note?: string): Promise<void> => {
    try {
      setError(null)
      await stockAlertService.resolveAlert(alertId, 'current_user', note) // TODO: Gerçek user ID
      
      // Listeyi güncelle
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, isResolved: true, resolvedAt: new Date().toISOString() }
            : alert
        )
      )
      
      toast.success('Uyarı çözümlendi')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı çözümlenemedi'
      setError(errorMessage)
      toast.error('Uyarı çözümlenemedi', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Uyarıyı reddet/kapat
  const dismissAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      setError(null)
      
      // Uyarıyı gizli olarak işaretle (soft delete)
      const { error: supabaseError } = await supabase
        .from('stock_alerts')
        .update({ is_dismissed: true })
        .eq('id', alertId)

      if (supabaseError) throw supabaseError
      
      // Listeden kaldır
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      
      toast.success('Uyarı kapatıldı')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı kapatılamadı'
      setError(errorMessage)
      toast.error('Uyarı kapatılamadı', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Uyarı kuralı oluştur
  const createAlertRule = useCallback(async (rule: Omit<StockAlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockAlertRule> => {
    try {
      setError(null)
      const newRule = await stockAlertService.createAlertRule(rule)
      
      setAlertRules(prev => [newRule, ...prev])
      
      toast.success('Uyarı kuralı oluşturuldu', {
        description: newRule.name
      })
      
      return newRule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı kuralı oluşturulamadı'
      setError(errorMessage)
      toast.error('Uyarı kuralı oluşturulamadı', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Uyarı kuralını güncelle
  const updateAlertRule = useCallback(async (id: string, updates: Partial<StockAlertRule>): Promise<void> => {
    try {
      setError(null)
      await stockAlertService.updateAlertRule(id, updates)
      
      setAlertRules(prev => 
        prev.map(rule => 
          rule.id === id ? { ...rule, ...updates } : rule
        )
      )
      
      toast.success('Uyarı kuralı güncellendi')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı kuralı güncellenemedi'
      setError(errorMessage)
      toast.error('Uyarı kuralı güncellenemedi', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Uyarı kuralını sil
  const deleteAlertRule = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await stockAlertService.deleteAlertRule(id)
      
      setAlertRules(prev => prev.filter(rule => rule.id !== id))
      
      toast.success('Uyarı kuralı silindi')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uyarı kuralı silinemedi'
      setError(errorMessage)
      toast.error('Uyarı kuralı silinemedi', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Konfigürasyonu güncelle
  const updateConfig = useCallback(async (configUpdates: Partial<StockAlertConfig>): Promise<void> => {
    try {
      setError(null)
      await stockAlertService.saveConfig(configUpdates)
      
      const updatedConfig = stockAlertService.getConfig()
      setConfig(updatedConfig)
      
      toast.success('Konfigürasyon güncellendi')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Konfigürasyon güncellenemedi'
      setError(errorMessage)
      toast.error('Konfigürasyon güncellenemedi', {
        description: errorMessage
      })
      throw err
    }
  }, [])

  // Stok kontrolü çalıştır
  const runStockCheck = useCallback(async (items?: InventoryItem[]): Promise<{ alerts: StockAlert[], triggers: AlertTrigger[] }> => {
    try {
      setError(null)
      setLoading(true)
      
      let result: { alerts: StockAlert[], triggers: AlertTrigger[] }
      
      if (items) {
        // Belirli öğeler için kontrol
        const triggers = await stockAlertService.checkStockLevels(items)
        const alerts: StockAlert[] = []
        
        for (const trigger of triggers) {
          const alert = await stockAlertService.createAlert(trigger)
          alerts.push(alert)
        }
        
        result = { alerts, triggers }
      } else {
        // Tüm stok için kontrol
        result = await stockAlertService.runStockCheck()
      }
      
      // Yeni uyarıları listeye ekle
      if (result.alerts.length > 0) {
        setAlerts(prev => [...result.alerts, ...prev])
        
        toast.success(`${result.alerts.length} yeni uyarı oluşturuldu`, {
          description: `${result.triggers.length} tetikleyici kontrol edildi`
        })
      } else {
        toast.info('Yeni uyarı bulunamadı', {
          description: 'Tüm stok seviyeleri normal'
        })
      }
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Stok kontrolü çalıştırılamadı'
      setError(errorMessage)
      toast.error('Stok kontrolü çalıştırılamadı', {
        description: errorMessage
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Uyarıyı okundu olarak işaretle
  const markAsRead = useCallback((alertId: string) => {
    setReadAlerts(prev => new Set([...prev, alertId]))
  }, [])

  // Tüm uyarıları okundu olarak işaretle
  const markAllAsRead = useCallback(() => {
    const allAlertIds = alerts.map(alert => alert.id)
    setReadAlerts(new Set(allAlertIds))
  }, [alerts])

  // İlk yükleme
  useEffect(() => {
    loadAlerts()
    loadAlertRules()
    loadConfig()
    loadStats()
  }, [])

  // Periyodik stok kontrolü (5 dakikada bir)
  useEffect(() => {
    const interval = setInterval(() => {
      if (config?.enableSystemNotifications) {
        runStockCheck().catch(console.error)
      }
    }, 5 * 60 * 1000) // 5 dakika

    return () => clearInterval(interval)
  }, [config, runStockCheck])

  return {
    alerts,
    unreadAlerts,
    alertStats,
    alertRules,
    config,
    loading,
    error,
    
    loadAlerts,
    loadAlertRules,
    loadConfig,
    loadStats,
    
    createAlert,
    resolveAlert,
    dismissAlert,
    
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    
    updateConfig,
    
    runStockCheck,
    
    markAsRead,
    markAllAsRead
  }
}

export default useStockAlerts