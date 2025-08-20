import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { Budget } from '@/types/budget'
import { useDesignSystem } from '@/hooks/useDesignSystem'

interface BudgetVarianceAnalysisProps {
  budgets: Budget[]
  selectedBudgetId?: string
  onBudgetSelect?: (budgetId: string) => void
}

interface VarianceData {
  category: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
  status: 'over' | 'under' | 'on-track'
}

interface MonthlyVariance {
  month: string
  budgeted: number
  actual: number
  variance: number
}

const COLORS = ['COLORS.chart[1]', 'COLORS.chart[2]', 'COLORS.chart[3]', 'COLORS.chart[4]', 'COLORS.chart[5]', 'COLORS.chart[6]']

export function BudgetVarianceAnalysis({ budgets, selectedBudgetId, onBudgetSelect }: BudgetVarianceAnalysisProps) {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [varianceData, setVarianceData] = useState<VarianceData[]>([])
  const [monthlyVariances, setMonthlyVariances] = useState<MonthlyVariance[]>([])
  const [viewType, setViewType] = useState<'category' | 'monthly' | 'trend'>('category')
  const [filterPeriod, setFilterPeriod] = useState<'current' | 'ytd' | 'custom'>('current')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedBudgetId) {
      const budget = budgets.find(b => b.id === selectedBudgetId)
      if (budget) {
        setSelectedBudget(budget)
        loadVarianceData(budget)
      }
    } else if (budgets.length > 0) {
      setSelectedBudget(budgets[0])
      loadVarianceData(budgets[0])
    }
  }, [selectedBudgetId, budgets])

  const loadVarianceData = async (budget: Budget) => {
    setLoading(true)
    try {
      // Mock varyans verilerini yükle
      const mockVarianceData: VarianceData[] = budget.categories.map(category => {
        const actualAmount = category.allocatedAmount * (0.7 + Math.random() * 0.6) // %70-130 arası gerçekleşme
        const variance = actualAmount - category.allocatedAmount
        const variancePercent = (variance / category.allocatedAmount) * 100
        
        let status: 'over' | 'under' | 'on-track' = 'on-track'
        if (Math.abs(variancePercent) > 10) {
          status = variancePercent > 0 ? 'over' : 'under'
        }

        return {
          category: category.name,
          budgeted: category.allocatedAmount,
          actual: actualAmount,
          variance,
          variancePercent,
          status
        }
      })

      // Mock aylık varyans verileri
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      const mockMonthlyVariances: MonthlyVariance[] = months.slice(0, 8).map(month => {
        const budgeted = budget.totalAmount / 12
        const actual = budgeted * (0.8 + Math.random() * 0.4)
        return {
          month,
          budgeted,
          actual,
          variance: actual - budgeted
        }
      })

      setVarianceData(mockVarianceData)
      setMonthlyVariances(mockMonthlyVariances)
    } catch (error) {
      toast.error('Varyans verileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleBudgetChange = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId)
    if (budget) {
      setSelectedBudget(budget)
      loadVarianceData(budget)
      onBudgetSelect?.(budgetId)
    }
  }

  const exportVarianceReport = () => {
    if (!selectedBudget) return
    
    const reportData = {
      budget: selectedBudget.name,
      period: selectedBudget.period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalBudgeted: varianceData.reduce((sum, item) => sum + item.budgeted, 0),
        totalActual: varianceData.reduce((sum, item) => sum + item.actual, 0),
        totalVariance: varianceData.reduce((sum, item) => sum + item.variance, 0)
      },
      categoryVariances: varianceData,
      monthlyVariances
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-variance-${selectedBudget.name}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Varyans raporu indirildi')
  }

  const getVarianceColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-red-100 text-red-800'
      case 'under': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getVarianceIcon = (status: string) => {
    switch (status) {
      case 'over': return <TrendingUp className="h-4 w-4" />
      case 'under': return <TrendingDown className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p>Varyans analizi yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!selectedBudget) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Analiz için bir bütçe seçin</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bütçe Varyans Analizi</h2>
          <p className="text-gray-600">Bütçe vs gerçekleşen performans analizi</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedBudget.id} onValueChange={handleBudgetChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgets.map(budget => (
                <SelectItem key={budget.id} value={budget.id}>
                  {budget.name} ({budget.period})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportVarianceReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Bütçe</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(varianceData.reduce((sum, item) => sum + item.budgeted, 0))}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gerçekleşen</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(varianceData.reduce((sum, item) => sum + item.actual, 0))}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Varyans</p>
              <p className={`text-2xl font-bold ${
                varianceData.reduce((sum, item) => sum + item.variance, 0) >= 0 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {formatCurrency(varianceData.reduce((sum, item) => sum + item.variance, 0))}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Varyans Oranı</p>
              <p className={`text-2xl font-bold ${
                (varianceData.reduce((sum, item) => sum + item.variance, 0) / 
                 varianceData.reduce((sum, item) => sum + item.budgeted, 0)) * 100 >= 0 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {formatPercent(
                  (varianceData.reduce((sum, item) => sum + item.variance, 0) / 
                   varianceData.reduce((sum, item) => sum + item.budgeted, 0)) * 100
                )}
              </p>
            </div>
            <PieChart className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* View Type Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Görünüm:</span>
        </div>
        <div className="flex space-x-2">
          {[
            { key: 'category', label: 'Kategori Analizi', icon: BarChart3 },
            { key: 'monthly', label: 'Aylık Trend', icon: LineChart },
            { key: 'trend', label: 'Trend Analizi', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={viewType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType(key as any)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Variance Analysis */}
      {viewType === 'category' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variance Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Kategori Varyans Grafiği</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={varianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'budgeted' ? 'Bütçe' : name === 'actual' ? 'Gerçekleşen' : 'Varyans'
                  ]}
                />
                <Legend />
                <Bar dataKey="budgeted" fill="#3B82F6" name="Bütçe" />
                <Bar dataKey="actual" fill="#10B981" name="Gerçekleşen" />
                <Bar dataKey="variance" fill="#F59E0B" name="Varyans" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Variance Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detaylı Varyans Tablosu</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Kategori</th>
                    <th className="text-right p-2">Bütçe</th>
                    <th className="text-right p-2">Gerçekleşen</th>
                    <th className="text-right p-2">Varyans</th>
                    <th className="text-center p-2">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {varianceData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.category}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(item.budgeted)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(item.actual)}</td>
                      <td className={`p-2 text-right font-mono ${
                        item.variance >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(item.variance)}
                      </td>
                      <td className="p-2 text-center">
                        <Badge className={getVarianceColor(item.status)}>
                          <div className="flex items-center space-x-1">
                            {getVarianceIcon(item.status)}
                            <span>{formatPercent(item.variancePercent)}</span>
                          </div>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Monthly Trend Analysis */}
      {viewType === 'monthly' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Aylık Varyans Trendi</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={monthlyVariances}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'budgeted' ? 'Bütçe' : name === 'actual' ? 'Gerçekleşen' : 'Varyans'
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="budgeted" stroke="#3B82F6" strokeWidth={2} name="Bütçe" />
              <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Gerçekleşen" />
              <Line type="monotone" dataKey="variance" stroke="#F59E0B" strokeWidth={2} name="Varyans" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Trend Analysis */}
      {viewType === 'trend' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cumulative Variance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Kümülatif Varyans</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyVariances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Kümülatif Varyans']} />
                <Area type="monotone" dataKey="variance" stroke="colors.chart[1]" fill="colors.chart[1]" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Variance Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Varyans Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={varianceData.map(item => ({
                    name: item.category,
                    value: Math.abs(item.variance)
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="colors.chart[1]"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {varianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Varyans']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  )
}