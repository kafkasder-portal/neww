import { CorporateBadge, Card, CardContent, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { CardDescription } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import { formatCurrency } from '@/utils/formatters'
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

interface VarianceData {
  category: string
  budgeted: number
  actual: number
  variance: number
  variancePercentage: number
}

interface MonthlyVarianceData {
  month: string
  budgeted: number
  actual: number
  variance: number
}

interface BudgetVarianceChartProps {
  categoryData: VarianceData[]
  monthlyData: MonthlyVarianceData[]
  title?: string
  className?: string
}

// Use design system colors instead of hardcoded hex values

export function BudgetVarianceChart({
  categoryData,
  monthlyData,
  title = "Bütçe Varyans Analizi",
  className = ""
}: BudgetVarianceChartProps) {
  const { colors, styles } = useDesignSystem()

  // Prepare data for pie chart
  const pieData = categoryData.map(item => ({
    name: item.category,
    value: Math.abs(item.variance),
    variance: item.variance
  }))

  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'budgeted' ? 'Bütçelenen' :
                entry.dataKey === 'actual' ? 'Gerçekleşen' :
                  entry.dataKey === 'variance' ? 'Varyans' : entry.dataKey}: {' '}
              {formatCurrency(entry.value, 'TRY', 'tr-TR')}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.variance > 0 ? colors.semantic.danger : colors.semantic.success }}>
            Varyans: {formatCurrency(data.variance, 'TRY', 'tr-TR')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <CorporateCard className={className}>
      <CorporateCardHeader>
        <CorporateCardTitle>{title}</CorporateCardTitle>
        <CardDescription>
          Bütçelenen ve gerçekleşen tutarların karşılaştırmalı analizi
        </CardDescription>
      </CorporateCardHeader>
      <CorporateCardContent>
        <Tabs defaultValue="category-bar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="category-bar">Kategori Çubuk</TabsTrigger>
            <TabsTrigger value="monthly-line">Aylık Trend</TabsTrigger>
            <TabsTrigger value="variance-bar">Varyans Çubuk</TabsTrigger>
            <TabsTrigger value="distribution-pie">Dağılım Pasta</TabsTrigger>
          </TabsList>

          {/* Category Bar Chart */}
          <TabsContent value="category-bar">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value, 'TRY', 'tr-TR', { notation: 'compact' })}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="budgeted" fill={colors.brand.primary} name="Bütçelenen" />
                  <Bar dataKey="actual" fill={colors.semantic.success} name="Gerçekleşen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Monthly Line Chart */}
          <TabsContent value="monthly-line">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value, 'TRY', 'tr-TR', { notation: 'compact' })}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="budgeted"
                    stroke={colors.brand.primary}
                    strokeWidth={2}
                    name="Bütçelenen"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke={colors.semantic.success}
                    strokeWidth={2}
                    name="Gerçekleşen"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Variance Bar Chart */}
          <TabsContent value="variance-bar">
            <div className="space-y-4">
              <div className="flex gap-2">
                <CorporateBadge variant="danger">Aşım</CorporateBadge>
                <CorporateBadge variant="primary">Tasarruf</CorporateBadge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value, 'TRY', 'tr-TR', { notation: 'compact' })}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const variance = payload[0].value as number
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p style={{ color: variance > 0 ? colors.semantic.danger : colors.semantic.success }}>
                                Varyans: {formatCurrency(variance, 'TRY', 'tr-TR')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {variance > 0 ? 'Bütçe Aşımı' : 'Tasarruf'}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="variance"
                      fill={(entry: any) => entry.variance > 0 ? colors.semantic.danger : colors.semantic.success}
                      name="Varyans"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.variance > 0 ? colors.semantic.danger : colors.semantic.success} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Distribution Pie Chart */}
          <TabsContent value="distribution-pie">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="colors.chart[1]"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <CorporateCard>
            <CorporateCardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Toplam Bütçelenen</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    categoryData.reduce((sum, item) => sum + item.budgeted, 0),
                    'TRY',
                    'tr-TR'
                  )}
                </p>
              </div>
            </CorporateCardContent>
          </CorporateCard>

          <CorporateCard>
            <CorporateCardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Toplam Gerçekleşen</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    categoryData.reduce((sum, item) => sum + item.actual, 0),
                    'TRY',
                    'tr-TR'
                  )}
                </p>
              </div>
            </CorporateCardContent>
          </CorporateCard>

          <CorporateCard>
            <CorporateCardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Toplam Varyans</p>
                <p className={`text-2xl font-bold ${categoryData.reduce((sum, item) => sum + item.variance, 0) > 0
                    ? 'text-red-600'
                    : 'text-green-600'
                  }`}>
                  {formatCurrency(
                    categoryData.reduce((sum, item) => sum + item.variance, 0),
                    'TRY',
                    'tr-TR'
                  )}
                </p>
              </div>
            </CorporateCardContent>
          </CorporateCard>
        </div>
      </CorporateCardContent>
    </CorporateCard>
  )
}

export default BudgetVarianceChart