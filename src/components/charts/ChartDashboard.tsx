import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react'
// import { useLanguageContext } from '@/contexts/LanguageContext' // Kullanılmıyor
import {
  LineChartComponent,
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  ComposedChartComponent,
  generateSampleData,
  generatePieData
} from './ChartComponents'

type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'composed'
type TimeRange = '7d' | '30d' | '90d' | '1y'

interface ChartConfig {
  type: ChartType
  title: string
  dataKey: string
  timeRange: TimeRange
  showGrid: boolean
  showLegend: boolean
}

export const ChartDashboard = () => {
  // const { t } = useLanguageContext() // Kullanılmıyor
  const [selectedCharts, setSelectedCharts] = useState<ChartType[]>(['line', 'bar', 'pie'])
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [isLoading, setIsLoading] = useState(false)

  const chartConfigs: Record<ChartType, ChartConfig> = {
    line: {
      type: 'line',
      title: 'Bağış Trendi',
      dataKey: 'value',
      timeRange,
      showGrid: true,
      showLegend: true
    },
    area: {
      type: 'area',
      title: 'Yardım Alanlar Trendi',
      dataKey: 'beneficiaries',
      timeRange,
      showGrid: true,
      showLegend: true
    },
    bar: {
      type: 'bar',
      title: 'Aylık Bağışlar',
      dataKey: 'donations',
      timeRange,
      showGrid: true,
      showLegend: true
    },
    pie: {
      type: 'pie',
      title: 'Bağış Dağılımı',
      dataKey: 'value',
      timeRange,
      showGrid: false,
      showLegend: true
    },
    composed: {
      type: 'composed',
      title: 'Bağış vs Yardım Alanlar',
      dataKey: 'value',
      timeRange,
      showGrid: true,
      showLegend: true
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simüle edilmiş veri yenileme
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // Grafik export işlevi
    console.log('Grafik export ediliyor...')
  }

  const renderChart = (type: ChartType) => {
    const config = chartConfigs[type]
    const data = type === 'pie' ? generatePieData() : generateSampleData()

    switch (type) {
      case 'line':
        return (
          <LineChartComponent
            data={data}
            title={config.title}
            dataKey={config.dataKey}
            showGrid={config.showGrid}
            showLegend={config.showLegend}
          />
        )
      case 'area':
        return (
          <AreaChartComponent
            data={data}
            title={config.title}
            dataKey={config.dataKey}
            showGrid={config.showGrid}
            showLegend={config.showLegend}
          />
        )
      case 'bar':
        return (
          <BarChartComponent
            data={data}
            title={config.title}
            dataKey={config.dataKey}
            showGrid={config.showGrid}
            showLegend={config.showLegend}
          />
        )
      case 'pie':
        return (
          <PieChartComponent
            data={data}
            title={config.title}
            showLegend={config.showLegend}
          />
        )
      case 'composed':
        return (
          <ComposedChartComponent
            data={data}
            title={config.title}
            lineDataKey="value"
            barDataKey="donations"
            showGrid={config.showGrid}
            showLegend={config.showLegend}
          />
        )
      default:
        return null
    }
  }

  const chartTypes: { value: ChartType; label: string; icon: React.ReactNode }[] = [
    { value: 'line', label: 'Çizgi Grafik', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'area', label: 'Alan Grafik', icon: <Activity className="w-4 h-4" /> },
    { value: 'bar', label: 'Sütun Grafik', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'pie', label: 'Pasta Grafik', icon: <PieChart className="w-4 h-4" /> },
    { value: 'composed', label: 'Karma Grafik', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Kontrol Paneli */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Grafik Dashboard</h2>
            <Select value={timeRange} onValueChange={(value: string) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Son 7 Gün</SelectItem>
                <SelectItem value="30d">Son 30 Gün</SelectItem>
                <SelectItem value="90d">Son 90 Gün</SelectItem>
                <SelectItem value="1y">Son 1 Yıl</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Grafik Türü Seçici */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Grafik Türleri</h3>
          <div className="flex flex-wrap gap-2">
            {chartTypes.map((chartType) => (
              <Button
                key={chartType.value}
                variant={selectedCharts.includes(chartType.value) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedCharts.includes(chartType.value)) {
                    setSelectedCharts(selectedCharts.filter(t => t !== chartType.value))
                  } else {
                    setSelectedCharts([...selectedCharts, chartType.value])
                  }
                }}
                className="flex items-center space-x-1"
              >
                {chartType.icon}
                <span>{chartType.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grafikler Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCharts.map((chartType) => (
          <div key={chartType}>
            {renderChart(chartType)}
          </div>
        ))}
      </div>

      {/* Boş Durum */}
      {selectedCharts.length === 0 && (
        <Card className="p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Grafik Seçilmedi</h3>
          <p className="text-gray-500 mb-4">
            Görüntülemek istediğiniz grafik türlerini seçin
          </p>
          <Button
            onClick={() => setSelectedCharts(['line', 'bar'])}
            className="flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>Varsayılan Grafikleri Göster</span>
          </Button>
        </Card>
      )}
    </div>
  )
}
