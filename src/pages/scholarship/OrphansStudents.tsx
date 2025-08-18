import { useMemo, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'
import { supabase } from '@lib/supabase'
// Mock data kaldırıldı - gerçek API'den veri gelecek

export interface OrphanRow {
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  status: string;
  guardian: string;
  enrollmentDate: string;
  lastUpdate: string;
  notes?: string;
  education?: string;
  health?: string;
  fileNo?: string;
  nameTr?: string;
  nameOrig?: string;
  nationality?: string;
  country?: string;
  partner?: string;
}

type Row = OrphanRow;
import StatCard from '@components/StatCard'
import { Modal } from '@components/Modal'
import { Users, GraduationCap, DollarSign, FileText, Filter, Plus, Download, Search, Eye, Edit, Trash2 } from 'lucide-react'

export default function OrphansStudents() {
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [genderFilter, setGenderFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Row | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const mockData: Row[] = []; // Boş array - gerçek API'den veri gelecek

  const filtered = useMemo(() => {
    return mockData.filter((r) => {
      const matchesSearch = JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesGender = genderFilter === 'all' || r.gender === genderFilter
      return matchesSearch && matchesStatus && matchesGender
    })
  }, [q, statusFilter, genderFilter, mockData])

  const stats = useMemo(() => {
    const total = mockData.length
    const active = mockData.filter(s => s.status === 'Aktif').length
    const preparing = mockData.filter(s => s.status === 'Hazırlanıyor').length
    const avgAge = Math.round(mockData.reduce((sum, s) => sum + s.age, 0) / total)
    
    return { total, active, preparing, avgAge }
  }, [mockData])

  const columns: Column<Row>[] = [
    { key: 'fileNo', header: 'Dosya No' },
    { key: 'partner', header: 'Partner & Şube' },
    { key: 'nationality', header: 'Uyruk' },
    { key: 'country', header: 'Ülke' },
    { key: 'gender', header: 'Cinsiyet' },
    { key: 'age', header: 'Yaş' },
    { key: 'nameTr', header: 'İsim (Tercüme)' },
    { key: 'nameOrig', header: 'İsim (Orijinal)' },
    { key: 'status', header: 'Durum', render: (_, r) => <StatusBadge v={r.status} /> },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_, r) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setSelectedStudent(r)
              setShowDetailModal(true)
            }}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="Detay Görüntüle"
          >
            <Eye size={16} />
          </button>
          <button
            className="rounded p-1 text-green-600 hover:bg-green-50"
            title="Düzenle"
          >
            <Edit size={16} />
          </button>
          <button
            className="rounded p-1 text-red-600 hover:bg-red-50"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Öğrenci"
          value={stats.total.toString()}
          icon={Users}
        />
        <StatCard
          title="Aktif Burslar"
          value={stats.active.toString()}
          icon={GraduationCap}
        />
        <StatCard
          title="Hazırlanan"
          value={stats.preparing.toString()}
          icon={FileText}
        />
        <StatCard
          title="Ortalama Yaş"
          value={stats.avgAge.toString()}
          icon={DollarSign}
        />
      </div>

      {/* Arama ve Filtre Bölümü */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto rounded border p-3 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="min-w-64 flex-1 border-0 outline-none text-sm"
              placeholder="Öğrenci adı, dosya no, kimlik no ile arama yapın..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm border ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filtre
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          >
            <Plus size={16} />
            Yeni Öğrenci
          </button>
          <button
            onClick={() => exportToCsv('yetimler.csv', filtered)}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Download size={16} />
            Dışa Aktar
          </button>
        </div>

        {/* Filtre Paneli */}
        {showFilters && (
          <div className="rounded border bg-gray-50 dark:bg-gray-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durum
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Hazırlanıyor">Hazırlanıyor</option>
                  <option value="Kontrol">Kontrol</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cinsiyet
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="Kız">Kız</option>
                  <option value="Erkek">Erkek</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setGenderFilter('all')
                    setQ('')
                  }}
                  className="rounded border px-3 py-2 text-sm hover:bg-white"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{filtered.length} kayıt gösteriliyor</span>
          <span>Sayfa 1 / {Math.ceil(filtered.length / 10)}</span>
        </div>
      </div>

      {/* Veri Tablosu */}
      <div className="bg-white dark:bg-gray-800 rounded border">
        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Yeni Öğrenci Ekleme Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Öğrenci Ekle"
      >
        <AddStudentForm onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Öğrenci Detay Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Öğrenci Detayları"
      >
        {selectedStudent && <StudentDetail student={selectedStudent} />}
      </Modal>
    </div>
  )
}

