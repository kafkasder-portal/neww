import React from 'react'
import { TrendingUp, TrendingDown, CreditCard, Users, BarChart3 } from 'lucide-react'
import { useSwipeableCard } from '../hooks/useSwipeGestures'

interface FinancialCardProps {
  title: string
  value: number
  change?: number
  changeType?: 'increase' | 'decrease'
  period?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: number[]
  currency?: string
  unit?: string
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeable?: boolean
}

interface MiniChartProps {
  data: number[]
}

function MiniChart({ data, color }: MiniChartProps & { color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className="h-12 w-full">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className={color || "text-financial-success"}
        />
      </svg>
    </div>
  )
}

function formatCurrency(value: number, unit: string = '₺'): string {
  return `${unit}${value.toLocaleString('tr-TR')}`
}

export function FinancialCard({
  title,
  value,
  change,
  changeType,
  period,
  icon,
  trend,
  unit = '₺',
  variant = 'default',
  className = '',
  onSwipeLeft,
  onSwipeRight,
  swipeable = false
}: FinancialCardProps) {
  const { bind, getSwipeStyle } = useSwipeableCard({
    onSwipeLeft,
    onSwipeRight,
    threshold: 100
  })

  const getVariantColors = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-financial-success/10',
          iconText: 'text-financial-success',
          chartColor: 'text-financial-success'
        }
      case 'warning':
        return {
          iconBg: 'bg-financial-warning/10',
          iconText: 'text-financial-warning',
          chartColor: 'text-financial-warning'
        }
      case 'info':
        return {
          iconBg: 'bg-financial-info/10',
          iconText: 'text-financial-info',
          chartColor: 'text-financial-info'
        }
      default:
        return {
          iconBg: 'bg-financial-primary/10',
          iconText: 'text-financial-primary',
          chartColor: 'text-financial-primary'
        }
    }
  }

  const variantColors = getVariantColors(variant)

  const changeColor = changeType === 'increase'
    ? 'text-financial-success'
    : 'text-financial-error'

  const changeIcon = changeType === 'increase'
    ? <TrendingUp className="h-4 w-4" />
    : <TrendingDown className="h-4 w-4" />

  return (
    <div 
      {...(swipeable ? bind() : {})}
      style={swipeable ? getSwipeStyle() : {}}
      className={`
        bg-card
        border-border
        border rounded-xl shadow-sm p-6
        hover:shadow-md transition-all duration-200
        min-h-[160px]
        group cursor-pointer
        hover:scale-[1.02] active:scale-[0.98]
        touch-manipulation
        min-w-[44px] min-h-[44px]
        swipeable-card
        ${className}
        ${swipeable ? 'select-none' : ''}
      `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${variantColors.iconBg} ${variantColors.iconText}`}>
            {icon && React.createElement(icon, { className: "h-5 w-5" })}
          </div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${changeColor}`}>
            {changeIcon}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-foreground">
          {unit === '₺' ? formatCurrency(value, unit) : `${value.toLocaleString('tr-TR')}${unit}`}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{period}</p>
      </div>
      
      {trend && trend.length > 0 && (
        <div className="mt-4">
          <MiniChart data={trend} color={variantColors.chartColor} />
        </div>
      )}
    </div>
  )
}

// Özel finansal kart varyantları
export function TotalDonationsCard({ totalDonations, monthlyChange, trend }: {
  totalDonations: number
  monthlyChange: number
  trend?: number[]
}) {
  return (
    <FinancialCard
      title="Toplam Bağış"
      value={totalDonations}
      change={monthlyChange}
      changeType={monthlyChange >= 0 ? 'increase' : 'decrease'}
      period="Bu ay"
      icon={CreditCard}
      trend={trend}
      unit="₺"
      variant="success"
      className="bg-gradient-to-br from-financial-success/5 to-financial-success/10 border-financial-success/20"
    />
  )
}

export function MonthlyGrowthCard({ growthRate, period }: {
  growthRate: number
  period: string
}) {
  return (
    <FinancialCard
      title="Aylık Büyüme"
      value={growthRate}
      change={Math.abs(growthRate)}
      changeType={growthRate >= 0 ? 'increase' : 'decrease'}
      period={period}
      icon={TrendingUp}
      unit="%"
      variant="warning"
      className="bg-gradient-to-br from-financial-warning/5 to-financial-warning/10 border-financial-warning/20"
    />
  )
}

export function ActiveBeneficiariesCard({ count, monthlyChange }: {
  count: number
  monthlyChange: number
}) {
  return (
    <FinancialCard
      title="Aktif Yararlanıcı"
      value={count}
      change={monthlyChange}
      changeType={monthlyChange >= 0 ? 'increase' : 'decrease'}
      period="Bu ay"
      icon={Users}
      unit=""
      variant="info"
      className="bg-gradient-to-br from-financial-info/5 to-financial-info/10 border-financial-info/20"
    />
  )
}

export function FundDistributionCard({ distributionRate, target }: {
  distributionRate: number
  target: number
}) {
  return (
    <FinancialCard
      title="Fon Dağılım Oranı"
      value={distributionRate}
      change={((distributionRate - target) / target) * 100}
      changeType={distributionRate >= target ? 'increase' : 'decrease'}
      period={`Hedef: %${target}`}
      icon={BarChart3}
      unit="%"
      variant="default"
      className="bg-gradient-to-br from-financial-primary/5 to-financial-primary/10 border-financial-primary/20"
    />
  )
}
