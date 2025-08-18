import { supabase } from '@lib/supabase'
import type { 
  Donor, 
  DonorInteraction, 
  DonorCampaign, 
  DonorSegment,
  DonorTaskList,
  DonorCommunication,
  DonorAnalytics,
  DonorSearchFilters,
  DonorDashboardData
} from '@/types/donors'
import { toast } from 'sonner'

export class DonorCRMService {
  // Donor Management
  static async createDonor(donorData: Omit<Donor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string | null> {
    try {
      // Check for existing donor with same email
      const { data: existingDonor } = await supabase
        .from('donors')
        .select('id')
        .eq('email', donorData.email)
        .single()

      if (existingDonor) {
        toast.error('Bu e-posta adresi ile zaten bir bağışçı kayıtlı')
        return null
      }

      const { data, error } = await supabase
        .from('donors')
        .insert([{
          ...donorData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user-id' // Should be replaced with actual user ID
        }])
        .select()
        .single()

      if (error) throw error

      // Calculate donor tier based on total donated
      await this.updateDonorTier(data.id)

      toast.success('Bağışçı başarıyla oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating donor:', error)
      toast.error('Bağışçı oluşturulamadı')
      return null
    }
  }

  static async updateDonor(donorId: string, updates: Partial<Donor>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donors')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user-id'
        })
        .eq('id', donorId)

      if (error) throw error

