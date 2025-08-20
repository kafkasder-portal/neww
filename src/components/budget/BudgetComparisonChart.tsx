import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import { useDesignSystem } from '@/hooks/useDesignSystem'

interface MonthlyTrendData {
  month: string
  budgeted: number
  actual: number
  variance: number
}

interface BudgetComparisonChartProps {
  data: MonthlyTrendData[]
  title?: string
  className?: string
}

export function BudgetComparisonChart({
  data,
  title = "Bütçe Karşılaştırması",
  className = ""
}: BudgetComparisonChartProps) {
  const { colors } = useDesignSystem()

  return (
    <div className={className}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value, 'TRY', 'tr-TR')}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value, 'TRY', 'tr-TR'),
                name === 'budgeted' ? 'Bütçelenen' : 'Gerçekleşen'
              ]}
            />
            <Legend />
            <Bar
              dataKey="budgeted"
              fill={colors.chart[1]}
              name="Bütçelenen"
            />
            <Bar
              dataKey="actual"
              fill={colors.chart[2]}
              name="Gerçekleşen"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BudgetComparisonChart