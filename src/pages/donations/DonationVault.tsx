import { useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { TotalDonationsCard, MonthlyDonationsCard, DonorCountCard } from '@components/DonationCard'
import { Plus, History } from 'lucide-react'

interface VaultTransaction {
  id: string
  date: string
  type: 'giriş' | 'çıkış'
  amount: number
  description: string
  operator: string
  balance: number
}

const mockVaultData: VaultTransaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'giriş',
    amount: 5000,
    description: 'Nakit bağış girişi',
    operator: 'Ahmet Yılmaz',
    balance: 15000
  },
  {
    id: '2',
    date: '2024-01-14',
    type: 'çıkış',
    amount: 2000,
    description: 'Yardım ödemesi',
    operator: 'Fatma Demir',
    balance: 10000
  }
]

export default function DonationVault() {
  const [transactions] = useState<VaultTransaction[]>(mockVaultData)
  const [newTransaction, setNewTransaction] = useState({
    type: 'giriş' as 'giriş' | 'çıkış',
    amount: '',
    description: ''
  })

  const columns: Column<VaultTransaction>[] = [
    { key: 'date', header: 'Tarih' },
    {
      key: 'type',
      header: 'İşlem Türü',
      render: (_, row: VaultTransaction) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.type === 'giriş' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.type}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Tutar',
      render: (_, row: VaultTransaction) => `${row.amount.toLocaleString('tr-TR')} ₺`
    },
    { key: 'description', header: 'Açıklama' },
    { key: 'operator', header: 'İşlem Yapan' },
    {
      key: 'balance',
      header: 'Kasa Bakiyesi',
      render: (_, row: VaultTransaction) => `${row.balance.toLocaleString('tr-TR')} ₺`
    }
  ]

  const currentBalance = transactions.length > 0 ? transactions[0].balance : 0

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bağış Kabul Veznesi</h2>
        
        {/* Kasa Durumu - Modernized with DonationCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TotalDonationsCard 
            title="Mevcut Bakiye"
            value={currentBalance} 
            change={12}
            changeType="increase"
            period="Mevcut Bakiye"
            trend={[45, 52, 48, 61, 55, 67, 73]}
          />
          <MonthlyDonationsCard 
            title="Günlük Giriş"
            value={5000} 
            change={8}
            changeType="increase"
            period="Günlük Giriş"
            trend={[32, 38, 35, 42, 39, 45, 48]}
          />
          <DonorCountCard 
            title="Günlük Çıkış"
            value={2000} 
            change={5}
            changeType="decrease"
            period="Günlük Çıkış"
            trend={[12, 15, 13, 18, 16, 21, 24]}
          />
        </div>

        {/* Yeni İşlem Formu - Modernized */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Yeni İşlem</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">İşlem Türü</label>
              <select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'giriş' | 'çıkış'})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="giriş">💰 Giriş</option>
                <option value="çıkış">💸 Çıkış</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tutar (₺)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Açıklama</label>
              <input
                type="text"
                placeholder="İşlem açıklaması"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                İşlem Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* İşlem Geçmişi - Modernized */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">İşlem Geçmişi</h3>
        </div>
        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  )
}
