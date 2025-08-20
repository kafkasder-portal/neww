import { supabase } from '@lib/supabase'
import type { 
  Volunteer, 
  VolunteerApplication,
  VolunteerShift,
  VolunteerTraining,
  VolunteerEvent,
  VolunteerAnalytics,
  VolunteerDashboard,
  VolunteerSearchFilters
} from '@/types/volunteers'
import { toast } from 'sonner'

export class VolunteerService {
  // Volunteer Management
  static async createVolunteer(data: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      // Check for existing volunteer with same email
      const { data: existingVolunteer } = await supabase
        .from('volunteers')
        .select('id')
        .eq('email', data.email)
        .single()

      if (existingVolunteer) {
        toast.error('Bu e-posta adresi ile zaten bir gönüllü kayıtlı')
        return null
      }

      const { data: created, error } = await supabase
        .from('volunteers')
        .insert([{
          ...data,
          totalHoursWorked: 0,
          totalShiftsCompleted: 0,
          averageRating: 0,
          attendanceRate: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Gönüllü başarıyla kaydedildi')
      return created.id
    } catch (error) {
      console.error('Error creating volunteer:', error)
      toast.error('Gönüllü kaydedilemedi')
      return null
    }
  }

  static async updateVolunteer(id: string, updates: Partial<Volunteer>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user-id'
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Gönüllü bilgileri güncellendi')
      return true
    } catch (error) {
      console.error('Error updating volunteer:', error)
      toast.error('Gönüllü güncellenemedi')
      return false
    }
  }

  static async getVolunteer(id: string): Promise<Volunteer | null> {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching volunteer:', error)
      return null
    }
  }

