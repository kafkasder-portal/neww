// Volunteer Management Types for Charity Management System

export interface Volunteer {
  id: string
  
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  alternativePhone?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  nationalId?: string
  
  // Address Information
  address: string
  city: string
  district: string
  postalCode?: string
  country: string
  
  // Emergency Contact
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  
  // Volunteer Information
  volunteerType: 'regular' | 'event_based' | 'seasonal' | 'professional' | 'student'
  status: 'active' | 'inactive' | 'on_leave' | 'terminated' | 'blacklisted'
  joinDate: string
  terminationDate?: string
  terminationReason?: string
  
  // Skills and Interests
  skills: string[]
  interests: string[]
  languages: string[]
  education: string
  profession?: string
  
  // Availability
  availabilityDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  availabilityTimeSlots: TimeSlot[]
  maxHoursPerWeek?: number
  canWorkWeekends: boolean
  canWorkEvenings: boolean
  
  // Experience and Training
  previousVolunteerExperience?: string
  organizationExperience: string[]
  trainingCompleted: string[]
  certifications: string[]
  
  // Background Check
  backgroundCheckRequired: boolean
  backgroundCheckCompleted: boolean
  backgroundCheckDate?: string
  backgroundCheckExpiry?: string
  backgroundCheckNotes?: string
  
  // Preferences
  preferredRoles: string[]
  preferredDepartments: string[]
  communicationPreferences: {
    email: boolean
    sms: boolean
    phone: boolean
    whatsapp: boolean
  }
  newsletterSubscribed: boolean
  
  // Performance Metrics
  totalHoursWorked: number
  totalShiftsCompleted: number
  averageRating: number
  lastActivityDate?: string
  attendanceRate: number
  
  // Additional Information
  motivation?: string
  notes?: string
  tags: string[]
  
  // References
  references: VolunteerReference[]
  
  // System Fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface TimeSlot {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string // HH:MM format
  endTime: string // HH:MM format
}

export interface VolunteerReference {
  id: string
  volunteerId: string
  name: string
  organization?: string
  position?: string
  phone: string
  email?: string
  relationship: string
  contacted: boolean
  contactedDate?: string
  contactedBy?: string
  feedback?: string
  recommendation: 'excellent' | 'good' | 'satisfactory' | 'not_recommended'
}

export interface VolunteerShift {
  id: string
  volunteerId: string
  
  // Shift Details
  title: string
  description?: string
  department: string
  location: string
  shiftType: 'regular' | 'event' | 'emergency' | 'training'
  
  // Scheduling
  shiftDate: string
  startTime: string
  endTime: string
  duration: number // in minutes
  
  // Requirements
  requiredSkills: string[]
  minVolunteers: number
  maxVolunteers: number
  currentVolunteers: number
  
  // Coordinator
  coordinatorId?: string
  coordinatorName?: string
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  cancellationReason?: string
  
  // Check-in/Check-out
  checkedIn: boolean
  checkInTime?: string
  checkedOut: boolean
  checkOutTime?: string
  actualHoursWorked?: number
  
  // Rating and Feedback
  performanceRating?: number
  feedback?: string
  supervisorFeedback?: string
  
  // Additional Information
  notes?: string
  attachments?: string[]
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface VolunteerApplication {
  id: string
  
  // Applicant Information
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Application Details
  applicationDate: string
  preferredRoles: string[]
  availability: TimeSlot[]
  motivation: string
  experience?: string
  skills: string[]
  
  // Application Status
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected' | 'withdrawn'
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
  
  // Interview
  interviewScheduled: boolean
  interviewDate?: string
  interviewTime?: string
  interviewType?: 'in_person' | 'phone' | 'video' | 'group'
  interviewerName?: string
  interviewNotes?: string
  interviewScore?: number
  
  // Decision
  decisionDate?: string
  decisionBy?: string
  approvalNotes?: string
  
  // Follow-up
  orientationScheduled: boolean
  orientationDate?: string
  onboardingCompleted: boolean
  
  createdAt: string
  updatedAt: string
}

export interface VolunteerTraining {
  id: string
  
