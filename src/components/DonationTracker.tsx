import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import DonationCard from './DonationCard';

interface DonationActivity {
  id: string;
  type: 'donation' | 'withdrawal' | 'transfer';
  amount: number;
  donor?: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  method: 'cash' | 'online' | 'bank' | 'other';
}

interface DonationTrackerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Mock real-time data
const generateMockActivity = (): DonationActivity => {
  const types: DonationActivity['type'][] = ['donation', 'withdrawal', 'transfer'];
  const methods: DonationActivity['method'][] = ['cash', 'online', 'bank', 'other'];
  const statuses: DonationActivity['status'][] = ['pending', 'completed', 'failed'];
  const donors = ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya', 'Ayşe Öztürk', 'Ali Şahin'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const method = methods[Math.floor(Math.random() * methods.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const donor = type === 'donation' ? donors[Math.floor(Math.random() * donors.length)] : undefined;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    amount: Math.floor(Math.random() * 10000) + 100,
    donor,
    description: type === 'donation' ? 'Yeni bağış alındı' : 
                type === 'withdrawal' ? 'Yardım ödemesi yapıldı' : 'Transfer işlemi',
    timestamp: new Date(),
    status,
    method
  };
};

const initialActivities: DonationActivity[] = [
  {
    id: '1',
    type: 'donation',
    amount: 2500,
    donor: 'Ahmet Yılmaz',
    description: 'Online bağış',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'completed',
    method: 'online'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 1200,
    description: 'Yardım ödemesi - Aile 123',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'completed',
    method: 'cash'
  },
  {
    id: '3',
    type: 'donation',
    amount: 5000,
    donor: 'Fatma Demir',
    description: 'Banka havalesi',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'pending',
    method: 'bank'
  }
];

const DonationTracker: React.FC<DonationTrackerProps> = ({ 
  className = '',
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [activities, setActivities] = useState<DonationActivity[]>(initialActivities);
  const [isLive, setIsLive] = useState(autoRefresh);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Randomly add new activity (30% chance)
      if (Math.random() < 0.3) {
        const newActivity = generateMockActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 items
        setLastUpdate(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const getStatusIcon = (status: DonationActivity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTypeColor = (type: DonationActivity['type']) => {
    switch (type) {
      case 'donation':
        return 'text-green-600 bg-green-50';
      case 'withdrawal':
        return 'text-red-600 bg-red-50';
      case 'transfer':
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getMethodIcon = (method: DonationActivity['method']) => {

    switch (method) {
      case 'cash':
        return '💵';
      case 'online':
        return '💳';
      case 'bank':
        return '🏦';
      case 'other':
        return '📄';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return timestamp.toLocaleDateString('tr-TR');
  };

  // Calculate summary stats
  const todayActivities = activities.filter(a => {
    const today = new Date();
    return a.timestamp.toDateString() === today.toDateString();
  });

  const todayDonations = todayActivities
    .filter(a => a.type === 'donation' && a.status === 'completed')
    .reduce((sum, a) => sum + a.amount, 0);

  const todayWithdrawals = todayActivities
    .filter(a => a.type === 'withdrawal' && a.status === 'completed')
    .reduce((sum, a) => sum + a.amount, 0);

  const pendingCount = activities.filter(a => a.status === 'pending').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DonationCard
          title="Bugünkü Girişler"
          subtitle="Tamamlanan bağışlar"
          value={todayDonations}
          currency="TRY"
          period="Bugün"
          icon={TrendingUp}
          change={15.2}
          changeType="increase"
          variant="success"
        />
        
        <DonationCard
          title="Bugünkü Çıkışlar"
          subtitle="Yapılan ödemeler"
          value={todayWithdrawals}
          currency="TRY"
          period="Bugün"
          icon={TrendingUp}
          change={-8.5}
          changeType="decrease"
          variant="warning"
        />
        
        <DonationCard
          title="Bekleyen İşlemler"
          subtitle="Onay bekliyor"
          value={pendingCount}
          currency=""
          period="Şu an"
          icon={Clock}
          variant="info"
        />
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Canlı İşlem Takibi</h3>
                <p className="text-sm text-gray-500">
                  Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isLive ? 'Canlı' : 'Durduruldu'}
                </span>
              </div>
              
              <button
                onClick={() => setIsLive(!isLive)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isLive 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
                title={isLive ? 'Canlı takibi durdur' : 'Canlı takibi başlat'}
              >
                {isLive ? <RefreshCw className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz işlem bulunmuyor</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(activity.status)}
                      <span className="text-lg">{getMethodIcon(activity.method)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type === 'donation' ? 'Bağış' : 
                           activity.type === 'withdrawal' ? 'Çıkış' : 'Transfer'}
                        </span>
                        {activity.donor && (
                          <span className="text-sm font-medium text-gray-900">{activity.donor}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      activity.type === 'donation' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.type === 'donation' ? '+' : '-'}{activity.amount.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{activity.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTracker;