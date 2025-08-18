import { useState, useEffect } from 'react'
import { 
  Activity, 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  Users,
  Settings
} from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useAuthStore } from '@store/auth'
import { realtimeService } from '@services/realtimeService'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface ActivityItem {
  id: string
  type: 'task_update' | 'meeting_created' | 'message_sent' | 'user_joined' | 'system_event'
  title: string
  description: string
  user_id?: string
  user_name?: string
  user_avatar?: string
  data?: Record<string, unknown>
  created_at: string
  category: 'task' | 'meeting' | 'message' | 'system' | 'user'
  severity: 'info' | 'success' | 'warning' | 'error'
}

interface RealtimeActivityFeedProps {
  className?: string
  maxItems?: number
  showFilters?: boolean
}

export function RealtimeActivityFeed({ 
  className, 
  maxItems = 20,
  showFilters = true
}: RealtimeActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const { user } = useAuthStore()

  useEffect(() => {
    loadActivities()
    subscribeToRealTimeUpdates()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, filter])

  const loadActivities = async () => {
    // In a real app, you'd load from a database or API
    // For now, we'll create some sample activities
    const sampleActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'task_update',
        title: 'Görev Tamamlandı',
        description: 'UI Tasarım görevini tamamladı',
        user_id: user?.id,
        user_name: user?.email || 'Kullanıcı',
        created_at: new Date().toISOString(),
        category: 'task',
        severity: 'success'
      },
      {
        id: '2',
        type: 'meeting_created',
        title: 'Yeni Toplantı',
        description: 'Haftalık değerlendirme toplantısı oluşturuldu',
        user_id: user?.id,
        user_name: user?.email || 'Kullanıcı',
        created_at: new Date(Date.now() - 300000).toISOString(),
        category: 'meeting',
        severity: 'info'
      }
    ]

    setActivities(sampleActivities)
    setLoading(false)
  }

  const subscribeToRealTimeUpdates = () => {
    if (!user) return

    // Subscribe to task updates
    const unsubscribeTasks = realtimeService.subscribe<Record<string, unknown>>('tasks', (event) => {
      let activityTitle = ''
      let activityDescription = ''
      let severity: 'info' | 'success' | 'warning' | 'error' = 'info'

      const newRecord = event.new
      const oldRecord = event.old

      switch (event.eventType) {
        case 'INSERT':
          activityTitle = 'Yeni Görev Oluşturuldu'
          activityDescription = `"${newRecord?.title || 'Bilinmeyen görev'}" görevi oluşturuldu`
          severity = 'info'
          break
        case 'UPDATE':
          if (oldRecord?.status !== newRecord?.status) {
            if (newRecord?.status === 'completed') {
              activityTitle = 'Görev Tamamlandı'
              activityDescription = `"${newRecord?.title || 'Bilinmeyen görev'}" görevi tamamlandı`
              severity = 'success'
            } else if (newRecord?.status === 'in_progress') {
              activityTitle = 'Görev Başlatıldı'
              activityDescription = `"${newRecord?.title || 'Bilinmeyen görev'}" görevi üzerinde çalışılmaya başlandı`
              severity = 'info'
            }
          }
          break
      }

      if (activityTitle && newRecord) {
        addActivity({
          id: `task_${newRecord.id}_${Date.now()}`,
          type: 'task_update',
          title: activityTitle,
          description: activityDescription,
          user_id: (newRecord.assigned_to as string) || (newRecord.assigned_by as string),
          created_at: new Date().toISOString(),
          category: 'task',
          severity,
          data: { taskId: newRecord.id }
        })
      }
    })

    // Subscribe to meeting updates
    const unsubscribeMeetings = realtimeService.subscribe<Record<string, unknown>>('meetings', (event) => {
      if (event.eventType === 'INSERT') {
        const newRecord = event.new
        if (newRecord) {
          addActivity({
            id: `meeting_${newRecord.id}_${Date.now()}`,
            type: 'meeting_created',
            title: 'Yeni Toplantı Oluşturuldu',
            description: `"${newRecord.title || 'Bilinmeyen toplantı'}" toplantısı oluşturuldu`,
            user_id: newRecord.organizer_id as string,
            created_at: new Date().toISOString(),
            category: 'meeting',
            severity: 'info',
            data: { meetingId: newRecord.id }
          })
        }
      }
    })

    // Subscribe to message updates
    const unsubscribeMessages = realtimeService.subscribe<Record<string, unknown>>('internal_messages', (event) => {
      if (event.eventType === 'INSERT') {
        const newRecord = event.new
        if (newRecord && newRecord.sender_id !== user?.id) {
          addActivity({
            id: `message_${newRecord.id}_${Date.now()}`,
            type: 'message_sent',
            title: 'Yeni Mesaj',
            description: 'Size yeni bir mesaj gönderildi',
            user_id: newRecord.sender_id as string,
            created_at: new Date().toISOString(),
            category: 'message',
            severity: 'info',
            data: { messageId: newRecord.id, conversationId: newRecord.conversation_id }
          })
        }
      }
    })

    return () => {
      unsubscribeTasks()
      unsubscribeMeetings()
      unsubscribeMessages()
    }
  }

  const addActivity = (activity: ActivityItem) => {
    setActivities(prev => [activity, ...prev.slice(0, maxItems - 1)])
  }

  const filterActivities = () => {
    if (filter === 'all') {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(activities.filter(activity => activity.category === filter))
    }
  }

  const getActivityIcon = (_type: string, category: string) => {
    switch (category) {
      case 'task':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'meeting':
        return <Calendar className="w-5 h-5 text-green-600" />
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />
      case 'user':
        return <Users className="w-5 h-5 text-orange-600" />
      case 'system':
        return <Settings className="w-5 h-5 text-gray-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const handleActivityClick = (activity: ActivityItem) => {
    // Navigate based on activity type
    switch (activity.category) {
      case 'task':
        if (activity.data?.taskId) {
          window.location.href = `/tasks?task=${activity.data.taskId}`
        }
        break
      case 'meeting':
        if (activity.data?.meetingId) {
          window.location.href = `/meetings?meeting=${activity.data.meetingId}`
        }
        break
      case 'message':
        if (activity.data?.conversationId) {
          window.location.href = `/internal-messages?conversation=${activity.data.conversationId}`
        }
        break
    }
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Canlı Aktiviteler
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Canlı</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Tümü
          </Button>
          <Button
            size="sm"
            variant={filter === 'task' ? 'default' : 'outline'}
            onClick={() => setFilter('task')}
          >
            Görevler
          </Button>
          <Button
            size="sm"
            variant={filter === 'meeting' ? 'default' : 'outline'}
            onClick={() => setFilter('meeting')}
          >
            Toplantılar
          </Button>
          <Button
            size="sm"
            variant={filter === 'message' ? 'default' : 'outline'}
            onClick={() => setFilter('message')}
          >
            Mesajlar
          </Button>
          <Button
            size="sm"
            variant={filter === 'system' ? 'default' : 'outline'}
            onClick={() => setFilter('system')}
          >
            Sistem
          </Button>
        </div>
      )}

      {/* Activity Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {filter === 'all' 
                ? 'Henüz aktivite bulunmuyor' 
                : `${filter} kategorisinde aktivite bulunmuyor`}
            </p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div
              key={activity.id}
              className={`p-4 border-l-4 rounded-r-lg cursor-pointer hover:shadow-sm transition-shadow ${getSeverityColor(activity.severity)}`}
              onClick={() => handleActivityClick(activity)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {activity.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {activity.user_name && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{activity.user_name}</span>
                      </div>
                    )}
                    
                    <span>
                      {formatDistanceToNow(new Date(activity.created_at), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filteredActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            Tüm aktiviteleri görüntüle
          </Button>
        </div>
      )}
    </Card>
  )
}

// Hook for creating activity entries
export function useActivityLogger() {
  const { user } = useAuthStore()

  const logActivity = async (activity: Omit<ActivityItem, 'id' | 'created_at' | 'user_id' | 'user_name'>) => {
    // In a real app, you'd send this to your backend
    // For now, we'll just trigger real-time updates
    
    const fullActivity: ActivityItem = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: user?.id,
      user_name: user?.email
    }

    // You could broadcast this to other users
    realtimeService.broadcast('activities', 'new_activity', fullActivity as any)
  }

  const logTaskActivity = (taskTitle: string, action: string) => {
    logActivity({
      type: 'task_update',
      title: `Görev ${action}`,
      description: `"${taskTitle}" görevi ${action}`,
      category: 'task',
      severity: action === 'tamamlandı' ? 'success' : 'info'
    })
  }

  const logMeetingActivity = (meetingTitle: string, action: string) => {
    logActivity({
      type: 'meeting_created',
      title: `Toplantı ${action}`,
      description: `"${meetingTitle}" toplantısı ${action}`,
      category: 'meeting',
      severity: 'info'
    })
  }

  return {
    logActivity,
    logTaskActivity,
    logMeetingActivity
  }
}
