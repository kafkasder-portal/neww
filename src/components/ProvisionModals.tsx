import { Modal } from './Modal'
import { DataTable } from './DataTable'
import { getItemColumns, getPaymentColumns } from './ProvisionTableColumns'
import type { ProvisionRequest, ProvisionItem, Payment } from '../types/provision'

interface ProvisionModalsProps {
  selectedRequest: ProvisionRequest | null
  items: ProvisionItem[]
  payments: Payment[]
  requests: ProvisionRequest[]
  isItemsModalOpen: boolean
  setIsItemsModalOpen: (open: boolean) => void
  isPaymentsModalOpen: boolean
  setIsPaymentsModalOpen: (open: boolean) => void
  isApprovalModalOpen: boolean
  setIsApprovalModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void
  onApprovalSubmit?: (approvalData: { status: string; notes: string }) => void
}

export function ProvisionModals({
  selectedRequest,
  items,
  payments,
  requests,
  isItemsModalOpen,
  setIsItemsModalOpen,
  isPaymentsModalOpen,
  setIsPaymentsModalOpen,
  isApprovalModalOpen,
  setIsApprovalModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  onApprovalSubmit
}: ProvisionModalsProps) {
  const itemColumns = getItemColumns(requests)
  const paymentColumns = getPaymentColumns(requests)

  const handleApprovalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const approvalData = {
      status: formData.get('status') as string,
      notes: formData.get('notes') as string
    }
    onApprovalSubmit?.(approvalData)
    setIsApprovalModalOpen(false)
  }

  return (
    <>
      {/* Kalemler Modal */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        title={`Kalemler - ${selectedRequest?.requestNumber}`}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Talep Bilgileri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Amaç: {selectedRequest?.purpose}</div>
              <div>Toplam Tutar: {selectedRequest?.totalAmount.toLocaleString('tr-TR')} ₺</div>
              <div>Faydalanıcı: {selectedRequest?.beneficiaryCount} kişi</div>
              <div>Hedef Tarih: {selectedRequest?.targetDate}</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <DataTable 
              columns={itemColumns} 
              data={items.filter(item => item.requestId === selectedRequest?.id)} 
            />
          </div>
        </div>
      </Modal>

      {/* Ödemeler Modal */}
      <Modal
        isOpen={isPaymentsModalOpen}
        onClose={() => setIsPaymentsModalOpen(false)}
        title={`Ödemeler - ${selectedRequest?.requestNumber}`}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Ödeme Özeti</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Toplam Tutar:</span>
                <div className="font-medium">{selectedRequest?.totalAmount.toLocaleString('tr-TR')} ₺</div>
              </div>
              <div>
                <span className="text-gray-600">Ödenen:</span>
                <div className="font-medium text-green-600">{selectedRequest?.paidAmount.toLocaleString('tr-TR')} ₺</div>
              </div>
              <div>
                <span className="text-gray-600">Kalan:</span>
                <div className="font-medium text-orange-600">{selectedRequest?.remainingAmount.toLocaleString('tr-TR')} ₺</div>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <DataTable 
              columns={paymentColumns} 
              data={payments.filter(payment => payment.requestId === selectedRequest?.id)} 
            />
          </div>
        </div>
      </Modal>

      {/* Onay Modal */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title={`Talep Onayı - ${selectedRequest?.requestNumber}`}
      >
        <form onSubmit={handleApprovalSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Talep Detayları</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Talep Eden: {selectedRequest?.requestedBy}</div>
              <div>Departman: {selectedRequest?.department}</div>
              <div>Amaç: {selectedRequest?.purpose}</div>
              <div>Tutar: {selectedRequest?.totalAmount.toLocaleString('tr-TR')} ₺</div>
              <div>Faydalanıcı: {selectedRequest?.beneficiaryCount} kişi</div>
              <div>Hedef Tarih: {selectedRequest?.targetDate}</div>
            </div>
            <div className="mt-2">
              <span className="text-gray-600">Açıklama:</span>
              <p className="text-sm mt-1">{selectedRequest?.description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Onay Durumu</label>
              <select 
                name="status"
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="onaylandı">Onayla</option>
                <option value="reddedildi">Reddet</option>
                <option value="revizyon">Revizyon İste</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Onay Notları</label>
              <textarea
                name="notes"
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Onay/ret gerekçesi..."
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsApprovalModalOpen(false)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {/* Yeni Talep Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Provizyon Talebi"
      >
        <form onSubmit={async (e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)
          const requestData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority') || 'normal',
            type: formData.get('type'),
            amount: formData.get('amount'),
            status: 'pending',
            created_at: new Date().toISOString()
          }

          try {
            // API çağrısı - gerçek implementasyon yapılana kadar console log
            console.log('Yeni talep eklendi:', requestData)

            // Burada normalde API'ye POST isteği gönderilecek
            // await api.post('/provision-requests', requestData)

            alert('Talep başarıyla eklendi!')
            setIsAddModalOpen(false)
          } catch (error) {
            console.error('Talep eklenirken hata:', error)
            alert('Talep eklenirken hata oluştu!')
          }
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Talep Başlığı</label>
              <input
                type="text"
                name="title"
                className="w-full border rounded px-3 py-2"
                placeholder="Talep başlığını girin..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Departman</label>
              <select
                name="department"
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Departman seçin...</option>
                <option value="IT">IT</option>
                <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                <option value="Muhasebe">Muhasebe</option>
                <option value="Satış">Satış</option>
                <option value="Pazarlama">Pazarlama</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Öncelik</label>
              <select
                name="priority"
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Öncelik seçin...</option>
                <option value="Düşük">Düşük</option>
                <option value="Orta">Orta</option>
                <option value="Yüksek">Yüksek</option>
                <option value="Acil">Acil</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <textarea
                name="description"
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Talep açıklaması..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bütçe (TL)</label>
              <input
                type="number"
                name="budget"
                className="w-full border rounded px-3 py-2"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Talep Oluştur
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
