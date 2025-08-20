import { DonorCountCard, MonthlyDonationsCard, TotalDonationsCard } from '@/components/DonationCard'
import type { Column } from '@components/DataTable'
import { DataTable } from '@components/DataTable'
import { Modal } from '@components/Modal'
import { exportToCsv } from '@lib/exportToCsv'
import { exportDonationsToExcel } from '@utils/excelExport'
import { exportDonationsToPDF } from '@utils/pdfExport'
import { Camera, FileSpreadsheet, FileText, Filter, Plus, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { LazyCameraScanner } from '@components/LazyCameraScanner'

interface CashDonation {
  id: string
  date: string
  donorName: string
  donorPhone: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  purpose: string
  receiptNo: string
  receivedBy: string
  notes?: string
  status: 'onaylandı' | 'beklemede' | 'iptal'
}

const mockCashDonations: CashDonation[] = [
  {
    id: '1',
    date: '2024-01-15',
    donorName: 'Ahmet Yılmaz',
    donorPhone: '0532 123 4567',
    amount: 1000,
    currency: 'TRY',
    purpose: 'Genel Bağış',
    receiptNo: 'NAK-2024-001',
    receivedBy: 'Fatma Demir',
    notes: 'Nakit olarak teslim alındı',
    status: 'onaylandı'
  },
  {
    id: '2',
    date: '2024-01-14',
    donorName: 'Zeynep Kaya',
    donorPhone: '0543 987 6543',
    amount: 500,
    currency: 'TRY',
    purpose: 'Eğitim Yardımı',
    receiptNo: 'NAK-2024-002',
    receivedBy: 'Mehmet Özkan',
    status: 'onaylandı'
  }
]

export default function CashDonations() {
  const [donations, setDonations] = useState<CashDonation[]>(mockCashDonations)
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDonation, setEditingDonation] = useState<CashDonation | null>(null)
  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    amount: '',
    currency: 'TRY' as CashDonation['currency'],
    purpose: '',
    notes: ''
  })
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const filteredDonations = useMemo(() =>
    donations.filter(donation =>
      JSON.stringify(donation).toLowerCase().includes(query.toLowerCase())
    ), [donations, query]
  )

  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0)

  const todayDonationAmount = filteredDonations
    .filter(donation => {
      const donationDate = new Date(donation.date)
      const today = new Date()
      return donationDate.toDateString() === today.toDateString()
    })
    .reduce((sum, donation) => sum + donation.amount, 0)

  const columns: Column<CashDonation>[] = [
    { key: 'date', header: 'Tarih' },
    { key: 'receiptNo', header: 'Fiş No' },
    { key: 'donorName', header: 'Bağışçı Adı' },
    { key: 'donorPhone', header: 'Telefon' },
    {
      key: 'amount',
      header: 'Tutar',
      render: (_, row: CashDonation) => `${row.amount.toLocaleString('tr-TR')} ${row.currency}`
    },
    { key: 'purpose', header: 'Amaç' },
    { key: 'receivedBy', header: 'Teslim Alan' },
    {
      key: 'status',
      header: 'Durum',
      render: (_, row: CashDonation) => (
        <span className={`px-2 py-1 rounded text-xs ${row.status === 'onaylandı' ? 'bg-green-100 text-green-800' :
          row.status === 'beklemede' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'id',
      header: 'İşlemler',
      render: (_, row: CashDonation) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Düzenle
          </button>
          <button
            onClick={() => handlePrint(row)}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            Yazdır
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

  const handleEdit = (donation: CashDonation) => {
    setEditingDonation(donation)
    setFormData({
      donorName: donation.donorName,
      donorPhone: donation.donorPhone,
      amount: donation.amount.toString(),
      currency: donation.currency,
      purpose: donation.purpose,
      notes: donation.notes || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu nakit bağışı silmek istediğinizden emin misiniz?')) {
      setDonations(donations.filter(donation => donation.id !== id))
    }
  }

  const handlePrint = (donation: CashDonation) => {
    // Makbuz yazdırma işlemi
    alert(`${donation.receiptNo} numaralı makbuz yazdırılıyor...`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDonation) {
      // Güncelleme
      setDonations(donations.map(donation =>
        donation.id === editingDonation.id
          ? {
            ...donation,
            ...formData,
            amount: parseFloat(formData.amount)
          }
          : donation
      ))
    } else {
      // Yeni ekleme
      const newDonation: CashDonation = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...formData,
        amount: parseFloat(formData.amount),
        receiptNo: `NAK-${new Date().getFullYear()}-${String(donations.length + 1).padStart(3, '0')}`,
        receivedBy: 'Sistem Kullanıcısı', // Gerçek uygulamada oturum açan kullanıcı
        status: 'onaylandı'
      }
      setDonations([...donations, newDonation])
    }

    setIsModalOpen(false)
    setEditingDonation(null)
    setFormData({
      donorName: '',
      donorPhone: '',
      amount: '',
      currency: 'TRY',
      purpose: '',
      notes: ''
    })
  }

  const handleScanResult = (data: string) => {
    if (data) {
      try {
        // Try to parse JSON data first
        const parsedData = JSON.parse(data)

        // QR kod, barkod veya OCR verilerini form alanlarına doldur
        if (parsedData.donorName != null) setFormData(prev => ({ ...prev, donorName: parsedData.donorName ?? prev.donorName }))
        if (parsedData.donorPhone != null) setFormData(prev => ({ ...prev, donorPhone: parsedData.donorPhone ?? prev.donorPhone }))
        if (parsedData.amount != null) setFormData(prev => ({ ...prev, amount: (parsedData.amount ?? Number(prev.amount || 0)).toString() }))
        if (parsedData.currency != null) setFormData(prev => ({ ...prev, currency: (['TRY', 'USD', 'EUR'] as const).includes(parsedData.currency as any) ? (parsedData.currency as typeof prev.currency) : prev.currency }))
        if (parsedData.purpose != null) setFormData(prev => ({ ...prev, purpose: parsedData.purpose ?? prev.purpose }))
        if (parsedData.notes != null) setFormData(prev => ({ ...prev, notes: parsedData.notes ?? prev.notes }))

        // OCR'dan gelen kimlik/pasaport verileri
        if (parsedData.firstName && parsedData.lastName) {
          setFormData(prev => ({ ...prev, donorName: `${parsedData.firstName} ${parsedData.lastName}` }))
        }
        if (parsedData.phone) {
          setFormData(prev => ({ ...prev, donorPhone: parsedData.phone || '' }))
        }
        if (parsedData.idNumber) {
          setFormData(prev => ({ ...prev, notes: prev.notes ? `${prev.notes} | TC: ${parsedData.idNumber}` : `TC: ${parsedData.idNumber}` }))
        }
        if (parsedData.passportNumber) {
          setFormData(prev => ({ ...prev, notes: prev.notes ? `${prev.notes} | Pasaport: ${parsedData.passportNumber}` : `Pasaport: ${parsedData.passportNumber}` }))
        }
        if (parsedData.address) {
          setFormData(prev => ({ ...prev, notes: prev.notes ? `${prev.notes} | Adres: ${parsedData.address}` : `Adres: ${parsedData.address}` }))
        }
        if (parsedData.birthDate) {
          setFormData(prev => ({ ...prev, notes: prev.notes ? `${prev.notes} | Doğum: ${parsedData.birthDate}` : `Doğum: ${parsedData.birthDate}` }))
        }
      } catch (error) {
        // If not JSON, treat as simple string data
        console.log('Scanned data:', data)
        // You can add custom logic here to handle different data formats
      }

      setIsScannerOpen(false)
    }
  }

  const openAddModal = () => {
    setEditingDonation(null)
    setFormData({
      donorName: '',
      donorPhone: '',
      amount: '',
      currency: 'TRY',
      purpose: '',
      notes: ''
    })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nakit Bağışlar</h2>
            <p className="text-gray-600">Nakit bağış işlemlerini yönetin ve takip edin</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Yeni Nakit Bağış
          </button>
        </div>

        {/* Özet Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TotalDonationsCard
            title="Toplam Bağış"
            total={totalAmount}
            change={12}
            period="Bu Ay"
          />
          <MonthlyDonationsCard
            title="Bugünkü Bağışlar"
            amount={todayDonationAmount}
            month="Bugün"
          />
          <DonorCountCard
            title="Benzersiz Bağışçı"
            count={new Set(filteredDonations.map(d => d.donorName).filter(name => name && name.trim())).size}
            change={15}
            period="Benzersiz Bağışçı"
          />
        </div>

        {/* Arama ve Filtreler */}
        <div className="corporate-table-header p-6 rounded-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Bağışçı adı, telefon, fiş no ile ara..."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]">
                  <option value="">Tüm Durumlar</option>
                  <option value="onaylandı">Onaylandı</option>
                  <option value="beklemede">Beklemede</option>
                  <option value="iptal">İptal</option>
                </select>
              </div>

              <input
                type="date"
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Başlangıç Tarihi"
              />

              <input
                type="date"
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bitiş Tarihi"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => exportToCsv('cash-donations.csv', filteredDonations as unknown as Record<string, unknown>[])}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors duration-200"
            >
              <FileText size={16} />
              CSV İndir
            </button>
            <button
              onClick={() => exportDonationsToExcel(filteredDonations as unknown as Record<string, unknown>[], { type: 'cash' })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
            >
              <FileSpreadsheet size={16} />
              Excel İndir
            </button>
            <button
              onClick={() => exportDonationsToPDF(filteredDonations as unknown as Record<string, unknown>[], { type: 'cash' })}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors duration-200"
            >
              <FileText size={16} />
              PDF İndir
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filteredDonations} />
        </div>
      </div>

      {/* Nakit Bağış Ekleme/Düzenleme Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDonation ? 'Nakit Bağış Düzenle' : 'Yeni Nakit Bağış'}
      >
        <div className="p-4">
          {!isScannerOpen && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                <Camera size={16} />
                Kamera Tara
              </button>
            </div>
          )}

          {isScannerOpen && (
            <div className="mb-4">
              <div className="flex items-center justify-between corporate-table-header p-3 rounded mb-3">
                <span className="text-sm font-medium">Kamera Tarama Aktif</span>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(false)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Kapat
                </button>
              </div>
              <LazyCameraScanner
                onScan={handleScanResult}
                onError={(error: string) => console.error('Tarama hatası:', error)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.donorPhone}
                  onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
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
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as CashDonation['currency'] })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-1">Notlar</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Ek bilgiler..."
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
        </div>
      </Modal>
    </div>
  )
}
