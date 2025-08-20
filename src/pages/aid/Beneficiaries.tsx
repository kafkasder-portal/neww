import { useEffect, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'
import { exportBeneficiariesToExcel } from '@utils/excelExport'
import { exportBeneficiariesToPDF } from '@utils/pdfExport'
import { Link } from 'react-router-dom'
import { Modal } from '@components/Modal'
import { BeneficiaryForm } from '@components/BeneficiaryForm'
import { type Database } from '@lib/supabase'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useBeneficiaries, getNextSequentialId } from '@hooks/useBeneficiaries'
import { getErrorMessage, logErrorSafely } from '@utils/errorMessageUtils'
import type { FormData, TempFormData } from '@/types/beneficiary'
import { defaultFormData, defaultTempFormData } from '@/types/beneficiary'
import { supabase } from '@lib/supabase'

type BeneficiaryRow = Database['public']['Tables']['beneficiaries']['Row']

export default function Beneficiaries() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [showTempModal, setShowTempModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [tempFormData, setTempFormData] = useState<TempFormData>(defaultTempFormData)
  
  const { loading, saving, setSaving, rows, setRows, loadBeneficiaries, saveBeneficiary } = useBeneficiaries()

  useEffect(() => {
    loadBeneficiaries(q)
  }, [q, loadBeneficiaries])

  const resetForm = () => {
    setFormData(defaultFormData)
    setEditingId(null)
  }

  const resetTempForm = () => {
    setTempFormData(defaultTempFormData)
  }

  const handleSave = async () => {
    const success = await saveBeneficiary(formData, editingId)
    if (success) {
      resetForm()
      setOpen(false)
    }
  }





  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTempInputChange = (field: keyof TempFormData, value: string) => {
    setTempFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTempSave = async () => {
    if (!tempFormData.name.trim() || !tempFormData.surname.trim() || !tempFormData.identity_no.trim()) {
      toast.error('Ad, Soyad ve Kimlik No alanları zorunludur')
      return
    }

    setSaving(true)
    try {
      // Sıralı ID ile geçici kayıt oluştur
      const nextId = await getNextSequentialId()
      const { error } = await supabase
        .from('beneficiaries')
        .insert([{
          id: nextId,
          name: tempFormData.name.trim(),
          surname: tempFormData.surname.trim(),
          identity_no: tempFormData.identity_no.trim(),
          category: 'Yetim Ailesi',
          status: 'suspended',
          fund_region: 'Genel',
          file_connection: 'Doğrudan Başvuru'
        }])
        .select()

      if (error) {
        console.error('Temp save error:', error)
        toast.error('Geçici kayıt sırasında hata olu��tu: ' + error.message)
      } else {
        toast.success('Geçici kayıt başarıyla oluşturuldu')
        setShowTempModal(false)
        resetTempForm()
        loadBeneficiaries()
      }
    } catch (error) {
      console.error('Temp save error:', error)
      toast.error('Geçici kayıt sırasında beklenmeyen hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleCompleteTemp = (row: BeneficiaryRow) => {
    // Geçici kaydı tam kayda dönüştürmek için mevcut verileri forma yükle
    setFormData({
      // Temel Bilgiler
      name: row.name || '',
      surname: row.surname || '',
      category: row.category || 'Yetim Ailesi',
      nationality: row.nationality || 'TC',
      birth_date: row.birth_date || '',
      birth_place: '',
      identity_no: row.identity_no || '',
      gender: '',
      marital_status: '',
      education_level: '',
      mother_name: '',
      father_name: '',
      
      // İletişim Bilgileri
      phone: row.phone || '',
      alternative_phone: '',
      email: row.email || '',
      address: row.address || '',
      city: row.city || '',
      district: row.district || '',
      neighborhood: '',
      postal_code: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      
      // Finansal Bilgiler
      monthly_income: '',
      household_size: '',
      dependent_count: '',
      employment_status: '',
      occupation: '',
      social_security_no: '',
      bank_account_no: '',
      bank_name: '',
      
      // Sağlık Bilgileri
      has_disability: false,
      disability_type: '',
      disability_percentage: '',
      chronic_illness: '',
      medication_needs: '',
      health_insurance: false,
      health_insurance_type: '',
      
      // Konut Bilgileri
      housing_type: '',
      monthly_rent: '',
      room_count: '',
      has_electricity: true,
      has_water: true,
      has_gas: false,
      has_internet: false,
      housing_condition: '',
      
      // Ek Bilgiler
      special_needs: '',
      previous_aid_received: false,
      previous_aid_details: '',
      verification_status: 'pending',
      notes: '',
      
      // Sistem Alanları
      fund_region: (row as any).fund_region || 'Genel',
      file_connection: (row as any).file_connection || 'Doğrudan Başvuru',
      file_number: (row as any).file_number || '',
      status: row.status || 'active',
      mernis_check: false
    })
    setEditingId(Number(row.id))
    setOpen(true)
  }

  // Demo kayıt veri setleri - UUID'ler Supabase tarafından otomatik oluşturulacak
  const createDemoDataSets = () => {
    const currentTime = Date.now()
    
    return {
      normal: [
        {
          name: 'Ahmet',
          surname: 'Yılmaz',
          category: 'Yetim Ailesi',
          nationality: 'T.C.',
          birth_date: '1985-03-15',
          identity_no: `${currentTime}001`,
          phone: '0532 123 45 67',
          family_size: 4,
          status: 'active' as const
        },
        {
          name: 'Fatma',
          surname: 'Demir',
          category: 'Yaşlı',
          nationality: 'T.C.',
          birth_date: '1950-08-22',
          identity_no: `${currentTime}002`,
          phone: '0533 234 56 78',
          family_size: 2,
          status: 'active' as const
        },
        {
          name: 'Mehmet',
          surname: 'Kaya',
          category: 'Engelli',
          nationality: 'T.C.',
          birth_date: '1978-12-10',
          identity_no: `${currentTime}003`,
          phone: '0534 345 67 89',
          family_size: 3,
          status: 'active' as const
        }
      ],
      temporary: [
        {
          name: 'Ali',
          surname: 'Özkan',
          identity_no: `${currentTime}004`,
          category: 'Muhtaç Aile',
          family_size: 5,
          status: 'inactive' as const
        },
        {
          name: 'Ayşe',
          surname: 'Çelik',
          identity_no: `${currentTime}005`,
          category: 'Hasta',
          family_size: 1,
          status: 'inactive' as const
        }
      ]
    }
  }

  const testSupabaseConnection = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      console.log('Environment Variables:')
      console.log('VITE_SUPABASE_URL:', supabaseUrl)
      console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set (hidden)' : 'Missing')

      if (!supabaseUrl || !supabaseKey) {
        toast.error('Supabase environment variables are missing')
        return
      }

      if (supabaseUrl.includes('your-project')) {
        toast.error('Supabase URL is still a placeholder - need real project URL')
        return
      }

      const { data, error } = await supabase.from('beneficiaries').select('count').limit(1)

      if (error) {
        console.error('Connection test error:', {
          message: error?.message || 'No message',
          code: error?.code || 'No code',
          details: error?.details || 'No details'
        })
        toast.error(`Connection failed: ${error?.message || 'Unknown error'}`)
      } else {
        console.log('Connection successful:', data)
        toast.success('Supabase connection successful!')
      }
    } catch (err) {
      console.error('Test error:', err)
      toast.error('Connection test failed')
    }
  }

  const handleCreateDemoRecords = async () => {
    setSaving(true)
    try {
      // Check environment variables first
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      console.log('Supabase Config:', {
        url: supabaseUrl ? 'Set' : 'Missing',
        key: supabaseKey ? 'Set' : 'Missing',
        urlValue: supabaseUrl?.includes('supabase.co') ? 'Valid' : 'Placeholder'
      })

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
        console.warn('Supabase not properly configured, using mock data')
        const demoDataSets = createDemoDataSets()
        const mockData = [...demoDataSets.normal, ...demoDataSets.temporary].map((item, index) => ({
          ...item,
          id: `mock-${Date.now()}-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        setRows(prev => [...prev, ...mockData as any])
        toast.success(`${mockData.length} demo kayıt mock data olarak eklendi (Supabase yapılandırması eksik)`)
        return
      }

      // Test Supabase connection
      console.log('Testing Supabase connection...')
      const { error: testError } = await supabase
        .from('beneficiaries')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('Supabase connection test failed:', {
          message: testError.message || 'No message',
          details: testError.details || 'No details',
          hint: testError.hint || 'No hint',
          code: testError.code || 'No code'
        })

        // Provide more specific error messages
        if (testError.code === 'PGRST116' || testError.message?.includes('relation "beneficiaries" does not exist')) {
          toast.error('Beneficiaries tablosu bulunamadı. Lütfen veritabanı migrasyonlarını çalıştırın.')
        } else if (testError.message?.includes('Invalid API key') || testError.message?.includes('JWT')) {
          toast.error('Geçersiz API key. Lütfen Supabase ayarlarını kontrol edin.')
        } else if (testError.message?.includes('permission denied')) {
          toast.error('Yetki hatası. Lütfen RLS politikalarını kontrol edin.')
        } else {
          toast.error(`Veritabanı bağlantısı hatası: ${testError.message || 'Bilinmeyen hata'}`)
        }
        return
      }

      console.log('Supabase connection successful, creating demo data...')

      // Demo veri setlerini oluştur
      const demoDataSets = createDemoDataSets()

      console.log('Demo data to insert:', demoDataSets)

      // Normal demo kayıtlar�� oluştur
      const { data: normalData, error: normalError } = await supabase
        .from('beneficiaries')
        .insert(demoDataSets.normal)
        .select()

      // Geçici demo kayıtları oluştur
      const { data: tempData, error: tempError } = await supabase
        .from('beneficiaries')
        .insert(demoDataSets.temporary)
        .select()

      if (normalError || tempError) {
        const errorDetails = normalError || tempError
        console.error('Demo records error - FULL ERROR OBJECT:', errorDetails)
        console.error('Demo records error - STRUCTURED:', {
          message: errorDetails?.message || 'No message',
          details: errorDetails?.details || 'No details',
          hint: errorDetails?.hint || 'No hint',
          code: errorDetails?.code || 'No code',
          errorType: typeof errorDetails
        })

        // Check if it's a table not found error
        if (errorDetails?.code === 'PGRST116' ||
            errorDetails?.message?.includes('relation "beneficiaries" does not exist')) {
          toast.error('Beneficiaries tablosu bulunamadı. Veritabanında tablolar oluşturulmamış.')
          console.warn('Beneficiaries table does not exist. Database migrations need to be run.')
          return
        }

        // Check if it's a Supabase configuration issue
        if (errorDetails?.message?.includes('Invalid API key') ||
            errorDetails?.message?.includes('not found') ||
            errorDetails?.code === 'PGRST202') {
          toast.error('Veritabanı yapılandırması eksik. Lütfen Supabase ayarlarını kontrol edin.')
          console.warn('Supabase appears to be misconfigured. Using mock data instead.')

          // Use mock data as fallback
          const mockData = [...demoDataSets.normal, ...demoDataSets.temporary].map((item, index) => ({
            ...item,
            id: `mock-${Date.now()}-${index}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))

          setRows(prev => [...prev, ...mockData as any])
          toast.success(`${mockData.length} demo kayıt mock data olarak eklendi`)
        } else {
          const errorMessage = getErrorMessage(errorDetails)
          toast.error(`Demo kayıtlar oluşturulurken hata oluştu: ${errorMessage}`)
        }
      } else {
        const totalCreated = (normalData?.length || 0) + (tempData?.length || 0)
        toast.success(`${totalCreated} demo kayıt başarıyla oluşturuldu (${normalData?.length || 0} normal, ${tempData?.length || 0} geçici)`)
        loadBeneficiaries()
      }
    } catch (error) {
      logErrorSafely('Demo records error', error)
      const errorMessage = getErrorMessage(error)
      toast.error(`Demo kayıtlar oluşturulurken beklenmeyen hata oluştu: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<BeneficiaryRow>[] = [
    { key: 'id', header: 'ID', render: (_, row, index) => <Link className="text-blue-600 underline" to={`/aid/beneficiaries/${row.id}`}>{(index || 0) + 1}</Link> },
    { key: 'name', header: 'Ad Soyad', render: (_, row) => <span>{row.name} {row.surname}</span> },
    { key: 'category', header: 'Kategori' },
    { key: 'nationality', header: 'Uyruk' },
    { key: 'identity_no', header: 'Kimlik No' },
    { key: 'phone', header: 'Cep Telefonu' },
    { key: 'city', header: 'Şehir' },
    { key: 'district', header: 'İlçe' },
    {
      key: 'status',
      header: 'Durum',
      render: (_value, row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'suspended'
            ? 'bg-orange-100 text-orange-800 border border-orange-200'
            : row.status === 'active'
            ? 'bg-green-100 text-green-800 border-green-200'
            : row.status === 'inactive'
            ? 'bg-gray-100 text-gray-800 border-gray-200'
            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }`}>
          {row.status === 'suspended' ? '🔄 Geçici' : row.status === 'active' ? 'Aktif' : row.status === 'inactive' ? 'Pasif' : row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_value, row) => (
        row.status === 'suspended' ? (
          <button
            onClick={() => handleCompleteTemp(row)}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            Tamamla
          </button>
        ) : null
      )
    }
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="min-w-64 flex-1 rounded border px-2 py-1 text-sm" placeholder="Ad, Soyad, Kimlik No, Telefon, Şehir, İlçe..." />
        <button className="rounded bg-green-600 px-3 py-1 text-sm text-white">Ara</button>

        <button onClick={() => setOpen(true)} className="rounded border px-3 py-1 text-sm">Ekle</button>
        <button onClick={() => setShowTempModal(true)} className="rounded bg-orange-600 px-3 py-1 text-sm text-white">Geçici Kayıt</button>
        <button
          onClick={testSupabaseConnection}
          className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
        >
          Test DB
        </button>
        <button
          onClick={handleCreateDemoRecords}
          disabled={saving}
          className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? 'Oluşturuluyor...' : 'Demo Kayıt'}
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => exportToCsv('ihtiyac-sahipleri.csv', rows)} 
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 flex items-center gap-1"
            title="CSV olarak indir"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
          <button 
            onClick={() => exportBeneficiariesToExcel(rows, q.trim() ? { search: q.trim() } : undefined)} 
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 flex items-center gap-1"
            title="Excel olarak indir"
          >
            <FileSpreadsheet className="w-3 h-3" />
            Excel
          </button>
          <button 
            onClick={() => exportBeneficiariesToPDF(rows, q.trim() ? { search: q.trim() } : undefined)} 
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 flex items-center gap-1"
            title="PDF olarak indir"
          >
            <FileText className="w-3 h-3" />
            PDF
          </button>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">{rows.length} Kayıt</div>
      </div>
      {loading ? (
        <div className="p-6 bg-card rounded-lg border text-sm text-muted-foreground">Yükleniyor...</div>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <Modal isOpen={open} onClose={() => { setOpen(false); resetForm(); }} title={editingId ? "İhtiyaç Sahibi Bilgilerini Tamamla" : "Yeni İhtiyaç Sahibi"}>
        <BeneficiaryForm
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={() => { setOpen(false); resetForm(); }}
          saving={saving}
          editingId={editingId}
        />
      </Modal>

      {/* Geçici Kayıt Modal */}
      <Modal 
        isOpen={showTempModal} 
        onClose={() => setShowTempModal(false)}
        title="Geçici Kayıt Ekle"
      >
        <div className="space-y-4">
          <Field label="Ad">
            <input 
              value={tempFormData.name}
              onChange={(e) => handleTempInputChange('name', e.target.value)}
              className="w-full rounded border px-2 py-1" 
              placeholder="Ad"
            />
          </Field>
          
          <Field label="Soyad">
            <input 
              value={tempFormData.surname}
              onChange={(e) => handleTempInputChange('surname', e.target.value)}
              className="w-full rounded border px-2 py-1" 
              placeholder="Soyad"
            />
          </Field>
          
          <Field label="Kimlik No">
            <input 
              value={tempFormData.identity_no}
              onChange={(e) => handleTempInputChange('identity_no', e.target.value)}
              className="w-full rounded border px-2 py-1" 
              placeholder="TC Kimlik No"
            />
          </Field>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button 
              onClick={() => { setShowTempModal(false); resetTempForm(); }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
              disabled={saving}
            >
              İptal
            </button>
            <button 
              onClick={handleTempSave}
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Geçici Kaydet'}
            </button>
          </div>
        </div>
      </Modal>


    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      {children}
    </label>
  )
}
