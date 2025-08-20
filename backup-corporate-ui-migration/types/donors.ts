// Donor CRM Types for Charity Management System

export interface Donor {
  id: string
  // Basic Information
  donorType: 'individual' | 'corporate' | 'foundation' | 'government'
  title?: string // Mr., Mrs., Dr., etc.
  firstName: string
  lastName: string
  companyName?: string
  position?: string // For corporate donors
  
  // Contact Information
  email: string
  phone: string
  alternativePhone?: string
  address: string
  city: string
  district: string
  postalCode: string
  country: string
  
  // Digital Presence
  website?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  
  // Donation Information
  totalDonated: number
  firstDonationDate: string
  lastDonationDate: string
  donationCount: number
  averageDonationAmount: number
  largestDonation: number
  preferredPaymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'check' | 'mobile_payment'
  
  // Segmentation & Classification
  donorSegment: 'major_donor' | 'regular_donor' | 'occasional_donor' | 'first_time_donor' | 'lapsed_donor'
  donorTier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard'
  interests: string[] // Education, Health, Emergency Relief, etc.
  preferredCauses: string[]
  
  // Communication Preferences
  communicationPreferences: {
    email: boolean
    sms: boolean
    phone: boolean
    postal: boolean
    whatsapp: boolean
  }
  newsletterSubscribed: boolean
  communicationFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'event_based'
  preferredLanguage: 'tr' | 'en' | 'ar'
  
  // Tax & Legal
  taxNumber?: string
  isEligibleForTaxDeduction: boolean
  wantsTaxReceipt: boolean
  kvkkConsent: boolean
  kvkkConsentDate?: string
  
  // Relationship & Engagement
  acquisitionSource: 'website' | 'social_media' | 'referral' | 'event' | 'direct_mail' | 'telemarketing' | 'walk_in'
  referredBy?: string
  assignedTo?: string // Staff member responsible
  relationshipStatus: 'prospect' | 'active' | 'lapsed' | 'churned' | 'blacklisted' | 'inactive'
  lastContactDate?: string
  nextFollowUpDate?: string
  
  // Additional Information
  birthDate?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  occupation?: string
  avatar?: string // Profile picture URL or base64 string
  notes?: string
  tags: string[]
  
  // System Fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
  
  // Additional properties for compatibility
  lastDonation?: number
  daysSinceLastDonation?: number
  donationRange?: string
}

export interface DonorInteraction {
  id: string
  donorId: string
  interactionType: 'call' | 'email' | 'meeting' | 'event' | 'letter' | 'sms' | 'social_media' | 'website_visit'
  subject: string
  description: string
  outcome: 'positive' | 'neutral' | 'negative' | 'follow_up_required'
  staffMember: string
  scheduledDate?: string
  actualDate: string
  duration?: number // in minutes
  followUpRequired: boolean
  followUpDate?: string
  attachments?: string[]
  createdAt: string
}

export interface DonorCampaign {
  id: string
  name: string
  description: string
  campaignType: 'fundraising' | 'awareness' | 'retention' | 'acquisition' | 'stewardship' | 'event' | 'membership' | 'volunteer'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  targetAmount?: number
  raisedAmount: number
  targetDonorCount?: number
  participantCount: number
  
  // Segmentation
  targetSegments: string[]
  targetTiers: string[]
  targetInterests: string[]
  
  // Communication
  channels: ('email' | 'sms' | 'phone' | 'postal' | 'social_media')[]
  messageTemplate: string
  frequency: 'one_time' | 'weekly' | 'monthly'
  
  // Results
  openRate?: number
  clickRate?: number
  responseRate?: number
  conversionRate?: number
  roi?: number
  
  createdAt: string
  updatedAt: string
  createdBy: string
  
  // Additional properties for compatibility
  campaignName?: string
}

export interface DonorSegment {
  id: string
  name: string
  description: string
  criteria: DonorSegmentCriteria
  donorCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DonorSegmentCriteria {
  donorType?: ('individual' | 'corporate' | 'foundation' | 'government')[]
  totalDonatedMin?: number
  totalDonatedMax?: number
  donationCountMin?: number
  donationCountMax?: number
  daysSinceLastDonationMin?: number
  daysSinceLastDonationMax?: number
  donorTiers?: ('platinum' | 'gold' | 'silver' | 'bronze' | 'standard')[]
  interests?: string[]
  preferredCauses?: string[]
  communicationPreferences?: {
    email?: boolean
    sms?: boolean
    phone?: boolean
  }
  relationshipStatus?: ('prospect' | 'active' | 'lapsed' | 'churned')[]
  ageMin?: number
  ageMax?: number
  cities?: string[]
  acquisitionSources?: string[]
}

export interface DonorTaskList {
  id: string
  donorId: string
  taskType: 'follow_up' | 'thank_you' | 'birthday_greeting' | 'renewal_reminder' | 'major_gift_ask' | 'stewardship'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  dueDate: string
  assignedTo: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  completedAt?: string
  notes?: string
  createdAt: string
}

export interface DonorAnalytics {
  donorId: string
  
