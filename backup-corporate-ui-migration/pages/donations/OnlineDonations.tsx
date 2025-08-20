import { DonorCountCard, MonthlyDonationsCard, OnlineDonationsCard, TotalDonationsCard } from '@/components/DonationCard'
import { donationService } from '@/services/donationService'
import AdvancedSearchModal, { SavedFilter } from '@components/AdvancedSearchModal'
import type { Column } from '@components/DataTable'
import { DataTable } from '@components/DataTable'
import { PaymentModal } from '@components/donations/PaymentModal'
import { Modal } from '@components/Modal'
import { exportToCsv } from '@lib/exportToCsv'
import {
  createDonationsFilterConfig,
  createDonationsSavedFiltersConfig,
  createDonationsURLConfig,
  getDonationsQuickFilters
} from '@utils/donationsFilterConfig'
import { exportDonationsToExcel } from '@utils/excelExport'
import { exportDonationsToPDF } from '@utils/pdfExport'
import { CreditCard, FileSpreadsheet, FileText, Filter, Globe, Plus, TrendingUp } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export interface OnlineDonation {
  id: string
  date: string
  donorName: string
  donorEmail: string
  donorPhone?: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  platform: 'Website' | 'Mobile App' | 'Facebook' | 'Instagram' | 'WhatsApp' | 'SMS'
  paymentMethod: 'Kredi Kartı' | 'Banka Kartı' | 'Dijital Cüzdan' | 'Kripto Para' | 'QR Kod'
  transactionId: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  purpose: string
  campaign?: string
  referralSource?: string
  isRecurring: boolean
  recurringPeriod?: 'Aylık' | 'Üç Aylık' | 'Altı Aylık' | 'Yıllık'
  status: 'başarılı' | 'beklemede' | 'başarısız' | 'iptal' | 'iade'
  processingFee: number
  netAmount: number
  notes?: string
}

const mockOnlineDonations: OnlineDonation[] = [
  {
    id: '1',
    date: '2024-01-15',
    donorName: 'Ahmet Yılmaz',
    donorEmail: 'ahmet.yilmaz@email.com',
    donorPhone: '+90 532 123 4567',
    amount: 1000,
    currency: 'TRY',
    platform: 'Website',
    paymentMethod: 'Kredi Kartı',
    transactionId: 'WEB789123456',
    sessionId: 'SES123456789',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    purpose: 'Eğitim Yardımı',
    campaign: 'Okul Öncesi Eğitim',
    referralSource: 'Google Ads',
    isRecurring: true,
    recurringPeriod: 'Aylık',
    status: 'başarılı',
    processingFee: 30,
    netAmount: 970,
    notes: 'Düzenli bağışçı'
  },
  {
    id: '2',
    date: '2024-01-14',
    donorName: 'Zeynep Kaya',
    donorEmail: 'zeynep.kaya@email.com',
    amount: 500,
    currency: 'TRY',
    platform: 'Mobile App',
    paymentMethod: 'Dijital Cüzdan',
    transactionId: 'APP456789123',
    purpose: 'Genel Bağış',
    referralSource: 'Sosyal Medya',
    isRecurring: false,
    status: 'başarılı',
    processingFee: 15,
    netAmount: 485
  },
  {
    id: '3',
    date: '2024-01-13',
    donorName: 'Mehmet Demir',
    donorEmail: 'mehmet.demir@email.com',
    donorPhone: '+90 533 987 6543',
    amount: 250,
    currency: 'TRY',
    platform: 'Facebook',
    paymentMethod: 'Kredi Kartı',
    transactionId: 'FB321654987',
    purpose: 'Kurban',
    campaign: 'Kurban 2024',
    referralSource: 'Facebook',
    isRecurring: false,
    status: 'beklemede',
    processingFee: 7.5,
    netAmount: 242.5
  }
]

const platforms = ['Website', 'Mobile App', 'Facebook', 'Instagram', 'WhatsApp', 'SMS']
const paymentMethods = ['Kredi Kartı', 'Banka Kartı', 'Dijital Cüzdan', 'Kripto Para', 'QR Kod']
const referralSources = ['Google Ads', 'Facebook', 'Instagram', 'Twitter', 'YouTube', 'E-posta', 'SMS', 'Doğrudan', 'Diğer']

