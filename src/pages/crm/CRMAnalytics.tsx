import { 
  CorporateButton,
  CorporateCard,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateCardContent,
  FormSelect,
  KPICard
} from '@/components/ui/corporate/CorporateComponents'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import { DonorCRMService } from '@/services/donorCRMService'
import type {
  CRMAnalyticsData
} from '@/types/donors'
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Heart,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  LineChart,
  PieChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
  Bar
} from 'recharts'

interface CRMAnalyticsProps {
  onRefresh: () => void
}

export default function CRMAnalytics({ onRefresh: _onRefresh }: CRMAnalyticsProps) {
  const { colors } = useDesignSystem()

  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<CRMAnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('donations')

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await DonorCRMService.getAnalytics(dateRange)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Analitik veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const COLORS = [colors.chart[1], colors.chart[2], colors.chart[3], colors.chart[4], colors.chart[5]]

  if (loading || !analyticsData) {
    return (
      <div className="p-6 bg-card rounded-lg border">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-card rounded-lg border space-y-6">
      <CorporateCard>
        <CorporateCardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CorporateCardTitle>CRM Analitikleri</CorporateCardTitle>
            <div className="flex items-center gap-2">
              <FormSelect
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
                <option value="1y">Son 1 Yıl</option>
              </FormSelect>
              <CorporateButton onClick={loadAnalytics} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Yenile
              </CorporateButton>
              <CorporateButton>
                <Download className="w-4 h-4 mr-2" />
                Rapor İndir
              </CorporateButton>
            </div>
          </div>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-4 mb-6">
            <KPICard
              title="Toplam Bağışçı"
              value={analyticsData.totalDonors.toLocaleString()}
              icon={<Users />}
              change={{ value: analyticsData.donorGrowth, isPositive: true }}
            />
            <KPICard
              title="Aktif Bağışçı"
              value={analyticsData.activeDonors.toLocaleString()}
              icon={<UserCheck />}
            />
            <KPICard
              title="Toplam Bağış"
              value={formatCurrency(analyticsData.totalDonations)}
              icon={<DollarSign />}
              change={{ value: analyticsData.donorGrowth, isPositive: true }}
            />
            <KPICard
              title="Ortalama Bağış"
              value={formatCurrency(analyticsData.averageDonation)}
              icon={<Heart />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4 mb-6">
            <CorporateCard>
              <CorporateCardHeader>
                <div className="flex items-center justify-between">
                  <CorporateCardTitle>Bağış Trendleri</CorporateCardTitle>
                  <FormSelect
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="text-sm"
                  >
                    <option value="donations">Bağış Miktarı</option>
                    <option value="count">Bağış Sayısı</option>
                    <option value="donors">Bağışçı Sayısı</option>
                  </FormSelect>
                </div>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={colors.brand.primary600}
                      strokeWidth={2}
                      dot={{ fill: colors.brand.primary600 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Bağışçı Segmentleri</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.donorSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={colors.chart[1]}
                      dataKey="value"
                    >
                      {analyticsData.donorSegments.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Kampanya Performansı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.campaignPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="raised" fill={colors.semantic.success} name="Toplanan" />
                    <Bar dataKey="target" fill={colors.neutral[300]} name="Hedef" />
                  </BarChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>İletişim Aktivitesi</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent className="space-y-4">
                {analyticsData.communicationActivity.map((activity, _index) => (
                  <div key={_index} className="flex items-center justify-between p-4 bg-bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-bg-primary/10 p-2 rounded-full">
                        {activity.type === 'email' && <Mail className="w-5 h-5 text-bg-primary" />}
                        {activity.type === 'phone' && <Phone className="w-5 h-5 text-bg-primary" />}
                        {activity.type === 'meeting' && <Calendar className="w-5 h-5 text-bg-primary" />}
                        {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-bg-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.label}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{activity.count}</p>
                      <p className="text-sm text-gray-600">bu dönem</p>
                    </div>
                  </div>
                ))}
              </CorporateCardContent>
            </CorporateCard>
          </div>
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}