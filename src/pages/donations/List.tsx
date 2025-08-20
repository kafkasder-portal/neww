import {
  CorporateBadge,
  CorporateButton,
  CorporateCard,
  CorporateCardContent,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateProgress,
  CorporateTable,
  FormInput
} from '@components/ui/corporate/CorporateComponents';
import { exportToCsv } from '@lib/exportToCsv';
import {
  Building,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  User
} from 'lucide-react';
import { useMemo, useState } from 'react';

export interface Donation {
  id: number;
  donor_name: string;
  amount: number;
  currency: string;
  donation_type: string;
  status: string;
  date: string;
  description?: string;
  payment_method?: string;
  receipt_number?: string;
}

export default function DonationsList() {
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Mock data - gerçek API'den veri gelecek
  const mockData: Donation[] = [
    {
      id: 1,
      donor_name: "Ahmet Yılmaz",
      amount: 5000,
      currency: "TRY",
      donation_type: "Nakit",
      status: "completed",
      date: "2024-01-15",
      description: "Aylık bağış",
      payment_method: "Banka Transferi",
      receipt_number: "RCP001"
    },
    {
      id: 2,
      donor_name: "Fatma Demir",
      amount: 2500,
      currency: "TRY",
      donation_type: "Kredi Kartı",
      status: "pending",
      date: "2024-01-14",
      description: "Eğitim desteği",
      payment_method: "Online Ödeme",
      receipt_number: "RCP002"
    },
    {
      id: 3,
      donor_name: "Mehmet Kaya",
      amount: 10000,
      currency: "TRY",
      donation_type: "Çek",
      status: "completed",
      date: "2024-01-13",
      description: "Sağlık yardımı",
      payment_method: "Çek",
      receipt_number: "RCP003"
    }
  ];

  const filtered = useMemo(() => {
    let filteredData = mockData.filter((d: Donation) =>
      JSON.stringify(d).toLowerCase().includes(query.toLowerCase())
    );

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(d => d.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filteredData = filteredData.filter(d => d.donation_type === selectedType);
    }

    return filteredData;
  }, [query, selectedStatus, selectedType, mockData]);

  const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);
  const completedDonations = filtered.filter(d => d.status === 'completed').length;
  const pendingDonations = filtered.filter(d => d.status === 'pending').length;

  const columns = [
    {
      key: 'date',
      title: 'Bağış Tarihi',
      render: (item: Donation) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{new Date(item.date).toLocaleDateString('tr-TR')}</span>
        </div>
      )
    },
    {
      key: 'donor_name',
      title: 'Bağışçı',
      render: (item: Donation) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-bg-primary" />
          </div>
          <span className="font-medium">{item.donor_name}</span>
        </div>
      )
    },
    {
      key: 'donation_type',
      title: 'Bağış Şekli',
      render: (item: Donation) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span>{item.donation_type}</span>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Tutar',
      render: (item: Donation) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-bg-green-500-600" />
          <span className="font-bold text-bg-green-500-700">
            ₺{item.amount.toLocaleString('tr-TR')}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Durum',
      render: (item: Donation) => (
        <CorporateBadge
          variant={item.status === 'completed' ? 'success' : 'warning'}
          className="capitalize"
        >
          {item.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
        </CorporateBadge>
      )
    },
    {
      key: 'actions',
      title: 'İşlemler',
      render: (item: Donation) => (
        <div className="flex items-center gap-1">
          <CorporateButton variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="w-4 h-4" />
          </CorporateButton>
          <CorporateButton variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="w-4 h-4" />
          </CorporateButton>
          <CorporateButton variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </CorporateButton>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header Card */}
      <CorporateCard className="border-0 shadow-lg bg-gradient-to-r from-bg-primary to-bg-primary/80 text-white">
        <CorporateCardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Bağış Yönetimi</h1>
              <p className="text-bg-primary/10">
                Tüm bağışları görüntüleyin ve yönetin
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CorporateButton
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Bağış
              </CorporateButton>
            </div>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Bağış</p>
                <p className="text-2xl font-bold text-foreground">
                  ₺{totalAmount.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-bg-green-500-600" />
              </div>
            </div>
            <div className="mt-4">
              <CorporateProgress value={75} variant="success" className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Bu ay %75 artış</p>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tamamlanan</p>
                <p className="text-2xl font-bold text-bg-green-500-600">{completedDonations}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="mt-4">
              <CorporateProgress value={completedDonations / filtered.length * 100} variant="success" className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Başarı oranı</p>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold text-bg-yellow-500-600">{pendingDonations}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="mt-4">
              <CorporateProgress value={pendingDonations / filtered.length * 100} variant="warning" className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Bekleme oranı</p>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Enhanced Main Card */}
      <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CorporateCardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-bg-primary" />
              </div>
              <div>
                <CorporateCardTitle>Bağış Listesi</CorporateCardTitle>
                <p className="text-sm text-muted-foreground">
                  {filtered.length} bağış bulundu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CorporateButton
                variant="outline"
                size="sm"
                onClick={() => exportToCsv('bagislar.csv', filtered)}
              >
                <Download className="w-4 h-4 mr-2" />
                İndir
              </CorporateButton>
            </div>
          </div>
        </CorporateCardHeader>

        <CorporateCardContent className="p-6">
          {/* Enhanced Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <FormInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-border focus:border-primary focus:ring-primary"
                  placeholder="Bağışçı adı, açıklama veya tutar ara..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-primary bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="completed">Tamamlandı</option>
                <option value="pending">Beklemede</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-primary bg-white"
              >
                <option value="all">Tüm Türler</option>
                <option value="Nakit">Nakit</option>
                <option value="Kredi Kartı">Kredi Kartı</option>
                <option value="Çek">Çek</option>
              </select>

              <CorporateButton variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </CorporateButton>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-hidden rounded-lg border border-border">
            <CorporateTable
              columns={columns}
              data={filtered}
              className="w-full"
            />
          </div>

          {/* Enhanced Summary */}
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {filtered.length} Kayıt
                </span>
                <span className="text-sm font-medium text-foreground">
                  Toplam: ₺{totalAmount.toLocaleString('tr-TR')} TRY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CorporateBadge variant="success">
                  {completedDonations} Tamamlandı
                </CorporateBadge>
                <CorporateBadge variant="warning">
                  {pendingDonations} Beklemede
                </CorporateBadge>
              </div>
            </div>
          </div>
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}


