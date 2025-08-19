import { DollarSign } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface FundCardProps {
    title: string
    amount: number
    currency?: string
    change?: number
    period?: string
    icon?: React.ReactNode
}

export const FundCard: React.FC<FundCardProps> = ({
    title,
    amount,
    currency = '₺',
    change,
    period = 'bu ay',
    icon = <DollarSign className="h-4 w-4 text-muted-foreground" />
}) => {
    const isPositive = change && change > 0

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
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

// Additional fund card variants for backward compatibility
export const GeneralFundCard = FundCard
export const ProjectFundCard = FundCard
export const SpecialFundCard = FundCard
export const EmergencyFundCard = FundCard

export default FundCard
