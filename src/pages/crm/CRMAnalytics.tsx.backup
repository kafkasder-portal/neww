import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { toast } from 'sonner'



interface CRMAnalyticsProps {
  onRefresh: () => void
}

export default function CRMAnalytics({ onRefresh: _onRefresh }: CRMAnalyticsProps) {
  const { colors } = useDesignSystem();

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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Analitikleri</h1>
          <p className="text-gray-600">Bağışçı ve kampanya performans raporları</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Bağışçı</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalDonors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{analyticsData.donorGrowth}%</span>
            <span className="text-sm text-gray-500 ml-1">bu dönem</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Bağışçı</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeDonors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Aktivite oranı: </span>
            <span className="text-sm font-medium text-gray-900 ml-1">
              {formatPercentage((analyticsData.activeDonors / analyticsData.totalDonors) * 100)}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Bağış</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalDonations)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{analyticsData.donorGrowth}%</span>
            <span className="text-sm text-gray-500 ml-1">bu dönem</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Bağış</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageDonation)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Medyan: </span>
            <span className="text-sm font-medium text-gray-900 ml-1">
              {formatCurrency(analyticsData.medianDonation)}
            </span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bağış Trendleri</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="donations">Bağış Miktarı</option>
              <option value="count">Bağış Sayısı</option>
              <option value="donors">Bağışçı Sayısı</option>
            </select>
          </div>
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
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Donor Segments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Bağışçı Segmentleri</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.donorSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="colors.chart[1]"
                dataKey="value"
              >
                {analyticsData.donorSegments.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Campaign Performance & Communication Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Kampanya Performansı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="raised" fill="#10B981" name="Toplanan" />
              <Bar dataKey="target" fill="COLORS.neutral[200]" name="Hedef" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Communication Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">İletişim Aktivitesi</h3>
          <div className="space-y-4">
            {analyticsData.communicationActivity.map((activity, _index) => (
              <div key={_index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'phone' && <Phone className="w-5 h-5 text-green-600" />}
                  {activity.type === 'meeting' && <Calendar className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-orange-600" />}
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
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Elde Tutma Oranı</h4>
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPercentage(analyticsData.retentionRate)}</p>
          <p className="text-sm text-gray-600 mt-2">Geçen yıla göre +2.3%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Yeni Bağışçılar</h4>
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.newDonors}</p>
          <p className="text-sm text-gray-600 mt-2">Bu dönem</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Ortalama Yanıt Süresi</h4>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.avgResponseTime}h</p>
          <p className="text-sm text-gray-600 mt-2">İletişim yanıtları</p>
        </Card>
      </div>
    </div>
  )
}