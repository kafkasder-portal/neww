import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Edit, 
  Trash2, 
  X, 
  UserPlus, 
  FileText,
  CheckCircle,
  XCircle,
  Target,
  MessageSquare,
  Plus,
  Save
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { meetingsApi } from '../../api/meetings'
import { Meeting, MeetingAttendee, MeetingAgenda, MeetingMinutes, MeetingActionItem } from '@/types/meetings'
// import { usePermissions } from '@hooks/usePermissions' // Temporarily disabled
import { useAuthStore } from '@store/auth'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface MeetingDetailModalProps {
  meetingId: string
  isOpen: boolean
  onClose: () => void
  onEdit?: (meeting: Meeting) => void
  onDelete?: (meetingId: string) => void
}

export default function MeetingDetailModal({
  meetingId,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: MeetingDetailModalProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [attendees, setAttendees] = useState<MeetingAttendee[]>([])
  const [agenda, setAgenda] = useState<MeetingAgenda[]>([])
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([])
  const [actionItems, setActionItems] = useState<MeetingActionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'attendees' | 'agenda' | 'minutes' | 'actions'>('details')
  
  // Form states
  const [newMinutes, setNewMinutes] = useState('')
  const [addingMinutes, setAddingMinutes] = useState(false)
  const [newActionItem, setNewActionItem] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: ''
  })
  const [addingActionItem, setAddingActionItem] = useState(false)
  
  // const permissions = usePermissions()
  const { user } = useAuthStore()
  const canEditMeeting = true
  const canDeleteMeeting = true
  const canManageMeeting = true

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchMeetingDetails()
    }
  }, [isOpen, meetingId])

  const fetchMeetingDetails = async () => {
    setLoading(true)
    try {
      const [meetingData, attendeesData, agendaData, minutesData, actionItemsData] = await Promise.all([
        meetingsApi.getMeeting(meetingId),
        meetingsApi.getAttendees(meetingId),
        meetingsApi.getAgenda(meetingId),
        meetingsApi.getMinutes(meetingId),
        meetingsApi.getActionItems(meetingId)
      ])

      setMeeting(meetingData)
      setAttendees(attendeesData)
      setAgenda(agendaData)
      setMinutes(minutesData)
      setActionItems(actionItemsData)
    } catch (error) {
      console.error('Failed to fetch meeting details:', error)
      toast.error('Toplantı bilgileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAttendeeResponse = async (status: MeetingAttendee['status']) => {
    if (!meeting || !user) return

    try {
      await meetingsApi.updateAttendeeStatus('temp_id', status)
      toast.success('Katılım durumunuz güncellendi')
      fetchMeetingDetails()
    } catch (error) {
      console.error('Failed to update attendance:', error)
      toast.error('Katılım durumu güncellenirken hata oluştu')
    }
  }

  const handleDelete = async () => {
    if (!meeting) return

    if (window.confirm('Bu toplantıyı silmek istediğinizden emin misiniz?')) {
      try {
        await meetingsApi.deleteMeeting(meetingId)
        toast.success('Toplantı silindi')
        onDelete?.(meetingId)
        onClose()
      } catch (error) {
        console.error('Failed to delete meeting:', error)
        toast.error('Toplantı silinirken hata oluştu')
      }
    }
  }

  const handleAddMinutes = async () => {
    if (!newMinutes.trim()) return

    try {
      const newMinutesData = await meetingsApi.addMinutes(meetingId, newMinutes)
      setMinutes(prev => [...prev, newMinutesData])
      setNewMinutes('')
      setAddingMinutes(false)
      toast.success('Tutanak eklendi')
    } catch (error) {
      console.error('Failed to add minutes:', error)
      toast.error('Tutanak eklenirken hata oluştu')
    }
  }

  const handleAddActionItem = async () => {
    if (!newActionItem.title.trim() || !newActionItem.assigned_to) return

    try {
      const actionItemData = {
        meeting_id: meetingId,
        title: newActionItem.title,
        description: newActionItem.description || undefined,
        assigned_to: newActionItem.assigned_to,
        due_date: newActionItem.due_date || undefined,
        status: 'pending' as const
      }

      const newAction = await meetingsApi.addActionItem(actionItemData)
      setActionItems(prev => [...prev, newAction])
      setNewActionItem({ title: '', description: '', assigned_to: '', due_date: '' })
      setAddingActionItem(false)
      toast.success('Eylem maddesi eklendi')
    } catch (error) {
      console.error('Failed to add action item:', error)
      toast.error('Eylem maddesi eklenirken hata oluştu')
    }
  }

  const handleActionItemStatusChange = async (actionId: string, status: MeetingActionItem['status']) => {
    try {
      await meetingsApi.updateActionItemStatus(actionId, status)
      setActionItems(prev => 
        prev.map(action => 
          action.id === actionId ? { ...action, status } : action
        )
      )
    } catch (error) {
      console.error('Failed to update action status:', error)
      toast.error('Eylem durumu güncellenirken hata oluştu')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Toplantı Detayları</h2>
          <div className="flex items-center space-x-2">
            {meeting && canEditMeeting && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit?.(meeting)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Düzenle
              </Button>
            )}
            {canDeleteMeeting && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Yükleniyor...</p>
          </div>
        ) : meeting ? (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
              {[
                { id: 'details', label: 'Detaylar', icon: FileText },
                { id: 'attendees', label: 'Katılımcılar', icon: Users, count: attendees.length },
                { id: 'agenda', label: 'Gündem', icon: Calendar, count: agenda.length },
                { id: 'minutes', label: 'Tutanak', icon: MessageSquare, count: minutes.length },
                { id: 'actions', label: 'Eylemler', icon: Target, count: actionItems.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">{meeting.title}</h3>
                    {meeting.description && (
                      <p className="text-muted-foreground mb-4">{meeting.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(meeting.start_date), 'dd MMMM yyyy', { locale: tr })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(meeting.start_date), 'HH:mm')} - {format(new Date(meeting.end_date), 'HH:mm')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {meeting.meeting_type === 'online' ? (
                          <Video className="h-4 w-4 text-blue-500" />
                        ) : meeting.meeting_type === 'hybrid' ? (
                          <>
                            <MapPin className="h-4 w-4 text-green-500" />
                            <Video className="h-4 w-4 text-blue-500" />
                          </>
                        ) : (
                          <MapPin className="h-4 w-4 text-green-500" />
                        )}
                        <span className="capitalize">
                          {meeting.meeting_type === 'physical' ? 'Fiziksel' : 
                           meeting.meeting_type === 'online' ? 'Online' : 'Hibrit'}
                        </span>
                      </div>
                      
                      {meeting.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Meeting URL */}
                    {meeting.meeting_url && (
                      <div className="mt-4">
                        <a 
                          href={meeting.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Toplantıya Katıl
                        </a>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        meeting.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {meeting.status === 'scheduled' ? 'Planlandı' :
                         meeting.status === 'ongoing' ? 'Devam Ediyor' :
                         meeting.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                      </span>
                    </div>
                  </Card>

                  {/* Attendance Response */}
                  {meeting.status === 'scheduled' && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Katılım Durumunuz</h4>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAttendeeResponse('accepted')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Katılacağım
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAttendeeResponse('declined')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Katılamayacağım
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAttendeeResponse('maybe')}
                        >
                          Belki
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'attendees' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Katılımcılar ({attendees.length})
                    </h3>
                    {canManageMeeting && (
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Katılımcı Ekle
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-3">
                    {attendees.map((attendee) => (
                      <Card key={attendee.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                              U
                            </div>
                            <div>
                              <div className="font-medium">Kullanıcı {attendee.user_id}</div>
                              {attendee.notes && (
                                <div className="text-sm text-muted-foreground">{attendee.notes}</div>
                              )}
                              {attendee.response_date && (
                                <div className="text-xs text-muted-foreground">
                                  Yanıt: {format(new Date(attendee.response_date), 'dd MMM HH:mm', { locale: tr })}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            attendee.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            attendee.status === 'declined' ? 'bg-red-100 text-red-800' :
                            attendee.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                            attendee.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                            attendee.status === 'absent' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {attendee.status === 'accepted' ? 'Kabul Etti' :
                             attendee.status === 'declined' ? 'Reddetti' :
                             attendee.status === 'maybe' ? 'Belki' :
                             attendee.status === 'attended' ? 'Katıldı' :
                             attendee.status === 'absent' ? 'Katılmadı' :
                             'Davet Edildi'}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'agenda' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Gündem ({agenda.length} madde)</h3>
                    {canManageMeeting && (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Gündem Ekle
                      </Button>
                    )}
                  </div>
                  
                  {agenda.length > 0 ? (
                    <div className="space-y-3">
                      {agenda.map((item, index) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{item.title}</h4>
                              {item.description && (
                                <p className="text-muted-foreground mt-2">{item.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-3">
                                {item.duration_minutes && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {item.duration_minutes} dakika
                                  </div>
                                )}
                                {item.presenter_id && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 mr-1" />
                                    Sunan: Kullanıcı {item.presenter_id}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz gündem maddesi eklenmemiş</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'minutes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Toplantı Tutanağı</h3>
                    {canManageMeeting && !addingMinutes && (
                      <Button size="sm" onClick={() => setAddingMinutes(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tutanak Ekle
                      </Button>
                    )}
                  </div>

                  {addingMinutes && (
                    <Card className="p-4">
                      <div className="space-y-3">
                        <textarea
                          value={newMinutes}
                          onChange={(e) => setNewMinutes(e.target.value)}
                          placeholder="Tutanak metni..."
                          className="w-full h-32 p-3 border rounded-md resize-none"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddMinutes}>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setAddingMinutes(false)
                            setNewMinutes('')
                          }}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {minutes.length > 0 ? (
                    <div className="space-y-3">
                      {minutes.map((minute) => (
                        <Card key={minute.id} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(minute.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Yazan: Kullanıcı {minute.created_by}
                              </span>
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap">{minute.content}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : !addingMinutes && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz tutanak eklenmemiş</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Eylem Maddeleri</h3>
                    {canManageMeeting && !addingActionItem && (
                      <Button size="sm" onClick={() => setAddingActionItem(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Eylem Ekle
                      </Button>
                    )}
                  </div>

                  {addingActionItem && (
                    <Card className="p-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newActionItem.title}
                          onChange={(e) => setNewActionItem(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Eylem başlığı..."
                          className="w-full p-3 border rounded-md"
                        />
                        <textarea
                          value={newActionItem.description}
                          onChange={(e) => setNewActionItem(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Açıklama..."
                          className="w-full h-20 p-3 border rounded-md resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={newActionItem.assigned_to}
                            onChange={(e) => setNewActionItem(prev => ({ ...prev, assigned_to: e.target.value }))}
                            placeholder="Atanan kişi ID..."
                            className="p-3 border rounded-md"
                          />
                          <input
                            type="date"
                            value={newActionItem.due_date}
                            onChange={(e) => setNewActionItem(prev => ({ ...prev, due_date: e.target.value }))}
                            className="p-3 border rounded-md"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddActionItem}>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setAddingActionItem(false)
                            setNewActionItem({ title: '', description: '', assigned_to: '', due_date: '' })
                          }}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {actionItems.length > 0 ? (
                    <div className="space-y-3">
                      {actionItems.map((action) => (
                        <Card key={action.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{action.title}</h4>
                                {action.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                action.status === 'completed' ? 'bg-green-100 text-green-800' :
                                action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                action.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {action.status === 'completed' ? 'Tamamlandı' :
                                 action.status === 'in_progress' ? 'Devam Ediyor' :
                                 action.status === 'cancelled' ? 'İptal Edildi' : 'Bekliyor'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>Atanan: Kullanıcı {action.assigned_to}</span>
                                {action.due_date && (
                                  <span>Son Tarih: {format(new Date(action.due_date), 'dd MMM yyyy', { locale: tr })}</span>
                                )}
                              </div>
                              
                              {canManageMeeting && action.status !== 'completed' && (
                                <div className="flex space-x-1">
                                  {action.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleActionItemStatusChange(action.id, 'in_progress')}
                                    >
                                      Başlat
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleActionItemStatusChange(action.id, 'completed')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Tamamla
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : !addingActionItem && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz eylem maddesi eklenmemiş</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Toplantı bulunamadı
          </div>
        )}
      </div>
    </div>
  )
}
