import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { type UserOptions } from 'jspdf-autotable'

// jsPDF türlerini genişlet
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF
  }
}

export interface PDFColumn {
  header: string
  dataKey: string
  width?: number
}

export interface PDFExportOptions {
  title: string
  subtitle?: string
  columns: PDFColumn[]
  data: Record<string, unknown>[]
  filename: string
  includeTimestamp?: boolean
}

/**
 * PDF'e veri export etmek için genel utility fonksiyonu
 */
export const exportToPDF = (options: PDFExportOptions) => {
  const {
    title,
    subtitle,
    columns,
    data,
    filename,
    includeTimestamp = true
  } = options

  // PDF oluştur
  const doc = new jsPDF()
  
  // Başlık ekle
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  
  let yPosition = 30
  
  // Alt başlık ekle
  if (subtitle) {
    doc.setFontSize(12)
    doc.text(subtitle, 14, yPosition)
    yPosition += 10
  }
  
  // Tarih ekle
  doc.setFontSize(10)
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, yPosition)
  yPosition += 15

  // Tablo oluştur
  const tableColumns = columns.map(col => col.header)
  const tableRows = data.map(row => 
    columns.map(col => {
      const value = row[col.dataKey]
      if (value instanceof Date) {
        return value.toLocaleDateString('tr-TR')
      }
      return value || ''
    })
  )

  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: yPosition,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 20 }
  })

  // Dosya adını oluştur
  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : ''
  const finalFilename = `${filename}${timestamp}.pdf`

  // PDF'i indir
  doc.save(finalFilename)
}

/**
 * Beneficiaries listesini PDF'e export et
 */
export const exportBeneficiariesToPDF = (beneficiaries: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: PDFColumn[] = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Ad Soyad', dataKey: 'name' },
    { header: 'E-posta', dataKey: 'email' },
    { header: 'Telefon', dataKey: 'phone' },
    { header: 'Durum', dataKey: 'status' },
    { header: 'Kayıt Tarihi', dataKey: 'created_at' }
  ]

  const title = 'Yararlanıcılar Listesi'
  const subtitle = filters ? 'Filtrelenmiş Liste' : 'Tüm Yararlanıcılar'
  const filename = filters ? 'beneficiaries_filtered' : 'beneficiaries'
  
  exportToPDF({
    title,
    subtitle,
    columns,
    data: beneficiaries,
    filename
  })
}

/**
 * Applications listesini PDF'e export et
 */
export const exportApplicationsToPDF = (applications: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: PDFColumn[] = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Başvuran', dataKey: 'applicant_name' },
    { header: 'Tür', dataKey: 'type' },
    { header: 'Durum', dataKey: 'status' },
    { header: 'Tutar', dataKey: 'amount' },
    { header: 'Başvuru Tarihi', dataKey: 'created_at' }
  ]

  const title = 'Başvurular Listesi'
  const subtitle = filters ? 'Filtrelenmiş Liste' : 'Tüm Başvurular'
  const filename = filters ? 'applications_filtered' : 'applications'
  
  exportToPDF({
    title,
    subtitle,
    columns,
    data: applications,
    filename
  })
}

/**
 * Donations listesini PDF'e export et
 */
export const exportDonationsToPDF = (donations: Record<string, unknown>[], filters?: Record<string, unknown>) => {
  const columns: PDFColumn[] = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Bağışçı', dataKey: 'donor_name' },
    { header: 'Tutar', dataKey: 'amount' },
    { header: 'Para Birimi', dataKey: 'currency' },
    { header: 'Tür', dataKey: 'type' },
    { header: 'Durum', dataKey: 'status' },
    { header: 'Bağış Tarihi', dataKey: 'donation_date' }
  ]

  const title = 'Bağışlar Listesi'
  const subtitle = filters ? 'Filtrelenmiş Liste' : 'Tüm Bağışlar'
  const filename = filters ? 'donations_filtered' : 'donations'
  
  exportToPDF({
    title,
    subtitle,
    columns,
    data: donations,
    filename
  })
}

/**
 * Detaylı rapor PDF'i oluştur
 */