  static async searchVolunteers(filters: VolunteerSearchFilters, page = 1, pageSize = 20): Promise<{ volunteers: Volunteer[], totalCount: number }> {
    try {
      let query = supabase
        .from('volunteers')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      if (filters.volunteerType && filters.volunteerType.length > 0) {
        query = query.in('volunteerType', filters.volunteerType)
      }

      if (filters.departments && filters.departments.length > 0) {
        query = query.contains('preferredDepartments', filters.departments)
      }

      if (filters.skills && filters.skills.length > 0) {
        query = query.contains('skills', filters.skills)
      }

      if (filters.searchQuery) {
        const searchTerm = filters.searchQuery.trim()
        query = query.or(
          `firstName.ilike.%${searchTerm}%,lastName.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize
      query = query
        .range(startIndex, startIndex + pageSize - 1)
        .order('createdAt', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        volunteers: data || [],
        totalCount: count || 0
      }
    } catch (error) {
      console.error('Error searching volunteers:', error)
      return { volunteers: [], totalCount: 0 }
    }
  }

  // Application Management
  static async createApplication(data: Omit<VolunteerApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data: created, error } = await supabase
        .from('volunteer_applications')
        .insert([{
          ...data,
          applicationDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Gönüllü başvurusu alındı')
      return created.id
    } catch (error) {
      console.error('Error creating application:', error)
      toast.error('Başvuru gönderilemedi')
      return null
    }
  }

  static async reviewApplication(id: string, status: VolunteerApplication['status'], reviewNotes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({
          status,
          reviewNotes,
          reviewedBy: 'current-user-id',
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      const statusText = status === 'approved' ? 'onaylandı' : 
                        status === 'rejected' ? 'reddedildi' : 'güncellendi'
      toast.success(`Başvuru ${statusText}`)
      return true
    } catch (error) {
      console.error('Error reviewing application:', error)
      toast.error('Başvuru durumu güncellenemedi')
      return false
    }
  }

  static async getApplications(status?: string): Promise<VolunteerApplication[]> {
    try {
      let query = supabase
        .from('volunteer_applications')
        .select('*')
        .order('createdAt', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching applications:', error)
      return []
    }
  }

  // Shift Management
  static async createShift(data: Omit<VolunteerShift, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data: created, error } = await supabase
        .from('volunteer_shifts')
        .insert([{
          ...data,
          currentVolunteers: 0,
          status: 'scheduled',
          checkedIn: false,
          checkedOut: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Vardiya oluşturuldu')
      return created.id
    } catch (error) {
      console.error('Error creating shift:', error)
      toast.error('Vardiya oluşturulamadı')
      return null
    }
  }

  static async assignVolunteerToShift(shiftId: string, volunteerId: string): Promise<boolean> {
    try {
      // Check if shift has capacity
      const shift = await this.getShift(shiftId)
      if (!shift) return false

      if (shift.currentVolunteers >= shift.maxVolunteers) {
        toast.error('Vardiya kapasitesi dolu')
        return false
      }

      // Create shift assignment
      const { error: assignError } = await supabase
        .from('volunteer_shift_assignments')
        .insert([{
          shiftId,
          volunteerId,
          assignedAt: new Date().toISOString(),
          status: 'assigned'
        }])

      if (assignError) throw assignError

      // Update shift volunteer count
      const { error: updateError } = await supabase
        .from('volunteer_shifts')
        .update({
          currentVolunteers: shift.currentVolunteers + 1,
          updatedAt: new Date().toISOString()
        })
        .eq('id', shiftId)

      if (updateError) throw updateError

      toast.success('Gönüllü vardiyaya atandı')
      return true
    } catch (error) {
      console.error('Error assigning volunteer to shift:', error)
      toast.error('Gönüllü atama başarısız')
      return false
    }
  }

  static async getShift(id: string): Promise<VolunteerShift | null> {
    try {
      const { data, error } = await supabase
        .from('volunteer_shifts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching shift:', error)
      return null
    }
  }

  static async getShifts(filters?: { status?: string, volunteerId?: string, date?: string }): Promise<VolunteerShift[]> {
    try {
      let query = supabase
        .from('volunteer_shifts')
        .select('*')
        .order('shiftDate', { ascending: true })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.volunteerId) {
        // This would need a join with shift assignments
        // For now, just return all shifts
      }

      if (filters?.date) {
        query = query.eq('shiftDate', filters.date)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching shifts:', error)
      return []
    }
  }

  // Check-in/Check-out
  static async checkInVolunteer(shiftId: string, volunteerId: string): Promise<boolean> {
    try {
      // Update shift assignment
      const { error } = await supabase
        .from('volunteer_shift_assignments')
        .update({
          checkedIn: true,
          checkInTime: new Date().toISOString(),
          status: 'checked_in'
        })
        .eq('shiftId', shiftId)
        .eq('volunteerId', volunteerId)

      if (error) throw error

      toast.success('Giriş kaydı yapıldı')
      return true
    } catch (error) {
      console.error('Error checking in volunteer:', error)
      toast.error('Giriş kaydı başarısız')
      return false
    }
  }

  static async checkOutVolunteer(shiftId: string, volunteerId: string, rating?: number, feedback?: string): Promise<boolean> {
    try {
      const checkOutTime = new Date()
      
      // Get check-in time to calculate hours worked
      const { data: assignment } = await supabase
        .from('volunteer_shift_assignments')
        .select('checkInTime')
        .eq('shiftId', shiftId)
        .eq('volunteerId', volunteerId)
        .single()

      let hoursWorked = 0
      if (assignment?.checkInTime) {
        const checkInTime = new Date(assignment.checkInTime)
        hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
      }

      // Update shift assignment
      const { error } = await supabase
        .from('volunteer_shift_assignments')
        .update({
          checkedOut: true,
          checkOutTime: checkOutTime.toISOString(),
          hoursWorked,
          performanceRating: rating,
          feedback,
          status: 'completed'
        })
        .eq('shiftId', shiftId)
        .eq('volunteerId', volunteerId)

      if (error) throw error

      // Update volunteer statistics
      await this.updateVolunteerStats(volunteerId, hoursWorked, rating)

      toast.success('Çıkış kaydı yapıldı')
      return true
    } catch (error) {
      console.error('Error checking out volunteer:', error)
      toast.error('Çıkış kaydı başarısız')
      return false
    }
  }

  private static async updateVolunteerStats(volunteerId: string, hoursWorked: number, rating?: number): Promise<void> {
    try {
      const volunteer = await this.getVolunteer(volunteerId)
      if (!volunteer) return

      const newTotalHours = volunteer.totalHoursWorked + hoursWorked
      const newTotalShifts = volunteer.totalShiftsCompleted + 1
      
      let newAverageRating = volunteer.averageRating
      if (rating && rating > 0) {
        // Calculate new average rating
        const totalRatingPoints = volunteer.averageRating * volunteer.totalShiftsCompleted + rating
        newAverageRating = totalRatingPoints / newTotalShifts
      }

      await this.updateVolunteer(volunteerId, {
        totalHoursWorked: newTotalHours,
        totalShiftsCompleted: newTotalShifts,
        averageRating: newAverageRating,
        lastActivityDate: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error updating volunteer stats:', error)
    }
  }

  // Training Management
  static async createTraining(data: Omit<VolunteerTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data: created, error } = await supabase
        .from('volunteer_trainings')
        .insert([{
          ...data,
          currentParticipants: 0,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Eğitim programı oluşturuldu')
      return created.id
    } catch (error) {
      console.error('Error creating training:', error)
      toast.error('Eğitim oluşturulamadı')
      return null
    }
  }

  static async enrollVolunteerInTraining(trainingId: string, volunteerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteer_training_enrollments')
        .insert([{
          trainingId,
          volunteerId,
          enrollmentDate: new Date().toISOString().split('T')[0],
          enrollmentStatus: 'enrolled',
          passed: false,
          certificateIssued: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])

      if (error) throw error

      toast.success('Eğitime kayıt yapıldı')
      return true
    } catch (error) {
      console.error('Error enrolling in training:', error)
      toast.error('Eğitim kaydı başarısız')
      return false
    }
  }

  // Dashboard Analytics
  static async getDashboardData(): Promise<VolunteerDashboard | null> {
    try {
      // Get basic volunteer statistics
      const { data: volunteers } = await supabase
        .from('volunteers')
        .select('status, volunteerType, totalHoursWorked, joinDate, birthDate')

      if (!volunteers) return null

      const activeVolunteers = volunteers.filter(v => v.status === 'active').length
      const currentMonth = new Date().toISOString().slice(0, 7)
      
      const newApplicationsThisWeek = 0 // Would need to query applications table
      const upcomingShifts = 0 // Would need to query shifts table
      const hoursWorkedThisMonth = volunteers
        .filter(v => v.status === 'active')
        .reduce((sum, v) => sum + (v.totalHoursWorked || 0), 0)

      // Calculate average age
      const validBirthDates = volunteers
        .filter(v => v.birthDate)
        .map(v => new Date().getFullYear() - new Date(v.birthDate).getFullYear())
      
      const averageAge = validBirthDates.length > 0 
        ? validBirthDates.reduce((sum, age) => sum + age, 0) / validBirthDates.length 
        : 0

      return {
        totalActiveVolunteers: activeVolunteers,
        newApplicationsThisWeek,
        upcomingShifts,
        hoursWorkedThisMonth,
        averageVolunteerAge: Math.round(averageAge),
        mostPopularRole: 'Yardım Dağıtımı', // Mock data
        highestRatedDepartment: 'Bağış Toplama', // Mock data
        retentionRate: 85, // Mock data
        recentApplications: [], // Would need to query applications
        recentShifts: [], // Would need to query shifts
        upcomingEvents: [], // Would need to query events
        alerts: [] // Generate based on business rules
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return null
    }
  }

  // Event Management
  static async createEvent(data: Omit<VolunteerEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data: created, error } = await supabase
        .from('volunteer_events')
        .insert([{
          ...data,
          registeredVolunteers: 0,
          status: 'planning',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Etkinlik oluşturuldu')
      return created.id
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Etkinlik oluşturulamadı')
      return null
    }
  }

  static async registerForEvent(eventId: string, volunteerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteer_event_registrations')
        .insert([{
          eventId,
          volunteerId,
          registrationDate: new Date().toISOString().split('T')[0],
          registrationStatus: 'registered',
          attended: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])

      if (error) throw error

      toast.success('Etkinliğe kayıt yapıldı')
      return true
    } catch (error) {
      console.error('Error registering for event:', error)
      toast.error('Etkinlik kaydı başarısız')
      return false
    }
  }

  // Background Check Management
  static async updateBackgroundCheck(volunteerId: string, status: boolean, expiryDate?: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({
          backgroundCheckCompleted: status,
          backgroundCheckDate: status ? new Date().toISOString().split('T')[0] : null,
          backgroundCheckExpiry: expiryDate || null,
          backgroundCheckNotes: notes || null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', volunteerId)

      if (error) throw error

      toast.success('Geçmiş kontrolü güncellendi')
      return true
    } catch (error) {
      console.error('Error updating background check:', error)
      toast.error('Geçmiş kontrolü güncellenemedi')
      return false
    }
  }

  // Bulk Operations
  static async bulkUpdateVolunteerStatus(volunteerIds: string[], status: Volunteer['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({
          status,
          updatedAt: new Date().toISOString()
        })
        .in('id', volunteerIds)

      if (error) throw error

      const statusText = status === 'active' ? 'aktif' : 
                        status === 'inactive' ? 'pasif' : 
                        status === 'on_leave' ? 'izinli' : 'sonlandırıldı'
      toast.success(`${volunteerIds.length} gönüllü durumu ${statusText} olarak güncellendi`)
      return true
    } catch (error) {
      console.error('Error bulk updating volunteers:', error)
      toast.error('Toplu güncelleme başarısız')
      return false
    }
  }
}
