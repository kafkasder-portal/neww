interface ProvisionFiltersProps {
  query: string
  setQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  priorityFilter: string
  setPriorityFilter: (priority: string) => void
  departmentFilter: string
  setDepartmentFilter: (department: string) => void
  approvalFilter: string
  setApprovalFilter: (approval: string) => void
  paymentFilter: string
  setPaymentFilter: (payment: string) => void
  dateFilter: string
  setDateFilter: (date: string) => void
}

export function ProvisionFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  departmentFilter,
  setDepartmentFilter,
  approvalFilter,
  setApprovalFilter,
  paymentFilter,
  setPaymentFilter,
  dateFilter,
  setDateFilter
}: ProvisionFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Arama</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Talep no, kişi, amaç..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Durum</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Tümü</option>
            <option value="taslak">Taslak</option>
            <option value="gönderildi">Gönderildi</option>
            <option value="işlemde">İşlemde</option>
            <option value="tamamlandı">Tamamlandı</option>
            <option value="iptal">İptal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Öncelik</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Tümü</option>
            <option value="düşük">Düşük</option>
            <option value="normal">Normal</option>
            <option value="yüksek">Yüksek</option>
            <option value="acil">Acil</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Departman</label>
          <input
            type="text"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            placeholder="Departman adı..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Onay Durumu</label>
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Tümü</option>
            <option value="beklemede">Beklemede</option>
            <option value="onaylandı">Onaylandı</option>
            <option value="reddedildi">Reddedildi</option>
            <option value="revizyon">Revizyon</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ödeme Durumu</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Tümü</option>
            <option value="beklemede">Beklemede</option>
            <option value="kısmi">Kısmi</option>
            <option value="tamamlandı">Tamamlandı</option>
            <option value="iptal">İptal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tarih Filtresi</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}