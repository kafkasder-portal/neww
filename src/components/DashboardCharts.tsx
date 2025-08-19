import { useState, useEffect, lazy, Suspense } from 'react'
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
  { name: 'Nakdi Yardım', value: 45, color: '#0F3A7A' },
  { name: 'Ayni Yardım', value: 25, color: '#1D8348' },
  { name: 'Eğitim Desteği', value: 20, color: '#B7950B' },
  { name: 'Sağlık Yardımı', value: 10, color: '#C0392B' }
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

/**
 * Lazily loads the `RechartsBundle` component for use within the dashboard charts.
 * 
 * This approach enables code-splitting, improving the application's performance by loading
 * the charting bundle only when it is needed.
 *
 * @remarks
 * The `RechartsBundle` component is imported asynchronously using React's `lazy` function.
 *
 * @see {@link https://react.dev/reference/react/lazy | React.lazy documentation}
 */
const LazyRechartsBundle = lazy(() => import('./RechartsBundle'));

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
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border rounded-md px-3 py-1 text-sm bg-background"
          >
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
      </div>

      <Suspense fallback={<div>Loading chart...</div>}>
        <LazyRechartsBundle
          donationTrend={mockDonationTrend}
          aidDistribution={mockAidDistribution}
          weeklyStats={mockWeeklyStats}
          regionalData={mockRegionalData}
        />
      </Suspense>

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
