import { useState, useEffect } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Modal } from '@components/Modal'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { RecurringDonationsService } from '@services/recurringDonationsService'
import type { 
  RecurringDonation, 
  RecurringDonationDashboard, 
  RecurringDonationFilters,
  RecurringDonationCampaign 
} from '@/types/recurringDonations'
import { toast } from 'sonner'
import { 
  Repeat, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  X,
  CreditCard,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  BarChart3,
  Target,
  Mail,
  Bell,
  Settings,
  Download
} from 'lucide-react'

export default function RecurringDonations() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'campaigns' | 'analytics' | 'settings'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<RecurringDonation[]>([])
  const [campaigns, setCampaigns] = useState<RecurringDonationCampaign[]>([])
  const [dashboardData, setDashboardData] = useState<RecurringDonationDashboard | null>(null)
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<RecurringDonation | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState<RecurringDonationFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load dashboard data
      const dashData = await RecurringDonationsService.getDashboardData()
      setDashboardData(dashData)

      // Load subscriptions
      const { donations } = await RecurringDonationsService.searchRecurringDonations({ searchQuery }, 1, 20)
      setSubscriptions(donations)

      // Load campaigns
      const campaignData = await RecurringDonationsService.getCampaigns()
      setCampaigns(campaignData)

    } catch (error) {
      console.error('Error loading recurring donations data:', error)
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    const { donations } = await RecurringDonationsService.searchRecurringDonations({
      ...filters,
      searchQuery
    })
    setSubscriptions(donations)
  }

  const handlePauseSubscription = async (id: string) => {
    const success = await RecurringDonationsService.pauseRecurringDonation(id, 'Bağışçı talebi')
    if (success) {
      loadData()
    }
  }

  const handleResumeSubscription = async (id: string) => {
    const success = await RecurringDonationsService.resumeRecurringDonation(id)
    if (success) {
      loadData()
    }
  }

  const handleCancelSubscription = async (id: string) => {
    const success = await RecurringDonationsService.cancelRecurringDonation(id, 'Bağışçı talebi')
    if (success) {
      loadData()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Haftalık'
      case 'monthly': return 'Aylık'
      case 'quarterly': return 'Üç Aylık'
      case 'annually': return 'Yıllık'
      default: return frequency
    }
  }

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aylık Gelir (MRR)</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData?.totalMRR || 0)}</p>
              <p className="text-xs text-gray-600">+{dashboardData?.netGrowth || 0} bu ay</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Abonelik</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData?.activeSubscriptions || 0}</p>
              <p className="text-xs text-green-600">+{dashboardData?.newThisMonth || 0} yeni</p>
            </div>
            <Repeat className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ortalama Tutar</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData?.averageAmount || 0)}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Başarı Oranı</p>
              <p className="text-2xl font-bold text-orange-600">%{Math.round(dashboardData?.paymentSuccessRate || 0)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setShowSubscriptionModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Plus className="h-6 w-6 mb-2" />
            Yeni Abonelik
          </Button>
          
          <Button 
            onClick={() => setShowCampaignModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Target className="h-6 w-6 mb-2" />
            Kampanya
          </Button>
          
          <Button 
            onClick={() => {
              RecurringDonationsService.processScheduledPayments()
              toast.success('Ödeme işlemi başlatıldı')
            }}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            Ödemeleri İşle
          </Button>
          
          <Button 
            onClick={() => setActiveTab('analytics')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <BarChart3 className="h-6 w-6 mb-2" />
            Raporlar
          </Button>
        </div>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Son Abonelikler</h3>
          <div className="space-y-3">
            {dashboardData?.recentSubscriptions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{sub.donorName}</p>
                  <p className="text-sm text-gray-600">{formatFrequency(sub.frequency)} - {sub.startDate}</p>
                </div>
                <span className="font-bold text-green-600">{formatCurrency(sub.amount)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uyarılar & Bildirimler</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData?.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center p-3 rounded ${
                alert.severity === 'critical' ? 'bg-red-50 text-red-800' :
                alert.severity === 'high' ? 'bg-orange-50 text-orange-800' :
                alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  {alert.count > 1 && (
                    <p className="text-xs">({alert.count} adet)</p>
                  )}
                </div>
                {alert.actionRequired && (
                  <Button size="sm" variant="outline">
                    İşlem Yap
                  </Button>
                )}
              </div>
            ))}
            {(!dashboardData?.alerts || dashboardData.alerts.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Herhangi bir uyarı yok</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Payment Status Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ödeme Durumu</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{dashboardData?.upcomingPayments || 0}</div>
            <div className="text-sm text-green-700">Yaklaşan Ödemeler</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-blue-700">Bugün İşlenecek</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{dashboardData?.overduePayments || 0}</div>
            <div className="text-sm text-yellow-700">Geciken Ödemeler</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-sm text-red-700">Başarısız Denemeler</div>
          </div>
        </div>
      </Card>
    </div>
  )

  const SubscriptionsTab = () => {
    const columns: Column<RecurringDonation>[] = [
      { 
        key: 'subscriptionName', 
        header: 'Abonelik Adı',
        render: (_, subscription) => (
          <div>
            <p className="font-medium">{subscription.subscriptionName}</p>
            <p className="text-sm text-gray-600">ID: {subscription.id.slice(0, 8)}...</p>
          </div>
        )
      },
      { 
        key: 'amount', 
        header: 'Tutar',
        render: (_, subscription) => (
          <div>
            <p className="font-semibold">{formatCurrency(subscription.amount)}</p>
            <p className="text-sm text-gray-600">{formatFrequency(subscription.frequency)}</p>
          </div>
        )
      },
      { 
        key: 'nextProcessDate', 
        header: 'Sonraki Ödeme',
        render: (_, subscription) => subscription.nextProcessDate ? 
          new Date(subscription.nextProcessDate).toLocaleDateString('tr-TR') : '-'
      },
      { 
        key: 'totalCollected', 
        header: 'Toplanan',
        render: (_, subscription) => (
          <div>
            <p className="font-medium">{formatCurrency(subscription.totalCollected)}</p>
            <p className="text-sm text-gray-600">{subscription.successfulPayments} ödeme</p>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Durum',
        render: (_, subscription) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
            subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
            subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            subscription.status === 'failed' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {subscription.status === 'active' ? 'Aktif' :
             subscription.status === 'paused' ? 'Duraklatıldı' :
             subscription.status === 'cancelled' ? 'İptal Edildi' :
             subscription.status === 'failed' ? 'Başarısız' : subscription.status}
          </span>
        )
      },
      {
        key: 'actions',
        header: 'İşlemler',
        render: (_, subscription) => (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedSubscription(subscription)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            {subscription.status === 'active' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePauseSubscription(subscription.id)}
              >
                <Pause className="w-3 h-3" />
              </Button>
            )}
            {subscription.status === 'paused' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleResumeSubscription(subscription.id)}
              >
                <Play className="w-3 h-3" />
              </Button>
            )}
            {(subscription.status === 'active' || subscription.status === 'paused') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelSubscription(subscription.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )
      }
    ]

    return (
      <div className="space-y-4">
        {/* Search and Actions */}
        <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
          <div className="flex-1 min-w-64">
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm" 
              placeholder="Abonelik ara (ad, e-posta...)"
            />
          </div>
          <Button onClick={handleSearch} size="sm">
            <Search className="w-3 h-3 mr-1" />
            Ara
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3 mr-1" />
            Filtrele
          </Button>
          <Button onClick={() => setShowSubscriptionModal(true)} size="sm">
            <Plus className="w-3 h-3 mr-1" />
            Yeni Abonelik
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="paused">Duraklatıldı</option>
                  <option value="cancelled">İptal Edildi</option>
                  <option value="failed">Başarısız</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sıklık</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="quarterly">Üç Aylık</option>
                  <option value="annually">Yıllık</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tutar Aralığı</label>
                <div className="flex gap-1">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full rounded border px-2 py-1 text-sm" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full rounded border px-2 py-1 text-sm" 
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button size="sm" className="w-full">Filtrele</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Subscriptions Table */}
        <Card>
          {loading ? (
            <div className="p-6 text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={subscriptions} />
          )}
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Repeat className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p>Düzenli bağış verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Düzenli Bağışlar</h1>
          <p className="text-gray-600">Abonelik tabanlı tekrarlayan bağış yönetimi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCampaignModal(true)}>
            <Target className="w-4 h-4 mr-2" />
            Yeni Kampanya
          </Button>
          <Button onClick={() => setShowSubscriptionModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Abonelik Ekle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { key: 'dashboard', label: 'Panel', icon: BarChart3 },
            { key: 'subscriptions', label: 'Abonelikler', icon: Repeat },
            { key: 'campaigns', label: 'Kampanyalar', icon: Target },
            { key: 'analytics', label: 'Analitik', icon: TrendingUp },
            { key: 'settings', label: 'Ayarlar', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'subscriptions' && <SubscriptionsTab />}
      {activeTab === 'campaigns' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Kampanya yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Analitik raporları modülü yakında...</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Düzenli bağış ayarları modülü yakında...</p>
        </div>
      )}

      {/* Modals */}
      {showSubscriptionModal && (
        <Modal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          title="Yeni Düzenli Bağış"
        >
          <div className="p-4">
            <p>Düzenli bağış oluşturma formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {showCampaignModal && (
        <Modal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          title="Yeni Kampanya"
        >
          <div className="p-4">
            <p>Kampanya oluşturma formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <Modal
          isOpen={!!selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          title="Abonelik Detayları"
        >
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedSubscription.subscriptionName}</h3>
              <p className="text-gray-600">{selectedSubscription.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tutar</p>
                <p className="font-semibold">{formatCurrency(selectedSubscription.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sıklık</p>
                <p className="font-semibold">{formatFrequency(selectedSubscription.frequency)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplanan</p>
                <p className="font-semibold">{formatCurrency(selectedSubscription.totalCollected)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ödeme Sayısı</p>
                <p className="font-semibold">{selectedSubscription.successfulPayments}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {selectedSubscription.status === 'active' && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handlePauseSubscription(selectedSubscription.id)}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Duraklat
                </Button>
              )}
              {selectedSubscription.status === 'paused' && (
                <Button 
                  className="flex-1"
                  onClick={() => handleResumeSubscription(selectedSubscription.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Devam Et
                </Button>
              )}
              <Button variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