function StatusBadge({ v }: { v: Row['status'] }) {
  const map: Record<Row['status'], string> = {
    'Hazırlanıyor': 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200',
    Aktif: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200',
    Kontrol: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
    Pasif: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    Beklemede: 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200',
  }
  return <span className={`rounded px-2 py-0.5 text-xs ${map[v]}`}>{v}</span>
}

function AddStudentForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fileNo: '',
    partner: '',
    nationality: '',
    country: '',
    gender: '',
    age: '',
    nameTr: '',
    nameOrig: '',
    status: 'Hazırlanıyor' as Row['status'],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // API çağrısı - Supabase ile entegrasyon
      const { data, error } = await supabase
        .from('students')
        .insert([{
          file_number: formData.fileNo,
          first_name: formData.nameTr,
          last_name: formData.nameOrig,
          identity_no: formData.partner,
          birth_date: formData.nationality,
          phone: formData.country,
          email: formData.gender,
          address: formData.age,
          school: formData.nameTr,
          grade: formData.nameOrig,
          gpa: parseFloat(formData.status) || null,
          parent_name: formData.fileNo,
          parent_phone: formData.partner,
          monthly_income: parseFloat(formData.nationality) || null,
          status: 'active',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Student creation error:', error);
        alert('Öğrenci eklenirken hata oluştu: ' + error.message);
        return;
      }

      console.log('Yeni ��ğrenci eklendi:', data);
      alert('Öğrenci başarıyla eklendi');
      onClose();
    } catch (error) {
      console.error('Student creation error:', error);
      alert('Öğrenci eklenirken hata oluştu');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dosya No *
          </label>
          <input
            type="text"
            required
            value={formData.fileNo}
            onChange={(e) => setFormData({ ...formData, fileNo: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Örn: SERBEST-247"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner & Şube
          </label>
          <input
            type="text"
            value={formData.partner}
            onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Örn: Serbest"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            İsim (Tercüme) *
          </label>
          <input
            type="text"
            required
            value={formData.nameTr}
            onChange={(e) => setFormData({ ...formData, nameTr: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Türkçe isim"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            İsim (Orijinal)
          </label>
          <input
            type="text"
            value={formData.nameOrig}
            onChange={(e) => setFormData({ ...formData, nameOrig: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Orijinal isim"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uyruk
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Örn: Çeçenistan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ülke
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Örn: Türkiye"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cinsiyet *
          </label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Seçiniz</option>
            <option value="Kız">Kız</option>
            <option value="Erkek">Erkek</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yaş *
          </label>
          <input
            type="number"
            required
            min="1"
            max="30"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Yaş"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          Kaydet
        </button>
      </div>
    </form>
  )
}

function StudentDetail({ student }: { student: Row }) {
  return (
    <div className="space-y-6">
      {/* Temel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Kişisel Bilgiler</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Dosya No:</span>
              <p className="font-medium">{student.fileNo}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">İsim (Tercüme):</span>
              <p className="font-medium">{student.nameTr}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">İsim (Orijinal):</span>
              <p className="font-medium">{student.nameOrig}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Yaş:</span>
              <p className="font-medium">{student.age}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Cinsiyet:</span>
              <p className="font-medium">{student.gender}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Konum Bilgileri</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Uyruk:</span>
              <p className="font-medium">{student.nationality}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Ülke:</span>
              <p className="font-medium">{student.country}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Partner & Şube:</span>
              <p className="font-medium">{student.partner}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Durum:</span>
              <StatusBadge v={student.status} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Burs Bilgileri */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 mb-3">Burs Bilgileri</h3>
        <div className="bg-gray-50 rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">Burs Türü:</span>
              <p className="font-medium">Eğitim Bursu</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Aylık Miktar:</span>
              <p className="font-medium">₺2,500</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Başlangıç Tarihi:</span>
              <p className="font-medium">01.09.2024</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Akademik Bilgiler */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 mb-3">Akademik Bilgiler</h3>
        <div className="bg-blue-50 rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Okul:</span>
              <p className="font-medium">İstanbul Üniversitesi</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Bölüm:</span>
              <p className="font-medium">Bilgisayar Mühendisliği</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Sınıf:</span>
              <p className="font-medium">2. Sınıf</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Not Ortalaması:</span>
              <p className="font-medium">3.45 / 4.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