      toast.success('Bağışçı bilgileri güncellendi')
      return true
    } catch (error) {
      console.error('Error updating donor:', error)
      toast.error('Bağışçı güncellenemedi')
      return false
    }
  }

  static async getDonor(donorId: string): Promise<Donor | null> {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('id', donorId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching donor:', error)
      return null
    }
  }

  static async searchDonors(filters: DonorSearchFilters, page = 1, pageSize = 20): Promise<{ donors: Donor[], totalCount: number }> {
    try {
      let query = supabase
        .from('donors')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.donorType && filters.donorType.length > 0) {
        query = query.in('donorType', filters.donorType)
      }

      if (filters.donorTier && filters.donorTier.length > 0) {
        query = query.in('donorTier', filters.donorTier)
      }

      if (filters.relationshipStatus && filters.relationshipStatus.length > 0) {
        query = query.in('relationshipStatus', filters.relationshipStatus)
      }

      if (filters.totalDonatedRange) {
        if (filters.totalDonatedRange.min !== undefined) {
          query = query.gte('totalDonated', filters.totalDonatedRange.min)
        }
        if (filters.totalDonatedRange.max !== undefined) {
          query = query.lte('totalDonated', filters.totalDonatedRange.max)
        }
      }

      if (filters.cities && filters.cities.length > 0) {
        query = query.in('city', filters.cities)
      }

      if (filters.searchQuery) {
        const searchTerm = filters.searchQuery.trim()
        query = query.or(
          `firstName.ilike.%${searchTerm}%,lastName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize
      query = query
        .range(startIndex, startIndex + pageSize - 1)
        .order('lastDonationDate', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        donors: data || [],
        totalCount: count || 0
      }
    } catch (error) {
      console.error('Error searching donors:', error)
      return { donors: [], totalCount: 0 }
    }
  }

  // Donor Tier Management
  static async updateDonorTier(donorId: string): Promise<void> {
    try {
      const donor = await this.getDonor(donorId)
      if (!donor) return

      let tier: Donor['donorTier'] = 'standard'
      
      if (donor.totalDonated >= 100000) tier = 'platinum'
      else if (donor.totalDonated >= 50000) tier = 'gold'
      else if (donor.totalDonated >= 25000) tier = 'silver'
      else if (donor.totalDonated >= 10000) tier = 'bronze'

      await this.updateDonor(donorId, { donorTier: tier })
    } catch (error) {
      console.error('Error updating donor tier:', error)
    }
  }

  // Interaction Management
  static async createInteraction(interaction: Omit<DonorInteraction, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('donor_interactions')
        .insert([{
          ...interaction,
          createdAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Update donor's last contact date
      await this.updateDonor(interaction.donorId, {
        lastContactDate: interaction.actualDate
      })

      return data.id
    } catch (error) {
      console.error('Error creating interaction:', error)
      return null
    }
  }

  static async getDonorInteractions(donorId: string): Promise<DonorInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('donor_interactions')
        .select('*')
        .eq('donorId', donorId)
        .order('actualDate', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching interactions:', error)
      return []
    }
  }

  // Campaign Management
  static async createCampaign(campaign: Omit<DonorCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('donor_campaigns')
        .insert([{
          ...campaign,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Kampanya oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Kampanya oluşturulamadı')
      return null
    }
  }

  static async getCampaigns(): Promise<DonorCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('donor_campaigns')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return []
    }
  }

  // Segmentation
  static async createSegment(segment: Omit<DonorSegment, 'id' | 'donorCount' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      // Calculate donor count for the segment
      const donorCount = await this.calculateSegmentSize(segment.criteria)

      const { data, error } = await supabase
        .from('donor_segments')
        .insert([{
          ...segment,
          donorCount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Bağışçı segmenti oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating segment:', error)
      toast.error('Segment oluşturulamadı')
      return null
    }
  }

  private static async calculateSegmentSize(criteria: any): Promise<number> {
    try {
      let query = supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })

      // Apply segment criteria (simplified version)
      if (criteria.donorType) {
        query = query.in('donorType', criteria.donorType)
      }

      if (criteria.totalDonatedMin !== undefined) {
        query = query.gte('totalDonated', criteria.totalDonatedMin)
      }

      if (criteria.totalDonatedMax !== undefined) {
        query = query.lte('totalDonated', criteria.totalDonatedMax)
      }

      const { count, error } = await query

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error calculating segment size:', error)
      return 0
    }
  }

  // Task Management
  static async createTask(task: Omit<DonorTaskList, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('donor_tasks')
        .insert([{
          ...task,
          createdAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Görev oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Görev oluşturulamadı')
      return null
    }
  }

  static async getTasksForDonor(donorId: string): Promise<DonorTaskList[]> {
    try {
      const { data, error } = await supabase
        .from('donor_tasks')
        .select('*')
        .eq('donorId', donorId)
        .order('dueDate', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  static async getUpcomingTasks(limit = 20): Promise<DonorTaskList[]> {
    try {
      const { data, error } = await supabase
        .from('donor_tasks')
        .select('*')
        .eq('status', 'pending')
        .gte('dueDate', new Date().toISOString().split('T')[0])
        .order('dueDate', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error)
      return []
    }
  }

  // Dashboard Analytics
  static async getDashboardData(): Promise<DonorDashboardData | null> {
    try {
      // Get basic donor counts
      const { data: donorStats } = await supabase
        .from('donors')
        .select('donorType, donorTier, relationshipStatus, totalDonated, lastDonationDate, createdAt')

      if (!donorStats) return null

      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      const newDonorsThisMonth = donorStats.filter(d => 
        d.createdAt.startsWith(currentMonth)
      ).length

      const activeDonors = donorStats.filter(d => 
        d.relationshipStatus === 'active'
      ).length

      const lapsedDonors = donorStats.filter(d => 
        d.relationshipStatus === 'lapsed'
      ).length

      const donorsByType = {
        individual: donorStats.filter(d => d.donorType === 'individual').length,
        corporate: donorStats.filter(d => d.donorType === 'corporate').length,
        foundation: donorStats.filter(d => d.donorType === 'foundation').length,
        government: donorStats.filter(d => d.donorType === 'government').length
      }

      const donorsByTier = {
        platinum: donorStats.filter(d => d.donorTier === 'platinum').length,
        gold: donorStats.filter(d => d.donorTier === 'gold').length,
        silver: donorStats.filter(d => d.donorTier === 'silver').length,
        bronze: donorStats.filter(d => d.donorTier === 'bronze').length,
        standard: donorStats.filter(d => d.donorTier === 'standard').length
      }

      const totalDonated = donorStats.reduce((sum, d) => sum + (d.totalDonated || 0), 0)
      const averageDonationAmount = totalDonated / donorStats.length

      // Get top donors
      const topDonors = donorStats
        .sort((a, b) => (b.totalDonated || 0) - (a.totalDonated || 0))
        .slice(0, 5)
        .map(d => ({
          id: d.id || '',
          name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.companyName || 'Unknown',
          totalDonated: d.totalDonated || 0,
          lastDonation: d.lastDonationDate || ''
        }))

      return {
        totalDonors: donorStats.length,
        newDonorsThisMonth,
        activeDonors,
        lapsedDonors,
        averageDonationAmount,
        donorRetentionRate: activeDonors / donorStats.length * 100,
        donorAcquisitionCost: 0, // Would need campaign cost data
        donorsByType,
        donorsByTier,
        topDonors,
        recentActivities: [], // Would need to join with interactions/donations
        monthlyTrends: [] // Would need historical data
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return null
    }
  }

  // Communication Tracking
  static async logCommunication(communication: Omit<DonorCommunication, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('donor_communications')
        .insert([{
          ...communication,
          createdAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error logging communication:', error)
      return null
    }
  }

  // Donor Analytics
  static async calculateDonorAnalytics(donorId: string): Promise<DonorAnalytics | null> {
    try {
      const donor = await this.getDonor(donorId)
      if (!donor) return null

      // Get donor's donation history
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, date, currency')
        .eq('donorId', donorId)
        .order('date', { ascending: true })

      if (!donations) return null

      // Calculate patterns and scores (simplified)
      const analytics: DonorAnalytics = {
        donorId,
        donationFrequency: this.calculateDonationFrequency(donations),
        seasonalPatterns: this.calculateSeasonalPatterns(donations),
        monthlyPatterns: this.calculateMonthlyPatterns(donations),
        engagementScore: this.calculateEngagementScore(donor, donations),
        responsiveness: 75, // Mock value
        loyaltyScore: this.calculateLoyaltyScore(donor, donations),
        churnRisk: this.assessChurnRisk(donor, donations),
        upgradeOpportunity: this.assessUpgradeOpportunity(donor, donations),
        currentLTV: donor.totalDonated,
        predictedLTV: donor.totalDonated * 1.5, // Simple prediction
        lastCalculated: new Date().toISOString()
      }

      return analytics
    } catch (error) {
      console.error('Error calculating donor analytics:', error)
      return null
    }
  }

  private static calculateDonationFrequency(donations: any[]): 'monthly' | 'quarterly' | 'annually' | 'irregular' {
    if (donations.length < 2) return 'irregular'
    
    const intervals = []
    for (let i = 1; i < donations.length; i++) {
      const prevDate = new Date(donations[i-1].date)
      const currDate = new Date(donations[i].date)
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      intervals.push(daysDiff)
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    
    if (avgInterval <= 35) return 'monthly'
    if (avgInterval <= 100) return 'quarterly'
    if (avgInterval <= 400) return 'annually'
    return 'irregular'
  }

  private static calculateSeasonalPatterns(donations: any[]) {
    const patterns = { spring: 0, summer: 0, autumn: 0, winter: 0 }
    
    donations.forEach(donation => {
      const month = new Date(donation.date).getMonth()
      if (month >= 2 && month <= 4) patterns.spring += donation.amount
      else if (month >= 5 && month <= 7) patterns.summer += donation.amount
      else if (month >= 8 && month <= 10) patterns.autumn += donation.amount
      else patterns.winter += donation.amount
    })
    
    return patterns
  }

  private static calculateMonthlyPatterns(donations: any[]): Record<string, number> {
    const patterns: Record<string, number> = {}
    
    donations.forEach(donation => {
      const monthKey = new Date(donation.date).toISOString().slice(0, 7)
      patterns[monthKey] = (patterns[monthKey] || 0) + donation.amount
    })
    
    return patterns
  }

  private static calculateEngagementScore(donor: Donor, donations: any[]): number {
    let score = 0
    
    // Recent donation activity (40 points)
    const daysSinceLastDonation = donor.lastDonationDate 
      ? (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24)
      : 365
    
    if (daysSinceLastDonation <= 30) score += 40
    else if (daysSinceLastDonation <= 90) score += 30
    else if (daysSinceLastDonation <= 180) score += 20
    else if (daysSinceLastDonation <= 365) score += 10
    
    // Donation frequency (30 points)
    if (donations.length >= 12) score += 30
    else if (donations.length >= 6) score += 20
    else if (donations.length >= 3) score += 10
    
    // Communication preferences (30 points)
    const prefCount = Object.values(donor.communicationPreferences).filter(Boolean).length
    score += Math.min(30, prefCount * 7.5)
    
    return Math.min(100, score)
  }

  private static calculateLoyaltyScore(donor: Donor, donations: any[]): number {
    let score = 0
    
    // Length of relationship (40 points)
    const relationshipDays = (Date.now() - new Date(donor.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (relationshipDays >= 1095) score += 40 // 3+ years
    else if (relationshipDays >= 730) score += 30 // 2+ years
    else if (relationshipDays >= 365) score += 20 // 1+ year
    else score += 10
    
    // Consistency of donations (40 points)
    const donationFrequency = this.calculateDonationFrequency(donations)
    if (donationFrequency === 'monthly') score += 40
    else if (donationFrequency === 'quarterly') score += 30
    else if (donationFrequency === 'annually') score += 20
    else score += 10
    
    // Total contribution relative to tier (20 points)
    if (donor.donorTier === 'platinum') score += 20
    else if (donor.donorTier === 'gold') score += 15
    else if (donor.donorTier === 'silver') score += 10
    else score += 5
    
    return Math.min(100, score)
  }

  private static assessChurnRisk(donor: Donor, donations: any[]): 'low' | 'medium' | 'high' {
    const daysSinceLastDonation = donor.lastDonationDate 
      ? (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24)
      : 365
    
    const avgDonationInterval = donations.length > 1 
      ? (Date.now() - new Date(donations[0].date).getTime()) / (1000 * 60 * 60 * 24) / donations.length
      : 365
    
    if (daysSinceLastDonation > avgDonationInterval * 2) return 'high'
    if (daysSinceLastDonation > avgDonationInterval * 1.5) return 'medium'
    return 'low'
  }

  private static assessUpgradeOpportunity(donor: Donor, donations: any[]): 'low' | 'medium' | 'high' {
    const recentDonations = donations.filter(d => 
      (Date.now() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24) <= 365
    )
    
    const recentAverage = recentDonations.length > 0
      ? recentDonations.reduce((sum, d) => sum + d.amount, 0) / recentDonations.length
      : 0
    
    if (recentAverage > donor.averageDonationAmount * 1.2) return 'high'
    if (recentAverage > donor.averageDonationAmount * 1.1) return 'medium'
    return 'low'
  }
}
