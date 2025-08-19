import { useEffect, useState, useCallback } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'
import { exportBeneficiariesToExcel } from '@utils/excelExport'
import { exportBeneficiariesToPDF } from '@utils/pdfExport'
import { Link } from 'react-router-dom'
import { Modal } from '@components/Modal'
import { supabase, type Database } from '@lib/supabase'
import { QrCode, FileSpreadsheet, FileText, Download, Filter, ChevronDown, ChevronUp, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage, logErrorSafely } from '../../utils/errorMessageUtils'

type BeneficiaryRow = Database['public']['Tables']['beneficiaries']['Row']

interface FormData {
  // Temel Bilgiler
  name: string
  surname: string
  category: string
  nationality: string
  birth_date: string
  birth_place: string
  identity_no: string
  gender: string
  marital_status: string
  education_level: string
  mother_name: string
  father_name: string
  
  // İletişim Bilgileri
  phone: string
  alternative_phone: string
  email: string
  address: string
  city: string
  district: string
  neighborhood: string
  postal_code: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relation: string
  
  // Finansal Bilgiler
  monthly_income: string
  household_size: string
  dependent_count: string
  employment_status: string
  occupation: string
  social_security_no: string
  bank_account_no: string
  bank_name: string
  
  // Sağlık Bilgileri
  has_disability: boolean
  disability_type: string
  disability_percentage: string
  chronic_illness: string
  medication_needs: string
  health_insurance: boolean
  health_insurance_type: string
  
  // Konut Bilgileri
  housing_type: string
  monthly_rent: string
  room_count: string
  has_electricity: boolean
  has_water: boolean
  has_gas: boolean
  has_internet: boolean
  housing_condition: string
  
  // Ek Bilgiler
  special_needs: string
  previous_aid_received: boolean
  previous_aid_details: string
  verification_status: string
  notes: string
  
  // Sistem Alanları
  fund_region: string
  file_connection: string
  file_number: string
  status: string
  mernis_check: boolean
}

interface TempFormData {
  name: string
  surname: string
  identity_no: string
}

// Sıralı ID oluşturma fonksiyonu
const getNextSequentialId = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting next ID:', error)
    return 1
  }

  return data && data.length > 0 ? data[0].id + 1 : 1
}

