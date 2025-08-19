import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface ReportData {
  title: string
  subtitle?: string
  headers: string[]
  data: any[][]
  summary?: {
    total?: number
    count?: number
    average?: number
  }
  filters?: {
    dateRange?: string
    category?: string
    status?: string
  }
}

export interface ReportConfig {
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'A4' | 'A3' | 'letter'
  fontSize?: number
  includeHeader?: boolean
  includeFooter?: boolean
  includeSummary?: boolean
  includeFilters?: boolean
}

export class ReportGenerator {
  private defaultConfig: ReportConfig = {
    orientation: 'portrait',
    pageSize: 'A4',
    fontSize: 12,
    includeHeader: true,
    includeFooter: true,
    includeSummary: true,
    includeFilters: true
  }

  async generatePDF(data: ReportData, config: ReportConfig = {}): Promise<Blob> {
    const finalConfig = { ...this.defaultConfig, ...config }
    
    const doc = new jsPDF({
      orientation: finalConfig.orientation,
      unit: 'mm',
      format: finalConfig.pageSize
    })

    let yPosition = 20

    // Header
    if (finalConfig.includeHeader) {
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(data.title, 20, yPosition)
      yPosition += 10

      if (data.subtitle) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'normal')
        doc.text(data.subtitle, 20, yPosition)
        yPosition += 10
      }
    }

    // Filters
    if (finalConfig.includeFilters && data.filters) {
      yPosition += 5
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Filtreler:', 20, yPosition)
      yPosition += 5

      doc.setFont('helvetica', 'normal')
      Object.entries(data.filters).forEach(([key, value]) => {
        if (value) {
          doc.text(`${key}: ${value}`, 25, yPosition)
          yPosition += 5
        }
      })
      yPosition += 5
    }

    // Table
    autoTable(doc, {
      head: [data.headers],
      body: data.data,
      startY: yPosition,
      styles: {
        fontSize: finalConfig.fontSize,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    })

    // Summary
    if (finalConfig.includeSummary && data.summary) {
      const finalY = (doc as any).lastAutoTable.finalY + 10
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Özet:', 20, finalY)
      
      doc.setFont('helvetica', 'normal')
      let summaryY = finalY + 5
      Object.entries(data.summary).forEach(([key, value]) => {
        if (value !== undefined) {
          doc.text(`${key}: ${value}`, 25, summaryY)
          summaryY += 5
        }
      })
    }

    // Footer
    if (finalConfig.includeFooter) {
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Sayfa ${i} / ${pageCount} - Oluşturulma: ${new Date().toLocaleString('tr-TR')}`,
          20,
          doc.internal.pageSize.height - 10
        )
      }
    }

    return doc.output('blob')
  }

  async generateExcel(data: ReportData): Promise<Blob> {
    const workbook = XLSX.utils.book_new()
    
    // Ana veri sayfası
    const worksheet = XLSX.utils.aoa_to_sheet([
      [data.title],
      data.subtitle ? [data.subtitle] : [],
      [],
      data.headers,
      ...data.data
    ])

    // Başlık formatı
    // Title range hesaplanabilir
    worksheet['A1'] = { v: data.title, t: 's' }
    worksheet['A1'].s = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center' }
    }

    // Alt başlık formatı
    if (data.subtitle) {
      worksheet['A2'] = { v: data.subtitle, t: 's' }
      worksheet['A2'].s = {
        font: { italic: true, size: 12 },
        alignment: { horizontal: 'center' }
      }
    }

    // Başlık satırı formatı
    const headerRow = 3 + (data.subtitle ? 1 : 0)
    data.headers.forEach((header, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: index })
      worksheet[cellRef] = { v: header, t: 's' }
      worksheet[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4285CA" } },
        alignment: { horizontal: 'center' }
      }
    })

    // Sütun genişliklerini ayarla
    const colWidths = data.headers.map(header => Math.max(header.length * 1.2, 10))
    worksheet['!cols'] = colWidths.map(width => ({ width }))

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapor')

    // Özet sayfası
    if (data.summary) {
      const summaryData = Object.entries(data.summary).map(([key, value]) => [key, value])
      const summarySheet = XLSX.utils.aoa_to_sheet([
        ['Özet'],
        [],
        ['Metrik', 'Değer'],
        ...summaryData
      ])
      
      summarySheet['A1'].s = { font: { bold: true, size: 14 } }
      summarySheet['A3'].s = { font: { bold: true } }
      summarySheet['B3'].s = { font: { bold: true } }
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Özet')
    }

    // Filtreler sayfası
    if (data.filters) {
      const filterData = Object.entries(data.filters).map(([key, value]) => [key, value])
      const filterSheet = XLSX.utils.aoa_to_sheet([
        ['Filtreler'],
        [],
        ['Filtre', 'Değer'],
        ...filterData
      ])
      
      filterSheet['A1'].s = { font: { bold: true, size: 14 } }
      filterSheet['A3'].s = { font: { bold: true } }
      filterSheet['B3'].s = { font: { bold: true } }
      
      XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filtreler')
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  async downloadPDF(data: ReportData, filename: string, config?: ReportConfig): Promise<void> {
    const blob = await this.generatePDF(data, config)
    saveAs(blob, `${filename}.pdf`)
  }

  async downloadExcel(data: ReportData, filename: string): Promise<void> {
    const blob = await this.generateExcel(data)
    saveAs(blob, `${filename}.xlsx`)
  }

  // Örnek veri oluşturucu
  generateSampleData(): ReportData {
    return {
      title: 'Yardım Raporu',
      subtitle: 'Ocak 2024 - Aralık 2024',
      headers: ['ID', 'Ad Soyad', 'Kategori', 'Tutar', 'Tarih', 'Durum'],
      data: [
        ['001', 'Ahmet Yılmaz', 'Nakit', '1000 TL', '2024-01-15', 'Tamamlandı'],
        ['002', 'Fatma Demir', 'Ayni', '500 TL', '2024-01-20', 'Beklemede'],
        ['003', 'Mehmet Kaya', 'Nakit', '750 TL', '2024-01-25', 'Tamamlandı'],
        ['004', 'Ayşe Özkan', 'Ayni', '300 TL', '2024-02-01', 'İptal'],
        ['005', 'Ali Çelik', 'Nakit', '1200 TL', '2024-02-05', 'Tamamlandı']
      ],
      summary: {
        total: 3750,
        count: 5,
        average: 750
      },
      filters: {
        dateRange: '01.01.2024 - 31.12.2024',
        category: 'Tümü',
        status: 'Tümü'
      }
    }
  }
}

export const reportGenerator = new ReportGenerator()
