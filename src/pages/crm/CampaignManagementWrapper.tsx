import { useState, useEffect } from 'react'
import CampaignManagement from './CampaignManagement'
import { DonorCRMService } from '@/services/donorCRMService'
import type { Donor } from '@/types/donors'
import { toast } from 'sonner'

export default function CampaignManagementWrapper() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonors()
  }, [])

  const loadDonors = async () => {
    setLoading(true)
    try {
      const { donors: fetchedDonors } = await DonorCRMService.searchDonors({})
      setDonors(fetchedDonors)
    } catch (error) {
      console.error('Error loading donors:', error)
      toast.error('Bağışçılar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <CampaignManagement donors={donors} />
  )
}
