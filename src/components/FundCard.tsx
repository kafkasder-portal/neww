import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target, PieChart, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { useSwipeableCard } from '../hooks/useSwipeGestures';

interface FundCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  period?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number[];
  currency?: string;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger';
  target?: number;
  progress?: number;
  status?: 'active' | 'inactive' | 'completed' | 'pending';
  fundType?: 'Genel' | 'Özel' | 'Proje' | 'Acil Durum';
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

const getVariantStyles = (variant: FundCardProps['variant']) => {
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
    case 'danger':
      return {
        background: 'bg-gradient-to-br from-red-50 to-rose-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        valueColor: 'text-red-900'
      };
    default:
      return {
        background: 'bg-gradient-to-br from-financial-gray-50 to-slate-50',
        border: 'border-financial-gray-200',
        iconBg: 'bg-financial-primary/10',
        iconColor: 'text-financial-primary',
        valueColor: 'text-financial-gray-900'
      };
  }
};

const getFundTypeStyles = (fundType: FundCardProps['fundType']) => {
  switch (fundType) {
    case 'Genel':
      return 'bg-blue-100 text-blue-700';
    case 'Özel':
      return 'bg-purple-100 text-purple-700';
    case 'Proje':
      return 'bg-green-100 text-green-700';
    case 'Acil Durum':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: FundCardProps['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'inactive':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

const FundCard: React.FC<FundCardProps> = ({
  title,
  value,
  change,
  changeType,
  period = 'Bu ay',
  icon: Icon = Wallet,
  trend,
  currency = 'TRY',
  subtitle,
  variant = 'default',
  target,
  progress,
  status = 'active',
  fundType,
  className = '',
  onSwipeLeft,
  onSwipeRight,
  swipeable = false
}) => {
  const { bind, getSwipeStyle } = useSwipeableCard({
    onSwipeLeft,
    onSwipeRight,
    threshold: 100
  });
  const styles = getVariantStyles(variant);
  const progressPercentage = target && value ? (value / target) * 100 : progress || 0;
  
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
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-financial-gray-700 leading-tight">{title}</h3>
              {getStatusIcon(status)}
            </div>
            {subtitle && (
              <p className="text-xs text-financial-gray-500 mt-1">{subtitle}</p>
            )}
            {fundType && (
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getFundTypeStyles(fundType)}`}>
                {fundType}
              </span>
            )}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'increase' ? 'text-status-success' : 'text-status-error'
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
        <p className={`text-2xl font-bold ${styles.valueColor} financial-number leading-tight`}>
          {formatCurrency(value, currency)}
        </p>
        {period && (
          <p className="text-xs text-financial-gray-500 mt-1">
            {period}
          </p>
        )}
      </div>
      
      {/* Progress Bar (if target is provided) */}
      {target && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-financial-gray-500 mb-1">
            <span>Hedef: {formatCurrency(target, currency)}</span>
            <span>%{progressPercentage.toFixed(1)}</span>
          </div>
          <div className="w-full bg-financial-gray-200 rounded-full h-2">
            <div 
              className="bg-financial-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
      
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

// Özel fund card varyantları
export const GeneralFundCard: React.FC<Omit<FundCardProps, 'icon' | 'variant' | 'fundType'>> = (props) => (
  <FundCard 
    {...props} 
    icon={Wallet} 
    variant="default"
    fundType="Genel"
  />
);

export const ProjectFundCard: React.FC<Omit<FundCardProps, 'icon' | 'variant' | 'fundType'>> = (props) => (
  <FundCard 
    {...props} 
    icon={Target} 
    variant="success"
    fundType="Proje"
  />
);

export const SpecialFundCard: React.FC<Omit<FundCardProps, 'icon' | 'variant' | 'fundType'>> = (props) => (
  <FundCard 
    {...props} 
    icon={PieChart} 
    variant="info"
    fundType="Özel"
  />
);

export const EmergencyFundCard: React.FC<Omit<FundCardProps, 'icon' | 'variant' | 'fundType'>> = (props) => (
  <FundCard 
    {...props} 
    icon={AlertCircle} 
    variant="danger"
    fundType="Acil Durum"
  />
);

export const FundPerformanceCard: React.FC<Omit<FundCardProps, 'icon' | 'variant'>> = (props) => (
  <FundCard 
    {...props} 
    icon={BarChart3} 
    variant="info"
  />
);

export default FundCard;