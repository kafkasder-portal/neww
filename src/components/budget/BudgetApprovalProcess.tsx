import { CorporateBadge, CorporateButton, Card, CardContent, CardDescription, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ApprovalStatus, ApprovalStep, Budget, BudgetApproval } from '@/types/budget'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Send,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

interface BudgetApprovalProcessProps {
  budget: Budget
  onApprovalUpdate?: (budgetId: string, approval: BudgetApproval) => void
  currentUserId?: string
  userRole?: 'admin' | 'manager' | 'finance' | 'viewer'
}

interface ApprovalAction {
  id: string
  type: 'approve' | 'reject' | 'request_changes'
  comment: string
  timestamp: Date
  userId: string
  userName: string
}

const mockApprovalSteps: ApprovalStep[] = [
  {
    id: '1',
    workflowId: 'wf-1',
    stepNumber: 1,
    stepName: 'Departman Yöneticisi Onayı',
    approverRole: 'manager',
    approverName: 'Ahmet Yılmaz',
    status: 'approved',
    completedAt: '2024-01-15T10:30:00Z',
    comments: 'Departman bütçesi uygun görülmüştür.',
    isRequired: true
  },
  {
    id: '2',
    workflowId: 'wf-1',
    stepNumber: 2,
    stepName: 'Mali İşler Onayı',
    approverRole: 'finance',
    approverName: 'Fatma Kaya',
    status: 'pending',
    comments: '',
    isRequired: true
  },
  {
    id: '3',
    workflowId: 'wf-1',
    stepNumber: 3,
    stepName: 'Genel Müdür Onayı',
    approverRole: 'admin',
    approverName: 'Mehmet Özkan',
    status: 'pending',
    comments: '',
    isRequired: true
  }
]

const mockApprovalHistory: ApprovalAction[] = [
  {
    id: '1',
    type: 'approve',
    comment: 'Bütçe planlaması detaylı ve gerçekçi görünüyor.',
    timestamp: new Date('2024-01-15T10:30:00'),
    userId: 'user1',
    userName: 'Ahmet Yılmaz'
  },
  {
    id: '2',
    type: 'request_changes',
    comment: 'Pazarlama bütçesi %15 azaltılmalı.',
    timestamp: new Date('2024-01-14T14:20:00'),
    userId: 'user2',
    userName: 'Fatma Kaya'
  }
]

