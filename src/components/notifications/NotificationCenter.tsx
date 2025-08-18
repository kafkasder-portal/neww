import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { useAuthStore } from '@store/auth'
import { realtimeService } from '@services/realtimeService'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { supabase } from '@lib/supabase'
import { toast } from 'sonner'

interface Notification {
  id: string
  user_id: string
  type: 'task_assigned' | 'meeting_invite' | 'message' | 'system' | 'reminder'
  title: string
  message: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
  expires_at?: string
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load notifications
  useEffect(() => {
    if (user) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    if (!user) return

    return realtimeService.subscribeToNotifications(user.id, (event) => {
      switch (event.eventType) {
        case 'INSERT':
          setNotifications(prev => [event.new, ...prev])
          // Show toast for new notification
          if (!event.new.is_read) {
            showNotificationToast(event.new)
          }
          break
        case 'UPDATE':
          setNotifications(prev => 
            prev.map(n => n.id === event.new.id ? event.new : n)
          )
          break
        case 'DELETE':
          setNotifications(prev => 
            prev.filter(n => n.id !== event.old.id)
          )
          break
      }
    })
  }

  const showNotificationToast = (notification: Notification) => {
    // You can customize this based on notification type
    if (notification.type === 'task_assigned') {
      toast.info(notification.title, {
        description: notification.message,
        action: {
          label: 'Görüntüle',
          onClick: () => handleNotificationClick(notification)
        }
      })
    } else if (notification.type === 'meeting_invite') {
      toast.info(notification.title, {
        description: notification.message,
        action: {
          label: 'Toplantıya Git',
          onClick: () => handleNotificationClick(notification)
        }
      })
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id)

      if (unreadIds.length === 0) return

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id)

      if (error) throw error

      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.is_read) {
      markAsRead(notification.id)
    }

    // Navigate based on notification type and data
    switch (notification.type) {
      case 'task_assigned':
        if (notification.data?.taskId) {
          window.location.href = `/tasks?task=${notification.data.taskId}`
        }
        break
      case 'meeting_invite':
        if (notification.data?.meetingId) {
          window.location.href = `/meetings?meeting=${notification.data.meetingId}`
        }
        break
      case 'message':
        if (notification.data?.conversationId) {
          window.location.href = `/internal-messages?conversation=${notification.data.conversationId}`
        }
        break
      default:
        // Do nothing for system notifications
        break
    }

    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋'
      case 'meeting_invite':
        return '📅'
      case 'message':
        return '💬'
      case 'reminder':
        return '⏰'
      case 'system':
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return 'bg-blue-100 text-blue-800'
      case 'meeting_invite':
        return 'bg-green-100 text-green-800'
      case 'message':
        return 'bg-purple-100 text-purple-800'
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800'
      case 'system':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Bildirimler</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Tümünü Okundu İşaretle
                  </Button>
                )}
                <Button
                  onClick={clearAllNotifications}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Bildirimler yükleniyor...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <Badge className={`text-xs ${getNotificationColor(notification.type)}`}>
                            {notification.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: tr
                            })}
                          </span>
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center"
                onClick={() => {
                  window.location.href = '/notifications'
                  setIsOpen(false)
                }}
              >
                Tüm bildirimleri görüntüle
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

// Hook for creating notifications
export function useNotifications() {
  const { user } = useAuthStore()

  const createNotification = async (
    targetUserId: string,
    notification: {
      type: 'task_assigned' | 'meeting_invite' | 'message' | 'system' | 'reminder'
      title: string
      message: string
      data?: Record<string, any>
      expiresAt?: string
    }
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          expires_at: notification.expiresAt,
          is_read: false
        })

      if (error) throw error
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  const createTaskAssignedNotification = async (
    assigneeId: string,
    taskTitle: string,
    taskId: string
  ) => {
    await createNotification(assigneeId, {
      type: 'task_assigned',
      title: 'Yeni Görev Atandı',
      message: `Size "${taskTitle}" görevi atandı.`,
      data: { taskId, assignedBy: user?.id }
    })
  }

  const createMeetingInviteNotification = async (
    participantId: string,
    meetingTitle: string,
    meetingId: string,
    meetingDate: string
  ) => {
    await createNotification(participantId, {
      type: 'meeting_invite',
      title: 'Toplantı Daveti',
      message: `"${meetingTitle}" toplantısına davet edildiniz.`,
      data: { meetingId, meetingDate, invitedBy: user?.id }
    })
  }

  const createMessageNotification = async (
    recipientId: string,
    senderName: string,
    conversationId: string
  ) => {
    await createNotification(recipientId, {
      type: 'message',
      title: 'Yeni Mesaj',
      message: `${senderName} size mesaj gönderdi.`,
      data: { conversationId, senderId: user?.id }
    })
  }

  return {
    createNotification,
    createTaskAssignedNotification,
    createMeetingInviteNotification,
    createMessageNotification
  }
}
