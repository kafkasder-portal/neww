import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, LineChart, Target, Download } from 'lucide-react';
import FundCard from './FundCard';

interface PerformanceMetric {
  id: string;
  fundId: string;
  fundName: string;
  fundType: 'Genel' | 'Özel' | 'Proje' | 'Acil Durum';
  period: string;
  targetAmount: number;
  collectedAmount: number;
  spentAmount: number;
  efficiency: number;
  roi: number;
  beneficiaryCount: number;
  averageDonation: number;
  growthRate: number;
  performanceScore: number;
  trend: number[];
  monthlyData: {
    month: string;
    collected: number;
    spent: number;
    beneficiaries: number;
  }[];
}

interface PerformanceCardProps {
  metric: PerformanceMetric;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ metric }) => {
  const completionRate = (metric.collectedAmount / metric.targetAmount) * 100;
  const spendingRate = (metric.spentAmount / metric.collectedAmount) * 100;
  
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return { text: 'Mükemmel', class: 'bg-green-100 text-green-700' };
    if (score >= 60) return { text: 'İyi', class: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Geliştirilmeli', class: 'bg-red-100 text-red-700' };
  };
  
  const badge = getPerformanceBadge(metric.performanceScore);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-financial-gray-900">{metric.fundName}</h3>
          <p className="text-sm text-financial-gray-500">{metric.fundType} • {metric.period}</p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full ${badge.class}`}>
          {badge.text}
        </span>
      </div>
      
      {/* Performance Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-financial-gray-600">Performans Skoru</span>
          <span className={`font-bold ${getPerformanceColor(metric.performanceScore)}`}>
            {metric.performanceScore}/100
          </span>
        </div>
        <div className="w-full bg-financial-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              metric.performanceScore >= 80 ? 'bg-green-500' :
              metric.performanceScore >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${metric.performanceScore}%` }}
          />
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-financial-gray-500">Hedef Tamamlama</p>
          <p className="font-semibold text-financial-gray-900">%{completionRate.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-financial-gray-500">Harcama Oranı</p>
          <p className="font-semibold text-financial-gray-900">%{spendingRate.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-financial-gray-500">ROI</p>
          <p className={`font-semibold ${
            metric.roi >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            %{metric.roi.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-financial-gray-500">Büyüme Oranı</p>
          <p className={`font-semibold flex items-center ${
            metric.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.growthRate >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            %{Math.abs(metric.growthRate).toFixed(1)}
          </p>
        </div>
      </div>
      
      {/* Mini Chart */}
      {metric.trend && metric.trend.length > 0 && (
        <div className="h-16 bg-financial-gray-50 rounded-lg p-2">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={metric.trend.map((value, index) => {
                const max = Math.max(...metric.trend);
                const min = Math.min(...metric.trend);
                const range = max - min || 1;
                const x = (index / (metric.trend.length - 1)) * 100;
                const y = 100 - ((value - min) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

interface PerformanceComparisonProps {
  metrics: PerformanceMetric[];
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-financial-primary" />
        Performans Karşılaştırması
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-financial-gray-200">
              <th className="text-left py-3 px-4 font-medium text-financial-gray-700">Fon</th>
              <th className="text-center py-3 px-4 font-medium text-financial-gray-700">Skor</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Hedef</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Toplanan</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">ROI</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Büyüme</th>
              <th className="text-center py-3 px-4 font-medium text-financial-gray-700">Yararlanıcı</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id} className="border-b border-financial-gray-100 hover:bg-financial-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-financial-gray-900">{metric.fundName}</p>
                    <p className="text-sm text-financial-gray-500">{metric.fundType}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${
                    metric.performanceScore >= 80 ? 'text-green-600' :
                    metric.performanceScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {metric.performanceScore}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {metric.targetAmount.toLocaleString('tr-TR')} ₺
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {metric.collectedAmount.toLocaleString('tr-TR')} ₺
                </td>
                <td className={`py-3 px-4 text-right font-mono ${
                  metric.roi >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  %{metric.roi.toFixed(1)}
                </td>
                <td className={`py-3 px-4 text-right font-mono ${
                  metric.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  %{metric.growthRate.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {metric.beneficiaryCount.toLocaleString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface MonthlyTrendProps {
  metrics: PerformanceMetric[];
}

const MonthlyTrend: React.FC<MonthlyTrendProps> = ({ metrics }) => {
  const [selectedFund, setSelectedFund] = useState(metrics[0]?.id || '');
  
  const selectedMetric = metrics.find(m => m.id === selectedFund);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-financial-gray-900 flex items-center">
          <LineChart className="w-5 h-5 mr-2 text-financial-primary" />
          Aylık Trend Analizi
        </h3>
        <select 
          value={selectedFund}
          onChange={(e) => setSelectedFund(e.target.value)}
          className="rounded-lg border border-financial-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-financial-primary"
        >
          {metrics.map(metric => (
            <option key={metric.id} value={metric.id}>{metric.fundName}</option>
          ))}
        </select>
      </div>
      
      {selectedMetric && (
        <div className="space-y-4">
          {/* Chart Placeholder */}
          <div className="h-64 bg-financial-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-16 h-16 mx-auto text-financial-gray-400 mb-2" />
              <p className="text-financial-gray-500">Trend Grafiği</p>
              <p className="text-sm text-financial-gray-400">{selectedMetric.fundName}</p>
            </div>
          </div>
          
          {/* Monthly Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedMetric.monthlyData.slice(-3).map((data, index) => (
              <div key={index} className="bg-financial-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-financial-gray-900 mb-2">{data.month}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-financial-gray-600">Toplanan:</span>
                    <span className="font-mono text-sm">{data.collected.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-financial-gray-600">Harcanan:</span>
                    <span className="font-mono text-sm">{data.spent.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-financial-gray-600">Yararlanıcı:</span>
                    <span className="font-mono text-sm">{data.beneficiaries.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FundPerformanceTracker: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState('all');
  
  // Mock data
  const mockMetrics: PerformanceMetric[] = [
    {
      id: '1',
      fundId: 'fund-1',
      fundName: 'Genel Bağış Fonu',
      fundType: 'Genel',
      period: '2024 Q1',
      targetAmount: 600000,
      collectedAmount: 525000,
      spentAmount: 425000,
      efficiency: 85.2,
      roi: 12.5,
      beneficiaryCount: 1250,
      averageDonation: 420,
      growthRate: 8.3,
      performanceScore: 87,
      trend: [400000, 450000, 480000, 510000, 525000],
      monthlyData: [
        { month: 'Ocak', collected: 180000, spent: 145000, beneficiaries: 420 },
        { month: 'Şubat', collected: 165000, spent: 135000, beneficiaries: 385 },
        { month: 'Mart', collected: 180000, spent: 145000, beneficiaries: 445 }
      ]
    },
    {
      id: '2',
      fundId: 'fund-2',
      fundName: 'Eğitim Bursu Fonu',
      fundType: 'Özel',
      period: '2024 Q1',
      targetAmount: 350000,
      collectedAmount: 285000,
      spentAmount: 220000,
      efficiency: 78.5,
      roi: 15.8,
      beneficiaryCount: 180,
      averageDonation: 1583,
      growthRate: 12.1,
      performanceScore: 82,
      trend: [200000, 230000, 250000, 270000, 285000],
      monthlyData: [
        { month: 'Ocak', collected: 95000, spent: 75000, beneficiaries: 60 },
        { month: 'Şubat', collected: 90000, spent: 70000, beneficiaries: 55 },
        { month: 'Mart', collected: 100000, spent: 75000, beneficiaries: 65 }
      ]
    },
    {
      id: '3',
      fundId: 'fund-3',
      fundName: 'Ramazan Paketi Projesi',
      fundType: 'Proje',
      period: '2024 Q1',
      targetAmount: 400000,
      collectedAmount: 395000,
      spentAmount: 380000,
      efficiency: 92.1,
      roi: 18.2,
      beneficiaryCount: 2100,
      averageDonation: 188,
      growthRate: 25.6,
      performanceScore: 94,
      trend: [250000, 300000, 350000, 380000, 395000],
      monthlyData: [
        { month: 'Ocak', collected: 120000, spent: 115000, beneficiaries: 650 },
        { month: 'Şubat', collected: 135000, spent: 130000, beneficiaries: 720 },
        { month: 'Mart', collected: 140000, spent: 135000, beneficiaries: 730 }
      ]
    }
  ];
  
  const filteredMetrics = selectedType === 'all' 
    ? mockMetrics 
    : mockMetrics.filter(m => m.fundType === selectedType);
  
  const averageScore = filteredMetrics.reduce((sum, m) => sum + m.performanceScore, 0) / filteredMetrics.length;
  const totalCollected = filteredMetrics.reduce((sum, m) => sum + m.collectedAmount, 0);
  const totalTarget = filteredMetrics.reduce((sum, m) => sum + m.targetAmount, 0);
  const averageROI = filteredMetrics.reduce((sum, m) => sum + m.roi, 0) / filteredMetrics.length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-financial-gray-900">Fon Performans Takibi</h2>
          <p className="text-financial-gray-600 mt-1">Fon performansları ve trend analizleri</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-financial-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-financial-primary"
          >
            <option value="all">Tüm Fonlar</option>
            <option value="Genel">Genel</option>
            <option value="Özel">Özel</option>
            <option value="Proje">Proje</option>
            <option value="Acil Durum">Acil Durum</option>
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
          <button className="flex items-center space-x-2 bg-financial-primary text-white px-4 py-2 rounded-lg hover:bg-financial-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            <span>Rapor İndir</span>
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FundCard
          title="Ortalama Performans"
          value={averageScore}
          change={5.2}
          changeType="increase"
          period="Bu dönem"
          icon={Target}
          variant="success"
          currency="/100"
        />
        
        <FundCard
          title="Toplam Toplanan"
          value={totalCollected}
          change={12.8}
          changeType="increase"
          period="Bu dönem"
          icon={TrendingUp}
          variant="info"
        />
        
        <FundCard
          title="Hedef Tamamlama"
          value={(totalCollected / totalTarget) * 100}
          change={8.1}
          changeType="increase"
          period="Bu dönem"
          icon={BarChart3}
          variant="default"
          currency="%"
        />
        
        <FundCard
          title="Ortalama ROI"
          value={averageROI}
          change={3.5}
          changeType="increase"
          period="Bu dönem"
          icon={TrendingUp}
          variant="warning"
          currency="%"
        />
      </div>
      
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map(metric => (
          <PerformanceCard key={metric.id} metric={metric} />
        ))}
      </div>
      
      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlyTrend metrics={filteredMetrics} />
        <PerformanceComparison metrics={filteredMetrics} />
      </div>
    </div>
  );
};

export default FundPerformanceTracker;