import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Award, DollarSign } from 'lucide-react';
import DonationCard from './DonationCard';

interface DonationAnalyticsProps {
  className?: string;
}

// Mock data for analytics
const monthlyData = [
  { month: 'Oca', amount: 45000, donors: 120 },
  { month: 'Şub', amount: 52000, donors: 135 },
  { month: 'Mar', amount: 48000, donors: 128 },
  { month: 'Nis', amount: 61000, donors: 145 },
  { month: 'May', amount: 58000, donors: 142 },
  { month: 'Haz', amount: 67000, donors: 158 }
];

const donationTypeData = [
  { name: 'Nakit', value: 45, color: '#10B981' },
  { name: 'Online', value: 35, color: '#3B82F6' },
  { name: 'Banka', value: 15, color: '#F59E0B' },
  { name: 'Diğer', value: 5, color: '#EF4444' }
];

const weeklyTrend = [
  { day: 'Pzt', amount: 8500 },
  { day: 'Sal', amount: 9200 },
  { day: 'Çar', amount: 7800 },
  { day: 'Per', amount: 11200 },
  { day: 'Cum', amount: 13500 },
  { day: 'Cmt', amount: 15200 },
  { day: 'Paz', amount: 12800 }
];

const topDonors = [
  { name: 'Ahmet Yılmaz', amount: 25000, donations: 12 },
  { name: 'Fatma Demir', amount: 18500, donations: 8 },
  { name: 'Mehmet Kaya', amount: 15200, donations: 15 },
  { name: 'Ayşe Öztürk', amount: 12800, donations: 6 },
  { name: 'Ali Şahin', amount: 11500, donations: 9 }
];

const DonationAnalytics: React.FC<DonationAnalyticsProps> = ({ className = '' }) => {
  const totalDonations = monthlyData.reduce((sum, item) => sum + item.amount, 0);
  const totalDonors = Math.max(...monthlyData.map(item => item.donors));
  const avgDonation = totalDonations / totalDonors;
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const monthlyGrowth = ((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DonationCard
          title="Toplam Bağış"
          subtitle="Son 6 ay"
          value={totalDonations}
          currency="TRY"
          period="6 Ay"
          icon={DollarSign}
          trend={monthlyData.map(d => d.amount)}
          change={monthlyGrowth}
          changeType={monthlyGrowth > 0 ? 'increase' : 'decrease'}
          variant="success"
        />
        
        <DonationCard
          title="Aktif Bağışçı"
          subtitle="Bu ay"
          value={currentMonth.donors}
          currency=""
          period="Bu Ay"
          icon={Users}
          trend={monthlyData.map(d => d.donors)}
          change={8.5}
          changeType="increase"
          variant="info"
        />
        
        <DonationCard
          title="Ortalama Bağış"
          subtitle="Kişi başı"
          value={Math.round(avgDonation)}
          currency="TRY"
          period="Ortalama"
          icon={Target}
          change={12.3}
          changeType="increase"
          variant="warning"
        />
        
        <DonationCard
          title="Bu Ay Hedef"
          subtitle="%85 tamamlandı"
          value={85}
          currency="%"
          period="Hedef"
          icon={Award}
          change={5.2}
          changeType="increase"
          variant="default"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Aylık Bağış Trendi</h3>
              <p className="text-sm text-gray-500">Son 6 ayın bağış miktarları</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString('tr-TR')} ₺`, 'Bağış']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donation Types Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bağış Türleri</h3>
              <p className="text-sm text-gray-500">Bağış yöntemlerinin dağılımı</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donationTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {donationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`%${value}`, 'Oran']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {donationTypeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">%{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trend and Top Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Haftalık Trend</h3>
              <p className="text-sm text-gray-500">Bu haftanın günlük bağış miktarları</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString('tr-TR')} ₺`, 'Bağış']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Donors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">En Çok Bağış Yapanlar</h3>
              <p className="text-sm text-gray-500">Bu ayki liderler</p>
            </div>
          </div>
          <div className="space-y-4">
            {topDonors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{donor.name}</p>
                    <p className="text-xs text-gray-500">{donor.donations} bağış</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{donor.amount.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationAnalytics;