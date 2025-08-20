import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { toast } from 'sonner'

/**
 * Real-time notifications için hook'lar
 */

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId: string
  data?: Record<string, unknown>
  actionUrl?: string
  actionText?: string
}

export interface NotificationSettings {
  showToast: boolean
  playSound: boolean
  showBadge: boolean
  types: {
    info: boolean
    success: boolean
    warning: boolean
    error: boolean
  }
}

const DEFAULT_SETTINGS: NotificationSettings = {
  showToast: true,
  playSound: true,
  showBadge: true,
  types: {
    info: true,
    success: true,
    warning: true,
    error: true
  }
}

/**
 * Real-time notifications yönetimi
 */
export function useNotifications() {
  const { isConnected, emit, on, off } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)

  // Yeni notification geldiğinde
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Ayarlara göre toast göster
    if (settings.showToast && settings.types[notification.type]) {
      const toastOptions = {
        duration: notification.type === 'error' ? 10000 : 5000,
        action: notification.actionUrl ? {
          label: notification.actionText || 'Görüntüle',
          onClick: () => window.location.href = notification.actionUrl!
        } : undefined
      }

      switch (notification.type) {
        case 'success':
          toast.success(notification.title, {
            description: notification.message,
            ...toastOptions
          })
          break
        case 'warning':
          toast.warning(notification.title, {
            description: notification.message,
            ...toastOptions
          })
          break
        case 'error':
          toast.error(notification.title, {
            description: notification.message,
            ...toastOptions
          })
          break
        default:
          toast.info(notification.title, {
            description: notification.message,
            ...toastOptions
          })
      }
    }

    // Ses çal
    if (settings.playSound && settings.types[notification.type]) {
      playNotificationSound(notification.type)
    }

    // Browser notification
    if (settings.showBadge && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }, [settings])

  // Socket event'lerini dinle
  useEffect(() => {
    if (isConnected) {
      on('notification', handleNewNotification)
      on('notification_read', (notificationId: string) => {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      })
      on('notifications_cleared', () => {
        setNotifications([])
        setUnreadCount(0)
      })

      // Mevcut notification'ları al
      emit('get_notifications')

      return () => {
        off('notification', handleNewNotification)
        off('notification_read')
        off('notifications_cleared')
      }
    }
  }, [isConnected, on, off, emit, handleNewNotification])

  // Notification'ı okundu olarak işaretle
  const markAsRead = useCallback((notificationId: string) => {
    emit('mark_notification_read', notificationId)
  }, [emit])

  // Tüm notification'ları okundu olarak işaretle
  const markAllAsRead = useCallback(() => {
    emit('mark_all_notifications_read')
  }, [emit])

  // Notification'ları temizle
  const clearNotifications = useCallback(() => {
    emit('clear_notifications')
  }, [emit])

  // Notification ayarlarını güncelle
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    // Ayarları localStorage'a kaydet
    localStorage.setItem('notification_settings', JSON.stringify({ ...settings, ...newSettings }))
  }, [settings])

  // Ayarları localStorage'dan yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  // Browser notification izni iste
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }, [])

  return {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    updateSettings,
    requestNotificationPermission
  }
}

/**
 * Belirli bir notification türü için hook
 */
export function useNotificationsByType(type: Notification['type']) {
  const { notifications } = useNotifications()
  return notifications.filter(n => n.type === type)
}

/**
 * Notification ses çalma
 */
function playNotificationSound(type: Notification['type']) {
  try {
    const audio = new Audio()
    switch (type) {
      case 'success':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
        break
      case 'warning':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
        break
      case 'error':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
        break
      default:
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    }
    audio.volume = 0.3
    audio.play().catch(console.error)
  } catch (error) {
    console.error('Error playing notification sound:', error)
  }
}

/**
 * Real-time mesajlaşma için hook
 */
export interface Message {
  id: string
  content: string
  userId: string
  timestamp: Date
  type?: 'text' | 'image' | 'file'
  metadata?: Record<string, unknown>
}

export function useRealTimeMessages() {
  const { isConnected, emit, on, off } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Yeni mesaj geldiğinde
  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  // Kullanıcı yazıyor durumu
  const handleUserTyping = useCallback((data: { userId: string, isTyping: boolean }) => {
    setTypingUsers(prev => {
      if (data.isTyping) {
        return prev.includes(data.userId) ? prev : [...prev, data.userId]
      } else {
        return prev.filter(id => id !== data.userId)
      }
    })
  }, [])

  // Socket event'lerini dinle
  useEffect(() => {
    if (isConnected) {
      on('new_message', handleNewMessage)
      on('user_typing', handleUserTyping)

      return () => {
        off('new_message', handleNewMessage)
        off('user_typing', handleUserTyping)
      }
    }
  }, [isConnected, on, off, handleNewMessage, handleUserTyping])

  // Mesaj gönder
  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    emit('send_message', message)
  }, [emit])

  // Yazıyor durumunu bildir
  const setTyping = useCallback((isTyping: boolean) => {
    emit('typing', { isTyping })
  }, [emit])

  return {
    messages,
    typingUsers,
    sendMessage,
    setTyping
  }
}