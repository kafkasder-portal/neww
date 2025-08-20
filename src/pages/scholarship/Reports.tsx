import { useState, useMemo, Suspense, lazy } from 'react'
import StatCard from '@components/StatCard'
import { Users, GraduationCap, DollarSign, TrendingUp, Download } from 'lucide-react'
import { exportToCsv } from '@lib/exportToCsv'

// Lazy load recharts components
const LazyResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })))
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })))
const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })))
const LazyLineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })))
const LazyBar = lazy(() => import('recharts').then(module => ({ default: module.Bar })))
const LazyPie = lazy(() => import('recharts').then(module => ({ default: module.Pie })))
const LazyCell = lazy(() => import('recharts').then(module => ({ default: module.Cell })))
const LazyLine = lazy(() => import('recharts').then(module => ({ default: module.Line })))
const LazyXAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })))
const LazyYAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })))
const LazyCartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })))
const LazyTooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })))

// Chart loading component
const ChartLoading = () => (
  <div className="flex h-[300px] items-center justify-center">
    <div className="text-sm text-muted-foreground">Grafik yükleniyor...</div>
  </div>
)

const monthlyData = [
  { month: 'Ocak', students: 45, amount: 112500 },
  { month: 'Şubat', students: 52, amount: 130000 },
  { month: 'Mart', students: 48, amount: 120000 },
  { month: 'Nisan', students: 55, amount: 137500 },
  { month: 'Mayıs', students: 60, amount: 150000 },
  { month: 'Haziran', students: 58, amount: 145000 },
]

const scholarshipTypes = [
  { name: 'Eğitim Bursu', value: 45, color: '#3B82F6' },
  { name: 'Barınma Bursu', value: 25, color: '#10B981' },
  { name: 'Beslenme Bursu', value: 20, color: '#F59E0B' },
  { name: 'Kitap Bursu', value: 10, color: '#EF4444' },
]

const genderData = [
  { name: 'Kız', value: 60, color: '#EC4899' },
  { name: 'Erkek', value: 40, color: '#3B82F6' },
]

const performanceData = [
  { month: 'Ocak', average: 3.2 },
  { month: 'Şubat', average: 3.3 },
  { month: 'Mart', average: 3.4 },
  { month: 'Nisan', average: 3.5 },
  { month: 'Mayıs', average: 3.6 },
  { month: 'Haziran', average: 3.7 },
]

