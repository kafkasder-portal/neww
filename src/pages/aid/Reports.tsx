import { CorporateButton, Card, CardContent, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { supabase } from '@lib/supabase'
import {
  BarChart3,
  DollarSign,
  Download,
  Filter,
  TrendingUp,
  Users
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Lazy load Recharts components
import { lazy, Suspense } from 'react'

const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })))
const LazyBar = lazy(() => import('recharts').then(module => ({ default: module.Bar })))
const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })))
const LazyPie = lazy(() => import('recharts').then(module => ({ default: module.Pie })))
const LazyLineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })))
const LazyLine = lazy(() => import('recharts').then(module => ({ default: module.Line })))
const LazyCell = lazy(() => import('recharts').then(module => ({ default: module.Cell })))
const LazyXAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })))
const LazyYAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })))
const LazyCartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })))
const LazyTooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })))
const LazyLegend = lazy(() => import('recharts').then(module => ({ default: module.Legend })))
const LazyResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })))

// Chart loading component
const ChartLoading = () => (
  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Grafik yükleniyor...</p>
    </div>
  </div>
)

// Loading component for charts (not used anymore)
// const ChartLoading = () => (
//   <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//       <p className="text-sm text-gray-600">Grafik yükleniyor...</p>
//     </div>
//   </div>
// )

interface ReportData {
  monthlyAids: Array<{ month: string; amount: number; count: number }>
  aidTypeDistribution: Array<{ name: string; value: number; color: string }>
  beneficiaryCategories: Array<{ category: string; count: number }>
  applicationTrends: Array<{ date: string; pending: number; approved: number; rejected: number }>
}

interface ReportFilters {
  startDate: string
  endDate: string
  aidType: string
  category: string
}

