import type { Column } from './DataTable'
import type { ProvisionRequest, ProvisionItem, Payment } from '../types/provision'

interface ProvisionTableColumnsProps {
  onEdit?: (request: ProvisionRequest) => void
  onViewItems: (request: ProvisionRequest) => void
  onViewPayments: (request: ProvisionRequest) => void
  onApproval: (request: ProvisionRequest) => void
  requests: ProvisionRequest[]
}

export function getRequestColumns({ onEdit, onViewItems, onViewPayments, onApproval }: ProvisionTableColumnsProps): Column<ProvisionRequest>[] {
  return [
    { key: 'requestNumber', header: 'Talep No' },
    { 
      key: 'requestDate', 
      header: 'Tarih',
      render: (_, row) => new Date(row.requestDate).toLocaleDateString('tr-TR')
    },
    { key: 'requestedBy', header: 'Talep Eden' },
    { key: 'department', header: 'Departman' },
    { 
      key: 'priority', 
      header: 'Öncelik',
      render: (_, row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.priority === 'acil' ? 'bg-red-100 text-red-800' :
          row.priority === 'yüksek' ? 'bg-orange-100 text-orange-800' :
          row.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.priority}
        </span>
      )
    },
    { 
      key: 'totalAmount', 
      header: 'Tutar/Faydalanıcı',
      render: (_, row) => (
        <div className="text-sm">
          <div className="font-medium">{row.totalAmount.toLocaleString('tr-TR')} ₺</div>
          <div className="text-gray-500">{row.beneficiaryCount} kişi</div>
        </div>
      )
    },
    { key: 'purpose', header: 'Amaç' },
    { 
      key: 'targetDate', 
      header: 'Hedef Tarih',
      render: (_, row) => new Date(row.targetDate).toLocaleDateString('tr-TR')
    },
    { 
      key: 'approvalStatus', 
      header: 'Onay Durumu',
      render: (_, row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.approvalStatus === 'onaylandı' ? 'bg-green-100 text-green-800' :
          row.approvalStatus === 'beklemede' ? 'bg-yellow-100 text-yellow-800' :
          row.approvalStatus === 'reddedildi' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {row.approvalStatus}
        </span>
      )
    },
    { 
      key: 'paymentStatus', 
      header: 'Ödeme Durumu',
      render: (_, row) => (
        <div className="text-sm">
          <span className={`px-2 py-1 rounded text-xs ${
            row.paymentStatus === 'tamamlandı' ? 'bg-green-100 text-green-800' :
            row.paymentStatus === 'kısmi' ? 'bg-yellow-100 text-yellow-800' :
            row.paymentStatus === 'beklemede' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {row.paymentStatus}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {row.paidAmount.toLocaleString('tr-TR')} / {row.totalAmount.toLocaleString('tr-TR')} ₺
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Durum',
      render: (_, row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === 'tamamlandı' ? 'bg-green-100 text-green-800' :
          row.status === 'işlemde' ? 'bg-blue-100 text-blue-800' :
          row.status === 'gönderildi' ? 'bg-yellow-100 text-yellow-800' :
          row.status === 'taslak' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'id',
      header: 'İşlemler',
      render: (_, request) => (
        <div className="flex gap-1 text-xs">
          {onEdit && (
            <button
              onClick={() => onEdit(request)}
              className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
            >
              Düzenle
            </button>
          )}
          <button
            onClick={() => onViewItems(request)}
            className="text-green-600 hover:text-green-800 px-2 py-1 rounded"
          >
            Kalemler
          </button>
          <button
            onClick={() => onViewPayments(request)}
            className="text-purple-600 hover:text-purple-800 px-2 py-1 rounded"
          >
            Ödemeler
          </button>
          {request.approvalStatus === 'beklemede' && (
            <button
              onClick={() => onApproval(request)}
              className="text-orange-600 hover:text-orange-800 px-2 py-1 rounded"
            >
              Onayla
            </button>
          )}
        </div>
      )
    }
  ]
}

export function getItemColumns(requests: ProvisionRequest[]): Column<ProvisionItem>[] {
  return [
    { 
      key: 'requestId', 
      header: 'Talep No',
      render: (_, item) => {
        const request = requests.find(r => r.id === item.requestId)
        return request ? request.requestNumber : 'Bilinmiyor'
      }
    },
    { 
      key: 'itemType', 
      header: 'Tip',
      render: (_, item) => (
        <span className={`px-2 py-1 rounded text-xs ${
          item.itemType === 'nakit' ? 'bg-green-100 text-green-800' :
          item.itemType === 'gıda' ? 'bg-blue-100 text-blue-800' :
          item.itemType === 'giyim' ? 'bg-purple-100 text-purple-800' :
          item.itemType === 'barınma' ? 'bg-orange-100 text-orange-800' :
          item.itemType === 'sağlık' ? 'bg-red-100 text-red-800' :
          item.itemType === 'eğitim' ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.itemType}
        </span>
      )
    },
    { key: 'itemName', header: 'Kalem Adı' },
    { key: 'description', header: 'Açıklama' },
    { 
      key: 'quantity', 
      header: 'Miktar/Birim',
      render: (_, item) => `${item.quantity} ${item.unit}`
    },
    { 
      key: 'unitPrice', 
      header: 'Birim/Toplam',
      render: (_, item) => (
        <div className="text-sm">
          <div>{item.unitPrice.toLocaleString('tr-TR')} ₺</div>
          <div className="text-gray-500 font-medium">{item.totalPrice.toLocaleString('tr-TR')} ₺</div>
        </div>
      )
    },
    { key: 'supplier', header: 'Tedarikçi' },
    { 
      key: 'deliveryDate', 
      header: 'Teslimat',
      render: (_, item) => item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('tr-TR') : '-'
    },
    { 
      key: 'status', 
      header: 'Durum',
      render: (_, item) => (
        <span className={`px-2 py-1 rounded text-xs ${
          item.status === 'teslim-edildi' ? 'bg-green-100 text-green-800' :
          item.status === 'sipariş-verildi' ? 'bg-blue-100 text-blue-800' :
          item.status === 'onaylandı' ? 'bg-yellow-100 text-yellow-800' :
          item.status === 'beklemede' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      )
    }
  ]
}

export function getPaymentColumns(requests: ProvisionRequest[]): Column<Payment>[] {
  return [
    { 
      key: 'requestId', 
      header: 'Talep No',
      render: (_, payment) => {
        const request = requests.find(r => r.id === payment.requestId)
        return request ? request.requestNumber : 'Bilinmiyor'
      }
    },
    { 
      key: 'paymentDate', 
      header: 'Ödeme Tarihi',
      render: (_, payment) => new Date(payment.paymentDate).toLocaleDateString('tr-TR')
    },
    { 
      key: 'amount', 
      header: 'Tutar',
      render: (_, payment) => `${payment.amount.toLocaleString('tr-TR')} ${payment.currency}`
    },
    { 
      key: 'paymentMethod', 
      header: 'Ödeme Yöntemi',
      render: (_, payment) => (
        <span className={`px-2 py-1 rounded text-xs ${
          payment.paymentMethod === 'nakit' ? 'bg-green-100 text-green-800' :
          payment.paymentMethod === 'banka' ? 'bg-blue-100 text-blue-800' :
          payment.paymentMethod === 'kredi-kartı' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {payment.paymentMethod}
        </span>
      )
    },
    { key: 'referenceNumber', header: 'Referans No' },
    { key: 'paidBy', header: 'Ödeyen' },
    { key: 'receivedBy', header: 'Alan' },
    { key: 'receiptNumber', header: 'Makbuz No' },
    { 
      key: 'status', 
      header: 'Durum',
      render: (_, payment) => (
        <span className={`px-2 py-1 rounded text-xs ${
          payment.status === 'tamamlandı' ? 'bg-green-100 text-green-800' :
          payment.status === 'beklemede' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {payment.status}
        </span>
      )
    }
  ]
}