import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Grid, 
  BarChart3, 
  Users, 
  Heart, 
  MessageSquare, 
  Calendar, 
  CheckSquare,
  X,
  Save,
  RotateCcw
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'

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

interface DashboardCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (widgets: DashboardWidget[]) => void
  currentWidgets: DashboardWidget[]
}

const availableWidgets: DashboardWidget[] = [
  {
    id: 'total-donations',
    title: 'Toplam Bağışlar',
    description: 'Toplam bağış miktarı ve değişim oranı',
    icon: <BarChart3 className="w-5 h-5" />,
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
    icon: <Users className="w-5 h-5" />,
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
    icon: <BarChart3 className="w-5 h-5" />,
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
    icon: <Heart className="w-5 h-5" />,
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
    icon: <Calendar className="w-5 h-5" />,
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
    icon: <CheckSquare className="w-5 h-5" />,
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
    icon: <MessageSquare className="w-5 h-5" />,
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
    icon: <BarChart3 className="w-5 h-5" />,
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
    icon: <Users className="w-5 h-5" />,
    category: 'activity',
    enabled: true,
    position: 8,
    size: 'large',
    color: 'bg-green-600'
  }
]

const categoryColors = {
  financial: 'bg-blue-50 border-blue-200',
  activity: 'bg-green-50 border-green-200',
  communication: 'bg-purple-50 border-purple-200',
  management: 'bg-orange-50 border-orange-200'
}

const categoryIcons = {
  financial: <BarChart3 className="w-4 h-4" />,
  activity: <Users className="w-4 h-4" />,
  communication: <MessageSquare className="w-4 h-4" />,
  management: <CheckSquare className="w-4 h-4" />
}

export function DashboardCustomizer({ 
  isOpen, 
  onClose, 
  onSave, 
  currentWidgets 
}: DashboardCustomizerProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(currentWidgets)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    setWidgets(currentWidgets)
  }, [currentWidgets])

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ))
  }

  const handleSizeChange = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, size }
        : widget
    ))
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) {
      const newWidgets = [...widgets]
      const draggedWidget = newWidgets[dragIndex]
      newWidgets.splice(dragIndex, 1)
      newWidgets.splice(index, 0, draggedWidget)
      setWidgets(newWidgets)
      setDragIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleSave = () => {
    onSave(widgets)
    onClose()
  }

  const handleReset = () => {
    setWidgets(availableWidgets)
  }

  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets.filter(widget => widget.category === selectedCategory)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Dashboard Kişiselleştirme
              </h2>
              <p className="text-sm text-gray-600">
                Widget&apos;ları düzenleyin ve dashboard&apos;ınızı özelleştirin
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Sıfırla
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-1" />
              Kaydet
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Grid className="w-4 h-4" />
                  <span className="font-medium">Tümü</span>
                  <Badge variant="secondary" className="ml-auto">
                    {widgets.length}
                  </Badge>
                </div>
              </button>
              
              {Object.entries(categoryColors).map(([category, colorClass]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category 
                      ? colorClass 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    <span className="font-medium capitalize">
                      {category === 'financial' ? 'Finansal' :
                       category === 'activity' ? 'Aktivite' :
                       category === 'communication' ? 'İletişim' :
                       'Yönetim'}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      {widgets.filter(w => w.category === category).length}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWidgets.map((widget, index) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 border rounded-lg cursor-move transition-all ${
                    dragIndex === index ? 'opacity-50 scale-95' : ''
                  } ${
                    widget.enabled 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${widget.color}`}>
                        <div className="text-white">
                          {widget.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {widget.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={() => handleWidgetToggle(widget.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Boyut:</span>
                      <select
                        value={widget.size}
                        onChange={(e) => handleSizeChange(widget.id, e.target.value as any)}
                        className="text-xs border rounded px-2 py-1"
                        disabled={!widget.enabled}
                      >
                        <option value="small">Küçük</option>
                        <option value="medium">Orta</option>
                        <option value="large">Büyük</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Kategori:</span>
                      <Badge variant="outline" className="text-xs">
                        {widget.category === 'financial' ? 'Finansal' :
                         widget.category === 'activity' ? 'Aktivite' :
                         widget.category === 'communication' ? 'İletişim' :
                         'Yönetim'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
