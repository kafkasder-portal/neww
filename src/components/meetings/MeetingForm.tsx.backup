import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, MapPin, Users, Video, Save, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { UserSelector } from '@/components/ui/UserSelector'
import { meetingsApi } from '@/api/meetings'
import { CreateMeetingData } from '@/types/meetings'
// import { usePermissions } from '@/hooks/usePermissions' // Temporarily disabled
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

const meetingSchema = z.object({
  title: z.string().min(1, 'Toplantı başlığı zorunludur'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Başlangıç tarihi zorunludur'),
  end_date: z.string().min(1, 'Bitiş tarihi zorunludur'),
  location: z.string().optional(),
  meeting_type: z.enum(['physical', 'online', 'hybrid']),
  meeting_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  attendees: z.array(z.string()).optional()
}).refine((data) => {
  const start = new Date(data.start_date)
  const end = new Date(data.end_date)
  return end > start
}, {
  message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  path: ['end_date']
})

type MeetingFormData = z.infer<typeof meetingSchema>

interface MeetingFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<CreateMeetingData>
  isEditMode?: boolean
  meetingId?: string
}

export default function MeetingForm({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false,
  meetingId
}: MeetingFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(initialData?.attendee_ids || [])
  // const permissions = usePermissions()
  const { user: currentUser } = useAuthStore()
  
  const canCreateMeeting = true
  const canEditMeeting = true

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : '',
      end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : '',
      location: initialData?.location || '',
      meeting_type: initialData?.meeting_type || 'physical',
      meeting_url: initialData?.meeting_url || '',
      attendees: selectedAttendees
    }
  })

  const meetingType = watch('meeting_type')

  const onSubmit = async (data: MeetingFormData) => {
    if ((!canCreateMeeting && !isEditMode) || (!canEditMeeting && isEditMode)) {
      toast.error('Bu işlem için yetkiniz bulunmamaktadır')
      return
    }

    setLoading(true)
    try {
      const meetingData: CreateMeetingData = {
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        location: data.location,
        meeting_type: data.meeting_type,
        meeting_url: data.meeting_url,
        status: 'scheduled',
        created_by: currentUser?.id || '',
        attendee_ids: selectedAttendees
      }

      if (isEditMode && meetingId) {
        await meetingsApi.updateMeeting(meetingId, meetingData)
        toast.success('Toplantı güncellendi')
      } else {
        await meetingsApi.createMeeting(meetingData)
        toast.success('Toplantı oluşturuldu')
      }

      onSuccess?.()
    } catch (error) {
      console.error('Meeting operation failed:', error)
      toast.error(isEditMode ? 'Toplantı güncellenirken hata oluştu' : 'Toplantı oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAttendeesChange = (userIds: string[]) => {
    setSelectedAttendees(userIds)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Toplantı Düzenle' : 'Yeni Toplantı Oluştur'}
        </h2>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Başlık */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Toplantı Başlığı *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Toplantı başlığını giriniz"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Açıklama
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Toplantı açıklamasını giriniz"
          />
        </div>

        {/* Tarih ve Saat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Başlangıç Tarihi *
            </label>
            <input
              {...register('start_date')}
              type="datetime-local"
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Bitiş Tarihi *
            </label>
            <input
              {...register('end_date')}
              type="datetime-local"
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Toplantı Türü */}
        <div>
          <label htmlFor="meeting_type" className="block text-sm font-medium mb-2">
            Toplantı Türü *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted">
              <input
                {...register('meeting_type')}
                type="radio"
                value="physical"
                className="mr-2"
              />
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span>Fiziksel</span>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted">
              <input
                {...register('meeting_type')}
                type="radio"
                value="online"
                className="mr-2"
              />
              <Video className="h-4 w-4 mr-2 text-blue-500" />
              <span>Online</span>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted">
              <input
                {...register('meeting_type')}
                type="radio"
                value="hybrid"
                className="mr-2"
              />
              <MapPin className="h-4 w-4 mr-1 text-green-500" />
              <Video className="h-4 w-4 mr-2 text-blue-500" />
              <span>Hibrit</span>
            </label>
          </div>
        </div>

        {/* Konum/Link */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            {meetingType === 'online' ? 'Toplantı Linki' : 'Konum'}
          </label>
          {meetingType === 'online' ? (
            <input
              {...register('meeting_url')}
              type="url"
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="https://zoom.us/j/123456789"
            />
          ) : (
            <input
              {...register('location')}
              type="text"
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Toplantı konumunu giriniz"
            />
          )}
          {meetingType === 'hybrid' && (
            <div className="mt-2">
              <input
                {...register('meeting_url')}
                type="url"
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Online katılım linki (opsiyonel)"
              />
            </div>
          )}
          {errors.meeting_url && (
            <p className="text-red-500 text-sm mt-1">{errors.meeting_url.message}</p>
          )}
        </div>

        {/* Katılımcılar */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="h-4 w-4 inline mr-2" />
            Katılımcılar
          </label>
          <UserSelector
            selectedUserIds={selectedAttendees}
            onSelectionChange={handleAttendeesChange}
            placeholder="Katılımcı ara ve seç..."
            excludeUserIds={currentUser?.id ? [currentUser.id] : []}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
