import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, Calculator, Save, History } from 'lucide-react'
import { 
  Budget,
  BudgetFormData, 
  BudgetCategoryFormData, 
  BudgetSubcategoryFormData,
  BUDGET_TYPES, 
  BUDGET_CATEGORIES,
  BudgetPeriod,
  BudgetRevision
} from '@/types/budget'
import { formatCurrency } from '@/utils/formatters'

interface BudgetEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget | null
  onSuccess: () => void
}

export function BudgetEditDialog({ open, onOpenChange, budget, onSuccess }: BudgetEditDialogProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    description: '',
    budgetType: 'annual',
    budgetPeriodId: '',
    categories: []
  })
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>([])
  const [budgetRevisions, setBudgetRevisions] = useState<BudgetRevision[]>([])
  const [activeTab, setActiveTab] = useState('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')

  useEffect(() => {
    if (open && budget) {
      loadBudgetPeriods()
      loadBudgetRevisions()
      initializeFormData()
    }
  }, [open, budget])

  useEffect(() => {
    calculateTotals()
    checkForChanges()
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
    } catch (error) {
      console.error('Bütçe dönemleri yüklenirken hata:', error)
    }
  }

  const loadBudgetRevisions = async () => {
    if (!budget) return
    
    try {
      // Mock data - replace with actual API call
      const mockRevisions: BudgetRevision[] = [
        {
          id: 'rev-1',
          budgetId: budget.id,
          revisionNumber: 1,
          revisionNote: 'İlk revizyon - kategori güncellemeleri',
          revisedBy: 'admin',
          revisedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          changes: {
            categoriesAdded: 2,
            categoriesModified: 3,
            categoriesRemoved: 1,
            totalBudgetChange: 15000
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'rev-2',
          budgetId: budget.id,
          revisionNumber: 2,
          revisionNote: 'Bütçe tutarları güncellendi',
          revisedBy: 'admin',
          revisedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          changes: {
            categoriesAdded: 0,
            categoriesModified: 5,
            categoriesRemoved: 0,
            totalBudgetChange: -8000
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setBudgetRevisions(mockRevisions)
    } catch (error) {
      console.error('Bütçe revizyonları yüklenirken hata:', error)
    }
  }

  const initializeFormData = () => {
    if (!budget) return
    
    const categories: BudgetCategoryFormData[] = budget.categories.map(cat => ({
      categoryName: cat.categoryName,
      categoryCode: cat.categoryCode,
      accountCode: cat.accountCode,
      budgetType: cat.budgetType,
      budgetedAmount: cat.budgetedAmount,
      monthlyAllocations: cat.monthlyAllocations || new Array(12).fill(0),
      subcategories: cat.subcategories?.map(sub => ({
        subcategoryName: sub.subcategoryName,
        subcategoryCode: sub.subcategoryCode,
        budgetedAmount: sub.budgetedAmount
      })) || []
    }))
    
    setFormData({
      name: budget.name,
      description: budget.description || '',
      budgetType: budget.budgetType,
      budgetPeriodId: budget.budgetPeriodId,
      categories
    })
    
    setActiveTab('basic')
    setErrors({})
    setHasChanges(false)
    setRevisionNote('')
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

  const checkForChanges = () => {
    if (!budget) return
    
    // Simple change detection - in real app, you'd want more sophisticated comparison
    const originalTotal = budget.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
    const currentTotal = formData.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
    
    const nameChanged = formData.name !== budget.name
    const descriptionChanged = formData.description !== (budget.description || '')
    const totalChanged = originalTotal !== currentTotal
    const categoriesCountChanged = formData.categories.length !== budget.categories.length
    
    setHasChanges(nameChanged || descriptionChanged || totalChanged || categoriesCountChanged)
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
      newErrors.categories = 'En az bir kategori bulunmalıdır'
    }
    
    if (hasChanges && !revisionNote.trim()) {
      newErrors.revisionNote = 'Değişiklik notu gereklidir'
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
      // API call to update budget
      console.log('Updating budget:', {
        budgetId: budget?.id,
        formData,
        revisionNote: hasChanges ? revisionNote : undefined
      })
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSuccess()
    } catch (error) {
      console.error('Bütçe güncellenirken hata:', error)
      setErrors({ submit: 'Bütçe güncellenirken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const netBudget = totalRevenue - totalExpense
  const originalNetBudget = budget ? 
    budget.categories.filter(c => c.budgetType === 'revenue').reduce((sum, c) => sum + c.budgetedAmount, 0) -
    budget.categories.filter(c => c.budgetType === 'expense').reduce((sum, c) => sum + c.budgetedAmount, 0)
    : 0
  const netChange = netBudget - originalNetBudget

  if (!budget) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bütçe Düzenle</DialogTitle>
          <DialogDescription>
            {budget.name} bütçesini düzenleyin ve değişikliklerinizi kaydedin.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="revisions">Revizyon Geçmişi</TabsTrigger>
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

              {/* Revision Note */}
              {hasChanges && (
                <div className="grid gap-2">
                  <Label htmlFor="revisionNote">Değişiklik Notu *</Label>
                  <Textarea
                    id="revisionNote"
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Bu revizyonda yapılan değişiklikleri açıklayın..."
                    rows={2}
                  />
                  {errors.revisionNote && (
                    <p className="text-sm text-red-600">{errors.revisionNote}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Değişiklik yaptığınız için revizyon notu gereklidir.
                  </p>
                </div>
              )}

              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mevcut Durum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Durum:</span>
                    <Badge variant={budget.status === 'approved' ? 'default' : 'secondary'}>
                      {budget.status === 'draft' && 'Taslak'}
                      {budget.status === 'pending_approval' && 'Onay Bekliyor'}
                      {budget.status === 'approved' && 'Onaylandı'}
                      {budget.status === 'rejected' && 'Reddedildi'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Son Güncelleme:</span>
                    <span>{new Date(budget.updated_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revizyon Sayısı:</span>
                    <span>{budgetRevisions.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bütçe Kategorileri</h3>
              <Button onClick={addCategory} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Kategori Ekle
              </Button>
            </div>

            {errors.categories && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.categories}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {formData.categories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {category.categoryName || `Kategori ${categoryIndex + 1}`}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(categoryIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <div className="space-y-2">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSubcategory(categoryIndex, subIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSubcategory(categoryIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Alt Kategori Ekle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revisions Tab */}
          <TabsContent value="revisions" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Revizyon Geçmişi</h3>
              
              {budgetRevisions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Henüz revizyon yok</h3>
                      <p className="text-muted-foreground">
                        Bu bütçe için henüz revizyon yapılmamış.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {budgetRevisions.map((revision) => (
                    <Card key={revision.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Revizyon #{revision.revisionNumber}
                          </CardTitle>
                          <Badge variant="outline">
                            {new Date(revision.revisedAt).toLocaleDateString('tr-TR')}
                          </Badge>
                        </div>
                        <CardDescription>
                          {revision.revisionNote}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Değişiklikler:</p>
                            <ul className="mt-1 space-y-1 text-muted-foreground">
                              {revision.changes.categoriesAdded > 0 && (
                                <li>• {revision.changes.categoriesAdded} kategori eklendi</li>
                              )}
                              {revision.changes.categoriesModified > 0 && (
                                <li>• {revision.changes.categoriesModified} kategori güncellendi</li>
                              )}
                              {revision.changes.categoriesRemoved > 0 && (
                                <li>• {revision.changes.categoriesRemoved} kategori silindi</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium">Bütçe Değişimi:</p>
                            <p className={`mt-1 font-semibold ${
                              revision.changes.totalBudgetChange >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {revision.changes.totalBudgetChange >= 0 ? '+' : ''}
                              {formatCurrency(revision.changes.totalBudgetChange)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bütçe Karşılaştırması</CardTitle>
                  <CardDescription>
                    Mevcut bütçe ile önerilen değişiklikler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Mevcut Bütçe</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Toplam Gelir:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(budget.categories.filter(c => c.budgetType === 'revenue').reduce((sum, c) => sum + c.budgetedAmount, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Toplam Gider:</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(budget.categories.filter(c => c.budgetType === 'expense').reduce((sum, c) => sum + c.budgetedAmount, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Net Bütçe:</span>
                          <span className={originalNetBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(originalNetBudget)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Yeni Bütçe</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Toplam Gelir:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(totalRevenue)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Toplam Gider:</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(totalExpense)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Net Bütçe:</span>
                          <span className={netBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(netBudget)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Net Değişim</p>
                    <p className={`text-2xl font-bold ${
                      netChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
                    </p>
                  </div>

                  {hasChanges && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Değişiklik tespit edildi:</strong> Bu bütçede değişiklik yaptınız. 
                        Kaydetmek için revizyon notu gereklidir.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!hasChanges && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Henüz değişiklik yapılmadı. Değişiklik yapmak için kategorileri düzenleyin.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}