  // Donation Patterns
  donationFrequency: 'monthly' | 'quarterly' | 'annually' | 'irregular'
  seasonalPatterns: {
    spring: number
    summer: number
    autumn: number
    winter: number
  }
  monthlyPatterns: Record<string, number>
  
  // Engagement Metrics
  engagementScore: number // 0-100
  responsiveness: number // 0-100
  loyaltyScore: number // 0-100
  
  // Predictions
  churnRisk: 'low' | 'medium' | 'high'
  upgradeOpportunity: 'low' | 'medium' | 'high'
  nextDonationPrediction?: {
    date: string
    amount: number
    confidence: number
  }
  
  // Lifetime Value
  currentLTV: number
  predictedLTV: number
  
  lastCalculated: string
}

export interface DonorCommunication {
  id: string
  donorId: string
  campaignId?: string
  communicationType: 'email' | 'sms' | 'phone' | 'postal' | 'whatsapp'
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'pending' | 'completed'
  scheduledDate?: string
  sentDate?: string
  deliveredDate?: string
  openedDate?: string
  clickedDate?: string
  bounceReason?: string
  
  // Tracking
  opens: number
  clicks: number
  unsubscribed: boolean
  complained: boolean
  
  createdAt: string
  createdBy: string
  
  // Additional properties for compatibility
  communicationDate?: string
  followUpDate?: string
  priority?: string
}

// Dashboard and Analytics Types
export interface DonorDashboardData {
  totalDonors: number
  newDonorsThisMonth: number
  activeDonors: number
  lapsedDonors: number
  averageDonationAmount: number
  donorRetentionRate: number
  donorAcquisitionCost: number
  
  donorsByType: {
    individual: number
    corporate: number
    foundation: number
    government: number
  }
  
  donorsByTier: {
    platinum: number
    gold: number
    silver: number
    bronze: number
    standard: number
  }
  
  topDonors: {
    id: string
    name: string
    totalDonated: number
    lastDonation: string
  }[]
  
  recentActivities: {
    type: 'new_donor' | 'donation' | 'interaction' | 'task_completed'
    donorName: string
    amount?: number
    date: string
    description: string
  }[]
  
  monthlyTrends: {
    month: string
    newDonors: number
    totalDonations: number
    averageAmount: number
  }[]
}

// Filter and Search Types
export interface DonorSearchFilters {
  donorType?: ('individual' | 'corporate' | 'foundation' | 'government')[]
  donorSegment?: string[]
  donorTier?: ('platinum' | 'gold' | 'silver' | 'bronze' | 'standard')[]
  relationshipStatus?: ('prospect' | 'active' | 'lapsed' | 'churned')[]
  
  totalDonatedRange?: {
    min?: number
    max?: number
  }
  
  donationCountRange?: {
    min?: number
    max?: number
  }
  
  lastDonationDateRange?: {
    start?: string
    end?: string
  }
  
  cities?: string[]
  acquisitionSources?: string[]
  interests?: string[]
  
  communicationPreferences?: {
    email?: boolean
    sms?: boolean
    phone?: boolean
  }
  
  searchQuery?: string // Name, email, phone search
}

export interface DonorListViewConfig {
  columns: ('name' | 'email' | 'phone' | 'totalDonated' | 'lastDonation' | 'donorTier' | 'status')[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  pageSize: number
  showFilters: boolean
}

// CRM Analytics Types
export interface CRMAnalyticsData {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  averageDonation: number;
  retentionRate: number;
  newDonorsThisMonth: number;
  donorGrowth: number;
  medianDonation: number;
  communicationStats: {
    emails: number;
    calls: number;
    meetings: number;
  };
  donorSegments: DonorSegmentChart[];
  campaignPerformance: CampaignPerformance[];
  communicationActivity: Array<{
    type: 'email' | 'phone' | 'meeting' | 'message';
    label: string;
    description: string;
    count: number;
  }>;
  newDonors: number;
  avgResponseTime: number;
  donationTrends: DonationTrend[];
}

export interface DonationTrend {
  month: string;
  amount: number;
  donors: number;
}

export interface DonorSegmentChart {
  name: string;
  value: number;
  color: string;
}

export interface CampaignPerformance {
  name: string;
  target: number;
  raised: number;
  donors: number;
}

// Communication Types
export interface CommunicationFilters {
  donorId?: string;
  type?: 'email' | 'phone' | 'meeting' | 'letter' | 'sms';
  status?: 'pending' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchQuery?: string;
}

export interface CommunicationStats {
  totalCommunications: number;
  emailsSent: number;
  callsMade: number;
  meetingsHeld: number;
  responseRate: number;
}

// Campaign Types
export interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  type?: 'fundraising' | 'awareness' | 'retention' | 'acquisition' | 'stewardship';
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchQuery?: string;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalRaised: number;
  averageROI: number;
}

// Utility Types
export type DonorFormData = Omit<Donor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'totalDonated' | 'donationCount' | 'averageDonationAmount'>

export interface DonorValidationError {
  field: keyof Donor
  message: string
}

export interface DonorImportResult {
  success: boolean
  processedCount: number
  successCount: number
  failureCount: number
  errors: {
    row: number
    errors: DonorValidationError[]
  }[]
  duplicates: {
    row: number
    existingDonorId: string
    name: string
  }[]
}
