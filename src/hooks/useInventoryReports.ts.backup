import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { 
  inventoryReportService, 
  type InventoryReportData, 
  type ReportFilters 
} from '@/services/inventoryReportService'

interface UseInventoryReportsReturn {
  reportData: InventoryReportData | null
  loading: boolean
  error: string | null
  filters: ReportFilters
  setFilters: (filters: ReportFilters) => void
  generateReport: () => Promise<void>
  exportReport: (format: 'csv' | 'json') => Promise<void>
  refreshReport: () => Promise<void>
}

export const useInventoryReports = (initialFilters: ReportFilters = {}): UseInventoryReportsReturn => {
  const [reportData, setReportData] = useState<InventoryReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReportFilters>(initialFilters)

  const generateReport = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await inventoryReportService.generateInventoryReport(filters)
      setReportData(data)
      toast.success('Rapor başarıyla oluşturuldu')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Rapor oluşturulurken hata oluştu'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const exportReport = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    if (!reportData) {
      toast.error('Önce rapor oluşturulmalı')
      return
    }

    try {
      const exportData = await inventoryReportService.exportReportData(reportData, format)
      
      // Dosyayı indir
      const blob = new Blob([exportData], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `envanter-raporu-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`Rapor ${format.toUpperCase()} formatında indirildi`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Rapor dışa aktarılırken hata oluştu'
      toast.error(errorMessage)
    }
  }, [reportData])

  const refreshReport = useCallback(async () => {
    await generateReport()
  }, [generateReport])

  // İlk yükleme
  useEffect(() => {
    generateReport()
  }, []) // Sadece mount olduğunda çalışsın

  return {
    reportData,
    loading,
    error,
    filters,
    setFilters,
    generateReport,
    exportReport,
    refreshReport
  }
}