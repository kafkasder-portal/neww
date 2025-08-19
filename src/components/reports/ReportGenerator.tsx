import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  FileText, 
  FileSpreadsheet, 
  Settings, 
  Eye
} from 'lucide-react'
import { reportGenerator, ReportData, ReportConfig } from '@/lib/reportGenerator'
import { useLanguageContext } from '@/contexts/LanguageContext'

interface ReportGeneratorProps {
  data?: ReportData
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  data: initialData
}) => {
  const { t } = useLanguageContext()
  const [data, setData] = useState<ReportData>(initialData || reportGenerator.generateSampleData())
  const [config, setConfig] = useState<ReportConfig>({
    orientation: 'portrait',
    pageSize: 'A4',
    fontSize: 12,
    includeHeader: true,
    includeFooter: true,
    includeSummary: true,
    includeFilters: true
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await reportGenerator.downloadPDF(data, `rapor_${Date.now()}`, config)
    } catch (error) {
      console.error('PDF oluşturma hatası:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateExcel = async () => {
    setIsGenerating(true)
    try {
      await reportGenerator.downloadExcel(data, `rapor_${Date.now()}`)
    } catch (error) {
      console.error('Excel oluşturma hatası:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreview = () => {
    setShowPreview(!showPreview)
  }

  const updateConfig = (key: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Rapor Başlığı */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t('reports.title')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{t('reports.reportTitle')}</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('reports.enterTitle')}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">{t('reports.subtitle')}</Label>
              <Input
                id="subtitle"
                value={data.subtitle || ''}
                onChange={(e) => setData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder={t('reports.enterSubtitle')}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Ayarlar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">{t('reports.settings')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t('reports.orientation')}</Label>
              <Select value={config.orientation} onValueChange={(value: string) => updateConfig('orientation', value as 'portrait' | 'landscape')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">{t('reports.portrait')}</SelectItem>
                  <SelectItem value="landscape">{t('reports.landscape')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>{t('reports.pageSize')}</Label>
              <Select value={config.pageSize} onValueChange={(value: string) => updateConfig('pageSize', value as 'A4' | 'A3' | 'letter')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                  <SelectItem value="letter">{t('reports.letter')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>{t('reports.fontSize')}</Label>
              <Select value={config.fontSize?.toString()} onValueChange={(value) => updateConfig('fontSize', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeader"
                checked={config.includeHeader}
                onCheckedChange={(checked) => updateConfig('includeHeader', checked)}
              />
              <Label htmlFor="includeHeader">{t('reports.includeHeader')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFooter"
                checked={config.includeFooter}
                onCheckedChange={(checked) => updateConfig('includeFooter', checked)}
              />
              <Label htmlFor="includeFooter">{t('reports.includeFooter')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSummary"
                checked={config.includeSummary}
                onCheckedChange={(checked) => updateConfig('includeSummary', checked)}
              />
              <Label htmlFor="includeSummary">{t('reports.includeSummary')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFilters"
                checked={config.includeFilters}
                onCheckedChange={(checked) => updateConfig('includeFilters', checked)}
              />
              <Label htmlFor="includeFilters">{t('reports.includeFilters')}</Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Önizleme */}
      {showPreview && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">{t('reports.preview')}</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg">{data.title}</h4>
              {data.subtitle && <p className="text-gray-600">{data.subtitle}</p>}
              
              <div className="mt-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      {data.headers.map((header, index) => (
                        <th key={index} className="border border-gray-300 px-3 py-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.data.length > 3 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ... ve {data.data.length - 3} satır daha
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aksiyonlar */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? t('reports.hidePreview') : t('reports.showPreview')}</span>
          </Button>
          
          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <FileText className="w-4 h-4" />
            <span>{t('reports.generatePDF')}</span>
          </Button>
          
          <Button
            onClick={handleGenerateExcel}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('reports.generateExcel')}</span>
          </Button>
          
          {isGenerating && (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{t('reports.generating')}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