  // Training Details
  title: string
  description: string
  trainingType: 'orientation' | 'skills' | 'safety' | 'leadership' | 'specialized'
  department?: string
  
  // Scheduling
  trainingDate: string
  startTime: string
  endTime: string
  duration: number // in minutes
  location: string
  
  // Training Content
  curriculum: string[]
  materials: string[]
  prerequisites?: string[]
  
  // Capacity
  maxParticipants: number
  currentParticipants: number
  
  // Instructor
  instructorName: string
  instructorId?: string
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  
  // Requirements
  isMandatory: boolean
  certificateIssued: boolean
  validityPeriod?: number // in months
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface VolunteerTrainingEnrollment {
  id: string
  trainingId: string
  volunteerId: string
  
  // Enrollment Details
  enrollmentDate: string
  enrollmentStatus: 'enrolled' | 'waitlisted' | 'attended' | 'no_show' | 'cancelled'
  
  // Attendance
  attended: boolean
  attendanceTime?: string
  
  // Performance
  participationScore?: number
  testScore?: number
  passed: boolean
  certificateIssued: boolean
  certificateDate?: string
  certificateNumber?: string
  
  // Feedback
  feedback?: string
  instructorFeedback?: string
  
  notes?: string
  
  createdAt: string
  updatedAt: string
}

export interface VolunteerEvent {
  id: string
  
  // Event Details
  title: string
  description: string
  eventType: 'fundraising' | 'community_service' | 'awareness' | 'emergency_response' | 'administrative'
  
  // Scheduling
  eventDate: string
  startTime: string
  endTime: string
  duration: number
  
  // Location
  location: string
  address?: string
  
  // Requirements
  requiredVolunteers: number
  registeredVolunteers: number
  requiredSkills: string[]
  minimumAge?: number
  
  // Coordinator
  coordinatorId: string
  coordinatorName: string
  
  // Status
  status: 'planning' | 'open_registration' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled'
  
  // Registration
  registrationDeadline?: string
  allowWaitlist: boolean
  
  // Additional Information
  materials?: string[]
  instructions?: string
  dresscode?: string
  notes?: string
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface VolunteerEventRegistration {
  id: string
  eventId: string
  volunteerId: string
  
  // Registration Details
  registrationDate: string
  registrationStatus: 'registered' | 'waitlisted' | 'confirmed' | 'no_show' | 'cancelled'
  
  // Participation
  attended: boolean
  checkInTime?: string
  checkOutTime?: string
  hoursWorked?: number
  
  // Role Assignment
  assignedRole?: string
  assignedTask?: string
  
  // Performance
  performanceRating?: number
  feedback?: string
  supervisorFeedback?: string
  
  notes?: string
  
  createdAt: string
  updatedAt: string
}

export interface VolunteerDepartment {
  id: string
  name: string
  description: string
  
  // Management
  managerId?: string
  managerName?: string
  coordinators: string[]
  
  // Volunteers
  activeVolunteers: number
  totalVolunteers: number
  
  // Requirements
  requiredSkills: string[]
  backgroundCheckRequired: boolean
  minimumAge?: number
  
  // Status
  isActive: boolean
  
  createdAt: string
  updatedAt: string
}

export interface VolunteerRole {
  id: string
  title: string
  description: string
  department: string
  
  // Requirements
  requiredSkills: string[]
  minimumExperience?: string
  backgroundCheckRequired: boolean
  minimumAge?: number
  
  // Time Commitment
  timeCommitment: string
  expectedHoursPerWeek?: number
  
  // Responsibilities
  responsibilities: string[]
  
  // Status
  isActive: boolean
  positionsAvailable: number
  currentVolunteers: number
  
  createdAt: string
  updatedAt: string
}

// Analytics and Dashboard Types
export interface VolunteerAnalytics {
  // Overview Metrics
  totalVolunteers: number
  activeVolunteers: number
  newVolunteersThisMonth: number
  volunteerRetentionRate: number
  
  // Activity Metrics
  totalHoursThisMonth: number
  totalShiftsThisMonth: number
  averageHoursPerVolunteer: number
  attendanceRate: number
  
  // Department Distribution
  volunteersByDepartment: {
    department: string
    count: number
    percentage: number
  }[]
  
