import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { supabase } from '../lib/supabase'
import { SkeletonCard } from './Loading'
import { Calendar } from 'lucide-react'

// Mock data for demonstration - replace with real data
const mockDonationTrend = [
  { month: 'Oca', donations: 45000, beneficiaries: 120 },
  { month: 'Şub', donations: 52000, beneficiaries: 135 },
  { month: 'Mar', donations: 48000, beneficiaries: 128 },
  { month: 'Nis', donations: 61000, beneficiaries: 145 },
  { month: 'May', donations: 55000, beneficiaries: 138 },
  { month: 'Haz', donations: 67000, beneficiaries: 156 }
]

const mockAidDistribution = [
  { name: 'Nakdi Yardım', value: 45, color: 'COLORS.brand.primary800' },
  { name: 'Ayni Yardım', value: 25, color: 'COLORS.semantic.success700' },
  { name: 'Eğitim Desteği', value: 20, color: 'COLORS.semantic.warning700' },
  { name: 'Sağlık Yardımı', value: 10, color: 'COLORS.semantic.danger700' }
]

const mockWeeklyStats = [
  { day: 'Pzt', applications: 12, donations: 8500 },
  { day: 'Sal', applications: 8, donations: 6200 },
  { day: 'Çar', applications: 15, donations: 9800 },
  { day: 'Per', applications: 20, donations: 12400 },
  { day: 'Cum', applications: 18, donations: 11200 },
  { day: 'Cmt', applications: 6, donations: 4500 },
  { day: 'Paz', applications: 4, donations: 3200 }
]

const mockRegionalData = [
  { region: 'İstanbul', beneficiaries: 450, amount: 125000 },
  { region: 'Ankara', beneficiaries: 320, amount: 89000 },
  { region: 'İzmir', beneficiaries: 280, amount: 76000 },
  { region: 'Bursa', beneficiaries: 180, amount: 51000 },
  { region: 'Antalya', beneficiaries: 150, amount: 42000 },
  { region: 'Diğer', beneficiaries: 220, amount: 61000 }
]

interface DashboardData {
  totalBeneficiaries: number
  totalDonations: number
  totalAid: number
  activeApplications: number
  monthlyGrowth: number
  loading: boolean
}

// Direct recharts imports - lazy loading removed for simplicity
import { COLORS } from '@/constants/design-system'

// Alternative inline component for simple charts

export const DashboardCharts = () => {
  const [data, setData] = useState<DashboardData>({
    totalBeneficiaries: 0,
    totalDonations: 0,
    totalAid: 0,
    activeApplications: 0,
    monthlyGrowth: 0,
    loading: true
  })

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time subscriptions
    const beneficiariesSubscription = supabase
      .channel('beneficiaries-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'beneficiaries' },
        () => fetchDashboardData()
      )
      .subscribe()

    const applicationsSubscription = supabase
      .channel('applications-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => fetchDashboardData()
      )
      .subscribe()

    return () => {
      beneficiariesSubscription.unsubscribe()
      applicationsSubscription.unsubscribe()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [beneficiariesResult, applicationsResult] = await Promise.all([
        supabase.from('beneficiaries').select('*', { count: 'exact' }),
        supabase.from('applications').select('*', { count: 'exact' })
      ])

      setData({
        totalBeneficiaries: beneficiariesResult.count || 0,
        totalDonations: 450000, // Mock data - replace with real donation queries
        totalAid: 380000, // Mock data
        activeApplications: applicationsResult.count || 0,
        monthlyGrowth: 12.5, // Mock data
        loading: false
      })
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  if (data.loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">İstatistik ve Analizler</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as string)}
            className="border rounded-md px-3 py-1 text-sm bg-background"
          >
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Bağış Trendi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDonationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="COLORS.brand.primary800" strokeWidth={2} />
                <Line type="monotone" dataKey="beneficiaries" stroke="COLORS.semantic.success700" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aid Distribution Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Yardım Dağılımı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAidDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="colors.chart[1]"
                  dataKey="value"
                >
                  {mockAidDistribution.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Stats Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Haftalık İstatistikler</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="COLORS.brand.primary800" />
                <Bar dataKey="donations" fill="COLORS.semantic.success700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Data Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Bölgesel Veriler</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRegionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="beneficiaries" stackId="1" stroke="COLORS.brand.primary800" fill="COLORS.brand.primary800" />
                <Area type="monotone" dataKey="amount" stackId="1" stroke="COLORS.semantic.success700" fill="COLORS.semantic.success700" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ortalama Bağış</p>
              <p className="text-2xl font-bold">₺2,450</p>
            </div>
            <div className="text-green-600 text-sm">+8.2%</div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Başvuru/Onay Oranı</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
            <div className="text-green-600 text-sm">+2.1%</div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Bağışçı</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div className="text-green-600 text-sm">+15.3%</div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hedef Tamamlama</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
            <div className="text-blue-600 text-sm">Bu ay</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCharts
