import { 
  Meeting, 
  MeetingAttendee, 
  MeetingAgenda, 
  MeetingMinutes,
  MeetingActionItem,
  CreateMeetingData 
} from '../types/collaboration'
import { toast } from 'sonner'

// Helper function to handle API errors
const handleApiError = (error: any, context: string) => {
  console.error(`${context}:`, error)
  const message = error?.message || `Error in ${context}`
  toast.error(message)
  throw new Error(message)
}

// =====================================================
// Meetings CRUD Operations
// =====================================================

export const meetingsApi = {
  // Get all meetings
  async getMeetings(): Promise<Meeting[]> {
    try {
      // Mock data for now - replace with real Supabase calls when tables are ready
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Aylık Genel Kurul Toplantısı',
          description: 'Dernek faaliyetlerinin değerlendirildiği aylık toplantı',
          start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Dernek Merkezi - Konferans Salonu',
          meeting_type: 'physical',
          status: 'scheduled',
          created_by: 'user1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Bütçe Planlama Toplantısı',
          description: '2024 yılı bütçe planlama ve değerlendirme toplantısı',
          start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          meeting_type: 'online',
          meeting_url: 'https://meet.google.com/abc-def-ghi',
          status: 'scheduled',
          created_by: 'user2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Proje Koordinasyon Toplantısı',
          description: 'Devam eden projelerin koordinasyonu',
          start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() - 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
          location: 'Zoom Toplantısı',
          meeting_type: 'hybrid',
          meeting_url: 'https://zoom.us/j/123456789',
          status: 'completed',
          created_by: 'user3',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      return mockMeetings
    } catch (error) {
      handleApiError(error, 'getMeetings')
      return []
    }
  },

  // Get single meeting
  async getMeeting(id: string): Promise<Meeting | null> {
    try {
      const meetings = await this.getMeetings()
      return meetings.find(m => m.id === id) || null
    } catch (error) {
      handleApiError(error, 'getMeeting')
      return null
    }
  },

  // Create new meeting
  async createMeeting(data: CreateMeetingData): Promise<Meeting> {
    try {
      const newMeeting: Meeting = {
        id: `meeting_${Date.now()}`,
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        meeting_type: data.meeting_type,
        meeting_url: data.meeting_url,
        status: 'scheduled',
        created_by: 'current_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: meeting, _error } = await supabase
      //   .from('meetings')
      //   .insert([newMeeting])
      //   .select()
      //   .single()

      toast.success('Toplantı başarıyla oluşturuldu')
      return newMeeting
    } catch (error) {
      handleApiError(error, 'createMeeting')
      throw error
    }
  },

  // Update meeting
  async updateMeeting(id: string, data: Partial<CreateMeetingData>): Promise<Meeting> {
    try {
      const meetings = await this.getMeetings()
      const existingMeeting = meetings.find(m => m.id === id)
      
      if (!existingMeeting) {
        throw new Error('Toplantı bulunamadı')
      }

      const updatedMeeting: Meeting = {
        ...existingMeeting,
        ...data,
        updated_at: new Date().toISOString()
      }

      // In real implementation, update in Supabase
      // const { _data: meeting, _error } = await supabase
      //   .from('meetings')
      //   .update(data)
      //   .eq('id', id)
      //   .select()
      //   .single()

      toast.success('Toplantı başarıyla güncellendi')
      return updatedMeeting
    } catch (error) {
      handleApiError(error, 'updateMeeting')
      throw error
    }
  },

  // Delete meeting
  async deleteMeeting(_id: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase
      // const { _error } = await supabase
      //   .from('meetings')
      //   .delete()
      //   .eq('id', _id)

      toast.success('Toplantı başarıyla silindi')
    } catch (error) {
      handleApiError(error, 'deleteMeeting')
      throw error
    }
  },

  // =====================================================
  // Meeting Attendees
  // =====================================================

  async getAttendees(meetingId: string): Promise<MeetingAttendee[]> {
    try {
      const mockAttendees: MeetingAttendee[] = [
        {
          id: '1',
          meeting_id: meetingId,
          user_id: 'user1',
          status: 'accepted',
          response_date: new Date().toISOString(),
          notes: 'Katılacağım'
        },
        {
          id: '2',
          meeting_id: meetingId,
          user_id: 'user2',
          status: 'invited',
          notes: ''
        },
        {
          id: '3',
          meeting_id: meetingId,
          user_id: 'user3',
          status: 'declined',
          response_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Başka bir toplantım var'
        }
      ]
      
      return mockAttendees
    } catch (error) {
      handleApiError(error, 'getAttendees')
      return []
    }
  },

  async addAttendee(meetingId: string, userId: string): Promise<MeetingAttendee> {
    try {
      const newAttendee: MeetingAttendee = {
        id: `attendee_${Date.now()}`,
        meeting_id: meetingId,
        user_id: userId,
        status: 'invited'
      }

      toast.success('Katılımcı eklendi')
      return newAttendee
    } catch (error) {
      handleApiError(error, 'addAttendee')
      throw error
    }
  },

  async updateAttendeeStatus(_attendeeId: string, _status: MeetingAttendee['status'], _notes?: string): Promise<void> {
    try {
      // Update attendee status in database
      toast.success('Katılım durumu güncellendi')
    } catch (error) {
      handleApiError(error, 'updateAttendeeStatus')
      throw error
    }
  },

  // =====================================================
  // Meeting Agenda
  // =====================================================

  async getAgenda(meetingId: string): Promise<MeetingAgenda[]> {
    try {
      const mockAgenda: MeetingAgenda[] = [
        {
          id: '1',
          meeting_id: meetingId,
          title: 'Açılış ve Katılımcı Tanıtımı',
          description: 'Toplantının açılışı ve katılımcıların tanıtımı',
          duration_minutes: 15,
          order_index: 1,
          presenter_id: 'user1'
        },
        {
          id: '2',
          meeting_id: meetingId,
          title: 'Geçen Ay Faaliyetlerinin Değerlendirilmesi',
          description: 'Önceki dönem faaliyetlerinin detaylı incelenmesi',
          duration_minutes: 30,
          order_index: 2,
          presenter_id: 'user2'
        },
        {
          id: '3',
          meeting_id: meetingId,
          title: 'Yeni Projeler ve Öneri Sunumları',
          description: 'Gelecek dönem için planlanan projeler',
          duration_minutes: 45,
          order_index: 3,
          presenter_id: 'user3'
        }
      ]
      
      return mockAgenda.sort((a, b) => a.order_index - b.order_index)
    } catch (error) {
      handleApiError(error, 'getAgenda')
      return []
    }
  },

  async addAgendaItem(data: Omit<MeetingAgenda, 'id'>): Promise<MeetingAgenda> {
    try {
      const newItem: MeetingAgenda = {
        id: `agenda_${Date.now()}`,
        ...data
      }

      toast.success('Gündem maddesi eklendi')
      return newItem
    } catch (error) {
      handleApiError(error, 'addAgendaItem')
      throw error
    }
  },

  async updateAgendaItem(_id: string, _data: Partial<MeetingAgenda>): Promise<void> {
    try {
      toast.success('Gündem maddesi güncellendi')
    } catch (error) {
      handleApiError(error, 'updateAgendaItem')
      throw error
    }
  },

  async deleteAgendaItem(_id: string): Promise<void> {
    try {
      toast.success('Gündem maddesi silindi')
    } catch (error) {
      handleApiError(error, 'deleteAgendaItem')
      throw error
    }
  },

  // =====================================================
  // Meeting Minutes
  // =====================================================

  async getMinutes(meetingId: string): Promise<MeetingMinutes[]> {
    try {
      const mockMinutes: MeetingMinutes[] = [
        {
          id: '1',
          meeting_id: meetingId,
          content: 'Toplantı saat 14:00\'da başladı. Tüm katılımcılar mevcut.',
          created_by: 'user1',
          created_at: new Date().toISOString()
        }
      ]
      
      return mockMinutes
    } catch (error) {
      handleApiError(error, 'getMinutes')
      return []
    }
  },

  async addMinutes(meetingId: string, content: string): Promise<MeetingMinutes> {
    try {
      const newMinutes: MeetingMinutes = {
        id: `minutes_${Date.now()}`,
        meeting_id: meetingId,
        content,
        created_by: 'current_user',
        created_at: new Date().toISOString()
      }

      toast.success('Tutanak eklendi')
      return newMinutes
    } catch (error) {
      handleApiError(error, 'addMinutes')
      throw error
    }
  },

  // =====================================================
  // Action Items
  // =====================================================

  async getActionItems(meetingId: string): Promise<MeetingActionItem[]> {
    try {
      const mockActionItems: MeetingActionItem[] = [
        {
          id: '1',
          meeting_id: meetingId,
          title: 'Bütçe raporu hazırlama',
          description: 'Bir sonraki toplantı için detaylı bütçe raporu hazırlanacak',
          assigned_to: 'user2',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          meeting_id: meetingId,
          title: 'Proje önerilerini gözden geçirme',
          description: 'Sunulan proje önerilerinin teknik değerlendirmesi',
          assigned_to: 'user3',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          created_at: new Date().toISOString()
        }
      ]
      
      return mockActionItems
    } catch (error) {
      handleApiError(error, 'getActionItems')
      return []
    }
  },

  async addActionItem(data: Omit<MeetingActionItem, 'id' | 'created_at'>): Promise<MeetingActionItem> {
    try {
      const newActionItem: MeetingActionItem = {
        id: `action_${Date.now()}`,
        ...data,
        created_at: new Date().toISOString()
      }

      toast.success('Eylem maddesi eklendi')
      return newActionItem
    } catch (error) {
      handleApiError(error, 'addActionItem')
      throw error
    }
  },

  async updateActionItemStatus(_id: string, _status: MeetingActionItem['status']): Promise<void> {
    try {
      toast.success('Eylem durumu güncellendi')
    } catch (error) {
      handleApiError(error, 'updateActionItemStatus')
      throw error
    }
  }
}

export default meetingsApi