export default function Beneficiaries() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [tempOpen, setTempOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<BeneficiaryRow[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Form bölümlerinin açık/kapalı durumu
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: false,
    financial: false,
    health: false,
    housing: false,
    additional: false,
    system: false
  })
  

  const [formData, setFormData] = useState<FormData>({
    // Temel Bilgiler
    name: '',
    surname: '',
    category: 'Yetim Ailesi',
    nationality: 'TC',
    birth_date: '',
    birth_place: '',
    identity_no: '',
    gender: '',
    marital_status: '',
    education_level: '',
    mother_name: '',
    father_name: '',
    
    // İletişim Bilgileri
    phone: '',
    alternative_phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
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
    fund_region: 'Genel',
    file_connection: 'Doğrudan Başvuru',
    file_number: '',
    status: 'active',
    mernis_check: false
  })

  const [tempFormData, setTempFormData] = useState<TempFormData>({
    name: '',
    surname: '',
    identity_no: ''
  })

  const loadBeneficiaries = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('beneficiaries').select('*').order('created_at', { ascending: false })
    
    // Apply basic search filter
    const searchTerm = q.trim()
    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%,identity_no.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%`
      )
    }
    

    
    const { data, error } = await query
    if (error) {
      logErrorSafely('Beneficiaries fetch error', error)

      const errorMessage = getErrorMessage(error)
      if (errorMessage.includes('relation') || errorMessage.includes('table') || errorMessage.includes('does not exist')) {
        toast.error('Veritabanı tabloları bulunamadı. Lütfen sistem yöneticisine başvurun.')
      } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
        toast.error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.')
      } else {
        toast.error(`İhtiyaç sahipleri yüklenirken hata oluştu: ${errorMessage}`)
      }

      setRows([])
    } else {
      setRows(data || [])
    }
    setLoading(false)
  }, [q])

  useEffect(() => {
    loadBeneficiaries()
  }, [loadBeneficiaries])

  const resetForm = () => {
    setFormData({
      // Temel Bilgiler
      name: '',
      surname: '',
      category: 'Yetim Ailesi',
      nationality: 'TC',
      birth_date: '',
      birth_place: '',
      identity_no: '',
      gender: '',
      marital_status: '',
      education_level: '',
      mother_name: '',
      father_name: '',
      
      // İletişim Bilgileri
      phone: '',
      alternative_phone: '',
      email: '',
      address: '',
      city: '',
      district: '',
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
      fund_region: 'Genel',
      file_connection: 'Doğrudan Başvuru',
      file_number: '',
      status: 'active',
      mernis_check: false
    })
    setEditingId(null)
  }

  const resetTempForm = () => {
    setTempFormData({
      name: '',
      surname: '',
      identity_no: ''
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.surname.trim() || !formData.identity_no.trim()) {
      toast.error('Ad, Soyad ve Kimlik No alanları zorunludur')
      return
    }

    setSaving(true)
    try {
      const dataToSave = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        category: formData.category,
        nationality: formData.nationality.trim(),
        birth_date: formData.birth_date || null,
        identity_no: formData.identity_no.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        district: formData.district.trim() || null,
        status: formData.status,
        fund_region: formData.fund_region
      }

      let result
      if (editingId) {
        // Güncelleme işlemi
        result = await supabase
          .from('beneficiaries')
          .update(dataToSave)
          .eq('id', editingId)
          .select()
      } else {
        // Yeni kayıt işlemi - sıralı ID ile
        const nextId = await getNextSequentialId()
        const dataWithId = { ...dataToSave, id: nextId }
        result = await supabase
          .from('beneficiaries')
          .insert([dataWithId])
          .select()
      }

      const { error } = result

      if (error) {
        console.error('Save error:', error)
        toast.error('Kayıt sırasında hata oluştu: ' + error.message)
      } else {
        toast.success(editingId ? 'İhtiyaç sahibi başarıyla güncellendi' : 'İhtiyaç sahibi başarıyla kaydedildi')
        setOpen(false)
        resetForm()
        setEditingId(null)
        loadBeneficiaries()
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Kayıt sırasında beklenmeyen hata oluştu')
    } finally {
      setSaving(false)
    }
  }





  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // FormSection bileşeni
  const FormSection = ({ title, isExpanded, onToggle, children }: {
    title: string
    isExpanded: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left font-medium text-gray-900 rounded-t-lg"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isExpanded && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )

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
          status: 'geçici',
          fund_region: 'Genel',
          file_connection: 'Doğrudan Başvuru'
        }])
        .select()

      if (error) {
        console.error('Temp save error:', error)
        toast.error('Geçici kayıt sırasında hata olu��tu: ' + error.message)
      } else {
        toast.success('Geçici kayıt başarıyla oluşturuldu')
        setTempOpen(false)
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
            ? 'bg-green-100 text-green-800'
            : row.status === 'inactive'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-yellow-100 text-yellow-800'
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
        <button onClick={() => setTempOpen(true)} className="rounded bg-orange-600 px-3 py-1 text-sm text-white">Geçici Kayıt</button>
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
        <div className="p-6 text-sm text-muted-foreground">Yükleniyor...</div>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <Modal isOpen={open} onClose={() => { setOpen(false); resetForm(); }} title={editingId ? "İhtiyaç Sahibi Bilgilerini Tamamla" : "Yeni İhtiyaç Sahibi"}>
        <div className="p-4 space-y-4">


          {/* Temel Bilgiler Bölümü */}
          <FormSection 
            title="Temel Bilgiler" 
            isExpanded={expandedSections.personal} 
            onToggle={() => toggleSection('personal')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Kategori *">
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="Yetim Ailesi">Yetim Ailesi</option>
                  <option value="Muhtaç Aile">Muhtaç Aile</option>
                  <option value="Yaşlı">Yaşlı</option>
                  <option value="Engelli">Engelli</option>
                  <option value="Hasta">Hasta</option>
                </select>
              </Field>
              
              <Field label="Ad *">
                <div className="relative">
                  <input 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded border px-2 py-1" 
                    placeholder="Ad"
                  />
                  {formData.name && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </Field>
              
              <Field label="Soyad *">
                <div className="relative">
                  <input 
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    className="w-full rounded border px-2 py-1" 
                    placeholder="Soyad"
                  />
                  {formData.surname && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </Field>
              
              <Field label="Uyruk">
                <select 
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="TC">T.C.</option>
                  <option value="Suriye">Suriye</option>
                  <option value="Irak">Irak</option>
                  <option value="Afganistan">Afganistan</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </Field>
              
              <Field label="Doğum Tarihi">
                <input 
                  type="date" 
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                />
              </Field>
              
              <Field label="Doğum Yeri">
                <input 
                  value={formData.birth_place}
                  onChange={(e) => handleInputChange('birth_place', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Doğum yeri"
                />
              </Field>
              
              <Field label="Cinsiyet">
                <select 
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </Field>
              
              <Field label="Medeni Durum">
                <select 
                  value={formData.marital_status}
                  onChange={(e) => handleInputChange('marital_status', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Bekar">Bekar</option>
                  <option value="Evli">Evli</option>
                  <option value="Dul">Dul</option>
                  <option value="Boşanmış">Boşanmış</option>
                </select>
              </Field>
              
              <Field label="Eğitim Seviyesi">
                <select 
                  value={formData.education_level}
                  onChange={(e) => handleInputChange('education_level', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Okur-yazar değil">Okur-yazar değil</option>
                  <option value="İlkokul">İlkokul</option>
                  <option value="Ortaokul">Ortaokul</option>
                  <option value="Lise">Lise</option>
                  <option value="Üniversite">Üniversite</option>
                  <option value="Lisansüstü">Lisansüstü</option>
                </select>
              </Field>
              
              <Field label="Anne Adı">
                <input 
                  value={formData.mother_name}
                  onChange={(e) => handleInputChange('mother_name', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Anne adı"
                />
              </Field>
              
              <Field label="Baba Adı">
                <input 
                  value={formData.father_name}
                  onChange={(e) => handleInputChange('father_name', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Baba adı"
                />
              </Field>
              
              <div className="sm:col-span-2 grid grid-cols-[1fr_auto] items-center gap-2">
                <Field label="Kimlik No *">
                  <div className="relative">
                    <input 
                      value={formData.identity_no}
                      onChange={(e) => handleInputChange('identity_no', e.target.value)}
                      className="w-full rounded border px-2 py-1" 
                      placeholder="11 haneli kimlik numarası"
                    />
                    {formData.identity_no && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                </Field>
                <label className="flex items-center gap-2 text-sm mt-5">
                  <input 
                    type="checkbox" 
                    checked={formData.mernis_check}
                    onChange={(e) => handleInputChange('mernis_check', e.target.checked)}
                  /> 
                  Mernis Kontrolü Yap
                </label>
              </div>
            </div>
          </FormSection>
          
          {/* İletişim Bilgileri Bölümü */}
          <FormSection 
            title="İletişim Bilgileri" 
            isExpanded={expandedSections.contact} 
            onToggle={() => toggleSection('contact')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Telefon">
                <input 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0555 123 45 67"
                />
              </Field>
              
              <Field label="Alternatif Telefon">
                <input 
                  value={formData.alternative_phone}
                  onChange={(e) => handleInputChange('alternative_phone', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0555 123 45 67"
                />
              </Field>
              
              <Field label="E-posta">
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="ornek@email.com"
                />
              </Field>
              
              <Field label="Şehir">
                <input 
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Şehir"
                />
              </Field>
              
              <Field label="İlçe">
                <input 
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="İlçe"
                />
              </Field>
              
              <Field label="Mahalle">
                <input 
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Mahalle"
                />
              </Field>
              
              <Field label="Posta Kodu">
                <input 
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="34000"
                />
              </Field>
              
              <div className="sm:col-span-2">
                <Field label="Adres">
                  <textarea 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full rounded border px-2 py-1" 
                    placeholder="Tam adres"
                    rows={2}
                  />
                </Field>
              </div>
              
              <Field label="Acil Durum İletişim Adı">
                <input 
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Acil durum kişisi"
                />
              </Field>
              
              <Field label="Acil Durum Telefon">
                <input 
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0555 123 45 67"
                />
              </Field>
              
              <Field label="Acil Durum Yakınlık">
                <select 
                  value={formData.emergency_contact_relation}
                  onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Eş">Eş</option>
                  <option value="Anne">Anne</option>
                  <option value="Baba">Baba</option>
                  <option value="Kardeş">Kardeş</option>
                  <option value="Çocuk">Çocuk</option>
                  <option value="Akraba">Akraba</option>
                  <option value="Arkadaş">Arkadaş</option>
                  <option value="Komşu">Komşu</option>
                </select>
              </Field>
            </div>
          </FormSection>
          
          {/* Finansal Bilgiler Bölümü */}
          <FormSection 
            title="Finansal Bilgiler" 
            isExpanded={expandedSections.financial} 
            onToggle={() => toggleSection('financial')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Aylık Gelir (TL)">
                <input 
                  type="number"
                  value={formData.monthly_income}
                  onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0"
                />
              </Field>
              
              <Field label="Hane Büyüklüğü">
                <input 
                  type="number"
                  value={formData.household_size}
                  onChange={(e) => handleInputChange('household_size', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="1"
                />
              </Field>
              
              <Field label="Bağımlı Kişi Sayısı">
                <input 
                  type="number"
                  value={formData.dependent_count}
                  onChange={(e) => handleInputChange('dependent_count', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0"
                />
              </Field>
              
              <Field label="İstihdam Durumu">
                <select 
                  value={formData.employment_status}
                  onChange={(e) => handleInputChange('employment_status', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Çalışıyor">Çalışıyor</option>
                  <option value="İşsiz">İşsiz</option>
                  <option value="Emekli">Emekli</option>
                  <option value="Öğrenci">Öğrenci</option>
                  <option value="Ev hanımı">Ev hanımı</option>
                  <option value="Çalışamaz durumda">Çalışamaz durumda</option>
                </select>
              </Field>
              
              <Field label="Meslek">
                <input 
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Meslek"
                />
              </Field>
              
              <Field label="SGK No">
                <input 
                  value={formData.social_security_no}
                  onChange={(e) => handleInputChange('social_security_no', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="SGK numarası"
                />
              </Field>
              
              <Field label="Banka Hesap No">
                <input 
                  value={formData.bank_account_no}
                  onChange={(e) => handleInputChange('bank_account_no', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="IBAN"
                />
              </Field>
              
              <Field label="Banka Adı">
                <input 
                  value={formData.bank_name}
                  onChange={(e) => handleInputChange('bank_name', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Banka adı"
                />
              </Field>
            </div>
          </FormSection>
          
          {/* Sağlık Bilgileri Bölümü */}
          <FormSection 
            title="Sağlık Bilgileri" 
            isExpanded={expandedSections.health} 
            onToggle={() => toggleSection('health')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.has_disability}
                    onChange={(e) => handleInputChange('has_disability', e.target.checked)}
                  /> 
                  Engel durumu var
                </label>
              </div>
              
              {formData.has_disability && (
                <>
                  <Field label="Engel Türü">
                    <select 
                      value={formData.disability_type}
                      onChange={(e) => handleInputChange('disability_type', e.target.value)}
                      className="w-full rounded border px-2 py-1"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Fiziksel">Fiziksel</option>
                      <option value="Zihinsel">Zihinsel</option>
                      <option value="Görme">Görme</option>
                      <option value="İşitme">İşitme</option>
                      <option value="Konuşma">Konuşma</option>
                      <option value="Çoklu">Çoklu</option>
                    </select>
                  </Field>
                  
                  <Field label="Engel Oranı (%)">
                    <input 
                      type="number"
                      value={formData.disability_percentage}
                      onChange={(e) => handleInputChange('disability_percentage', e.target.value)}
                      className="w-full rounded border px-2 py-1" 
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </Field>
                </>
              )}
              
              <Field label="Kronik Hastalık">
                <input 
                  value={formData.chronic_illness}
                  onChange={(e) => handleInputChange('chronic_illness', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Kronik hastalık varsa belirtiniz"
                />
              </Field>
              
              <Field label="İlaç İhtiyacı">
                <input 
                  value={formData.medication_needs}
                  onChange={(e) => handleInputChange('medication_needs', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Düzenli kullanılan ilaçlar"
                />
              </Field>
              
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.health_insurance}
                    onChange={(e) => handleInputChange('health_insurance', e.target.checked)}
                  /> 
                  Sağlık sigortası var
                </label>
              </div>
              
              {formData.health_insurance && (
                <Field label="Sigorta Türü">
                  <select 
                    value={formData.health_insurance_type}
                    onChange={(e) => handleInputChange('health_insurance_type', e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  >
                    <option value="">Seçiniz</option>
                    <option value="SGK">SGK</option>
                    <option value="Yeşil Kart">Yeşil Kart</option>
                    <option value="Özel Sigorta">Özel Sigorta</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </Field>
              )}
            </div>
          </FormSection>
          
          {/* Konut Bilgileri Bölümü */}
          <FormSection 
            title="Konut Bilgileri" 
            isExpanded={expandedSections.housing} 
            onToggle={() => toggleSection('housing')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Konut Türü">
                <select 
                  value={formData.housing_type}
                  onChange={(e) => handleInputChange('housing_type', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="Mülk">Mülk</option>
                  <option value="Kiralık">Kiralık</option>
                  <option value="Lojman">Lojman</option>
                  <option value="Akraba yanında">Akraba yanında</option>
                  <option value="Barınak">Barınak</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </Field>
              
              <Field label="Aylık Kira (TL)">
                <input 
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="0"
                />
              </Field>
              
              <Field label="Oda Sayısı">
                <select 
                  value={formData.room_count}
                  onChange={(e) => handleInputChange('room_count', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </Field>
              
              <Field label="Konut Durumu">
                <select 
                  value={formData.housing_condition}
                  onChange={(e) => handleInputChange('housing_condition', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="">Seçiniz</option>
                  <option value="İyi">İyi</option>
                  <option value="Orta">Orta</option>
                  <option value="Kötü">Kötü</option>
                  <option value="Çok kötü">Çok kötü</option>
                </select>
              </Field>
              
              <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.has_electricity}
                    onChange={(e) => handleInputChange('has_electricity', e.target.checked)}
                  /> 
                  Elektrik
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.has_water}
                    onChange={(e) => handleInputChange('has_water', e.target.checked)}
                  /> 
                  Su
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.has_gas}
                    onChange={(e) => handleInputChange('has_gas', e.target.checked)}
                  /> 
                  Doğalgaz
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.has_internet}
                    onChange={(e) => handleInputChange('has_internet', e.target.checked)}
                  /> 
                  İnternet
                </label>
              </div>
            </div>
          </FormSection>
          
          {/* Ek Bilgiler Bölümü */}
          <FormSection 
            title="Ek Bilgiler" 
            isExpanded={expandedSections.additional} 
            onToggle={() => toggleSection('additional')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Özel İhtiyaçlar">
                  <textarea 
                    value={formData.special_needs}
                    onChange={(e) => handleInputChange('special_needs', e.target.value)}
                    className="w-full rounded border px-2 py-1" 
                    placeholder="Özel ihtiyaçlar, dikkat edilmesi gereken durumlar"
                    rows={2}
                  />
                </Field>
              </div>
              
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.previous_aid_received}
                    onChange={(e) => handleInputChange('previous_aid_received', e.target.checked)}
                  /> 
                  Daha önce yardım alındı
                </label>
              </div>
              
              {formData.previous_aid_received && (
                <div className="sm:col-span-2">
                  <Field label="Önceki Yardım Detayları">
                    <textarea 
                      value={formData.previous_aid_details}
                      onChange={(e) => handleInputChange('previous_aid_details', e.target.value)}
                      className="w-full rounded border px-2 py-1" 
                      placeholder="Hangi kuruluştan, ne tür yardım alındı"
                      rows={2}
                    />
                  </Field>
                </div>
              )}
              
              <Field label="Doğrulama Durumu">
                <select 
                  value={formData.verification_status}
                  onChange={(e) => handleInputChange('verification_status', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="pending">Beklemede</option>
                  <option value="verified">Doğrulandı</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="needs_review">İnceleme Gerekli</option>
                </select>
              </Field>
              
              <div className="sm:col-span-2">
                <Field label="Notlar">
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full rounded border px-2 py-1" 
                    placeholder="Ek notlar, açıklamalar"
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          </FormSection>
          
          {/* Sistem Alanları Bölümü */}
          <FormSection 
            title="Sistem Alanları" 
            isExpanded={expandedSections.system} 
            onToggle={() => toggleSection('system')}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Fon Bölgesi">
                <select 
                  value={formData.fund_region}
                  onChange={(e) => handleInputChange('fund_region', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="Genel">Genel</option>
                  <option value="Özel">Özel</option>
                  <option value="Acil">Acil</option>
                </select>
              </Field>
              
              <Field label="Dosya Bağlantısı">
                <select 
                  value={formData.file_connection}
                  onChange={(e) => handleInputChange('file_connection', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="Partner Kurum">Partner Kurum</option>
                  <option value="Doğrudan Başvuru">Doğrudan Başvuru</option>
                  <option value="Sevk">Sevk</option>
                </select>
              </Field>
              
              <Field label="Dosya Numarası">
                <input 
                  value={formData.file_number}
                  onChange={(e) => handleInputChange('file_number', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Dosya numarası"
                />
              </Field>
              
              <Field label="Durum">
                <select 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="suspended">Geçici</option>
                </select>
              </Field>
            </div>
          </FormSection>
          
          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button 
              onClick={() => { setOpen(false); resetForm(); }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
              disabled={saving}
            >
              İptal
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Geçici Kayıt Modal */}
      <Modal isOpen={tempOpen} onClose={() => { setTempOpen(false); resetTempForm(); }} title="Geçici Kayıt">
        <div className="p-4 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-orange-800">
              <strong>Geçici Kayıt:</strong> Sadece temel bilgiler alınır. Detaylar daha sonra tamamlanabilir.
            </p>
          </div>



          <div className="grid gap-3">
            <Field label="Ad *">
              <div className="relative">
                <input 
                  value={tempFormData.name}
                  onChange={(e) => handleTempInputChange('name', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Ad"
                />
                {tempFormData.name && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </Field>
            
            <Field label="Soyad *">
              <div className="relative">
                <input 
                  value={tempFormData.surname}
                  onChange={(e) => handleTempInputChange('surname', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="Soyad"
                />
                {tempFormData.surname && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </Field>
            
            <Field label="Kimlik No *">
              <div className="relative">
                <input 
                  value={tempFormData.identity_no}
                  onChange={(e) => handleTempInputChange('identity_no', e.target.value)}
                  className="w-full rounded border px-2 py-1" 
                  placeholder="11 haneli kimlik numarası"
                />
                {tempFormData.identity_no && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </Field>
          </div>
          
          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button 
              onClick={() => { setTempOpen(false); resetTempForm(); }}
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