export const generateDetailedReportPDF = (reportData: {
  beneficiaries?: Record<string, unknown>[]
  applications?: Record<string, unknown>[]
  donations?: Record<string, unknown>[]
  summary?: {
    totalBeneficiaries?: number
    totalApplications?: number
    totalDonations?: number
    totalDonationAmount?: number
  }
  dateRange?: { start: string; end: string }
}) => {
  const doc = new jsPDF()
  
  // Başlık
  doc.setFontSize(20)
  doc.text('Detaylı Faaliyet Raporu', 14, 22)
  
  // Tarih aralığı
  if (reportData.dateRange) {
    doc.setFontSize(12)
    doc.text(`Tarih Aralığı: ${reportData.dateRange.start} - ${reportData.dateRange.end}`, 14, 35)
  }
  
  doc.setFontSize(10)
  doc.text(`Rapor Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 45)
  
  let yPosition = 60
  
  // Özet bilgiler
  if (reportData.summary) {
    doc.setFontSize(14)
    doc.text('Özet Bilgiler', 14, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.text(`Toplam Yararlanıcı: ${reportData.summary.totalBeneficiaries || 0}`, 14, yPosition)
    yPosition += 7
    doc.text(`Toplam Başvuru: ${reportData.summary.totalApplications || 0}`, 14, yPosition)
    yPosition += 7
    doc.text(`Toplam Bağış: ${reportData.summary.totalDonations || 0}`, 14, yPosition)
    yPosition += 7
    doc.text(`Toplam Bağış Tutarı: ${reportData.summary.totalDonationAmount || 0} TL`, 14, yPosition)
    yPosition += 20
  }
  
  // Yeni sayfa ekle
  doc.addPage()
  yPosition = 20
  
  // Yararlanıcılar tablosu
  if (reportData.beneficiaries && reportData.beneficiaries.length > 0) {
    doc.setFontSize(14)
    doc.text('Yararlanıcılar', 14, yPosition)
    yPosition += 10
    
    const beneficiariesColumns = ['ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Durum']
    const beneficiariesRows = reportData.beneficiaries.slice(0, 20).map(b => [
      String(b.id), String(b.name), String(b.email), String(b.phone), String(b.status)
    ])
    
    doc.autoTable({
      head: [beneficiariesColumns],
      body: beneficiariesRows,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    })
    
    yPosition = (doc as any).lastAutoTable.finalY + 20
  }
  
  // Başvurular için yeni sayfa
  if (reportData.applications && reportData.applications.length > 0) {
    doc.addPage()
    yPosition = 20
    
    doc.setFontSize(14)
    doc.text('Başvurular', 14, yPosition)
    yPosition += 10
    
    const applicationsColumns = ['ID', 'Başvuran', 'Tür', 'Durum', 'Tutar']
    const applicationsRows = reportData.applications.slice(0, 20).map(a => [
      String(a.id), String(a.applicant_name), String(a.type), String(a.status), a.amount ? `${a.amount} TL` : ''
    ])
    
    doc.autoTable({
      head: [applicationsColumns],
      body: applicationsRows,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    })
  }
  
  // Bağışlar için yeni sayfa
  if (reportData.donations && reportData.donations.length > 0) {
    doc.addPage()
    yPosition = 20
    
    doc.setFontSize(14)
    doc.text('Bağışlar', 14, yPosition)
    yPosition += 10
    
    const donationsColumns = ['ID', 'Bağışçı', 'Tutar', 'Tür', 'Durum']
    const donationsRows = reportData.donations.slice(0, 20).map(d => [
      String(d.id), String(d.donor_name), `${d.amount} TL`, String(d.type), String(d.status)
    ])
    
    doc.autoTable({
      head: [donationsColumns],
      body: donationsRows,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    })
  }
  
  // PDF'i indir
  const filename = `detayli_rapor_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

/**
 * Özet rapor PDF'i oluştur
 */
export const generateSummaryReportPDF = (summaryData: {
  totalBeneficiaries: number
  totalApplications: number
  totalDonations: number
  totalDonationAmount: number
  monthlyStats?: Record<string, unknown>[]
  statusBreakdown?: Record<string, unknown>
}) => {
  const doc = new jsPDF()
  
  // Başlık
  doc.setFontSize(20)
  doc.text('Özet Rapor', 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 35)
  
  let yPosition = 50
  
  // Ana istatistikler
  doc.setFontSize(14)
  doc.text('Genel İstatistikler', 14, yPosition)
  yPosition += 15
  
  doc.setFontSize(12)
  doc.text(`Toplam Yararlanıcı: ${summaryData.totalBeneficiaries}`, 14, yPosition)
  yPosition += 10
  doc.text(`Toplam Başvuru: ${summaryData.totalApplications}`, 14, yPosition)
  yPosition += 10
  doc.text(`Toplam Bağış: ${summaryData.totalDonations}`, 14, yPosition)
  yPosition += 10
  doc.text(`Toplam Bağış Tutarı: ${summaryData.totalDonationAmount} TL`, 14, yPosition)
  yPosition += 20
  
  // Durum dağılımı
  if (summaryData.statusBreakdown) {
    doc.setFontSize(14)
    doc.text('Durum Dağılımı', 14, yPosition)
    yPosition += 15
    
    Object.entries(summaryData.statusBreakdown).forEach(([status, count]) => {
      doc.setFontSize(10)
      doc.text(`${status}: ${count}`, 14, yPosition)
      yPosition += 8
    })
  }
  
  // PDF'i indir
  const filename = `ozet_rapor_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}