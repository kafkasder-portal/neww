import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Bell, Check, X, Target, Clock, CheckCircle, MessageSquare, Users, Calendar } from 'lucide-react'
import { formatRelativeTime } from '@utils/collaboration'
import { tasksApi } from '../../api/tasks'
import { messagesApi } from '../../api/messages'

interface Notification {
  id: string
  type: 'task' | 'meeting' | 'message' | 'system'
  subtype: 'assignment' | 'due_reminder' | 'completion' | 'comment' | 'mention' | 'invitation' | 'reminder' | 'update'
  title: string
  message: string
  entity_id?: string
  is_read: boolean
  created_at: string
  action_url?: string
}

interface NotificationCenterProps {
  userId: string
  className?: string
}

export default function NotificationCenter({ userId, className = '' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'task' | 'meeting' | 'message'>('all')

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, userId])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Fetch notifications from different modules
      const [taskNotifications, messageNotifications] = await Promise.all([
        tasksApi.getTaskNotifications(userId),
        messagesApi.getNotifications(userId)
      ])

      // Combine and transform notifications
      const allNotifications: Notification[] = [
        ...taskNotifications.map(tn => ({
          id: tn.id,
          type: 'task' as const,
          subtype: tn.type as 'assignment' | 'due_reminder' | 'completion' | 'comment' | 'mention' | 'invitation' | 'reminder' | 'update',
          title: tn.title,
          message: tn.message,
          entity_id: tn.task_id,
          is_read: tn.is_read,
          created_at: tn.created_at,
          action_url: `/tasks/${tn.task_id}`
        })),
        ...messageNotifications.map(mn => ({
          id: mn.id,
          type: 'message' as const,
          subtype: mn.type as 'assignment' | 'due_reminder' | 'completion' | 'comment' | 'mention' | 'invitation' | 'reminder' | 'update',
          title: getMessageNotificationTitle(mn.type),
          message: getMessageNotificationMessage(mn.type),
          entity_id: mn.conversation_id,
          is_read: mn.is_read,
          created_at: mn.created_at,
          action_url: `/internal-messages`
        }))
      ]

      // Sort by creation date (newest first)
      allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      setNotifications(allNotifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMessageNotificationTitle = (type: string): string => {
    switch (type) {
      case 'new_message': return 'Yeni Mesaj'
      case 'mention': return 'Bahsedildin'
      case 'reply': return 'Yanıt Alındı'
      default: return 'Mesaj Bildirimi'
    }
  }

  const getMessageNotificationMessage = (type: string): string => {
    switch (type) {
      case 'new_message': return 'Yeni bir mesajınız var'
      case 'mention': return 'Bir konuşmada bahsedildiniz'
      case 'reply': return 'Mesajınıza yanıt verildi'
      default: return 'Mesaj bildirimi'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'task') return notification.type === 'task'
    if (filter === 'meeting') return notification.type === 'meeting'
    if (filter === 'message') return notification.type === 'message'
    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markAsRead = async (notificationId: string, type: 'task' | 'message' | 'meeting') => {
    try {
      if (type === 'task') {
        await tasksApi.markNotificationAsRead(notificationId)
      } else if (type === 'message') {
        await messagesApi.markNotificationAsRead(notificationId)
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read)
      
      // Mark all as read in parallel
      await Promise.all(
        unreadNotifications.map(notification => 
          markAsRead(notification.id, notification.type as 'message' | 'meeting' | 'task')
        )
      )
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id, notification.type as 'message' | 'meeting' | 'task')
    }
    
    if (notification.action_url) {
      // In a real app, you would use React Router to navigate
      window.location.href = notification.action_url
    }
    
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string, subtype: string) => {
    switch (type) {
      case 'task':
        switch (subtype) {
          case 'assignment': return <Target className="h-4 w-4 text-blue-600" />
          case 'due_reminder': return <Clock className="h-4 w-4 text-orange-600" />
          case 'completion': return <CheckCircle className="h-4 w-4 text-green-600" />
          case 'comment': return <MessageSquare className="h-4 w-4 text-purple-600" />
          default: return <Target className="h-4 w-4 text-gray-600" />
        }
      case 'meeting':
        switch (subtype) {
          case 'invitation': return <Calendar className="h-4 w-4 text-blue-600" />
          case 'reminder': return <Clock className="h-4 w-4 text-orange-600" />
          case 'update': return <Calendar className="h-4 w-4 text-purple-600" />
          default: return <Calendar className="h-4 w-4 text-gray-600" />
        }
      case 'message':
        switch (subtype) {
          case 'new_message': return <MessageSquare className="h-4 w-4 text-blue-600" />
          case 'mention': return <Users className="h-4 w-4 text-red-600" />
          case 'reply': return <MessageSquare className="h-4 w-4 text-green-600" />
          default: return <MessageSquare className="h-4 w-4 text-gray-600" />
        }
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
        title="Bildirimler"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full right-0 mt-2 w-96 max-h-[500px] overflow-hidden z-20 shadow-lg">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Bildirimler</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Tümünü Okundu İşaretle
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 p-1 bg-muted rounded-lg">
                {[
                  { id: 'all', label: 'Tümü', count: notifications.length },
                  { id: 'unread', label: 'Okunmayan', count: unreadCount },
                  { id: 'task', label: 'Görevler', count: notifications.filter(n => n.type === 'task').length },
                  { id: 'meeting', label: 'Toplantılar', count: notifications.filter(n => n.type === 'meeting').length },
                  { id: 'message', label: 'Mesajlar', count: notifications.filter(n => n.type === 'message').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as 'all' | 'unread' | 'task' | 'meeting' | 'message')}
                    className={`flex-1 text-xs py-1.5 px-2 rounded transition-colors ${
                      filter === tab.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1">({tab.count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Yükleniyor...</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.is_read 
                          ? 'hover:bg-muted/50' 
                          : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type, notification.subtype)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm truncate ${
                              notification.is_read ? 'font-medium' : 'font-semibold'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 line-clamp-2 ${
                            notification.is_read ? 'text-muted-foreground' : 'text-gray-800'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {/* Action indicator */}
                          {notification.action_url && (
                            <div className="mt-2">
                              <span className="text-xs text-blue-600 hover:text-blue-800">
                                Görüntülemek için tıklayın →
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>
                    {filter === 'unread' ? 'Okunmamış bildirim yok' : 
                     filter === 'all' ? 'Henüz bildirim yok' : 
                     `${filter} bildirimi yok`}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t bg-muted/30">
                <button 
                  className="w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    // Navigate to full notifications page
                    setIsOpen(false)
                  }}
                >
                  Tüm bildirimleri görüntüle
                </button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

// Export a simpler notification badge for other components
export function NotificationBadge({ count, className = '' }: { count: number; className?: string }) {
  if (count === 0) return null
  
  return (
    <span className={`
      bg-red-500 text-white text-xs rounded-full h-5 w-5 
      flex items-center justify-center font-medium
      ${className}
    `}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

// Export notification types for type safety
export type { Notification }
