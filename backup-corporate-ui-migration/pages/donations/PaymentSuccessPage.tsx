import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { CheckCircle, Download, Share2, Copy, ArrowLeft, AlertTriangle } from 'lucide-react'
import { donationService } from '@/services/donationService'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { toast } from 'sonner'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [donation, setDonation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handlePaymentCallback()
  }, [])

  const handlePaymentCallback = async () => {
    try {
      const provider = searchParams.get('provider') as 'iyzico' | 'paytr'
      const token = searchParams.get('token')
      const donationId = searchParams.get('donation_id')

      if (!provider || !token || !donationId) {
        setError('Geçersiz ödeme parametreleri')
        setLoading(false)
        return
      }

      // Verify payment with backend
      const result = await donationService.handlePaymentCallback(provider, token, donationId)

      if (result.success && result.donation) {
        setDonation(result.donation)
        
        // Send success email/SMS notifications
        await sendSuccessNotifications(result.donation)
      } else {
        setError(result.error || 'Ödeme doğrulanamadı')
      }

      setLoading(false)
    } catch (error) {
      console.error('Payment callback error:', error)
      setError('Ödeme işlemi doğrulanırken hata oluştu')
      setLoading(false)
    }
  }

  const sendSuccessNotifications = async (donation: any) => {
    try {
      // Send email receipt
      if (donation.donor_email) {
        await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            to: donation.donor_email,
            templateId: 'donation_receipt',
            templateVariables: {
              donor_name: donation.donor_name,
              amount: donation.amount.toString(),
              donation_id: donation.id,
              date: formatDate(donation.created_at),
              payment_method: donation.payment_provider
            }
          })
        })
      }

      // Send SMS notification
      if (donation.donor_phone) {
        await fetch('/api/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            to: donation.donor_phone,
            templateId: 'donation_thanks',
            templateVariables: {
              name: donation.donor_name,
              amount: donation.amount.toString(),
              donation_id: donation.id
            }
          })
        })
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      // Don't show error to user, notifications are secondary
    }
  }

  const handleCopyDonationId = () => {
    if (donation?.id) {
      navigator.clipboard.writeText(donation.id)
      toast.success('Bağış ID kopyalandı')
    }
  }

  const handleDownloadReceipt = () => {
    // Generate and download PDF receipt
    const receiptContent = `
KAFKASDER - Bağış Makbuzu
==========================

Bağış ID: ${donation?.id}
Bağışçı: ${donation?.donor_name}
E-posta: ${donation?.donor_email}
Telefon: ${donation?.donor_phone || 'Belirtilmemiş'}

Bağış Detayları:
- Tutar: ${formatCurrency(donation?.amount)}
- İşlem Ücreti: ${formatCurrency(donation?.processing_fee)}
- Net Tutar: ${formatCurrency(donation?.net_amount)}
- Para Birimi: ${donation?.currency}
- Ödeme Yöntemi: ${donation?.payment_provider}
- Tarih: ${formatDate(donation?.created_at)}

Amaç: ${donation?.purpose || 'Genel bağış'}
Kampanya: ${donation?.campaign || 'Genel'}

Bu makbuz vergi indirimi için kullanılabilir.

KAFKASDER
Çeçen Kafkas Muhacirleri Yardımlaşma ve Dayanışma Derneği
www.kafkasder.org
    `

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kafkasder-bagis-makbuzu-${donation?.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KAFKASDER Bağış Makbuzu',
        text: `${formatCurrency(donation?.amount)} tutarında bağış yaptım. Bağış ID: ${donation?.id}`,
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      const shareText = `KAFKASDER'e ${formatCurrency(donation?.amount)} bağış yaptım! 🙏 #KAFKASDER #Bağış`
      navigator.clipboard.writeText(shareText)
      toast.success('Paylaşım metni kopyalandı')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Ödeme Doğrulanıyor</h2>
            <p className="text-gray-600">Lütfen bekleyin...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CorporateCard className="max-w-md">
          <CorporateCardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <CorporateCardTitle className="text-red-600">Ödeme Başarısız</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-2">
              <CorporateButton variant="neutral" onClick={() => navigate('/donations')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri Dön
              </CorporateButton>
              <CorporateButton onClick={() => window.location.reload()} className="flex-1">
                Tekrar Dene
              </CorporateButton>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen corporate-table-header py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Bağışınız Tamamlandı!</h1>
          <p className="text-lg text-gray-600">
            Değerli katkınız için çok teşekkür ederiz. 🙏
          </p>
        </div>

        {/* Donation Details */}
        <CorporateCard className="mb-6">
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center justify-between">
              Bağış Detayları
              <CorporateBadge variant="neutral" className="bg-green-100 text-green-800">
                Başarılı
              </CorporateBadge>
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Bağışçı</label>
                <div className="font-medium">{donation?.donor_name}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Bağış ID</label>
                <div className="font-medium font-mono flex items-center gap-2">
                  {donation?.id}
                  <CorporateButton
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyDonationId}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </CorporateButton>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tutar</label>
                <div className="font-medium text-lg">{formatCurrency(donation?.amount)}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tarih</label>
                <div className="font-medium">{formatDate(donation?.created_at)}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Ödeme Yöntemi</label>
                <div className="font-medium capitalize">{donation?.payment_provider}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Amaç</label>
                <div className="font-medium">{donation?.purpose || 'Genel bağış'}</div>
              </div>
            </div>

            {donation?.processing_fee && (
              <div className="border-t pt-4 corporate-form-group">
                <div className="flex justify-between text-sm">
                  <span>Bağış Tutarı:</span>
                  <span>{formatCurrency(donation.amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>İşlem Ücreti:</span>
                  <span>-{formatCurrency(donation.processing_fee)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Derneğe Ulaşan Tutar:</span>
                  <span>{formatCurrency(donation.net_amount)}</span>
                </div>
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CorporateButton onClick={handleDownloadReceipt} variant="neutral" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Makbuz İndir
          </CorporateButton>
          <CorporateButton onClick={handleShare} variant="neutral" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Paylaş
          </CorporateButton>
        </div>

        {/* Next Steps */}
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="text-lg">Sonraki Adımlar</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <div className="font-medium">E-posta Makbuzu</div>
                <div className="text-sm text-gray-600">
                  E-posta adresinize detaylı makbuz gönderildi.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <div className="font-medium">Vergi İndirimi</div>
                <div className="text-sm text-gray-600">
                  Bu makbuz vergi indirimi için kullanılabilir.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <div className="font-medium">Bağış Takibi</div>
                <div className="text-sm text-gray-600">
                  Bağışınızın nasıl kullanıldığını takip edebilirsiniz.
                </div>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <CorporateButton 
            variant="neutral" 
            onClick={() => navigate('/donations')}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bağışlara Dön
          </CorporateButton>
          <CorporateButton 
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Ana Sayfaya Dön
          </CorporateButton>
        </div>

        {/* Additional Actions */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            Bağışınız için bir kez daha teşekkür ederiz! 💝
          </p>
          
          {!donation?.is_recurring && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                📅 Düzenli bağış yapmak ister misiniz?
              </p>
              <CorporateButton 
                size="sm" 
                onClick={() => navigate('/donations/recurring')}
              >
                Düzenli Bağış Ayarla
              </CorporateButton>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Bu işlem güvenli SSL bağlantısı ile gerçekleştirilmiştir.
          </div>
        </div>
      </div>
    </div>
  )
}
