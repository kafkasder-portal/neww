import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import {
  ActivityIcon,
  AwardIcon,
  DollarSignIcon,
  DownloadIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-react';
import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface AnalyticsData {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  averageDonation: number;
  retentionRate: number;
  newDonorsThisMonth: number;
  donationGrowth: number;
  communicationStats: {
    emails: number;
    calls: number;
    meetings: number;
  };
}

interface DonationTrend {
  month: string;
  amount: number;
  donors: number;
}

interface DonorSegment {
  name: string;
  value: number;
  color: string;
}

interface CampaignPerformance {
  name: string;
  target: number;
  raised: number;
  donors: number;
}

const CRMAnalytics: React.FC = () => {
  const { colors } = useDesignSystem();

  const [_dateRange, _setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [analyticsData, _setAnalyticsData] = useState<AnalyticsData>({
    totalDonors: 1247,
    activeDonors: 892,
    totalDonations: 2450000,
    averageDonation: 1965,
    retentionRate: 78.5,
    newDonorsThisMonth: 45,
    donationGrowth: 12.3,
    communicationStats: {
      emails: 1250,
      calls: 340,
      meetings: 89
    }
  });

  const donationTrends: DonationTrend[] = [
    { month: 'Oca', amount: 180000, donors: 95 },
    { month: 'Şub', amount: 220000, donors: 110 },
    { month: 'Mar', amount: 195000, donors: 102 },
    { month: 'Nis', amount: 240000, donors: 125 },
    { month: 'May', amount: 280000, donors: 140 },
    { month: 'Haz', amount: 310000, donors: 155 },
    { month: 'Tem', amount: 290000, donors: 148 },
    { month: 'Ağu', amount: 320000, donors: 162 },
    { month: 'Eyl', amount: 350000, donors: 175 },
    { month: 'Eki', amount: 380000, donors: 190 },
    { month: 'Kas', amount: 420000, donors: 210 },
    { month: 'Ara', amount: 450000, donors: 225 }
  ];

  const donorSegments: DonorSegment[] = [
    { name: 'VIP Bağışçılar', value: 15, color: colors.chart[5] },
    { name: 'Düzenli Bağışçılar', value: 45, color: colors.chart[6] },
    { name: 'Tek Seferlik', value: 30, color: colors.semantic.success },
    { name: 'Kurumsal', value: 10, color: colors.semantic.warning }
  ];

  const campaignPerformance: CampaignPerformance[] = [
    { name: 'Eğitim Kampanyası', target: 500000, raised: 420000, donors: 180 },
    { name: 'Sağlık Projesi', target: 300000, raised: 285000, donors: 95 },
    { name: 'Çevre Koruma', target: 200000, raised: 150000, donors: 75 },
    { name: 'Acil Yardım', target: 150000, raised: 165000, donors: 120 }
  ];

  const handleExportReport = () => {
    // Export functionality
    console.log('Rapor dışa aktarılıyor...');
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                {trend === 'up' ? (
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                {trendValue}
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Analitikleri</h2>
          <p className="text-muted-foreground">Bağışçı ve kampanya performans analizi</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Dönem seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Son 7 Gün</SelectItem>
              <SelectItem value="last-30-days">Son 30 Gün</SelectItem>
              <SelectItem value="last-3-months">Son 3 Ay</SelectItem>
              <SelectItem value="last-6-months">Son 6 Ay</SelectItem>
              <SelectItem value="last-year">Son 1 Yıl</SelectItem>
              <SelectItem value="custom">Özel Tarih</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Bağışçı"
          value={analyticsData.totalDonors.toLocaleString()}
          icon={UsersIcon}
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Aktif Bağışçı"
          value={analyticsData.activeDonors.toLocaleString()}
          icon={ActivityIcon}
          trend="up"
          trendValue="+3.1%"
        />
        <StatCard
          title="Toplam Bağış"
          value={`₺${(analyticsData.totalDonations / 1000000).toFixed(1)}M`}
          icon={DollarSignIcon}
          trend="up"
          trendValue="+12.3%"
        />
        <StatCard
          title="Ortalama Bağış"
          value={`₺${analyticsData.averageDonation.toLocaleString()}`}
          icon={HeartIcon}
          trend="up"
          trendValue="+8.7%"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="donors">Bağışçı Analizi</TabsTrigger>
          <TabsTrigger value="campaigns">Kampanya Performansı</TabsTrigger>
          <TabsTrigger value="communication">İletişim Analizi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Bağış Trendleri</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString()}`, 'Bağış Miktarı']} />
                    <Area type="monotone" dataKey="amount" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donor Segments */}
            <Card>
              <CardHeader>
                <CardTitle>Bağışçı Segmentleri</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donorSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="colors.chart[1]"
                      dataKey="value"
                    >
                      {donorSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bağışçı Tutma Oranı</p>
                    <p className="text-2xl font-bold">{analyticsData.retentionRate}%</p>
                  </div>
                  <AwardIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bu Ay Yeni Bağışçı</p>
                    <p className="text-2xl font-bold">{analyticsData.newDonorsThisMonth}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bağış Artışı</p>
                    <p className="text-2xl font-bold text-green-600">+{analyticsData.donationGrowth}%</p>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donor Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Bağışçı Büyümesi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="donors" stroke="#06B6D4" name="Bağışçı Sayısı" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donor Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Bağışçı Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donorSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm font-medium">{segment.name}</span>
                      </div>
                      <Badge variant="secondary">{segment.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kampanya Performansı</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₺${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="target" fill="COLORS.neutral[200]" name="Hedef" />
                  <Bar dataKey="raised" fill="#10B981" name="Toplanan" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaignPerformance.map((campaign, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2">{campaign.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Hedef:</span>
                      <span>₺{campaign.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Toplanan:</span>
                      <span className="font-semibold">₺{campaign.raised.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Bağışçı:</span>
                      <span>{campaign.donors}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-center">
                      {((campaign.raised / campaign.target) * 100).toFixed(1)}% tamamlandı
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">E-posta Gönderimi</p>
                    <p className="text-2xl font-bold">{analyticsData.communicationStats.emails}</p>
                  </div>
                  <MailIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefon Görüşmesi</p>
                    <p className="text-2xl font-bold">{analyticsData.communicationStats.calls}</p>
                  </div>
                  <PhoneIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplantı</p>
                    <p className="text-2xl font-bold">{analyticsData.communicationStats.meetings}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Aktivitesi</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'E-posta', value: analyticsData.communicationStats.emails },
                  { name: 'Telefon', value: analyticsData.communicationStats.calls },
                  { name: 'Toplantı', value: analyticsData.communicationStats.meetings }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMAnalytics;