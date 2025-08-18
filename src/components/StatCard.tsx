import React from 'react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  accentClass?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'financial' | 'compact';
}

const StatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  accentClass = 'text-financial-primary', 
  icon: Icon,
  subtitle,
  trend,
  variant = 'default'
}) => {
  const isFinancial = variant === 'financial';
  const isCompact = variant === 'compact';
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-financial-gray-200 transition-all duration-200 hover:shadow-md hover:border-financial-gray-300",
      isCompact ? "p-4" : "p-6",
      isFinancial && "bg-gradient-to-br from-white to-financial-gray-50"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn(
            "font-medium text-financial-gray-600 mb-1",
            isCompact ? "text-financial-xs" : "text-financial-sm",
            isFinancial && "font-financial tracking-financial-normal"
          )}>
            {title}
          </p>
          <p className={cn(
            "font-bold mb-1",
            isCompact ? "text-financial-lg" : "text-financial-2xl",
            isFinancial ? "font-financial-mono tracking-financial-tight" : "",
            accentClass
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-financial-gray-500",
              isCompact ? "text-financial-xs" : "text-financial-xs",
              isFinancial && "font-financial"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-financial-xs font-medium",
              trend.isPositive ? "text-status-success" : "text-status-error"
            )}>
              <span className={cn(
                "inline-block w-0 h-0 mr-1",
                trend.isPositive ? 
                  "border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-status-success" :
                  "border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-status-error"
              )} />
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg transition-colors duration-200",
            isCompact ? "p-2" : "p-3",
            isFinancial ? "bg-financial-gray-100 hover:bg-financial-gray-200" : "bg-gray-50 hover:bg-gray-100"
          )}>
            <Icon className={cn(
              isCompact ? "h-4 w-4" : "h-6 w-6",
              accentClass
            )} />
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
