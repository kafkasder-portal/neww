// import { Fragment } from 'react'
import { X, Plus, Edit2, Trash2, Eye, Download, Upload } from 'lucide-react'

interface RelatedRecordsModalProps {
  isOpen: boolean
  onClose: () => void
  recordType: string
  recordCount?: number
}

export default function RelatedRecordsModal({ 
  isOpen, 
  onClose, 
  recordType, 
  recordCount = 0 
}: RelatedRecordsModalProps) {
  if (!isOpen) return null

  const getModalContent = () => {
    switch (recordType) {
      case 'bank-accounts':
        return {
          title: '🏦 Banka Hesapları',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Kayıtlı Banka Hesapları</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Yeni Hesap Ekle
                </button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Banka Adı</th>
                      <th className="px-4 py-3 text-left">Hesap No</th>
                      <th className="px-4 py-3 text-left">IBAN</th>
                      <th className="px-4 py-3 text-left">Durum</th>
                      <th className="px-4 py-3 text-left">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3">Ziraat Bankası</td>
                      <td className="px-4 py-3">1234567890</td>
                      <td className="px-4 py-3">TR12 0001 0012 3456 7890 1234 56</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aktif</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4" /></button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Başka hesap bulunamadı</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

      case 'documents':
        return {
          title: `📄 Dokümanlar (${recordCount})`,
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Kişiye Ait Dokümanlar</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  Doküman Yükle
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Kimlik Fotokopisi.pdf', size: '2.4 MB', date: '15.01.2024' },
                  { name: 'İkametgah Belgesi.pdf', size: '1.8 MB', date: '12.01.2024' },
                  { name: 'Gelir Belgesi.pdf', size: '3.2 MB', date: '10.01.2024' },
                  { name: 'Aile Fotoğrafı.jpg', size: '5.1 MB', date: '08.01.2024' },
                  { name: 'Sağlık Raporu.pdf', size: '2.7 MB', date: '05.01.2024' },
                  { name: 'Nüfus Cüzdanı.pdf', size: '1.9 MB', date: '03.01.2024' }
                ].map((doc, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{doc.size} • {doc.date}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="h-3 w-3" /></button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Download className="h-3 w-3" /></button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

      case 'photos':
        return {
          title: '📷 Fotoğraflar',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Fotoğraf Galerisi</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  Fotoğraf Ekle
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((photo) => (
                  <div key={photo} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 group-hover:bg-gray-400 transition-colors"></div>
                      <span className="text-xs text-gray-500">Fotoğraf {photo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

      case 'orphans':
        return {
          title: '👶 Baktığı Yetimler',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Bakmakla Yükümlü Olduğu Yetimler</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Yetim Ekle
                </button>
              </div>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-center text-gray-500">Henüz kayıtlı yetim bulunmuyor.</p>
                  <p className="text-center text-sm text-gray-400 mt-2">Yeni yetim eklemek için yukarıdaki butonu kullanın.</p>
                </div>
              </div>
            </div>
          )
        }

      case 'dependents':
        return {
          title: `👨‍👩‍👧‍👦 Baktığı Kişiler (${recordCount})`,
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Bakmakla Yükümlü Olduğu Kişiler</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Kişi Ekle
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Ayşe Sayro', relation: 'Kızı', age: '12', status: 'Öğrenci' },
                  { name: 'Mehmet Sayro', relation: 'Oğlu', age: '8', status: 'İlkokul' },
                  { name: 'Fatma Sayro', relation: 'Kayınvalidesi', age: '67', status: 'Emekli' },
                  { name: 'Ali Sayro', relation: 'Oğlu', age: '15', status: 'Lise' }
                ].map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <h4 className="font-medium">{person.name}</h4>
                        <p className="text-sm text-gray-500">{person.relation} • {person.age} yaş • {person.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="h-4 w-4" /></button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Edit2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

      case 'aid-requests':
        return {
          title: `🤲 Yardım Talepleri (${recordCount})`,
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Yardım Talep Geçmişi</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Yeni Talep
                </button>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-orange-900">Acil Gıda Yardımı</h4>
                      <p className="text-sm text-orange-700 mt-1">Talep Tarihi: 10.01.2024</p>
                      <p className="text-sm text-orange-600 mt-2">Ailede 4 kişi için acil gıda desteği talep ediliyor.</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">Beklemede</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 'sponsors':
        return {
          title: '💝 Sponsorlar',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sponsor Listesi</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Sponsor Ekle
                </button>
              </div>

              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500">Henüz kayıtlı sponsor bulunmuyor.</p>
                <p className="text-sm text-gray-400 mt-2">Bu kişi için sponsor eklemek istiyorsanız yukarıdaki butonu kullanın.</p>
              </div>
            </div>
          )
        }

      case 'references':
        return {
          title: '📝 Referanslar',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Referans Kişiler</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Referans Ekle
                </button>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Ahmet Yılmaz</h4>
                      <p className="text-sm text-gray-600 mt-1">Mahalle Muhtarı</p>
                      <p className="text-sm text-gray-500 mt-1">Tel: 0532 123 45 67</p>
                      <p className="text-xs text-gray-400 mt-2">Ekleme Tarihi: 05.01.2024</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Edit2 className="h-4 w-4" /></button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 'meeting-records':
        return {
          title: '💬 Görüşme Kayıtları',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Görüşme Geçmişi</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Yeni Görüşme
                </button>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Ev Ziyareti</h4>
                      <p className="text-sm text-gray-600 mt-1">12.01.2024 - 14:30</p>
                      <p className="text-sm text-gray-700 mt-2">Aile durumu değerlendirildi. İhtiyaçlar tespit edildi.</p>
                      <p className="text-xs text-gray-500 mt-2">Görüşen: Ayşe Demir</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="h-4 w-4" /></button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Edit2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 'session-tracking':
        return {
          title: '📅 Görüşme Seans Takibi',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Seans Planlaması</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Seans Planla
                </button>
              </div>

              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500">Planlanmış seans bulunmuyor.</p>
              </div>
            </div>
          )
        }

      case 'aid-provided':
        return {
          title: '✅ Yapılan Yardımlar',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Yardım Geçmişi</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Yardım Ekle
                </button>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-900">Gıda Paketi</h4>
                      <p className="text-sm text-green-700 mt-1">08.01.2024</p>
                      <p className="text-sm text-green-600 mt-2">₺500 değerinde gıda yardımı yapıldı.</p>
                    </div>
                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">Tamamlandı</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 'consent-statements':
        return {
          title: `📝 Rıza Beyanları (${recordCount})`,
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Rıza Beyan Belgeleri</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  Rıza Beyanı Yükle
                </button>
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">KVKK Rıza Beyanı</h4>
                      <p className="text-sm text-gray-600 mt-1">Tarih: 03.01.2024</p>
                      <p className="text-sm text-green-600 mt-2">✓ Onaylandı</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="h-4 w-4" /></button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 'social-cards':
        return {
          title: '🎨 Sosyal Kartlar',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sosyal Medya Kartları</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Kart Oluştur
                </button>
              </div>

              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500">Henüz sosyal kart oluşturulmamış.</p>
              </div>
            </div>
          )
        }

      case 'card-summary':
        return {
          title: '📊 Kart Özeti',
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Genel Özet</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-gray-600">Toplam Doküman</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-gray-600">Baktığı Kişi</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-gray-600">Bekleyen Talep</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">Rıza Beyanı</div>
                </div>
              </div>
            </div>
          )
        }

      default:
        return {
          title: recordType.charAt(0).toUpperCase() + recordType.slice(1),
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bu bölüm henüz geliştirilmemiş</h3>
              <p className="text-gray-500">Bu kayıt türü için henüz özel içerik hazırlanmamıştır.</p>
            </div>
          )
        }
    }
  }

  const { title, content } = getModalContent()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {content}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Kapat
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
