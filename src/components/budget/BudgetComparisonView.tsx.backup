import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Calendar,
  DollarSign,
  Target,
  Activity
} from 'lucide-react'
import { Budget, BudgetCategory, ActualExpense } from '@/types/budget'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { useDesignSystem } from '@/hooks/useDesignSystem'

interface BudgetComparisonViewProps {
  budget: Budget
  actualExpenses: ActualExpense[]
  selectedPeriod?: string
}

interface ComparisonData {
  categoryName: string
  budgeted: number
  actual: number
  variance: number
  variancePercentage: number
  status: 'under' | 'over' | 'on-track'
}

interface MonthlyComparison {
  month: string
  budgeted: number
  actual: number
  variance: number
}

const COLORS = ['COLORS.chart[1]', 'COLORS.chart[2]', 'COLORS.chart[3]', 'COLORS.chart[4]', 'COLORS.chart[5]']

export function BudgetComparisonView({ budget, actualExpenses, selectedPeriod }: BudgetComparisonViewProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyComparison[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewType, setViewType] = useState<'category' | 'monthly'>('category')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateComparisons()
  }, [budget, actualExpenses, selectedPeriod])

  const calculateComparisons = async () => {
    setLoading(true)
    try {
      // Calculate category-wise comparison
      const categoryComparisons: ComparisonData[] = budget.categories.map(category => {
        const actualAmount = actualExpenses
          .filter(expense => expense.categoryId === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0)
        
        const variance = actualAmount - category.budgetedAmount
        const variancePercentage = category.budgetedAmount > 0 
          ? (variance / category.budgetedAmount) * 100 
          : 0
        
        let status: 'under' | 'over' | 'on-track' = 'on-track'
        if (Math.abs(variancePercentage) > 10) {
          status = variance > 0 ? 'over' : 'under'
        }
        
        return {
          categoryName: category.categoryName,
          budgeted: category.budgetedAmount,
          actual: actualAmount,
          variance,
          variancePercentage,
          status
        }
      })
      
      setComparisonData(categoryComparisons)
      
      // Calculate monthly comparison
      const monthlyComparisons: MonthlyComparison[] = []
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                     'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      
      months.forEach((month, index) => {
        const monthlyBudgeted = budget.categories.reduce((sum, category) => {
          const monthlyAllocation = category.monthlyAllocations?.[index] || 
                                   category.budgetedAmount / 12
          return sum + monthlyAllocation
        }, 0)
        
        const monthlyActual = actualExpenses
          .filter(expense => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() === index
          })
          .reduce((sum, expense) => sum + expense.amount, 0)
        
        monthlyComparisons.push({
          month,
          budgeted: monthlyBudgeted,
          actual: monthlyActual,
          variance: monthlyActual - monthlyBudgeted
        })
      })
      
      setMonthlyData(monthlyComparisons)
    } catch (error) {
      console.error('Karşılaştırma hesaplanırken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const csvData = comparisonData.map(item => ({
      'Kategori': item.categoryName,
      'Bütçe': item.budgeted,
      'Gerçekleşen': item.actual,
      'Varyans': item.variance,
      'Varyans %': item.variancePercentage.toFixed(2)
    }))
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `butce-karsilastirma-${budget.name}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalBudgeted = comparisonData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = comparisonData.reduce((sum, item) => sum + item.actual, 0)
  const totalVariance = totalActual - totalBudgeted
  const totalVariancePercentage = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0

  const overBudgetCategories = comparisonData.filter(item => item.status === 'over').length
  const underBudgetCategories = comparisonData.filter(item => item.status === 'under').length
  const onTrackCategories = comparisonData.filter(item => item.status === 'on-track').length

  const pieChartData = [
    { name: 'Hedefte', value: onTrackCategories, color: 'COLORS.chart[2]' },
    { name: 'Bütçe Aşımı', value: overBudgetCategories, color: 'COLORS.chart[4]' },
    { name: 'Bütçe Altı', value: underBudgetCategories, color: 'COLORS.chart[1]' }
  ]

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Karşılaştırma hesaplanıyor...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Toplam Bütçe</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Gerçekleşen</p>
                <p className="text-2xl font-bold">{formatCurrency(totalActual)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {totalVariance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Varyans</p>
                <p className={`text-2xl font-bold ${
                  totalVariance >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Varyans %</p>
                <p className={`text-2xl font-bold ${
                  totalVariancePercentage >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {totalVariancePercentage >= 0 ? '+' : ''}{formatPercentage(totalVariancePercentage)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kategori Durumu</CardTitle>
            <CardDescription>
              Kategorilerin bütçe performansı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Hedefte</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {onTrackCategories} kategori
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Bütçe Aşımı</span>
                </div>
                <Badge variant="outline" className="text-red-600">
                  {overBudgetCategories} kategori
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Bütçe Altı</span>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  {underBudgetCategories} kategori
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Dağılımı</CardTitle>
            <CardDescription>
              Performans durumuna göre kategori dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Comparison View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bütçe vs Gerçekleşen Karşılaştırması</CardTitle>
              <CardDescription>
                Detaylı kategori ve dönem bazlı analiz
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Kategori Bazlı</SelectItem>
                  <SelectItem value="monthly">Aylık Bazlı</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="category">Kategori Analizi</TabsTrigger>
              <TabsTrigger value="monthly">Aylık Trend</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-4">
              {/* Category Comparison Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="categoryName" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        formatCurrency(value), 
                        name === 'budgeted' ? 'Bütçe' : 'Gerçekleşen'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="budgeted" fill="colors.chart[1]" name="Bütçe" />
                    <Bar dataKey="actual" fill="colors.chart[2]" name="Gerçekleşen" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Details Table */}
              <div className="space-y-3">
                {comparisonData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{item.categoryName}</h4>
                        <Badge 
                          variant={item.status === 'on-track' ? 'default' : 'secondary'}
                          className={`${
                            item.status === 'over' ? 'bg-red-100 text-red-800' :
                            item.status === 'under' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.status === 'over' && 'Bütçe Aşımı'}
                          {item.status === 'under' && 'Bütçe Altı'}
                          {item.status === 'on-track' && 'Hedefte'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bütçe</p>
                          <p className="font-semibold">{formatCurrency(item.budgeted)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gerçekleşen</p>
                          <p className="font-semibold">{formatCurrency(item.actual)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Varyans</p>
                          <p className={`font-semibold ${
                            item.variance >= 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Varyans %</p>
                          <p className={`font-semibold ${
                            item.variancePercentage >= 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {item.variancePercentage >= 0 ? '+' : ''}{formatPercentage(item.variancePercentage)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Gerçekleşme Oranı</span>
                          <span>{formatPercentage((item.actual / item.budgeted) * 100)}</span>
                        </div>
                        <Progress 
                          value={Math.min((item.actual / item.budgeted) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              {/* Monthly Trend Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        formatCurrency(value), 
                        name === 'budgeted' ? 'Bütçe' : 'Gerçekleşen'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="budgeted" 
                      stroke="colors.chart[1]" 
                      strokeWidth={2}
                      name="Bütçe"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="colors.chart[2]" 
                      strokeWidth={2}
                      name="Gerçekleşen"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {monthlyData.slice(0, 12).map((month, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{month.month}</h4>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bütçe:</span>
                          <span className="font-medium">{formatCurrency(month.budgeted)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gerçekleşen:</span>
                          <span className="font-medium">{formatCurrency(month.actual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Varyans:</span>
                          <span className={`font-medium ${
                            month.variance >= 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {month.variance >= 0 ? '+' : ''}{formatCurrency(month.variance)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alerts and Recommendations */}
      {(overBudgetCategories > 0 || Math.abs(totalVariancePercentage) > 15) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dikkat:</strong> 
            {overBudgetCategories > 0 && ` ${overBudgetCategories} kategori bütçe aşımında.`}
            {Math.abs(totalVariancePercentage) > 15 && ` Toplam varyans %${Math.abs(totalVariancePercentage).toFixed(1)} seviyesinde.`}
            {' '}Bütçe revizyonu düşünmelisiniz.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}