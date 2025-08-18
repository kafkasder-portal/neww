// import React from 'react' // JSX için gerekli değil
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts'
import { Card } from '@/components/ui/card'
import { CHART_COLORS_HEX } from '@/constants/colors'

// Optimized color palette - WCAG AA compliant
const COLORS = CHART_COLORS_HEX

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface LineChartProps {
  data: ChartData[]
  title: string
  dataKey: string
  stroke?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export const LineChartComponent = ({
  data,
  title,
  dataKey,
  stroke = CHART_COLORS_HEX[0],
  height = 300,
  showGrid = true,
  showLegend = true
}: LineChartProps) => {
  // const { t } = useLanguageContext() // Kullanılmıyor

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            dot={{ fill: stroke, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface AreaChartProps {
  data: ChartData[]
  title: string
  dataKey: string
  fill?: string
  stroke?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export const AreaChartComponent = ({
  data,
  title,
  dataKey,
  fill = CHART_COLORS_HEX[0],
  stroke = CHART_COLORS_HEX[0],
  height = 300,
  showGrid = true,
  showLegend = true
}: AreaChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            fill={fill}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface BarChartProps {
  data: ChartData[]
  title: string
  dataKey: string
  fill?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export const BarChartComponent = ({
  data,
  title,
  dataKey,
  fill = CHART_COLORS_HEX[0],
  height = 300,
  showGrid = true,
  showLegend = true
}: BarChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface PieChartProps {
  data: ChartData[]
  title: string
  height?: number
  showLegend?: boolean
}

export const PieChartComponent = ({
  data,
  title,
  height = 300,
  showLegend = true
}: PieChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill={CHART_COLORS_HEX[0]}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface ComposedChartProps {
  data: ChartData[]
  title: string
  lineDataKey: string
  barDataKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export const ComposedChartComponent = ({
  data,
  title,
  lineDataKey,
  barDataKey,
  height = 300,
  showGrid = true,
  showLegend = true
}: ComposedChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Bar dataKey={barDataKey} fill={CHART_COLORS_HEX[0]} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey={lineDataKey} stroke={CHART_COLORS_HEX[3]} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  )
}

// Örnek veri oluşturucular
export const generateSampleData = () => {
  return [
    { name: 'Ocak', value: 4000, donations: 2400, beneficiaries: 1800 },
    { name: 'Şubat', value: 3000, donations: 1398, beneficiaries: 2210 },
    { name: 'Mart', value: 2000, donations: 9800, beneficiaries: 2290 },
    { name: 'Nisan', value: 2780, donations: 3908, beneficiaries: 2000 },
    { name: 'Mayıs', value: 1890, donations: 4800, beneficiaries: 2181 },
    { name: 'Haziran', value: 2390, donations: 3800, beneficiaries: 2500 },
    { name: 'Temmuz', value: 3490, donations: 4300, beneficiaries: 2100 },
  ]
}

export const generatePieData = () => {
  return [
    { name: 'Nakit Bağış', value: 400 },
    { name: 'Ayni Bağış', value: 300 },
    { name: 'Banka Bağışı', value: 300 },
    { name: 'Diğer', value: 200 },
  ]
}
