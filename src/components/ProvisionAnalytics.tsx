import { useMemo } from 'react'
import {
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Pie,
  Cell
} from 'recharts'
import type { ProvisionRequest } from '../types/provision'

interface ProvisionAnalyticsProps {
  requests: ProvisionRequest[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ProvisionAnalytics({ requests }: ProvisionAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalRequests = requests.length
    const pendingRequests = requests.filter(r => ['taslak', 'gönderildi', 'işlemde'].includes(r.status)).length
    const approvedRequests = requests.filter(r => r.approvalStatus === 'onaylandı').length
    const completedRequests = requests.filter(r => r.status === 'tamamlandı').length
    const totalRequestedAmount = requests.reduce((sum, r) => sum + r.totalAmount, 0)
    const totalPaidAmount = requests.reduce((sum, r) => sum + r.paidAmount, 0)
    const totalRemainingAmount = requests.reduce((sum, r) => sum + r.remainingAmount, 0)
    const totalBeneficiaries = requests.reduce((sum, r) => sum + r.beneficiaryCount, 0)
    const averageRequestAmount = totalRequests > 0 ? totalRequestedAmount / totalRequests : 0
    const paymentCompletionRate = totalRequestedAmount > 0 ? (totalPaidAmount / totalRequestedAmount) * 100 : 0

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
      totalRequestedAmount,
      totalPaidAmount,
      totalRemainingAmount,
      totalBeneficiaries,
      averageRequestAmount,
      paymentCompletionRate
    }
  }, [requests])

  const departmentData = useMemo(() => {
    const departments = requests.reduce((acc, request) => {
      acc[request.department] = (acc[request.department] || 0) + request.totalAmount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(departments).map(([name, value]) => ({ name, value }))
  }, [requests])

  const priorityData = useMemo(() => {
    const priorities = requests.reduce((acc, request) => {
      acc[request.priority] = (acc[request.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(priorities).map(([name, value]) => ({ name, value }))
  }, [requests])

  const statusData = useMemo(() => {
    const statuses = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statuses).map(([name, value]) => ({ name, value }))
  }, [requests])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Toplam Talep</h3>
          <p className="text-2xl font-bold text-blue-900">{analytics.totalRequests}</p>
          <p className="text-xs text-blue-600">Beklemede: {analytics.pendingRequests}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Toplam Tutar</h3>
          <p className="text-2xl font-bold text-green-900">
            {analytics.totalRequestedAmount.toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-green-600">
            Ort: {analytics.averageRequestAmount.toLocaleString('tr-TR')} ₺
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Ödeme Durumu</h3>
          <p className="text-2xl font-bold text-yellow-900">
            %{analytics.paymentCompletionRate.toFixed(1)}
          </p>
          <p className="text-xs text-yellow-600">
            Ödenen: {analytics.totalPaidAmount.toLocaleString('tr-TR')} ₺
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Faydalanıcı</h3>
          <p className="text-2xl font-bold text-purple-900">{analytics.totalBeneficiaries}</p>
          <p className="text-xs text-purple-600">Onaylanan: {analytics.approvedRequests}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Department Analysis */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Departmana Göre Analiz</h3>
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString('tr-TR')} ₺`, 'Tutar']}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Analysis */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Öncelik Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent ? percent * 100 : 0).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Analysis */}
        <div className="bg-white p-4 rounded-lg border col-span-2">
          <h3 className="text-lg font-medium mb-4">Durum Analizi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}