export default function ScholarshipReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024')
  const [reportType, setReportType] = useState('monthly')

  const totalStats = useMemo(() => {
    const totalStudents = monthlyData[monthlyData.length - 1].students
    const totalAmount = monthlyData.reduce((sum, item) => sum + item.amount, 0)
    const avgAmount = Math.round(totalAmount / monthlyData.length)
    const growth = Math.round(((monthlyData[monthlyData.length - 1].students - monthlyData[0].students) / monthlyData[0].students) * 100)
    
    return { totalStudents, totalAmount, avgAmount, growth }
  }, [])

  const exportReport = () => {
    const reportData = monthlyData.map(item => ({
      'Ay': item.month,
      'Öğrenci Sayısı': item.students,
      'Toplam Tutar': item.amount,
      'Ortalama Tutar': Math.round(item.amount / item.students)
    }))
    exportToCsv(`burs-raporu-${selectedPeriod}.csv`, reportData)
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Filtreler */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Burs Raporları</h1>
          <p className="text-gray-600">Detaylı istatistikler ve analitik raporlar</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="monthly">Aylık</option>
            <option value="quarterly">Üç Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
          
          <button
            onClick={exportReport}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Download size={16} />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Öğrenci"
          value={totalStats.totalStudents.toString()}
          icon={Users}
        />
        <StatCard
          title="Toplam Burs Tutarı"
          value={`₺${totalStats.totalAmount.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Aylık Ortalama"
          value={`₺${totalStats.avgAmount.toLocaleString()}`}
          icon={TrendingUp}
        />
        <StatCard
          title="Aktif Burslar"
          value="95%"
          icon={GraduationCap}
        />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
        {/* Aylık Öğrenci Sayısı */}
        <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Öğrenci Sayısı</h3>
          <Suspense fallback={<ChartLoading />}>
            <LazyResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={monthlyData}>
                <LazyCartesianGrid strokeDasharray="3 3" />
                <LazyXAxis dataKey="month" />
                <LazyYAxis />
                <LazyTooltip />
                <LazyBar dataKey="students" fill="#3B82F6" />
              </LazyBarChart>
            </LazyResponsiveContainer>
          </Suspense>
        </div>

        {/* Burs Türleri Dağılımı */}
        <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Burs Türleri Dağılımı</h3>
          <Suspense fallback={<ChartLoading />}>
            <LazyResponsiveContainer width="100%" height={300}>
              <LazyPieChart>
                <LazyPie
                  data={scholarshipTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {scholarshipTypes.map((entry, index) => (
                    <LazyCell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </LazyPie>
                <LazyTooltip />
              </LazyPieChart>
            </LazyResponsiveContainer>
          </Suspense>
        </div>

        {/* Aylık Burs Tutarları */}
        <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Burs Tutarları</h3>
          <Suspense fallback={<ChartLoading />}>
            <LazyResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={monthlyData}>
                <LazyCartesianGrid strokeDasharray="3 3" />
                <LazyXAxis dataKey="month" />
                <LazyYAxis />
                <LazyTooltip formatter={(value) => [`₺${value.toLocaleString()}`, 'Tutar']} />
                <LazyBar dataKey="amount" fill="#10B981" />
              </LazyBarChart>
            </LazyResponsiveContainer>
          </Suspense>
        </div>

        {/* Cinsiyet Dağılımı */}
        <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cinsiyet Dağılımı</h3>
          <Suspense fallback={<ChartLoading />}>
            <LazyResponsiveContainer width="100%" height={300}>
              <LazyPieChart>
                <LazyPie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genderData.map((entry, index) => (
                    <LazyCell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </LazyPie>
                <LazyTooltip />
              </LazyPieChart>
            </LazyResponsiveContainer>
          </Suspense>
        </div>
      </div>

      {/* Akademik Performans Trendi */}
      <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Akademik Performans Trendi</h3>
        <Suspense fallback={<ChartLoading />}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyLineChart data={performanceData}>
              <LazyCartesianGrid strokeDasharray="3 3" />
              <LazyXAxis dataKey="month" />
              <LazyYAxis domain={[0, 4]} />
              <LazyTooltip formatter={(value) => [value, 'Not Ortalaması']} />
              <LazyLine type="monotone" dataKey="average" stroke="#F59E0B" strokeWidth={3} />
            </LazyLineChart>
          </LazyResponsiveContainer>
        </Suspense>
      </div>

      {/* Detaylı Tablo */}
      <div className="bg-white rounded-lg border p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı Aylık Rapor</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ay</th>
                <th className="text-right py-2">Öğrenci Sayısı</th>
                <th className="text-right py-2">Toplam Tutar</th>
                <th className="text-right py-2">Ortalama Tutar</th>
                <th className="text-right py-2">Büyüme</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item, index) => {
                const prevMonth = index > 0 ? monthlyData[index - 1] : null
                const growth = prevMonth ? Math.round(((item.students - prevMonth.students) / prevMonth.students) * 100) : 0
                
                return (
                  <tr key={item.month} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{item.month}</td>
                    <td className="text-right py-2">{item.students}</td>
                    <td className="text-right py-2">₺{item.amount.toLocaleString()}</td>
                    <td className="text-right py-2">₺{Math.round(item.amount / item.students).toLocaleString()}</td>
                    <td className={`text-right py-2 ${
                      growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {growth > 0 ? '+' : ''}{growth}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}