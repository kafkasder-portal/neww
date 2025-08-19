import { useMemo, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'

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
  const mockData: Donation[] = []; // Boş array - gerçek API'den veri gelecek
  const filtered = useMemo(() => mockData.filter((d: Donation) => JSON.stringify(d).toLowerCase().includes(query.toLowerCase())), [query, mockData])

  const columns: Column<Donation>[] = [
    { key: 'date', header: 'Bağış Tarihi' },
    { key: 'method', header: 'Bağış Şekli' },
    { key: 'card', header: 'Kart' },
    { key: 'activity', header: 'Faaliyet' },
    { key: 'source', header: 'Kaynak' },
    { key: 'region', header: 'Bölge' },
    { key: 'project', header: 'Proje' },
    { key: 'amount', header: 'TL Tutar' },
    { key: 'note', header: 'Ek Bilgi' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
        <select className="rounded border bg-background px-2 py-1 text-sm"><option>Genel Merkez</option></select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-64 flex-1 rounded border px-2 py-1 text-sm" placeholder="Kişi / Kurum / Partner / Mesaj" />
        <button className="rounded bg-green-600 px-3 py-1 text-sm text-white">Ara</button>
        <button className="rounded border px-3 py-1 text-sm">Filtre</button>
        <button onClick={() => exportToCsv('bagislar.csv', filtered)} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">İndir</button>
        <div className="ml-auto text-sm text-muted-foreground">1 Kayıt | 0,00 TRY</div>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  )
}