  // Age Demographics
  ageDistribution: {
    range: string
    count: number
    percentage: number
  }[]
  
  // Skills Analysis
  topSkills: {
    skill: string
    count: number
  }[]
  
  // Trends
  monthlyTrends: {
    month: string
    newVolunteers: number
    activeVolunteers: number
    totalHours: number
    retentionRate: number
  }[]
  
  // Performance Metrics
  topPerformers: {
    volunteerId: string
    name: string
    totalHours: number
    averageRating: number
    shiftsCompleted: number
  }[]
  
  lastCalculated: string
}

export interface VolunteerDashboard {
  // Key Metrics
  totalActiveVolunteers: number
  newApplicationsThisWeek: number
  upcomingShifts: number
  hoursWorkedThisMonth: number
  
  // Quick Stats
  averageVolunteerAge: number
  mostPopularRole: string
  highestRatedDepartment: string
  retentionRate: number
  
  // Recent Activities
  recentApplications: {
    id: string
    name: string
    email: string
    appliedDate: string
    status: string
  }[]
  
  recentShifts: {
    id: string
    title: string
    volunteer: string
    date: string
    status: string
  }[]
  
  upcomingEvents: {
    id: string
    title: string
    date: string
    registeredVolunteers: number
    requiredVolunteers: number
  }[]
  
  // Alerts
  alerts: {
    type: 'background_check_expiring' | 'training_due' | 'low_attendance' | 'application_pending'
    message: string
    count: number
    severity: 'low' | 'medium' | 'high' | 'critical'
    actionRequired: boolean
  }[]
}

// Search and Filter Types
export interface VolunteerSearchFilters {
  status?: ('active' | 'inactive' | 'on_leave' | 'terminated')[]
  volunteerType?: ('regular' | 'event_based' | 'seasonal' | 'professional' | 'student')[]
  departments?: string[]
  skills?: string[]
  availability?: {
    days?: string[]
    timeSlots?: TimeSlot[]
  }
  ageRange?: {
    min?: number
    max?: number
  }
  joinDateRange?: {
    start?: string
    end?: string
  }
  backgroundCheckStatus?: 'required' | 'completed' | 'expired' | 'not_required'
  searchQuery?: string
}

// Form Types
export interface VolunteerFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate?: string
  gender?: string
  
  // Address
  address: string
  city: string
  district: string
  
  // Emergency Contact
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  
  // Volunteer Information
  volunteerType: string
  skills: string[]
  interests: string[]
  languages: string[]
  preferredRoles: string[]
  availabilityDays: string[]
  
  // Experience
  previousExperience?: string
  motivation?: string
  
  // Preferences
  maxHoursPerWeek?: number
  canWorkWeekends: boolean
  canWorkEvenings: boolean
  
  // Communication
  communicationPreferences: {
    email: boolean
    sms: boolean
    phone: boolean
  }
  
  // Legal
  backgroundCheckConsent: boolean
  dataProcessingConsent: boolean
  termsAccepted: boolean
}

export interface ShiftFormData {
  title: string
  description?: string
  department: string
  location: string
  shiftDate: string
  startTime: string
  endTime: string
  minVolunteers: number
  maxVolunteers: number
  requiredSkills: string[]
  notes?: string
}

// Utility Types
export type VolunteerStatus = Volunteer['status']
export type ApplicationStatus = VolunteerApplication['status']
export type ShiftStatus = VolunteerShift['status']
export type TrainingStatus = VolunteerTraining['status']

export interface VolunteerValidationError {
  field: string
  message: string
}

export interface BulkVolunteerOperation {
  operation: 'activate' | 'deactivate' | 'send_message' | 'assign_training' | 'update_department'
  volunteerIds: string[]
  data?: any
}

export interface VolunteerReport {
  reportType: 'hours_summary' | 'attendance' | 'performance' | 'demographics' | 'training_completion'
  dateRange: {
    start: string
    end: string
  }
  filters?: VolunteerSearchFilters
  format: 'pdf' | 'excel' | 'csv'
  data: any
  generatedAt: string
  generatedBy: string
}
