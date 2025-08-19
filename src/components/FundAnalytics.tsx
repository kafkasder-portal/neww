import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Users, Target, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  id: string;
  fundId: string;
  fundName: string;
  fundType: 'Genel' | 'Özel' | 'Proje' | 'Acil Durum';
  totalDonations: number;
  donorCount: number;
  averageDonation: number;
  conversionRate: number;
  retentionRate: number;
  growthRate: number;
  efficiency: number;
  impactScore: number;
  monthlyTrend: number[];
  donorSegments: {
    segment: string;
    count: number;
    percentage: number;
    avgDonation: number;
  }[];
  geographicData: {
    region: string;
    amount: number;
    percentage: number;
    donorCount: number;
  }[];
  timeAnalysis: {
    period: string;
    donations: number;
    donors: number;
    avgAmount: number;
  }[];
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'percentage' | 'number';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  format = 'number',
  subtitle 
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `${val.toLocaleString('tr-TR')} ₺`;
      case 'percentage':
        return `%${val.toFixed(1)}`;
      default:
        return val.toLocaleString('tr-TR');
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-financial-primary/10 rounded-lg">
          {React.createElement(icon, { className: "w-5 h-5 text-financial-primary" })}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            %{Math.abs(change).toFixed(1)}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-financial-gray-900 mb-1">
          {formatValue(value)}
        </h3>
        <p className="text-financial-gray-600 text-sm">{title}</p>
        {subtitle && (
          <p className="text-financial-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

interface DonorSegmentChartProps {
  segments: AnalyticsData['donorSegments'];
}

const DonorSegmentChart: React.FC<DonorSegmentChartProps> = ({ segments }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-financial-primary" />
        Bağışçı Segmentleri
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="h-64 bg-financial-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-16 h-16 mx-auto text-financial-gray-400 mb-2" />
            <p className="text-financial-gray-500">Segment Dağılımı</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div key={segment.segment} className="flex items-center justify-between p-3 bg-financial-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div>
                  <p className="font-medium text-financial-gray-900">{segment.segment}</p>
                  <p className="text-sm text-financial-gray-500">{segment.count} bağışçı</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-financial-gray-900">%{segment.percentage.toFixed(1)}</p>
                <p className="text-sm text-financial-gray-500">
                  Ort: {segment.avgDonation.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface GeographicAnalysisProps {
  data: AnalyticsData['geographicData'];
}

const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-financial-primary" />
        Coğrafi Dağılım
      </h3>
      
      <div className="space-y-4">
        {data.map((region) => {
          const maxAmount = Math.max(...data.map(r => r.amount));
          const widthPercentage = (region.amount / maxAmount) * 100;
          
          return (
            <div key={region.region} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-financial-gray-900">{region.region}</span>
                <div className="text-right">
                  <span className="font-semibold text-financial-gray-900">
                    {region.amount.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="text-sm text-financial-gray-500 ml-2">
                    ({region.donorCount} bağışçı)
                  </span>
                </div>
              </div>
              <div className="w-full bg-financial-gray-200 rounded-full h-3">
                <div 
                  className="bg-financial-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
              <div className="text-right">
                <span className="text-sm text-financial-gray-500">%{region.percentage.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TrendAnalysisProps {
  data: AnalyticsData['timeAnalysis'];
  trend: number[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-financial-primary" />
        Trend Analizi
      </h3>
      
      <div className="space-y-6">
        {/* Trend Chart */}
        <div className="h-48 bg-financial-gray-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={trend.map((value, index) => {
                const max = Math.max(...trend);
                const min = Math.min(...trend);
                const range = max - min || 1;
                const x = (index / (trend.length - 1)) * 100;
                const y = 100 - ((value - min) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Data points */}
            {trend.map((value, index) => {
              const max = Math.max(...trend);
              const min = Math.min(...trend);
              const range = max - min || 1;
              const x = (index / (trend.length - 1)) * 100;
              const y = 100 - ((value - min) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3B82F6"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Period Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.slice(-3).map((period, index) => (
            <div key={index} className="bg-financial-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-financial-gray-900 mb-3">{period.period}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-financial-gray-600">Bağışlar:</span>
                  <span className="font-mono text-sm font-medium">
                    {period.donations.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-financial-gray-600">Bağışçı:</span>
                  <span className="font-mono text-sm font-medium">
                    {period.donors.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-financial-gray-600">Ortalama:</span>
                  <span className="font-mono text-sm font-medium">
                    {period.avgAmount.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InsightsProps {
  analytics: AnalyticsData[];
}

const Insights: React.FC<InsightsProps> = () => {
  const insights = [
    {
      type: 'success',
      title: 'Yüksek Performans',
      description: 'Ramazan Paketi Projesi %94 performans skoru ile en başarılı fon.',
      action: 'Bu stratejileri diğer fonlara uygulayın'
    },
    {
      type: 'warning',
      title: 'Dikkat Gereken Alan',
      description: 'Bağışçı tutma oranı son 3 ayda %5 düştü.',
      action: 'Bağışçı ilişkileri programını gözden geçirin'
    },
    {
      type: 'info',
      title: 'Fırsat',
      description: 'Online bağışlar %25 artış gösteriyor.',
      action: 'Dijital pazarlama bütçesini artırın'
    }
  ];
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const getInsightBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-financial-primary" />
        Öngörüler ve Öneriler
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}>
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <h4 className="font-medium text-financial-gray-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-financial-gray-600 mb-2">{insight.description}</p>
                <p className="text-sm font-medium text-financial-primary">{insight.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FundAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
  const [selectedFund, setSelectedFund] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock analytics data
  const mockAnalytics: AnalyticsData[] = [
    {
      id: '1',
      fundId: 'fund-1',
      fundName: 'Genel Bağış Fonu',
      fundType: 'Genel',
      totalDonations: 525000,
      donorCount: 1250,
      averageDonation: 420,
      conversionRate: 12.5,
      retentionRate: 78.3,
      growthRate: 8.3,
      efficiency: 85.2,
      impactScore: 87,
      monthlyTrend: [400000, 450000, 480000, 510000, 525000],
      donorSegments: [
        { segment: 'Yeni Bağışçılar', count: 450, percentage: 36, avgDonation: 280 },
        { segment: 'Düzenli Bağışçılar', count: 380, percentage: 30.4, avgDonation: 650 },
        { segment: 'Büyük Bağışçılar', count: 125, percentage: 10, avgDonation: 2500 },
        { segment: 'Kurumsal', count: 95, percentage: 7.6, avgDonation: 5200 },
        { segment: 'Diğer', count: 200, percentage: 16, avgDonation: 180 }
      ],
      geographicData: [
        { region: 'İstanbul', amount: 185000, percentage: 35.2, donorCount: 420 },
        { region: 'Ankara', amount: 125000, percentage: 23.8, donorCount: 285 },
        { region: 'İzmir', amount: 95000, percentage: 18.1, donorCount: 225 },
        { region: 'Bursa', amount: 65000, percentage: 12.4, donorCount: 165 },
        { region: 'Diğer', amount: 55000, percentage: 10.5, donorCount: 155 }
      ],
      timeAnalysis: [
        { period: 'Ocak 2024', donations: 180000, donors: 420, avgAmount: 428 },
        { period: 'Şubat 2024', donations: 165000, donors: 385, avgAmount: 428 },
        { period: 'Mart 2024', donations: 180000, donors: 445, avgAmount: 404 }
      ]
    }
  ];
  
  const selectedAnalytics = selectedFund === 'all' 
    ? mockAnalytics 
    : mockAnalytics.filter(a => a.fundId === selectedFund);
  
  const totalDonations = selectedAnalytics.reduce((sum, a) => sum + a.totalDonations, 0);
  const totalDonors = selectedAnalytics.reduce((sum, a) => sum + a.donorCount, 0);
  const avgDonation = totalDonations / totalDonors;
  const avgConversion = selectedAnalytics.reduce((sum, a) => sum + a.conversionRate, 0) / selectedAnalytics.length;
  const avgRetention = selectedAnalytics.reduce((sum, a) => sum + a.retentionRate, 0) / selectedAnalytics.length;
  const avgGrowth = selectedAnalytics.reduce((sum, a) => sum + a.growthRate, 0) / selectedAnalytics.length;
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-financial-gray-900">Fon Analitiği</h2>
          <p className="text-financial-gray-600 mt-1">Detaylı performans analizi ve öngörüler</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="rounded-lg border border-financial-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-financial-primary"
          >
            <option value="all">Tüm Fonlar</option>
            {mockAnalytics.map(analytics => (
              <option key={analytics.fundId} value={analytics.fundId}>
                {analytics.fundName}
              </option>
            ))}
          </select>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border border-financial-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-financial-primary"
          >
            <option value="monthly">Aylık</option>
            <option value="quarterly">Çeyreklik</option>
            <option value="yearly">Yıllık</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-financial-gray-100 text-financial-gray-700 px-4 py-2 rounded-lg hover:bg-financial-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          <button className="flex items-center space-x-2 bg-financial-primary text-white px-4 py-2 rounded-lg hover:bg-financial-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            <span>Rapor İndir</span>
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Toplam Bağış"
          value={totalDonations}
          change={12.8}
          changeType="increase"
          icon={TrendingUp}
          format="currency"
        />
        
        <MetricCard
          title="Toplam Bağışçı"
          value={totalDonors}
          change={8.5}
          changeType="increase"
          icon={Users}
          format="number"
        />
        
        <MetricCard
          title="Ortalama Bağış"
          value={avgDonation}
          change={5.2}
          changeType="increase"
          icon={Target}
          format="currency"
        />
        
        <MetricCard
          title="Dönüşüm Oranı"
          value={avgConversion}
          change={2.1}
          changeType="increase"
          icon={BarChart3}
          format="percentage"
        />
        
        <MetricCard
          title="Tutma Oranı"
          value={avgRetention}
          change={-1.5}
          changeType="decrease"
          icon={Users}
          format="percentage"
        />
        
        <MetricCard
          title="Büyüme Oranı"
          value={avgGrowth}
          change={3.8}
          changeType="increase"
          icon={TrendingUp}
          format="percentage"
        />
      </div>
      
      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {selectedAnalytics[0] && (
          <>
            <DonorSegmentChart segments={selectedAnalytics[0].donorSegments} />
            <GeographicAnalysis data={selectedAnalytics[0].geographicData} />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {selectedAnalytics[0] && (
          <>
            <div className="xl:col-span-2">
              <TrendAnalysis 
                data={selectedAnalytics[0].timeAnalysis} 
                trend={selectedAnalytics[0].monthlyTrend}
              />
            </div>
            <Insights analytics={selectedAnalytics} />
          </>
        )}
      </div>
    </div>
  );
};

export default FundAnalytics;