function OnlineDonations() {
  const location = useLocation()
  const [donationList, setDonationList] = useState<OnlineDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [editingDonation, setEditingDonation] = useState<OnlineDonation | null>(null)

  // Advanced search states
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

  // Filter configurations
  const filterConfig = useMemo(() => createDonationsFilterConfig(), [])
  const urlConfig = useMemo(() => createDonationsURLConfig(), [])
  const savedFiltersConfig = useMemo(() => createDonationsSavedFiltersConfig(), [])
  const quickFilters = useMemo(() => getDonationsQuickFilters(), [])

  // Initialize with pre-filled data from navigation state
  const initialPaymentData = location.state || {}

  React.useEffect(() => {
    loadDonationsData()
  }, [])

  // Load donations from API
  const loadDonationsData = async () => {
    try {
      setLoading(true)
      // Use donationService to fetch real data
      const donations = await donationService.getDonations()

      // Transform the data to match OnlineDonation interface
      const transformedDonations: OnlineDonation[] = donations.map(donation => ({
        id: donation.id,
        date: donation.created_at.split('T')[0],
        donorName: donation.donor_name,
        donorEmail: donation.donor_email || '',
        donorPhone: donation.donor_phone,
        amount: donation.amount,
        currency: donation.currency,
        platform: 'Website', // Default platform - you might want to add this field to your database
        paymentMethod: donation.payment_method === 'credit_card' ? 'Kredi Kartı' :
          donation.payment_method === 'bank_transfer' ? 'Banka Kartı' :
            donation.payment_method === 'crypto' ? 'Kripto Para' : 'Dijital Cüzdan',
        transactionId: donation.transaction_id || '',
        purpose: donation.purpose || '',
        campaign: donation.campaign,
        isRecurring: donation.is_recurring,
        recurringPeriod: donation.recurring_period === 'monthly' ? 'Aylık' :
          donation.recurring_period === 'quarterly' ? 'Üç Aylık' :
            donation.recurring_period === 'annually' ? 'Yıllık' : undefined,
        status: donation.status === 'completed' ? 'başarılı' :
          donation.status === 'pending' ? 'beklemede' :
            donation.status === 'failed' ? 'başarısız' :
              donation.status === 'refunded' ? 'iade' : 'iptal',
        processingFee: donation.processing_fee || 0,
        netAmount: donation.net_amount || donation.amount,
        notes: donation.notes
      }))

      setDonationList(transformedDonations)
      setLoading(false)
    } catch (error) {
      console.error('Error loading donations:', error)
      // Fallback to mock data if API fails
      setDonationList(mockOnlineDonations)
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    currency: 'TRY' as OnlineDonation['currency'],
    platform: 'Website' as OnlineDonation['platform'],
    paymentMethod: 'Kredi Kartı' as OnlineDonation['paymentMethod'],
    transactionId: '',
    purpose: '',
    campaign: '',
    referralSource: '',
    isRecurring: false,
    recurringPeriod: 'Aylık' as OnlineDonation['recurringPeriod'],
    notes: ''
  })

  const filteredDonations = useMemo(() => {
    return donationList.filter(donation => {
      // Basic search filter
      if (query) {
        const searchTerm = query.toLowerCase()
        const matchesBasicSearch = (
          donation.donorName.toLowerCase().includes(searchTerm) ||
          donation.donorEmail.toLowerCase().includes(searchTerm) ||
          donation.transactionId.toLowerCase().includes(searchTerm) ||
          donation.platform.toLowerCase().includes(searchTerm) ||
          donation.purpose.toLowerCase().includes(searchTerm)
        )
        if (!matchesBasicSearch) return false
      }

      // Advanced filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (!value || (Array.isArray(value) && value.length === 0)) continue

        switch (key) {
          case 'search': {
            const searchTerm = value.toLowerCase()
            const matchesSearch = (
              donation.donorName.toLowerCase().includes(searchTerm) ||
              donation.donorEmail.toLowerCase().includes(searchTerm) ||
              donation.transactionId.toLowerCase().includes(searchTerm)
            )
            if (!matchesSearch) return false
            break
          }

          case 'donorName':
            if (!donation.donorName.toLowerCase().includes(value.toLowerCase())) return false
            break

          case 'donorEmail':
            if (!donation.donorEmail.toLowerCase().includes(value.toLowerCase())) return false
            break

          case 'status':
            if (Array.isArray(value) && !value.includes(donation.status)) return false
            break

          case 'platform':
            if (Array.isArray(value) && !value.includes(donation.platform)) return false
            break

          case 'paymentMethod':
            if (Array.isArray(value) && !value.includes(donation.paymentMethod)) return false
            break

          case 'amountRange':
            if (value.min !== undefined && donation.amount < value.min) return false
            if (value.max !== undefined && donation.amount > value.max) return false
            break

          case 'currency':
            if (Array.isArray(value) && !value.includes(donation.currency)) return false
            break

          case 'purpose':
            if (Array.isArray(value) && !value.includes(donation.purpose)) return false
            break

          case 'isRecurring': {
            const isRecurringFilter = value === 'true'
            if (donation.isRecurring !== isRecurringFilter) return false
            break
          }

          case 'recurringPeriod':
            if (Array.isArray(value) && donation.recurringPeriod && !value.includes(donation.recurringPeriod)) return false
            break

          case 'referralSource':
            if (Array.isArray(value) && donation.referralSource && !value.includes(donation.referralSource)) return false
            break

          case 'campaign':
            if (donation.campaign && !donation.campaign.toLowerCase().includes(value.toLowerCase())) return false
            break

          case 'dateRange': {
            const donationDate = new Date(donation.date)
            if (value.start && donationDate < new Date(value.start)) return false
            if (value.end && donationDate > new Date(value.end)) return false
            break
          }

          case 'transactionId':
            if (!donation.transactionId.toLowerCase().includes(value.toLowerCase())) return false
            break
        }
      }

      return true
    })
  }, [donationList, query, activeFilters])

  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalFees = filteredDonations.reduce((sum, donation) => sum + donation.processingFee, 0)
  // const totalNetAmount = filteredDonations.reduce((sum, donation) => sum + donation.netAmount, 0)
  const recurringCount = filteredDonations.filter(d => d.isRecurring).length

  const platformStats = useMemo(() => {
    const stats = platforms.map(platform => {
      const platformDonations = filteredDonations.filter(d => d.platform === platform)
      return {
        platform,
        count: platformDonations.length,
        amount: platformDonations.reduce((sum, d) => sum + d.amount, 0)
      }
    })
    return stats.filter(stat => stat.count > 0)
  }, [filteredDonations])

  const referralStats = useMemo(() => {
    const stats = referralSources.map(source => {
      const sourceDonations = filteredDonations.filter(d => d.referralSource === source)
      return {
        source,
        count: sourceDonations.length,
        amount: sourceDonations.reduce((sum, d) => sum + d.amount, 0)
      }
    })
    return stats.filter(stat => stat.count > 0)
  }, [filteredDonations])

  const columns: Column<OnlineDonation>[] = [
    { key: 'date', header: 'Tarih' },
    { key: 'transactionId', header: 'İşlem No' },
    { key: 'donorName', header: 'Bağışçı' },
    { key: 'donorEmail', header: 'E-posta' },
    {
      key: 'platform',
      header: 'Platform',
      render: (_, row: OnlineDonation) => (
        <span className={`px-2 py-1 rounded text-xs ${row.platform === 'Website' ? 'bg-blue-100 text-blue-800' :
          row.platform === 'Mobile App' ? 'bg-green-100 text-green-800' :
            row.platform === 'Facebook' ? 'bg-blue-100 text-blue-800' :
              row.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                row.platform === 'WhatsApp' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
          }`}>
          {row.platform}
        </span>
      )
    },
    { key: 'paymentMethod', header: 'Ödeme Yöntemi' },
    {
      key: 'amount',
      header: 'Tutar',
      render: (_, row: OnlineDonation) => `${row.amount.toLocaleString('tr-TR')} ${row.currency}`
    },
    {
      key: 'isRecurring',
      header: 'Düzenli',
      render: (_, row: OnlineDonation) => (
        <span className={`px-2 py-1 rounded text-xs ${row.isRecurring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {row.isRecurring ? `Evet (${row.recurringPeriod})` : 'Hayır'}
        </span>
      )
    },
    { key: 'purpose', header: 'Amaç' },
    { key: 'campaign', header: 'Kampanya' },
    {
      key: 'status',
      header: 'Durum',
      render: (_, row: OnlineDonation) => (
        <span className={`px-2 py-1 rounded text-xs ${row.status === 'başarılı' ? 'bg-green-100 text-green-800' :
          row.status === 'beklemede' ? 'bg-yellow-100 text-yellow-800' :
            row.status === 'başarısız' ? 'bg-red-100 text-red-800' :
              row.status === 'iptal' ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'id',
      header: 'İşlemler',
      render: (_, row: OnlineDonation) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Düzenle
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Sil
          </button>
        </div>
      )
    }
  ]

  const handleEdit = (donation: OnlineDonation) => {
    setEditingDonation(donation)
    setFormData({
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone || '',
      amount: donation.amount.toString(),
      currency: donation.currency,
      platform: donation.platform,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId,
      purpose: donation.purpose,
      campaign: donation.campaign || '',
      referralSource: donation.referralSource || '',
      isRecurring: donation.isRecurring,
      recurringPeriod: donation.recurringPeriod || 'Aylık',
      notes: donation.notes || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu online bağışı silmek istediğinizden emin misiniz?')) {
      try {
        const success = await donationService.deleteDonation(id)
        if (success) {
          await loadDonationsData() // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting donation:', error)
        toast.error('Bağış silinirken hata oluştu')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    const processingFee = amount * 0.03 // %3 işlem ücreti
    const netAmount = amount - processingFee

    try {
      if (editingDonation) {
        // Update existing donation
        const updateData = {
          donor_name: formData.donorName,
          donor_email: formData.donorEmail,
          donor_phone: formData.donorPhone || undefined,
          amount,
          currency: formData.currency,
          payment_method: (formData.paymentMethod === 'Kredi Kartı' ? 'credit_card' :
            formData.paymentMethod === 'Banka Kartı' ? 'bank_transfer' :
              formData.paymentMethod === 'Kripto Para' ? 'crypto' : 'credit_card') as 'credit_card' | 'bank_transfer' | 'cash' | 'crypto',
          purpose: formData.purpose,
          campaign: formData.campaign || undefined,
          is_recurring: formData.isRecurring,
          recurring_period: formData.isRecurring ?
            (formData.recurringPeriod === 'Aylık' ? 'monthly' :
              formData.recurringPeriod === 'Üç Aylık' ? 'quarterly' :
                formData.recurringPeriod === 'Yıllık' ? 'annually' : 'monthly') as 'weekly' | 'monthly' | 'quarterly' | 'annually' : undefined,
          processing_fee: processingFee,
          net_amount: netAmount,
          notes: formData.notes || undefined
        }

        const success = await donationService.updateDonation(editingDonation.id, updateData)
        if (success) {
          await loadDonationsData() // Refresh the list
        }
      } else {
        // Create new donation
        const newDonationData = {
          donor_name: formData.donorName,
          donor_email: formData.donorEmail,
          donor_phone: formData.donorPhone || undefined,
          amount,
          currency: formData.currency,
          payment_method: (formData.paymentMethod === 'Kredi Kartı' ? 'credit_card' :
            formData.paymentMethod === 'Banka Kartı' ? 'bank_transfer' :
              formData.paymentMethod === 'Kripto Para' ? 'crypto' : 'credit_card') as 'credit_card' | 'bank_transfer' | 'cash' | 'crypto',
          purpose: formData.purpose,
          campaign: formData.campaign || undefined,
          is_recurring: formData.isRecurring,
          recurring_period: formData.isRecurring ?
            (formData.recurringPeriod === 'Aylık' ? 'monthly' :
              formData.recurringPeriod === 'Üç Aylık' ? 'quarterly' :
                formData.recurringPeriod === 'Yıllık' ? 'annually' : 'monthly') as 'weekly' | 'monthly' | 'quarterly' | 'annually' : undefined,
          processing_fee: processingFee,
          net_amount: netAmount,
          notes: formData.notes || undefined,
          status: 'completed' as const
        }

        const newDonation = await donationService.createDonation(newDonationData)
        if (newDonation) {
          await loadDonationsData() // Refresh the list
        }
      }

      setIsModalOpen(false)
      setEditingDonation(null)
      resetForm()
    } catch (error) {
      console.error('Error saving donation:', error)
      toast.error('Bağış kaydedilirken hata oluştu')
    }
  }

  const resetForm = () => {
    setFormData({
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      amount: '',
      currency: 'TRY',
      platform: 'Website',
      paymentMethod: 'Kredi Kartı',
      transactionId: '',
      purpose: '',
      campaign: '',
      referralSource: '',
      isRecurring: false,
      recurringPeriod: 'Aylık',
      notes: ''
    })
  }

  const openAddModal = () => {
    setEditingDonation(null)
    resetForm()
    setIsModalOpen(true)
  }

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (donationId: string) => {
    setIsPaymentModalOpen(false)
    loadDonationsData() // Refresh donations list  
    toast.success(`Bağış #${donationId} başarıyla tamamlandı!`)
  }

  // Advanced search handlers
  const handleAdvancedSearch = (filters: Record<string, any>) => {
    setActiveFilters(filters)
    setAdvancedSearchOpen(false)
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setQuery('')
  }

  const handleSaveFilter = (name: string, filters: Record<string, any>) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date().toISOString()
    }
    setSavedFilters(prev => [...prev, newFilter])
  }

  const handleLoadFilter = (filter: SavedFilter) => {
    setActiveFilters(filter.filters)
  }



  // Analytics hesaplamaları zaten useMemo ile tanımlandı

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Online Bağışlar
            </h1>
            <p className="text-slate-600 mt-1">Dijital platform bağışlarını yönetin ve analiz edin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <TrendingUp size={18} />
              Analitik
            </button>
            <button
              onClick={openPaymentModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CreditCard size={18} />
              Online Bağış Yap
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={18} />
              Manuel Kayıt
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="corporate-grid-4">
          <TotalDonationsCard
            title="Toplam Bağış"
            total={totalAmount}
            change={12}
            period="Bu Ay"
          />
          <OnlineDonationsCard
            title="Net Tutar"
            amount={totalAmount - totalFees}
            change={8}
            period="Net Tutar"
          />
          <DonorCountCard
            title="Benzersiz Bağışçı"
            count={new Set(filteredDonations.map(d => d.donorEmail)).size}
            change={15}
            period="Benzersiz Bağışçı"
          />
          <MonthlyDonationsCard
            title="İşlem Ücreti"
            amount={totalFees}
            month="İşlem Ücreti"
          />
        </div>

        {/* Platform Distribution */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="text-blue-600" size={24} />
            Platform Dağılımı
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformStats.map((stat) => (
              <div key={stat.platform} className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800">{stat.platform}</h4>
                  <CreditCard className="text-blue-500" size={20} />
                </div>
                <p className="text-sm text-slate-600 mb-1">{stat.count} bağış</p>
                <p className="text-xl font-bold text-blue-600">{stat.amount.toLocaleString('tr-TR')} ₺</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
            <button
              onClick={() => setAdvancedSearchOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${Object.keys(activeFilters).length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-md'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-md'
                }`}
            >
              <Filter size={16} />
              Gelişmiş Filtre
              {Object.keys(activeFilters).length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button>

            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Filtreleri Temizle
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => exportToCsv('online-bagislar.csv', filteredDonations as unknown as Record<string, unknown>[])}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText size={16} />
                CSV
              </button>
              <button
                onClick={() => exportDonationsToExcel(filteredDonations as unknown as Record<string, unknown>[], { type: 'online' })}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileSpreadsheet size={16} />
                Excel
              </button>
              <button
                onClick={() => exportDonationsToPDF(filteredDonations as unknown as Record<string, unknown>[], { type: 'online' })}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-pink-700 flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText size={16} />
                PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-slate-600">Bağışlar yükleniyor...</span>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredDonations} />
            )}
          </div>
        </div>
      </div>

      {/* Online Bağış Ekleme/Düzenleme Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDonation ? 'Online Bağış Düzenle' : 'Yeni Online Bağış'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bağışçı Adı</label>
              <input
                type="text"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-posta</label>
              <input
                type="email"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="tel"
              value={formData.donorPhone}
              onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tutar</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Para Birimi</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as OnlineDonation['currency'] })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as OnlineDonation['platform'] })}
                className="w-full border rounded px-3 py-2"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ödeme Yöntemi</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as OnlineDonation['paymentMethod'] })}
                className="w-full border rounded px-3 py-2"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">İşlem No</label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bağış Amacı</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Genel Bağış">Genel Bağış</option>
                <option value="Eğitim Yardımı">Eğitim Yardımı</option>
                <option value="Sağlık Yardımı">Sağlık Yardımı</option>
                <option value="Gıda Yardımı">Gıda Yardımı</option>
                <option value="Kurban">Kurban</option>
                <option value="Ramazan">Ramazan</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kampanya</label>
              <input
                type="text"
                value={formData.campaign}
                onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Kampanya adı (opsiyonel)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Yönlendirme Kaynağı</label>
            <select
              value={formData.referralSource}
              onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Seçiniz</option>
              {referralSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="mr-2"
              />
              Düzenli Bağış
            </label>

            {formData.isRecurring && (
              <select
                value={formData.recurringPeriod}
                onChange={(e) => setFormData({ ...formData, recurringPeriod: e.target.value as OnlineDonation['recurringPeriod'] })}
                className="border rounded px-3 py-2"
              >
                <option value="Aylık">Aylık</option>
                <option value="Üç Aylık">Üç Aylık</option>
                <option value="Altı Aylık">Altı Aylık</option>
                <option value="Yıllık">Yıllık</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded hover:corporate-table-header"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingDonation ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Analitik Modal */}
      <Modal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        title="Online Bağış Analitiği"
      >
        <div className="space-y-6">
          {/* Platform İstatistikleri */}
          <div>
            <h3 className="text-lg font-medium mb-3">Platform Performansı</h3>
            <div className="corporate-form-group">
              {platformStats.map((stat) => (
                <div key={stat.platform} className="flex justify-between items-center p-3 corporate-table-header rounded">
                  <span className="font-medium">{stat.platform}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{stat.count} bağış</div>
                    <div className="font-bold">{stat.amount.toLocaleString('tr-TR')} ₺</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yönlendirme Kaynakları */}
          <div>
            <h3 className="text-lg font-medium mb-3">Yönlendirme Kaynakları</h3>
            <div className="corporate-form-group">
              {referralStats.map((stat) => (
                <div key={stat.source} className="flex justify-between items-center p-3 corporate-table-header rounded">
                  <span className="font-medium">{stat.source}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{stat.count} bağış</div>
                    <div className="font-bold">{stat.amount.toLocaleString('tr-TR')} ₺</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genel İstatistikler */}
          <div>
            <h3 className="text-lg font-medium mb-3">Genel İstatistikler</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm text-blue-600">Ortalama Bağış</div>
                <div className="text-xl font-bold text-blue-900">
                  {filteredDonations.length > 0 ? (totalAmount / filteredDonations.length).toLocaleString('tr-TR') : '0'} ₺
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm text-green-600">Başarı Oranı</div>
                <div className="text-xl font-bold text-green-900">
                  {filteredDonations.length > 0 ?
                    Math.round((filteredDonations.filter(d => d.status === 'başarılı').length / filteredDonations.length) * 100) : 0}%
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-sm text-purple-600">Düzenli Bağış Oranı</div>
                <div className="text-xl font-bold text-purple-900">
                  {filteredDonations.length > 0 ?
                    Math.round((recurringCount / filteredDonations.length) * 100) : 0}%
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="text-sm text-orange-600">Ortalama İşlem Ücreti</div>
                <div className="text-xl font-bold text-orange-900">
                  {filteredDonations.length > 0 ? (totalFees / filteredDonations.length).toLocaleString('tr-TR') : '0'} ₺
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        initialData={initialPaymentData}
      />

      {/* Gelişmiş Arama Modal */}
      <AdvancedSearchModal
        isOpen={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
        onApplyFilters={handleAdvancedSearch}
        onSaveFilter={handleSaveFilter}
        onLoadFilter={handleLoadFilter}
        fields={filterConfig.fields}
        pageType="donations"
        urlConfig={urlConfig}
        savedFiltersConfig={savedFiltersConfig}
        quickFilters={quickFilters}
        savedFilters={savedFilters}
        initialFilters={activeFilters}
      />
    </div>
  )
}

export default OnlineDonations
