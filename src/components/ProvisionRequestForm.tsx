import { useState } from 'react'
import { Modal } from './Modal'
import type { ProvisionRequest } from '../types/provision'

interface ProvisionRequestFormProps {
  isOpen: boolean
  onClose: () => void
  editingRequest: ProvisionRequest | null
  onSubmit: (data: Partial<ProvisionRequest>) => void
}

export function ProvisionRequestForm({ isOpen, onClose, editingRequest, onSubmit }: ProvisionRequestFormProps) {
  const [formData, setFormData] = useState({
    requestNumber: editingRequest?.requestNumber || '',
    requestedBy: editingRequest?.requestedBy || '',
    department: editingRequest?.department || '',
    priority: editingRequest?.priority || 'normal' as ProvisionRequest['priority'],
    totalAmount: editingRequest?.totalAmount?.toString() || '',
    currency: editingRequest?.currency || 'TRY' as ProvisionRequest['currency'],
    purpose: editingRequest?.purpose || '',
    description: editingRequest?.description || '',
    beneficiaryCount: editingRequest?.beneficiaryCount?.toString() || '',
    targetDate: editingRequest?.targetDate || '',
    paymentMethod: editingRequest?.paymentMethod || 'banka' as ProvisionRequest['paymentMethod'],
    bankAccount: editingRequest?.bankAccount || '',
    documents: editingRequest?.documents || [''] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      beneficiaryCount: parseInt(formData.beneficiaryCount) || 0,
      tryEquivalent: parseFloat(formData.totalAmount) || 0,
      documents: formData.documents.filter(doc => doc.trim() !== '')
    }
    
    onSubmit(submitData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRequest ? 'Talep Düzenle' : 'Yeni Talep Oluştur'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Talep No *</label>
            <input
              type="text"
              value={formData.requestNumber}
              onChange={(e) => setFormData({...formData, requestNumber: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="PR-2024-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Talep Eden *</label>
            <input
              type="text"
              value={formData.requestedBy}
              onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Ad Soyad"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departman *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seçiniz</option>
              <option value="Yardım Dağıtım">Yardım Dağıtım</option>
              <option value="Eğitim Yardımları">Eğitim Yardımları</option>
              <option value="Sağlık Yardımları">Sağlık Yardımları</option>
              <option value="Barınma Yardımları">Barınma Yardımları</option>
              <option value="Gıda Yardımları">Gıda Yardımları</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Öncelik *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as ProvisionRequest['priority']})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="düşük">Düşük</option>
              <option value="normal">Normal</option>
              <option value="yüksek">Yüksek</option>
              <option value="acil">Acil</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tutar *</label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="50000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Para Birimi *</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value as ProvisionRequest['currency']})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Faydalanıcı Sayısı *</label>
            <input
              type="number"
              value={formData.beneficiaryCount}
              onChange={(e) => setFormData({...formData, beneficiaryCount: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="100"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amaç *</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Kış Yardımı, Eğitim Bursu vb."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hedef Tarih *</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Açıklama *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Detaylı açıklama..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ödeme Yöntemi</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as ProvisionRequest['paymentMethod']})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="nakit">Nakit</option>
              <option value="banka">Banka Transferi</option>
              <option value="kredi-kartı">Kredi Kartı</option>
              <option value="çek">Çek</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Banka Hesabı</label>
            <input
              type="text"
              value={formData.bankAccount}
              onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="TR12 3456 7890 1234 5678 90"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingRequest ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  )
}