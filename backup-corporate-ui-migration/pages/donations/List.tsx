import { useMemo, useState } from 'react'
import { 
  CorporateTable,
  CorporateButton,
  CorporateCard,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateCardContent,
  FormInput,
  FormSelect
} from '@components/ui/corporate/CorporateComponents'
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
    <CorporateCard>
      <CorporateCardHeader>
        <div className="flex items-center justify-between gap-4">
          <CorporateCardTitle>Bağış Listesi</CorporateCardTitle>
          <div className="flex items-center gap-2">
            <FormInput 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="min-w-64" 
              placeholder="Kişi / Kurum / Partner / Mesaj"
            />
            <CorporateButton variant="primary">Ara</CorporateButton>
            <CorporateButton variant="outline">Filtre</CorporateButton>
            <CorporateButton 
              variant="secondary" 
              onClick={() => exportToCsv('bagislar.csv', filtered)}
            >
              İndir
            </CorporateButton>
          </div>
        </div>
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className="mb-4 text-sm text-corporate-neutral-600">
          1 Kayıt | 0,00 TRY
        </div>
        <CorporateTable columns={columns} data={filtered} />
      </CorporateCardContent>
    </CorporateCard>
  )
}


