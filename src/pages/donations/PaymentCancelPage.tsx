import { Card, CardContent, CardHeader, CardTitle, CorporateButton, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react'
import { donationService } from '@/services/donationService'

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [donation, setDonation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    handlePaymentCancel()
  }, [])

  const handlePaymentCancel = async () => {
    try {
      const donationId = searchParams.get('donation_id')
      
      if (donationId) {
        // Update donation status to cancelled
        await donationService.updateDonation(donationId, { 
          status: 'failed',
          notes: 'Payment cancelled by user'
        })

        // Get donation details
        const donations = await donationService.getDonations()
        const cancelledDonation = donations.find(d => d.id === donationId)
        setDonation(cancelledDonation)
      }

      setLoading(false)
    } catch (error) {
      console.error('Payment cancel handling error:', error)
      setLoading(false)
    }
  }

  const handleRetryPayment = () => {
    if (donation) {
      // Navigate back to donation form with pre-filled data
      navigate('/donations/online', {
        state: {
          donor_name: donation.donor_name,
          donor_email: donation.donor_email,
          donor_phone: donation.donor_phone,
          amount: donation.amount,
          purpose: donation.purpose,
          campaign: donation.campaign
        }
      })
    } else {
      navigate('/donations/online')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-blue-500 mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-medium">İşlem kontrol ediliyor...</h2>
            <p className="text-gray-600">Lütfen bekleyin</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ödeme İptal Edildi</h1>
          <p className="text-gray-600">
            Ödeme işleminiz iptal edildi veya tamamlanamadı.
          </p>
        </div>

        {/* Error Information */}
        <Alert className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Ödeme işlemi kullanıcı tarafından iptal edildi veya teknik bir sorun oluştu.
            Tekrar deneyebilir veya farklı bir ödeme yöntemi seçebilirsiniz.
          </AlertDescription>
        </Alert>

        {/* Donation Info (if available) */}
        {donation && (
          <CorporateCard className="mb-6">
            <CorporateCardHeader>
              <CorporateCardTitle className="text-lg">İptal Edilen Bağış</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bağışçı:</span>
                <span className="font-medium">{donation.donor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tutar:</span>
                <span className="font-medium">{donation.amount} TL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme Sağlayıcısı:</span>
                <span className="font-medium capitalize">{donation.payment_provider}</span>
              </div>
              {donation.purpose && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amaç:</span>
                  <span className="font-medium">{donation.purpose}</span>
                </div>
              )}
            </CorporateCardContent>
          </CorporateCard>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <CorporateButton onClick={handleRetryPayment} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </CorporateButton>
          
          <CorporateButton 
            variant="outline" 
            onClick={() => navigate('/donations')}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bağışlar Sayfasına Dön
          </CorporateButton>

          <CorporateButton 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Ana Sayfaya Dön
          </CorporateButton>
        </div>

        {/* Help Section */}
        <CorporateCard className="mt-8">
          <CorporateCardHeader>
            <CorporateCardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Yardıma mı ihtiyacınız var?
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Ödeme işlemi sırasında sorun yaşıyorsanız:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kart bilgilerinizi kontrol edin</li>
                <li>Kart limitinizi kontrol edin</li>
                <li>3D Secure onayını tamamladığınızdan emin olun</li>
                <li>Farklı bir tarayıcı deneyin</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <div className="font-medium text-blue-800 mb-1">İletişim</div>
              <div className="text-blue-700">
                📧 destek@kafkasder.org<br />
                📞 0212 555 0123<br />
                🕐 Pazartesi-Cuma 09:00-17:00
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Güvenli ödeme alt yapısı Supabase + İyzico/PayTR ile sağlanmaktadır.</p>
        </div>
      </div>
    </div>
  )
}
