import { Calendar, TrendingUp, Users } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/corporate/CorporateComponents'
import { CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'

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
    <CorporateCard>
      <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CorporateCardTitle className="text-sm font-medium">{title}</CorporateCardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className="text-2xl font-bold">
          {currency}{total.toLocaleString()}
        </div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CorporateCardContent>
    </CorporateCard>
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
    <CorporateCard>
      <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CorporateCardTitle className="text-sm font-medium">{title}</CorporateCardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className="text-2xl font-bold">
          {currency}{amount.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">{month}</p>
      </CorporateCardContent>
    </CorporateCard>
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
    <CorporateCard>
      <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CorporateCardTitle className="text-sm font-medium">{title}</CorporateCardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CorporateCardContent>
    </CorporateCard>
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
    <CorporateCard>
      <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CorporateCardTitle className="text-sm font-medium">{title}</CorporateCardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className="text-2xl font-bold">
          {currency}{amount.toLocaleString()}
        </div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% {period}
          </p>
        )}
      </CorporateCardContent>
    </CorporateCard>
  )
}

// Default export for backward compatibility
export default TotalDonationsCard
