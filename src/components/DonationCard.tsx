import { Calendar, TrendingUp, Users } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface TotalDonationsCardProps {
  total: number
  currency?: string
  change?: number
  period?: string
  title?: string
}

export const TotalDonationsCard: React.FC<TotalDonationsCardProps> = ({
  total,
  currency = '₺',
  change,
  period = 'bu ay',
  title = 'Toplam Bağış'
}) => {
  const isPositive = change && change > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency}{total.toLocaleString()}
        </div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface MonthlyDonationsCardProps {
  amount: number
  currency?: string
  month?: string
  title?: string
}

export const MonthlyDonationsCard: React.FC<MonthlyDonationsCardProps> = ({
  amount,
  currency = '₺',
  month = 'Bu ay',
  title = 'Aylık Bağış'
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency}{amount.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">{month}</p>
      </CardContent>
    </Card>
  )
}

interface DonorCountCardProps {
  count: number
  change?: number
  period?: string
  title?: string
}

export const DonorCountCard: React.FC<DonorCountCardProps> = ({
  count,
  change,
  period = 'bu ay',
  title = 'Bağışçı Sayısı'
}) => {
  const isPositive = change && change > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface OnlineDonationsCardProps {
  amount: number
  currency?: string
  change?: number
  period?: string
  title?: string
}

export const OnlineDonationsCard: React.FC<OnlineDonationsCardProps> = ({
  amount,
  currency = '₺',
  change,
  period = 'bu ay',
  title = 'Online Bağış'
}) => {
  const isPositive = change && change > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency}{amount.toLocaleString()}
        </div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Default export for backward compatibility
export default TotalDonationsCard
