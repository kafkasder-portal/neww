import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, ShieldCheck, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { donationService } from '@/services/donationService'
import { formatCurrency } from '@/utils/formatters'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (donationId: string) => void
  initialData?: {
    amount?: number
    donor_name?: string
    donor_email?: string
    donor_phone?: string
    purpose?: string
    campaign?: string
  }
}

export function PaymentModal({ isOpen, onClose, onSuccess, initialData }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'processing' | 'success' | 'error'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentProviders, setPaymentProviders] = useState<string[]>([])
  
  // Form data
  const [formData, setFormData] = useState({
    donor_name: initialData?.donor_name || '',
    donor_email: initialData?.donor_email || '',
    donor_phone: initialData?.donor_phone || '',
    amount: initialData?.amount?.toString() || '',
    currency: 'TRY',
    payment_provider: 'iyzico' as 'iyzico' | 'paytr',
    purpose: initialData?.purpose || '',
    campaign: initialData?.campaign || '',
    is_recurring: false,
    recurring_period: 'monthly'
  })

  // Payment data
  const [paymentData, setPaymentData] = useState<{
    payment_url?: string
    donation_id?: string
    transaction_id?: string
  }>({})

  useEffect(() => {
    if (isOpen) {
      loadPaymentProviders()
    }
  }, [isOpen])

  const loadPaymentProviders = async () => {
    try {
      const providers = await donationService.getPaymentProviders()
      setPaymentProviders(providers.providers)
      if (providers.default_provider) {
        setFormData(prev => ({ 
          ...prev, 
          payment_provider: providers.default_provider as 'iyzico' | 'paytr'
        }))
      }
    } catch (error) {
      console.error('Error loading payment providers:', error)
      setError('Ödeme sağlayıcıları yüklenemedi')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.donor_name || !formData.donor_email || !formData.amount) {
        setError('Lütfen tüm gerekli alanları doldurun')
        setLoading(false)
        return
      }

      const amount = parseFloat(formData.amount)
      if (amount < 10) {
        setError('Minimum bağış tutarı 10 TL\'dir')
        setLoading(false)
        return
      }

      // Create online donation
      const result = await donationService.createOnlineDonation({
        donor_name: formData.donor_name,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        amount,
        currency: formData.currency,
        payment_provider: formData.payment_provider,
        purpose: formData.purpose,
        campaign: formData.campaign,
        is_recurring: formData.is_recurring,
        recurring_period: formData.recurring_period
      })

      if (!result.success) {
        setError(result.error || 'Bağış oluşturulamadı')
        setLoading(false)
        return
      }

      // Store payment data
      setPaymentData({
        donation_id: result.donation_id,
        payment_url: result.payment_url
      })

      // Move to payment step
      setStep('payment')
      setLoading(false)

    } catch (error) {
      console.error('Payment submission error:', error)
      setError('Ödeme işlemi başlatılamadı')
      setLoading(false)
    }
  }

  const handlePaymentRedirect = () => {
    if (paymentData.payment_url) {
      setStep('processing')
      // Open payment URL in new window
      const paymentWindow = window.open(
        paymentData.payment_url, 
        'payment', 
        'width=800,height=600,scrollbars=yes,resizable=yes'
      )

      // Poll for payment completion
      const pollInterval = setInterval(() => {
        try {
          if (paymentWindow?.closed) {
            clearInterval(pollInterval)
            // Check payment status
            checkPaymentStatus()
          }
        } catch (error) {
          // Cross-origin error expected
        }
      }, 1000)

      // Auto-close after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close()
        }
        setStep('error')
        setError('Ödeme işlemi zaman aşımına uğradı')
      }, 10 * 60 * 1000)
    }
  }

  const checkPaymentStatus = async () => {
    if (!paymentData.donation_id) return

    try {
      // Get updated donation status
      const donations = await donationService.getDonations()
      const donation = donations.find(d => d.id === paymentData.donation_id)

      if (donation) {
        if (donation.status === 'completed') {
          setStep('success')
          onSuccess(donation.id)
        } else if (donation.status === 'failed') {
          setStep('error')
          setError('Ödeme başarısız oldu')
        } else {
          // Still processing, continue polling
          setTimeout(checkPaymentStatus, 3000)
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error)
      setStep('error')
      setError('Ödeme durumu kontrol edilemedi')
    }
  }

  const resetModal = () => {
    setStep('form')
    setError(null)
    setPaymentData({})
    setFormData({
      donor_name: initialData?.donor_name || '',
      donor_email: initialData?.donor_email || '',
      donor_phone: initialData?.donor_phone || '',
      amount: initialData?.amount?.toString() || '',
      currency: 'TRY',
      payment_provider: 'iyzico',
      purpose: initialData?.purpose || '',
      campaign: initialData?.campaign || '',
      is_recurring: false,
      recurring_period: 'monthly'
    })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  // Calculate processing fee
  const amount = parseFloat(formData.amount) || 0
  const processingFee = amount * 0.025
  const netAmount = amount - processingFee

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Online Bağış
          </DialogTitle>
          <DialogDescription>
            Güvenli ödeme sistemi ile bağış yapın
          </DialogDescription>
        </DialogHeader>

        {/* Form Step */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="danger">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad *</label>
                <Input
                  value={formData.donor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, donor_name: e.target.value }))}
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">E-posta *</label>
                <Input
                  type="email"
                  value={formData.donor_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, donor_email: e.target.value }))}
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <Input
                  type="tel"
                  value={formData.donor_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, donor_phone: e.target.value }))}
                  placeholder="0555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bağış Tutarı * (TL)</label>
                <Input
                  type="number"
                  min="10"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
                {amount >= 10 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Bağış Tutarı: {formatCurrency(amount)}</div>
                    <div>İşlem Ücreti: {formatCurrency(processingFee)}</div>
                    <div className="font-medium">Net Tutar: {formatCurrency(netAmount)}</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ödeme Sağlayıcısı</label>
                <Select 
                  value={formData.payment_provider} 
                  onValueChange={(value: 'iyzico' | 'paytr') => 
                    setFormData(prev => ({ ...prev, payment_provider: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentProviders.includes('iyzico') && (
                      <SelectItem value="iyzico">İyzico (Kredi Kartı)</SelectItem>
                    )}
                    {paymentProviders.includes('paytr') && (
                      <SelectItem value="paytr">PayTR (Çoklu Ödeme)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bağış Amacı</label>
                <Select 
                  value={formData.purpose} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Amaç seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genel">Genel Bağış</SelectItem>
                    <SelectItem value="egitim">Eğitim Desteği</SelectItem>
                    <SelectItem value="saglik">Sağlık Yardımı</SelectItem>
                    <SelectItem value="gida">Gıda Yardımı</SelectItem>
                    <SelectItem value="acil">Acil Yardım</SelectItem>
                    <SelectItem value="kurban">Kurban Bağışı</SelectItem>
                    <SelectItem value="ramazan">Ramazan Yardımı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                />
                <label htmlFor="recurring" className="text-sm">Düzenli bağış yap</label>
              </div>

              {formData.is_recurring && (
                <div>
                  <label className="block text-sm font-medium mb-1">Bağış Periyodu</label>
                  <Select 
                    value={formData.recurring_period} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, recurring_period: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Haftalık</SelectItem>
                      <SelectItem value="monthly">Aylık</SelectItem>
                      <SelectItem value="quarterly">3 Aylık</SelectItem>
                      <SelectItem value="annually">Yıllık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <CorporateButton type="button" variant="neutral" onClick={handleClose} className="flex-1">
                İptal
              </CorporateButton>
              <CorporateButton type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Hazırlanıyor...
                  </>
                ) : (
                  'Ödemeye Geç'
                )}
              </CorporateButton>
            </div>
          </form>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="space-y-4">
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="text-lg">Ödeme Özeti</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Bağışçı:</span>
                  <span className="font-medium">{formData.donor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tutar:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>İşlem Ücreti:</span>
                  <span>{formatCurrency(processingFee)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Toplam:</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">256-bit SSL güvenlik</span>
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <Alert>
              <AlertDescription>
                {formData.payment_provider === 'iyzico' ? 'İyzico' : 'PayTR'} güvenli ödeme sayfasına yönlendirileceksiniz.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <CorporateButton variant="neutral" onClick={() => setStep('form')} className="flex-1">
                Geri
              </CorporateButton>
              <CorporateButton onClick={handlePaymentRedirect} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Ödeme Yap
              </CorporateButton>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="animate-spin">
                <Loader2 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Ödeme İşleniyor</h3>
              <p className="text-gray-600">Lütfen bekleyin, ödemeniz işleniyor...</p>
            </div>
            <CorporateBadge variant="neutral" className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Ortalama işlem süresi: 30-60 saniye
            </CorporateBadge>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-600">Ödeme Başarılı!</h3>
              <p className="text-gray-600">
                Bağışınız için teşekkür ederiz. E-posta adresinize makbuz gönderilecektir.
              </p>
            </div>
            <div className="corporate-table-header p-4 rounded-lg">
              <div className="text-sm">
                <div>Bağış ID: {paymentData.donation_id}</div>
                <div>Tutar: {formatCurrency(amount)}</div>
                <div>Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
              </div>
            </div>
            <CorporateButton onClick={handleClose} className="w-full">
              Tamam
            </CorporateButton>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-600">Ödeme Başarısız</h3>
              <p className="text-gray-600">
                {error || 'Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.'}
              </p>
            </div>
            <div className="flex gap-2">
              <CorporateButton variant="neutral" onClick={() => setStep('form')} className="flex-1">
                Tekrar Dene
              </CorporateButton>
              <CorporateButton variant="neutral" onClick={handleClose} className="flex-1">
                Kapat
              </CorporateButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
