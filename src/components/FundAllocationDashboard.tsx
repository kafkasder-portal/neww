import React, { useState } from 'react';
import { PieChart, BarChart3, Wallet, DollarSign, Target, TrendingUp } from 'lucide-react';
import FundCard, { GeneralFundCard, ProjectFundCard, SpecialFundCard, EmergencyFundCard } from './FundCard';

interface FundAllocation {
  id: string;
  name: string;
  type: 'Genel' | 'Özel' | 'Proje' | 'Acil Durum';
  allocated: number;
  spent: number;
  remaining: number;
  target: number;
  percentage: number;
  status: 'active' | 'inactive' | 'completed' | 'pending';
  trend: number[];
  lastUpdate: string;
}

interface AllocationChartProps {
  data: FundAllocation[];
}

const AllocationChart: React.FC<AllocationChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.allocated, 0);
  
  const colors = {
    'Genel': '#3B82F6',
    'Özel': '#8B5CF6',
    'Proje': '#10B981',
    'Acil Durum': '#EF4444'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-financial-primary" />
        Fon Dağılım Grafiği
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Placeholder */}
        <div className="flex items-center justify-center h-64 bg-financial-gray-50 rounded-lg">
          <div className="text-center">
            <PieChart className="w-16 h-16 mx-auto text-financial-gray-400 mb-2" />
            <p className="text-financial-gray-500">Grafik Görünümü</p>
            <p className="text-sm text-financial-gray-400">Toplam: {total.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-financial-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[item.type] }}
                />
                <div>
                  <p className="font-medium text-financial-gray-900">{item.name}</p>
                  <p className="text-sm text-financial-gray-500">{item.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-financial-gray-900">
                  {item.allocated.toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-sm text-financial-gray-500">
                  %{item.percentage.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface AllocationTableProps {
  data: FundAllocation[];
}

const AllocationTable: React.FC<AllocationTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-financial-gray-200 p-6">
      <h3 className="text-lg font-semibold text-financial-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-financial-primary" />
        Detaylı Fon Dağılımı
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-financial-gray-200">
              <th className="text-left py-3 px-4 font-medium text-financial-gray-700">Fon Adı</th>
              <th className="text-left py-3 px-4 font-medium text-financial-gray-700">Tip</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Tahsis</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Harcanan</th>
              <th className="text-right py-3 px-4 font-medium text-financial-gray-700">Kalan</th>
              <th className="text-center py-3 px-4 font-medium text-financial-gray-700">İlerleme</th>
              <th className="text-center py-3 px-4 font-medium text-financial-gray-700">Durum</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const progressPercentage = (item.spent / item.allocated) * 100;
              
              return (
                <tr key={item.id} className="border-b border-financial-gray-100 hover:bg-financial-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-financial-gray-900">{item.name}</p>
                      <p className="text-sm text-financial-gray-500">Son güncelleme: {item.lastUpdate}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.type === 'Genel' ? 'bg-blue-100 text-blue-700' :
                      item.type === 'Özel' ? 'bg-purple-100 text-purple-700' :
                      item.type === 'Proje' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {item.allocated.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {item.spent.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {item.remaining.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-financial-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progressPercentage > 90 ? 'bg-red-500' :
                          progressPercentage > 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-financial-gray-500 mt-1 text-center">
                      %{progressPercentage.toFixed(1)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' :
                      item.status === 'inactive' ? 'bg-red-100 text-red-700' :
                      item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'active' ? 'Aktif' :
                       item.status === 'inactive' ? 'Pasif' :
                       item.status === 'completed' ? 'Tamamlandı' :
                       'Beklemede'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FundAllocationDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  // Mock data
  const mockAllocations: FundAllocation[] = [
    {
      id: '1',
      name: 'Genel Bağış Fonu',
      type: 'Genel',
      allocated: 500000,
      spent: 325000,
      remaining: 175000,
      target: 600000,
      percentage: 35.2,
      status: 'active',
      trend: [300000, 320000, 325000, 340000, 325000],
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Eğitim Bursu Fonu',
      type: 'Özel',
      allocated: 300000,
      spent: 180000,
      remaining: 120000,
      target: 350000,
      percentage: 21.1,
      status: 'active',
      trend: [150000, 160000, 170000, 175000, 180000],
      lastUpdate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Ramazan Paketi Projesi',
      type: 'Proje',
      allocated: 400000,
      spent: 380000,
      remaining: 20000,
      target: 400000,
      percentage: 28.2,
      status: 'active',
      trend: [200000, 250000, 300000, 350000, 380000],
      lastUpdate: '2024-01-13'
    },
    {
      id: '4',
      name: 'Acil Yardım Fonu',
      type: 'Acil Durum',
      allocated: 220000,
      spent: 85000,
      remaining: 135000,
      target: 250000,
      percentage: 15.5,
      status: 'active',
      trend: [50000, 60000, 70000, 80000, 85000],
      lastUpdate: '2024-01-12'
    }
  ];
  
  const totalAllocated = mockAllocations.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = mockAllocations.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = mockAllocations.reduce((sum, item) => sum + item.remaining, 0);
  const totalTarget = mockAllocations.reduce((sum, item) => sum + item.target, 0);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-financial-gray-900">Fon Dağılım Dashboard&apos;u</h2>
          <p className="text-financial-gray-600 mt-1">Fon tahsisleri ve harcama durumları</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border border-financial-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-financial-primary"
          >
            <option value="current">Mevcut Dönem</option>
            <option value="monthly">Aylık</option>
            <option value="quarterly">Çeyreklik</option>
            <option value="yearly">Yıllık</option>
          </select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FundCard
          title="Toplam Tahsis"
          value={totalAllocated}
          change={8.5}
          changeType="increase"
          period="Bu dönem"
          icon={Wallet}
          variant="default"
        />
        
        <FundCard
          title="Toplam Harcama"
          value={totalSpent}
          change={12.3}
          changeType="increase"
          period="Bu dönem"
          icon={DollarSign}
          variant="info"
        />
        
        <FundCard
          title="Kalan Bütçe"
          value={totalRemaining}
          change={-5.2}
          changeType="decrease"
          period="Bu dönem"
          icon={Target}
          variant="warning"
        />
        
        <FundCard
          title="Hedef Tamamlama"
          value={(totalAllocated / totalTarget) * 100}
          change={3.1}
          changeType="increase"
          period="Bu dönem"
          icon={TrendingUp}
          variant="success"
          currency="%"
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AllocationChart data={mockAllocations} />
        <div className="space-y-6">
          {/* Fund Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GeneralFundCard
              title="Genel Fonlar"
              value={mockAllocations.filter(f => f.type === 'Genel').reduce((sum, f) => sum + f.allocated, 0)}
              change={5.2}
              changeType="increase"
              period="Bu ay"
            />
            
            <ProjectFundCard
              title="Proje Fonları"
              value={mockAllocations.filter(f => f.type === 'Proje').reduce((sum, f) => sum + f.allocated, 0)}
              change={15.8}
              changeType="increase"
              period="Bu ay"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SpecialFundCard
              title="Özel Fonlar"
              value={mockAllocations.filter(f => f.type === 'Özel').reduce((sum, f) => sum + f.allocated, 0)}
              change={8.1}
              changeType="increase"
              period="Bu ay"
            />
            
            <EmergencyFundCard
              title="Acil Durum Fonları"
              value={mockAllocations.filter(f => f.type === 'Acil Durum').reduce((sum, f) => sum + f.allocated, 0)}
              change={-2.3}
              changeType="decrease"
              period="Bu ay"
            />
          </div>
        </div>
      </div>
      
      {/* Detailed Table */}
      <AllocationTable data={mockAllocations} />
    </div>
  );
};

export default FundAllocationDashboard;