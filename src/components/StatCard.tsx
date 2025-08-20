import React from 'react';
import { Card, CardContent } from './ui/corporate/CorporateComponents';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CorporateCard, CorporateCardContent } from '@/components/ui/corporate/CorporateComponents'

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down';
  trendValue?: string;
  accentClass?: string;
  color?: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  accentClass,
  color = 'text-blue-600 bg-blue-50',
  change 
}) => {
  return (
    <CorporateCard>
      <CorporateCardContent className="p-6 bg-card rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {trendValue}
              </div>
            )}
            {change !== undefined && (
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+{change} bu hafta</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${accentClass || color}`}>
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </CorporateCardContent>
    </CorporateCard>
  );
};

export default StatCard;