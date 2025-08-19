import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, CreditCard } from 'lucide-react';
import { useSwipeableCard } from '../hooks/useSwipeGestures';

interface DonationCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  period?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number[];
  currency?: string;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeable?: boolean;
}

interface MiniChartProps {
  data: number[];
  color: string;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        className="drop-shadow-sm"
      />
    </svg>
  );
};

const formatCurrency = (value: number, currency: string = 'TRY'): string => {
  const symbols: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };
  
  return `${value.toLocaleString('tr-TR')} ${symbols[currency] || currency}`;
};

const getVariantStyles = (variant: DonationCardProps['variant']) => {
  switch (variant) {
    case 'success':
      return {
        background: 'bg-gradient-to-br from-emerald-50 to-green-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        valueColor: 'text-emerald-900'
      };
    case 'warning':
      return {
        background: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        valueColor: 'text-amber-900'
      };
    case 'info':
      return {
        background: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        valueColor: 'text-blue-900'
      };
    default:
      return {
        background: 'bg-gradient-to-br from-gray-50 to-slate-50',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        valueColor: 'text-gray-900'
      };
  }
};

const DonationCard: React.FC<DonationCardProps> = ({
  title,
  value,
  change,
  changeType,
  period = 'Bu ay',
  icon: Icon = DollarSign,
  trend,
  currency = 'TRY',
  subtitle,
  variant = 'default',
  className = '',
  onSwipeLeft,
  onSwipeRight,
  swipeable = false
}) => {
  const { bind, getSwipeStyle } = useSwipeableCard({
    onSwipeLeft,
    onSwipeRight,
    threshold: 100
  })
  const styles = getVariantStyles(variant);
  
  return (
    <div 
      {...(swipeable ? bind() : {})}
      style={swipeable ? getSwipeStyle() : {}}
      className={`
        ${styles.background} 
        ${styles.border} 
        border rounded-xl shadow-sm p-4 sm:p-6 
        hover:shadow-md transition-all duration-200 
        min-h-[120px] sm:min-h-[160px] 
        group cursor-pointer
        hover:scale-[1.02] active:scale-[0.98]
        touch-manipulation
        min-w-[44px] min-h-[44px]
        swipeable-card
        ${className}
        ${swipeable ? 'select-none' : ''}
      `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${styles.iconBg} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
            {Icon && <Icon className={`w-5 h-5 ${styles.iconColor}`} />}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 leading-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'increase' ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      {/* Value */}
      <div className="mb-4">
        <p className={`text-2xl font-bold ${styles.valueColor} font-mono leading-tight`}>
          {formatCurrency(value, currency)}
        </p>
        {period && (
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {period}
          </p>
        )}
      </div>
      
      {/* Trend Chart */}
      {trend && trend.length > 0 && (
        <div className="h-12 mt-4">
          <MiniChart 
            data={trend} 
            color={changeType === 'increase' ? '#10B981' : '#EF4444'} 
          />
        </div>
      )}
    </div>
  );
};

// Özel donation card varyantları
export const TotalDonationsCard: React.FC<Omit<DonationCardProps, 'icon' | 'variant'>> = (props) => (
  <DonationCard 
    {...props} 
    icon={DollarSign} 
    variant="success"
  />
);

export const MonthlyDonationsCard: React.FC<Omit<DonationCardProps, 'icon' | 'variant'>> = (props) => (
  <DonationCard 
    {...props} 
    icon={TrendingUp} 
    variant="info"
  />
);

export const DonorCountCard: React.FC<Omit<DonationCardProps, 'icon' | 'variant'>> = (props) => (
  <DonationCard 
    {...props} 
    icon={Users} 
    variant="default"
  />
);

export const OnlineDonationsCard: React.FC<Omit<DonationCardProps, 'icon' | 'variant'>> = (props) => (
  <DonationCard 
    {...props} 
    icon={CreditCard} 
    variant="warning"
  />
);

export default DonationCard;