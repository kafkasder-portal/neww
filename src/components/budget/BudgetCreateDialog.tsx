import React, { useState, useEffect } from 'react'
import { CorporateButton, Card, CardContent, CardHeader, CardTitle, CorporateBadge, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, Calculator, AlertCircle, CheckCircle } from 'lucide-react'
import { 
  BudgetFormData, 
  BudgetCategoryFormData, 
  BudgetSubcategoryFormData,
  BUDGET_TYPES, 
  BUDGET_CATEGORIES,
  BudgetPeriod,
  BudgetTemplate
} from '@/types/budget'
import { formatCurrency } from '@/utils/formatters'

interface BudgetCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BudgetCreateDialog({ open, onOpenChange, onSuccess }: BudgetCreateDialogProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    description: '',
    budgetType: 'annual',
    budgetPeriodId: '',
    categories: []
  })
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>([])
  const [budgetTemplates, setBudgetTemplates] = useState<BudgetTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [activeTab, setActiveTab] = useState('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  useEffect(() => {
    if (open) {
      loadBudgetPeriods()
      loadBudgetTemplates()
      resetForm()
    }
  }, [open])

  useEffect(() => {
    calculateTotals()
  }, [formData.categories])

  const loadBudgetPeriods = async () => {
    try {
      // Mock data - replace with actual API call
      const mockPeriods: BudgetPeriod[] = [
        {
          id: 'period-2024',
          name: '2024 Mali Yılı',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          fiscalYear: 2024,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'period-2025',
          name: '2025 Mali Yılı',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          fiscalYear: 2025,
          isActive: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setBudgetPeriods(mockPeriods)
      if (mockPeriods.length > 0) {
        setFormData(prev => ({ ...prev, budgetPeriodId: mockPeriods[0].id }))
      }
    } catch (error) {
      console.error('Bütçe dönemleri yüklenirken hata:', error)
    }
  }

  const loadBudgetTemplates = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTemplates: BudgetTemplate[] = [
        {
          id: 'template-1',
          name: 'Standart Dernek Bütçesi',
          description: 'Genel dernek faaliyetleri için standart bütçe şablonu',
          budgetType: 'annual',
          categories: [],
          isDefault: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'template-2',
          name: 'Proje Bütçesi Şablonu',
          description: 'Özel projeler için bütçe şablonu',
          budgetType: 'project',
          categories: [],
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setBudgetTemplates(mockTemplates)
    } catch (error) {
      console.error('Bütçe şablonları yüklenirken hata:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      budgetType: 'annual',
      budgetPeriodId: budgetPeriods[0]?.id || '',
      categories: []
    })
    setSelectedTemplate('')
    setActiveTab('basic')
    setErrors({})
    setTotalRevenue(0)
    setTotalExpense(0)
  }

  const calculateTotals = () => {
    const revenue = formData.categories
      .filter(cat => cat.budgetType === 'revenue')
      .reduce((sum, cat) => sum + cat.budgetedAmount, 0)
    
    const expense = formData.categories
      .filter(cat => cat.budgetType === 'expense')
      .reduce((sum, cat) => sum + cat.budgetedAmount, 0)
    
    setTotalRevenue(revenue)
    setTotalExpense(expense)
  }

  const applyTemplate = async (templateId: string) => {
    if (!templateId) return
    
    try {
      // Mock template application - replace with actual API call
      const defaultCategories: BudgetCategoryFormData[] = BUDGET_CATEGORIES.map(cat => ({
        categoryName: cat.name,
        categoryCode: cat.code,
        accountCode: cat.accountCode,
        budgetType: cat.type as 'revenue' | 'expense',
        budgetedAmount: 0,
        monthlyAllocations: new Array(12).fill(0),
        subcategories: []
      }))
      
      setFormData(prev => ({
        ...prev,
        categories: defaultCategories
      }))
      
      setSelectedTemplate(templateId)
    } catch (error) {
      console.error('Şablon uygulanırken hata:', error)
    }
  }

  const addCategory = () => {
    const newCategory: BudgetCategoryFormData = {
      categoryName: '',
      categoryCode: '',
      budgetType: 'expense',
      budgetedAmount: 0,
      monthlyAllocations: new Array(12).fill(0),
      subcategories: []
    }
    
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }))
  }

  const updateCategory = (index: number, updates: Partial<BudgetCategoryFormData>) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, ...updates } : cat
      )
    }))
  }

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  const addSubcategory = (categoryIndex: number) => {
    const newSubcategory: BudgetSubcategoryFormData = {
      subcategoryName: '',
      subcategoryCode: '',
      budgetedAmount: 0
    }
    
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex 
          ? { ...cat, subcategories: [...(cat.subcategories || []), newSubcategory] }
          : cat
      )
    }))
  }

  const updateSubcategory = (categoryIndex: number, subcategoryIndex: number, updates: Partial<BudgetSubcategoryFormData>) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex 
          ? {
              ...cat,
              subcategories: cat.subcategories?.map((sub, j) => 
                j === subcategoryIndex ? { ...sub, ...updates } : sub
              ) || []
            }
          : cat
      )
    }))
  }

  const removeSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex 
          ? {
              ...cat,
              subcategories: cat.subcategories?.filter((_, j) => j !== subcategoryIndex) || []
            }
          : cat
      )
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bütçe adı gereklidir'
    }
    
    if (!formData.budgetPeriodId) {
      newErrors.budgetPeriodId = 'Bütçe dönemi seçilmelidir'
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'En az bir kategori eklenmelidir'
    }
    
    formData.categories.forEach((category, index) => {
      if (!category.categoryName.trim()) {
        newErrors[`category_${index}_name`] = 'Kategori adı gereklidir'
      }
      if (!category.categoryCode.trim()) {
        newErrors[`category_${index}_code`] = 'Kategori kodu gereklidir'
      }
      if (category.budgetedAmount <= 0) {
        newErrors[`category_${index}_amount`] = 'Bütçe tutarı 0\'dan büyük olmalıdır'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      // API call to create budget
      console.log('Creating budget:', formData)
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSuccess()
    } catch (error) {
      console.error('Bütçe oluşturulurken hata:', error)
      setErrors({ submit: 'Bütçe oluşturulurken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const netBudget = totalRevenue - totalExpense

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Bütçe Oluştur</DialogTitle>
          <DialogDescription>
            Derneğiniz için yeni bir bütçe oluşturun ve kategorileri tanımlayın.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="summary">Özet</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Bütçe Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: 2024 Yıllık Bütçesi"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Bütçe hakkında açıklama..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budgetType">Bütçe Türü *</Label>
                  <Select
                    value={formData.budgetType}
                    onValueChange={(value: any) => setFormData({ ...formData, budgetType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="budgetPeriod">Bütçe Dönemi *</Label>
                  <Select
                    value={formData.budgetPeriodId}
                    onValueChange={(value) => setFormData({ ...formData, budgetPeriodId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetPeriods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budgetPeriodId && (
                    <p className="text-sm text-red-600">{errors.budgetPeriodId}</p>
                  )}
                </div>
              </div>

              {/* Template Selection */}
              <div className="grid gap-2">
                <Label>Bütçe Şablonu</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={applyTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Şablon seçin (isteğe bağlı)" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Şablon seçerek önceden tanımlanmış kategorileri kullanabilirsiniz.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bütçe Kategorileri</h3>
              <CorporateButton onClick={addCategory} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Kategori Ekle
              </CorporateButton>
            </div>

            {errors.categories && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.categories}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {formData.categories.map((category, categoryIndex) => (
                <CorporateCard key={categoryIndex}>
                  <CorporateCardHeader>
                    <div className="flex items-center justify-between">
                      <CorporateCardTitle className="text-base">
                        Kategori {categoryIndex + 1}
                      </CorporateCardTitle>
                      <CorporateButton
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(categoryIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </CorporateButton>
                    </div>
                  </CorporateCardHeader>
                  <CorporateCardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Kategori Adı *</Label>
                        <Input
                          value={category.categoryName}
                          onChange={(e) => updateCategory(categoryIndex, { categoryName: e.target.value })}
                          placeholder="Kategori adı"
                        />
                        {errors[`category_${categoryIndex}_name`] && (
                          <p className="text-sm text-red-600">{errors[`category_${categoryIndex}_name`]}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Kategori Kodu *</Label>
                        <Input
                          value={category.categoryCode}
                          onChange={(e) => updateCategory(categoryIndex, { categoryCode: e.target.value })}
                          placeholder="Örn: REV001"
                        />
                        {errors[`category_${categoryIndex}_code`] && (
                          <p className="text-sm text-red-600">{errors[`category_${categoryIndex}_code`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Hesap Kodu</Label>
                        <Input
                          value={category.accountCode || ''}
                          onChange={(e) => updateCategory(categoryIndex, { accountCode: e.target.value })}
                          placeholder="Örn: 401"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tür *</Label>
                        <Select
                          value={category.budgetType}
                          onValueChange={(value: 'revenue' | 'expense') => updateCategory(categoryIndex, { budgetType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="revenue">Gelir</SelectItem>
                            <SelectItem value="expense">Gider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Bütçe Tutarı *</Label>
                        <Input
                          type="number"
                          value={category.budgetedAmount}
                          onChange={(e) => updateCategory(categoryIndex, { budgetedAmount: Number(e.target.value) })}
                          placeholder="0"
                        />
                        {errors[`category_${categoryIndex}_amount`] && (
                          <p className="text-sm text-red-600">{errors[`category_${categoryIndex}_amount`]}</p>
                        )}
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="space-y-6-group">
                        <Label>Alt Kategoriler</Label>
                        {category.subcategories.map((subcategory, subIndex) => (
                          <div key={subIndex} className="flex items-center gap-2 p-2 border rounded">
                            <Input
                              value={subcategory.subcategoryName}
                              onChange={(e) => updateSubcategory(categoryIndex, subIndex, { subcategoryName: e.target.value })}
                              placeholder="Alt kategori adı"
                              className="flex-1"
                            />
                            <Input
                              value={subcategory.subcategoryCode}
                              onChange={(e) => updateSubcategory(categoryIndex, subIndex, { subcategoryCode: e.target.value })}
                              placeholder="Kod"
                              className="w-24"
                            />
                            <Input
                              type="number"
                              value={subcategory.budgetedAmount}
                              onChange={(e) => updateSubcategory(categoryIndex, subIndex, { budgetedAmount: Number(e.target.value) })}
                              placeholder="Tutar"
                              className="w-32"
                            />
                            <CorporateButton
                              variant="outline"
                              size="sm"
                              onClick={() => removeSubcategory(categoryIndex, subIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </CorporateButton>
                          </div>
                        ))}
                      </div>
                    )}

                    <CorporateButton
                      variant="outline"
                      size="sm"
                      onClick={() => addSubcategory(categoryIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Alt Kategori Ekle
                    </CorporateButton>
                  </CorporateCardContent>
                </CorporateCard>
              ))}
            </div>

            {formData.categories.length === 0 && (
              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Henüz kategori eklenmedi</h3>
                    <p className="text-muted-foreground mb-4">
                      Bütçeniz için gelir ve gider kategorileri ekleyin.
                    </p>
                    <CorporateButton onClick={addCategory}>
                      İlk kategoriyi ekle
                    </CorporateButton>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            )}
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4">
              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>Bütçe Özeti</CorporateCardTitle>
                  <CardDescription>
                    Oluşturduğunuz bütçenin genel görünümü
                  </CardDescription>
                </CorporateCardHeader>
                <CorporateCardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalRevenue)}
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Toplam Gider</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalExpense)}
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Net Bütçe</p>
                      <p className={`text-2xl font-bold ${
                        netBudget >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(netBudget)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Bütçe Detayları</h4>
                    <div className="space-y-6-group text-sm">
                      <div className="flex justify-between">
                        <span>Bütçe Adı:</span>
                        <span className="font-medium">{formData.name || 'Belirtilmedi'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bütçe Türü:</span>
                        <span className="font-medium">
                          {BUDGET_TYPES.find(t => t.value === formData.budgetType)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kategori Sayısı:</span>
                        <span className="font-medium">{formData.categories.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gelir Kategorileri:</span>
                        <span className="font-medium">
                          {formData.categories.filter(c => c.budgetType === 'revenue').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gider Kategorileri:</span>
                        <span className="font-medium">
                          {formData.categories.filter(c => c.budgetType === 'expense').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {netBudget < 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Uyarı:</strong> Giderleriniz gelirlerinizden fazla. 
                        Bütçenizi dengelemeyi düşünün.
                      </AlertDescription>
                    </Alert>
                  )}

                  {netBudget >= 0 && formData.categories.length > 0 && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Bütçeniz dengeli görünüyor. Oluşturmaya hazır!
                      </AlertDescription>
                    </Alert>
                  )}
                </CorporateCardContent>
              </CorporateCard>
            </div>
          </TabsContent>
        </Tabs>

        {errors.submit && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <CorporateButton variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            İptal
          </CorporateButton>
          <CorporateButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Bütçe Oluştur'}
          </CorporateButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}