export function BudgetApprovalProcess({
  budget,
  onApprovalUpdate,
  currentUserId = 'user2',
  userRole = 'finance'
}: BudgetApprovalProcessProps) {
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>(mockApprovalSteps)
  const [approvalHistory, setApprovalHistory] = useState<ApprovalAction[]>(mockApprovalHistory)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'request_changes'>('approve')
  const [loading, setLoading] = useState(false)

  const currentStep = approvalSteps.find(step => step.status === 'pending')
  const canApprove = currentStep && (
    (currentStep.approverRole === userRole) ||
    (userRole === 'admin')
  )

  const approvalProgress = (
    approvalSteps.filter(step => step.status === 'approved').length /
    approvalSteps.length
  ) * 100

  const handleApprovalAction = async (action: 'approve' | 'reject' | 'request_changes') => {
    if (!currentStep || !approvalComment.trim()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newAction: ApprovalAction = {
        id: Date.now().toString(),
        type: action,
        comment: approvalComment,
        timestamp: new Date(),
        userId: currentUserId,
        userName: currentStep.approverName ?? ''
      }

      setApprovalHistory(prev => [newAction, ...prev])

      // Update current step
      const updatedSteps = approvalSteps.map(step => {
        if (step.id === currentStep.id) {
          return {
            ...step,
            status: action === 'approve' ? 'approved' as ApprovalStatus :
              action === 'reject' ? 'rejected' as ApprovalStatus : 'pending' as ApprovalStatus,
            completedAt: action === 'approve' ? new Date().toISOString() : undefined,
            comments: approvalComment
          }
        }
        return step
      })

      // If approved, move to next step
      let nextStepIndex = -1
      if (action === 'approve') {
        nextStepIndex = approvalSteps.findIndex(step => step.id === currentStep.id) + 1
        if (nextStepIndex < approvalSteps.length) {
          updatedSteps[nextStepIndex].status = 'pending'
        }
      }

      setApprovalSteps(updatedSteps)
      setApprovalComment('')
      setShowApprovalDialog(false)

      // Notify parent component
      if (onApprovalUpdate) {
        const approval: BudgetApproval = {
          id: budget.id,
          budgetId: budget.id,
          currentStep: action === 'approve' && nextStepIndex < approvalSteps.length ?
            nextStepIndex + 1 : currentStep.stepNumber,
          totalSteps: approvalSteps.length,
          status: action === 'reject' ? 'rejected' :
            updatedSteps.every(s => s.status === 'approved') ? 'approved' : 'in_progress',
          steps: updatedSteps,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        onApprovalUpdate(budget.id, approval)
      }
    } catch (error) {
      console.error('Onay işlemi sırasında hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportApprovalReport = () => {
    const reportData = {
      budget: budget.name,
      totalAmount: budget.totalAmount,
      status: budget.status,
      steps: approvalSteps,
      history: approvalHistory
    }

    const jsonContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onay-raporu-${budget.name}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ApprovalStatus) => {
    const variants = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      waiting: 'bg-gray-100 text-gray-800 border-gray-200',
      skipped: 'bg-gray-100 text-gray-800 border-gray-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    }

    const labels = {
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      pending: 'Beklemede',
      waiting: 'Sırada',
      skipped: 'Atlandı',
      completed: 'Tamamlandı'
    }

    return (
      <CorporateBadge className={variants[status]}>
        {labels[status]}
      </CorporateBadge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CorporateCard>
        <CorporateCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CorporateCardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Bütçe Onay Süreci</span>
              </CorporateCardTitle>
              <CardDescription>
                {budget.name} - {formatCurrency(budget.totalAmount)}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <CorporateButton onClick={exportApprovalReport} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </CorporateButton>
              {canApprove && (
                <CorporateButton onClick={() => setShowApprovalDialog(true)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Onay Ver
                </CorporateButton>
              )}
            </div>
          </div>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Onay İlerlemesi</span>
              <span>{Math.round(approvalProgress)}% Tamamlandı</span>
            </div>
            <Progress value={approvalProgress} className="h-2" />
          </div>
        </CorporateCardContent>
      </CorporateCard>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steps">Onay Adımları</TabsTrigger>
          <TabsTrigger value="history">Onay Geçmişi</TabsTrigger>
          <TabsTrigger value="details">Bütçe Detayları</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          {/* Approval Steps */}
          <div className="space-y-4">
            {approvalSteps.map((step, _index) => (
              <CorporateCard key={step.id} className={`${step.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : ''
                }`}>
                <CorporateCardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>

                    <div className="flex-1 space-y-6-group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{step.stepName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Onaylayıcı: {step.approverName}
                          </p>
                        </div>
                        {getStatusBadge(step.status)}
                      </div>

                      {step.completedAt && (
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {formatDate(new Date(step.completedAt))}
                        </p>
                      )}

                      {step.comments && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{step.comments}</p>
                        </div>
                      )}

                      {step.status === 'pending' && canApprove && step.id === currentStep?.id && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Bu adım sizin onayınızı bekliyor.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Approval History */}
          <div className="space-y-4">
            {approvalHistory.length === 0 ? (
              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz onay geçmişi bulunmuyor.</p>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            ) : (
              approvalHistory.map((action) => (
                <CorporateCard key={action.id}>
                  <CorporateCardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${action.userId}.jpg`} />
                        <AvatarFallback>
                          {action.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-6-group">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{action.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(action.timestamp)}
                            </p>
                          </div>
                          <CorporateBadge
                            className={`${action.type === 'approve' ? 'bg-green-100 text-green-800 border-green-200' :
                              action.type === 'reject' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`}
                          >
                            {action.type === 'approve' && 'Onayladı'}
                            {action.type === 'reject' && 'Reddetti'}
                            {action.type === 'request_changes' && 'Değişiklik İstedi'}
                          </CorporateBadge>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{action.comment}</p>
                        </div>
                      </div>
                    </div>
                  </CorporateCardContent>
                </CorporateCard>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Budget Details */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle>Bütçe Özeti</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <div className="grid grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bütçe Adı</p>
                    <p className="text-lg font-semibold">{budget.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Tutar</p>
                    <p className="text-lg font-semibold">{formatCurrency(budget.totalAmount)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dönem</p>
                    <p className="text-lg font-semibold">
                      {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Durum</p>
                    <p className="text-lg font-semibold">
                      {budget.status === 'draft' && 'Taslak'}
                      {budget.status === 'pending_approval' && 'Onay Bekliyor'}
                      {budget.status === 'approved' && 'Onaylandı'}
                      {budget.status === 'rejected' && 'Reddedildi'}
                      {budget.status === 'active' && 'Aktif'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kategori Sayısı</p>
                    <p className="text-lg font-semibold">{budget.categories.length}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Oluşturan</p>
                    <p className="text-lg font-semibold">{budget.createdBy}</p>
                  </div>
                </div>
              </div>
            </CorporateCardContent>
          </CorporateCard>

          {/* Categories Summary */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle>Kategori Dağılımı</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <div className="space-y-3">
                {budget.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{category.categoryName}</p>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.budgetedAmount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {budget.totalAmount ? ((category.budgetedAmount / budget.totalAmount) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bütçe Onayı</DialogTitle>
            <DialogDescription>
              {currentStep?.stepName} için kararınızı belirtin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <CorporateButton
                variant={selectedAction === 'approve' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('approve')}
                className="text-sm"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Onayla
              </CorporateButton>
              <CorporateButton
                variant={selectedAction === 'request_changes' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('request_changes')}
                className="text-sm"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Değişiklik
              </CorporateButton>
              <CorporateButton
                variant={selectedAction === 'reject' ? 'default' : 'outline'}
                onClick={() => setSelectedAction('reject')}
                className="text-sm"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reddet
              </CorporateButton>
            </div>

            <div>
              <label className="text-sm font-medium">Yorum (Zorunlu)</label>
              <Textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Onay kararınız için açıklama yazın..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <CorporateButton
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              disabled={loading}
            >
              İptal
            </CorporateButton>
            <CorporateButton
              onClick={() => handleApprovalAction(selectedAction)}
              disabled={!approvalComment.trim() || loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Gönder
            </CorporateButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}