export default function Reports() {
  const { colors } = useDesignSystem();

  const [reportData, setReportData] = useState<ReportData>({
    monthlyAids: [],
    aidTypeDistribution: [],
    beneficiaryCategories: [],
    applicationTrends: []
  })
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    aidType: 'all',
    category: 'all'
  })
  // const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const loadReportData = useCallback(async () => {
    // setLoading(true)
    try {
      // Aylık yardım verileri
      const { data: monthlyData } = await supabase
        .from('aid_records')
        .select('amount, created_at')
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate)
        .eq('status', 'completed')

      // Aylık verileri grupla
      const monthlyMap = new Map()
      monthlyData?.forEach(record => {
        const month = new Date(record.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' })
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { month, amount: 0, count: 0 })
        }
        const existing = monthlyMap.get(month)
        existing.amount += record.amount || 0
        existing.count += 1
      })

      // Yardım türü dağılımı
      const { data: aidTypeData } = await supabase
        .from('aid_records')
        .select('aid_type')
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate)

      const aidTypeMap = new Map()
      aidTypeData?.forEach(record => {
        const type = record.aid_type
        aidTypeMap.set(type, (aidTypeMap.get(type) || 0) + 1)
      })

      const chartColors = [colors.chart[1], colors.chart[2], colors.chart[3], colors.chart[4], colors.semantic.success]
      const aidTypeDistribution = Array.from(aidTypeMap.entries()).map(([name, value], index) => ({
        name: getAidTypeName(name),
        value,
        color: chartColors[index % chartColors.length]
      }))

      // İhtiyaç sahibi kategorileri
      const { data: categoryData } = await supabase
        .from('beneficiaries')
        .select('category')
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate)

      const categoryMap = new Map()
      categoryData?.forEach(beneficiary => {
        const category = beneficiary.category
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })

      const beneficiaryCategories = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category: getCategoryName(category),
        count
      }))

      // Başvuru trendleri
      const { data: applicationData } = await supabase
        .from('applications')
        .select('status, created_at')
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate)

      const applicationMap = new Map()
      applicationData?.forEach(app => {
        const date = new Date(app.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
        if (!applicationMap.has(date)) {
          applicationMap.set(date, { date, pending: 0, approved: 0, rejected: 0 })
        }
        const existing = applicationMap.get(date)
        if (app.status === 'pending') existing.pending += 1
        else if (app.status === 'approved') existing.approved += 1
        else if (app.status === 'rejected') existing.rejected += 1
      })

      setReportData({
        monthlyAids: Array.from(monthlyMap.values()),
        aidTypeDistribution,
        beneficiaryCategories,
        applicationTrends: Array.from(applicationMap.values())
      })
    } catch (error) {
      console.error('Rapor verileri yüklenirken hata:', error)
      toast.error('Rapor verileri yüklenirken hata oluştu')
    } finally {
      // setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadReportData()
  }, [loadReportData])

  const getAidTypeName = (type: string) => {
    const types: Record<string, string> = {
      'cash': 'Nakit',
      'food': 'Gıda',
      'clothing': 'Giyim',
      'housing': 'Barınma',
      'health': 'Sağlık',
      'education': 'Eğitim',
      'other': 'Diğer'
    }
    return types[type] || type
  }

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'orphan': 'Yetim',
      'widow': 'Dul',
      'elderly': 'Yaşlı',
      'disabled': 'Engelli',
      'refugee': 'Mülteci',
      'other': 'Diğer'
    }
    return categories[category] || category
  }

  const exportToCSV = () => {
    // CSV export logic
    toast.success('Rapor dışa aktarıldı')
  }

  const exportToPDF = () => {
    // PDF export logic
    toast.success('PDF raporu oluşturuldu')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Raporlar</h1>
          <p className="text-muted-foreground">Yardım ve başvuru istatistikleri</p>
        </div>
        <div className="flex space-x-2">
          <CorporateButton variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </CorporateButton>
          <CorporateButton variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </CorporateButton>
        </div>
      </div>

      {/* Filtreler */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtreler
          </CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Başlangıç Tarihi</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bitiş Tarihi</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Yardım Türü</label>
              <Select value={filters.aidType} onValueChange={(value: string) => setFilters(prev => ({ ...prev, aidType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="cash">Nakit</SelectItem>
                  <SelectItem value="food">Gıda</SelectItem>
                  <SelectItem value="clothing">Giyim</SelectItem>
                  <SelectItem value="housing">Barınma</SelectItem>
                  <SelectItem value="health">Sağlık</SelectItem>
                  <SelectItem value="education">Eğitim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Kategori</label>
              <Select value={filters.category} onValueChange={(value: string) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="orphan">Yetim</SelectItem>
                  <SelectItem value="widow">Dul</SelectItem>
                  <SelectItem value="elderly">Yaşlı</SelectItem>
                  <SelectItem value="disabled">Engelli</SelectItem>
                  <SelectItem value="refugee">Mülteci</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 space-y-4">
        <CorporateCard>
          <CorporateCardContent className="p-6 bg-card rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Toplam Yardım</p>
                <p className="text-2xl font-bold">
                  {reportData.monthlyAids.reduce((sum, item) => sum + item.amount, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6 bg-card rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Yardım Alan</p>
                <p className="text-2xl font-bold">
                  {reportData.monthlyAids.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6 bg-card rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Yardım Türü</p>
                <p className="text-2xl font-bold">{reportData.aidTypeDistribution.length}</p>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6 bg-card rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ortalama</p>
                <p className="text-2xl font-bold">
                  {reportData.monthlyAids.length > 0
                    ? (reportData.monthlyAids.reduce((sum, item) => sum + item.amount, 0) / reportData.monthlyAids.length).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
                    : 0} ₺
                </p>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Grafikler */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="monthly">Aylık Trend</TabsTrigger>
          <TabsTrigger value="distribution">Dağılım</TabsTrigger>
          <TabsTrigger value="applications">Başvurular</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
            {/* Aylık Yardım Grafiği */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Aylık Yardım Dağılımı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <Suspense fallback={<ChartLoading />}>
                  <LazyResponsiveContainer width="100%" height={300}>
                    <LazyBarChart data={reportData.monthlyAids}>
                      <LazyCartesianGrid strokeDasharray="3 3" />
                      <LazyXAxis dataKey="month" />
                      <LazyYAxis />
                      <LazyTooltip />
                      <LazyBar dataKey="amount" fill="colors.chart[1]" />
                    </LazyBarChart>
                  </LazyResponsiveContainer>
                </Suspense>
              </CorporateCardContent>
            </CorporateCard>

            {/* Yardım Türü Dağılımı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Yardım Türü Dağılımı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <Suspense fallback={<ChartLoading />}>
                  <LazyResponsiveContainer width="100%" height={300}>
                    <LazyPieChart>
                      <LazyPie
                        data={reportData.aidTypeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.aidTypeDistribution.map((entry, index) => (
                          <LazyCell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </LazyPie>
                      <LazyTooltip />
                    </LazyPieChart>
                  </LazyResponsiveContainer>
                </Suspense>
              </CorporateCardContent>
            </CorporateCard>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle>Aylık Yardım Trendi</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <Suspense fallback={<ChartLoading />}>
                <LazyResponsiveContainer width="100%" height={400}>
                  <LazyLineChart data={reportData.monthlyAids}>
                    <LazyCartesianGrid strokeDasharray="3 3" />
                    <LazyXAxis dataKey="month" />
                    <LazyYAxis />
                    <LazyTooltip />
                    <LazyLegend />
                    <LazyLine type="monotone" dataKey="amount" stroke="colors.chart[1]" strokeWidth={2} />
                    <LazyLine type="monotone" dataKey="count" stroke="colors.chart[2]" strokeWidth={2} />
                  </LazyLineChart>
                </LazyResponsiveContainer>
              </Suspense>
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
            {/* İhtiyaç Sahibi Kategorileri */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>İhtiyaç Sahibi Kategorileri</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <Suspense fallback={<ChartLoading />}>
                  <LazyResponsiveContainer width="100%" height={300}>
                    <LazyBarChart data={reportData.beneficiaryCategories}>
                      <LazyCartesianGrid strokeDasharray="3 3" />
                      <LazyXAxis dataKey="category" />
                      <LazyYAxis />
                      <LazyTooltip />
                      <LazyBar dataKey="count" fill="colors.chart[2]" />
                    </LazyBarChart>
                  </LazyResponsiveContainer>
                </Suspense>
              </CorporateCardContent>
            </CorporateCard>

            {/* Yardım Türü Detay */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Yardım Türü Detayı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <Suspense fallback={<ChartLoading />}>
                  <LazyResponsiveContainer width="100%" height={300}>
                    <LazyBarChart data={reportData.aidTypeDistribution} layout="horizontal">
                      <LazyCartesianGrid strokeDasharray="3 3" />
                      <LazyXAxis type="number" />
                      <LazyYAxis dataKey="name" type="category" />
                      <LazyTooltip />
                      <LazyBar dataKey="value" fill="colors.chart[1]" />
                    </LazyBarChart>
                  </LazyResponsiveContainer>
                </Suspense>
              </CorporateCardContent>
            </CorporateCard>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle>Başvuru Trendleri</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <Suspense fallback={<ChartLoading />}>
                <LazyResponsiveContainer width="100%" height={400}>
                  <LazyLineChart data={reportData.applicationTrends}>
                    <LazyCartesianGrid strokeDasharray="3 3" />
                    <LazyXAxis dataKey="date" />
                    <LazyYAxis />
                    <LazyTooltip />
                    <LazyLegend />
                    <LazyLine type="monotone" dataKey="pending" stroke="colors.chart[3]" strokeWidth={2} />
                    <LazyLine type="monotone" dataKey="approved" stroke="colors.chart[2]" strokeWidth={2} />
                    <LazyLine type="monotone" dataKey="rejected" stroke="colors.chart[4]" strokeWidth={2} />
                  </LazyLineChart>
                </LazyResponsiveContainer>
              </Suspense>
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}