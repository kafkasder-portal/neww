import * as XLSX from 'xlsx'

export interface ExportColumn {
  key: string
  label: string
  width?: number
  formatter?: (value: unknown) => string
}

export interface ExportOptions {
  filename: string
  sheetName?: string
  columns: ExportColumn[]
  data: Record<string, unknown>[]
  includeTimestamp?: boolean
}

/**
 * Excel'e veri export etmek için genel utility fonksiyonu
 */
export const exportToExcel = (options: ExportOptions) => {
  const {
    filename,
    sheetName = 'Sheet1',
    columns,
    data,
    includeTimestamp = true
  } = options

  // Başlık satırını oluştur
  const headers = columns.map(col => col.label)
  
  // Veriyi formatla
  const formattedData = data.map(row => {
    return columns.map(col => {
      const value = row[col.key]
      return col.formatter ? col.formatter(value) : value
    })
  })

  // Worksheet oluştur
  const wsData = [headers, ...formattedData]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Sütun genişliklerini ayarla
  const colWidths = columns.map(col => ({
    wch: col.width || 15
  }))
  ws['!cols'] = colWidths

  // Workbook oluştur
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Dosya adını oluştur
  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : ''
  const finalFilename = `${filename}${timestamp}.xlsx`

  // Excel dosyasını indir
  XLSX.writeFile(wb, finalFilename)
}

/**
 * Beneficiaries listesini Excel'e export et
 */
export const exportBeneficiariesToExcel = (beneficiaries: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 10 },
    { key: 'name', label: 'Ad Soyad', width: 25 },
    { key: 'email', label: 'E-posta', width: 30 },
    { key: 'phone', label: 'Telefon', width: 20 },
    { key: 'address', label: 'Adres', width: 40 },
    { key: 'status', label: 'Durum', width: 15 },
    { 
      key: 'created_at', 
      label: 'Oluşturulma Tarihi', 
      width: 20,
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('tr-TR') : ''
    }
  ]

  const filename = filters ? 'beneficiaries_filtered' : 'beneficiaries'
  
  exportToExcel({
    filename,
    sheetName: 'Yararlanıcılar',
    columns,
    data: beneficiaries
  })
}

/**
 * Applications listesini Excel'e export et
 */
export const exportApplicationsToExcel = (applications: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 10 },
    { key: 'applicant_name', label: 'Başvuran', width: 25 },
    { key: 'type', label: 'Başvuru Türü', width: 20 },
    { key: 'status', label: 'Durum', width: 15 },
    { key: 'amount', label: 'Tutar', width: 15, formatter: (value: unknown) => value ? `${value} TL` : '' },
    { key: 'description', label: 'Açıklama', width: 40 },
    { 
      key: 'created_at', 
      label: 'Başvuru Tarihi', 
      width: 20,
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('tr-TR') : ''
    },
    { 
      key: 'updated_at', 
      label: 'Güncelleme Tarihi', 
      width: 20,
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('tr-TR') : ''
    }
  ]

  const filename = filters ? 'applications_filtered' : 'applications'
  
  exportToExcel({
    filename,
    sheetName: 'Başvurular',
    columns,
    data: applications
  })
}

/**
 * Donations listesini Excel'e export et
 */
export const exportDonationsToExcel = (donations: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 10 },
    { key: 'donor_name', label: 'Bağışçı', width: 25 },
    { key: 'amount', label: 'Tutar', width: 15, formatter: (value: unknown) => `${value} TL` },
    { key: 'currency', label: 'Para Birimi', width: 15 },
    { key: 'type', label: 'Bağış Türü', width: 20 },
    { key: 'status', label: 'Durum', width: 15 },
    { key: 'description', label: 'Açıklama', width: 40 },
    { 
      key: 'donation_date', 
      label: 'Bağış Tarihi', 
      width: 20,
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('tr-TR') : ''
    },
    { 
      key: 'created_at', 
      label: 'Kayıt Tarihi', 
      width: 20,
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('tr-TR') : ''
    }
  ]

  const filename = filters ? 'donations_filtered' : 'donations'
  
  exportToExcel({
    filename,
    sheetName: 'Bağışlar',
    columns,
    data: donations
  })
}

/**
 * Genel rapor export fonksiyonu
 */
export const exportReportToExcel = (reportData: {
  beneficiaries?: Record<string, unknown>[]
  applications?: Record<string, unknown>[]
  donations?: Record<string, unknown>[]
  summary?: {
    totalBeneficiaries?: number
    totalApplications?: number
    totalDonations?: number
    totalDonationAmount?: number
  }
}) => {
  const wb = XLSX.utils.book_new()

  // Özet sayfası
  if (reportData.summary) {
    const summaryData = [
      ['Rapor Özeti', ''],
      ['Toplam Yararlanıcı', reportData.summary.totalBeneficiaries || 0],
      ['Toplam Başvuru', reportData.summary.totalApplications || 0],
      ['Toplam Bağış', reportData.summary.totalDonations || 0],
      ['Toplam Bağış Tutarı', `${reportData.summary.totalDonationAmount || 0} TL`],
      ['Rapor Tarihi', new Date().toLocaleDateString('tr-TR')]
    ]
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Özet')
  }

  // Yararlanıcılar sayfası
  if (reportData.beneficiaries && reportData.beneficiaries.length > 0) {
    const beneficiariesColumns = [
      'ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Adres', 'Durum', 'Oluşturulma Tarihi'
    ]
    const beneficiariesData = reportData.beneficiaries.map(b => [
      b.id, b.name, b.email, b.phone, b.address, b.status,
      b.created_at ? new Date(b.created_at as string).toLocaleDateString('tr-TR') : ''
    ])
    
    const beneficiariesWs = XLSX.utils.aoa_to_sheet([beneficiariesColumns, ...beneficiariesData])
    XLSX.utils.book_append_sheet(wb, beneficiariesWs, 'Yararlanıcılar')
  }

  // Başvurular sayfası
  if (reportData.applications && reportData.applications.length > 0) {
    const applicationsColumns = [
      'ID', 'Başvuran', 'Tür', 'Durum', 'Tutar', 'Açıklama', 'Başvuru Tarihi'
    ]
    const applicationsData = reportData.applications.map(a => [
      a.id, a.applicant_name, a.type, a.status, 
      a.amount ? `${a.amount} TL` : '', a.description,
      a.created_at ? new Date(a.created_at as string).toLocaleDateString('tr-TR') : ''
    ])
    
    const applicationsWs = XLSX.utils.aoa_to_sheet([applicationsColumns, ...applicationsData])
    XLSX.utils.book_append_sheet(wb, applicationsWs, 'Başvurular')
  }

  // Bağışlar sayfası
  if (reportData.donations && reportData.donations.length > 0) {
    const donationsColumns = [
      'ID', 'Bağışçı', 'Tutar', 'Para Birimi', 'Tür', 'Durum', 'Açıklama', 'Bağış Tarihi'
    ]
    const donationsData = reportData.donations.map(d => [
      d.id, d.donor_name, `${d.amount} TL`, d.currency, d.type, d.status, d.description,
      d.donation_date ? new Date(d.donation_date as string).toLocaleDateString('tr-TR') : ''
    ])
    
    const donationsWs = XLSX.utils.aoa_to_sheet([donationsColumns, ...donationsData])
    XLSX.utils.book_append_sheet(wb, donationsWs, 'Bağışlar')
  }

  // Dosyayı indir
  const filename = `genel_rapor_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}