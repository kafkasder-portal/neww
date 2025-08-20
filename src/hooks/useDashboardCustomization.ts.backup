import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface DashboardWidget {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'financial' | 'activity' | 'communication' | 'management'
  enabled: boolean
  position: number
  size: 'small' | 'medium' | 'large'
  color: string
}

interface DashboardSettings {
  widgets: DashboardWidget[]
  layout: 'grid' | 'list' | 'compact'
  theme: 'light' | 'dark' | 'auto'
  showWelcomeMessage: boolean
  autoRefresh: boolean
  refreshInterval: number // minutes
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'total-donations',
    title: 'Toplam Bağışlar',
    description: 'Toplam bağış miktarı ve değişim oranı',
    icon: null, // Will be set dynamically
    category: 'financial',
    enabled: true,
    position: 0,
    size: 'small',
    color: 'bg-blue-500'
  },
  {
    id: 'active-beneficiaries',
    title: 'Aktif İhtiyaç Sahipleri',
    description: 'Aktif yardım alan kişi sayısı',
    icon: null,
    category: 'activity',
    enabled: true,
    position: 1,
    size: 'small',
    color: 'bg-green-500'
  },
  {
    id: 'monthly-growth',
    title: 'Aylık Büyüme',
    description: 'Aylık büyüme oranı ve trend',
    icon: null,
    category: 'financial',
    enabled: true,
    position: 2,
    size: 'small',
    color: 'bg-purple-500'
  },
  {
    id: 'fund-distribution',
    title: 'Fon Dağılımı',
    description: 'Fonların dağılım oranı',
    icon: null,
    category: 'financial',
    enabled: true,
    position: 3,
    size: 'small',
    color: 'bg-orange-500'
  },
  {
    id: 'recent-activities',
    title: 'Son Aktiviteler',
    description: 'Son sistem aktiviteleri',
    icon: null,
    category: 'activity',
    enabled: true,
    position: 4,
    size: 'medium',
    color: 'bg-indigo-500'
  },
  {
    id: 'pending-tasks',
    title: 'Bekleyen Görevler',
    description: 'Tamamlanmamış görevler',
    icon: null,
    category: 'management',
    enabled: true,
    position: 5,
    size: 'medium',
    color: 'bg-red-500'
  },
  {
    id: 'messages',
    title: 'Mesajlar',
    description: 'Son mesajlar ve bildirimler',
    icon: null,
    category: 'communication',
    enabled: true,
    position: 6,
    size: 'medium',
    color: 'bg-teal-500'
  },
  {
    id: 'donation-chart',
    title: 'Bağış Grafiği',
    description: 'Bağış trendleri ve analizi',
    icon: null,
    category: 'financial',
    enabled: true,
    position: 7,
    size: 'large',
    color: 'bg-blue-600'
  },
  {
    id: 'beneficiary-chart',
    title: 'İhtiyaç Sahibi Analizi',
    description: 'İhtiyaç sahipleri dağılımı',
    icon: null,
    category: 'activity',
    enabled: true,
    position: 8,
    size: 'large',
    color: 'bg-green-600'
  }
]

const defaultSettings: DashboardSettings = {
  widgets: defaultWidgets,
  layout: 'grid',
  theme: 'auto',
  showWelcomeMessage: true,
  autoRefresh: false,
  refreshInterval: 5
}

export function useDashboardCustomization() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`dashboard_settings_${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (error) {
          console.error('Failed to parse dashboard settings:', error)
          setSettings(defaultSettings)
        }
      }
      setIsLoading(false)
    }
  }, [user])

  // Save settings to localStorage
  const saveSettings = (newSettings: DashboardSettings) => {
    if (!user) return

    setSettings(newSettings)
    localStorage.setItem(`dashboard_settings_${user.id}`, JSON.stringify(newSettings))
  }

  // Update widgets
  const updateWidgets = (widgets: DashboardWidget[]) => {
    saveSettings({ ...settings, widgets })
  }

  // Toggle widget
  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = settings.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    )
    updateWidgets(updatedWidgets)
  }

  // Update widget size
  const updateWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = settings.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    )
    updateWidgets(updatedWidgets)
  }

  // Reorder widgets
  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    const updatedWidgets = [...settings.widgets]
    const [movedWidget] = updatedWidgets.splice(fromIndex, 1)
    updatedWidgets.splice(toIndex, 0, movedWidget)
    
    // Update positions
    const widgetsWithNewPositions = updatedWidgets.map((widget, index) => ({
      ...widget,
      position: index
    }))
    
    updateWidgets(widgetsWithNewPositions)
  }

  // Update layout
  const updateLayout = (layout: 'grid' | 'list' | 'compact') => {
    saveSettings({ ...settings, layout })
  }

  // Update theme
  const updateTheme = (theme: 'light' | 'dark' | 'auto') => {
    saveSettings({ ...settings, theme })
  }

  // Toggle welcome message
  const toggleWelcomeMessage = () => {
    saveSettings({ ...settings, showWelcomeMessage: !settings.showWelcomeMessage })
  }

  // Toggle auto refresh
  const toggleAutoRefresh = () => {
    saveSettings({ ...settings, autoRefresh: !settings.autoRefresh })
  }

  // Update refresh interval
  const updateRefreshInterval = (interval: number) => {
    saveSettings({ ...settings, refreshInterval: interval })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    saveSettings(defaultSettings)
  }

  // Get enabled widgets
  const getEnabledWidgets = () => {
    return settings.widgets
      .filter(widget => widget.enabled)
      .sort((a, b) => a.position - b.position)
  }

  // Get widgets by category
  const getWidgetsByCategory = (category: string) => {
    return settings.widgets.filter(widget => widget.category === category)
  }

  return {
    settings,
    isLoading,
    updateWidgets,
    toggleWidget,
    updateWidgetSize,
    reorderWidgets,
    updateLayout,
    updateTheme,
    toggleWelcomeMessage,
    toggleAutoRefresh,
    updateRefreshInterval,
    resetToDefaults,
    getEnabledWidgets,
    getWidgetsByCategory
  }
}
