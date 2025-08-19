import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { DollarSign, Plus, Edit, Trash2, Search, TrendingUp, Calculator, PieChart } from 'lucide-react'

export default function PriceDefinitions() {
  const [searchTerm, setSearchTerm] = useState('')

  const priceDefinitions = [
    { id: 1, name: 'İlkokul Bursu', amount: 300, period: 'Aylık', category: 'Eğitim', status: 'Aktif' },
    { id: 2, name: 'Ortaokul Bursu', amount: 400, period: 'Aylık', category: 'Eğitim', status: 'Aktif' },
    { id: 3, name: 'Lise Bursu', amount: 500, period: 'Aylık', category: 'Eğitim', status: 'Aktif' },
    { id: 4, name: 'Üniversite Bursu', amount: 800, period: 'Aylık', category: 'Eğitim', status: 'Aktif' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Fiyat Tanımları</h1>
        </div>
        <p className="text-white/90">Burs miktarları ve ödeme planlarının belirlenmesi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fiyat Tanımı</p>
              <p className="text-2xl font-bold">{priceDefinitions.length}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ortalama Tutar</p>
              <p className="text-2xl font-bold text-green-600">₺{Math.round(priceDefinitions.reduce((sum, p) => sum + p.amount, 0) / priceDefinitions.length)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Yüksek</p>
              <p className="text-2xl font-bold text-purple-600">₺{Math.max(...priceDefinitions.map(p => p.amount))}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Düşük</p>
              <p className="text-2xl font-bold text-orange-600">₺{Math.min(...priceDefinitions.map(p => p.amount))}</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Fiyat ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-80" />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Fiyat
          </Button>
        </div>

        <div className="space-y-4">
          {priceDefinitions.map((price) => (
            <div key={price.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{price.name}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span>₺{price.amount} / {price.period}</span>
                    <span>{price.category}</span>
                    <span className="text-green-600">{price.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
