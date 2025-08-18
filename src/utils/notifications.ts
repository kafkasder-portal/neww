// Push Notification Utilities

// Global type declarations
declare global {
  interface Window {
    Notification: typeof Notification
  }
}

type NotificationPermission = 'default' | 'granted' | 'denied'

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export class NotificationManager {
  private static instance: NotificationManager
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.ready
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      console.error('Service Worker not registered')
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      })

      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    try {
      return await this.registration.pushManager.getSubscription()
    } catch (error) {
      console.error('Failed to get push subscription:', error)
      return null
    }
  }

  async showNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission()
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    if (!this.registration) {
      // Fallback to browser notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        tag: payload.tag,
        requireInteraction: payload.requireInteraction,
        silent: payload.silent,
        data: payload.data,
      });
      return
    }

    try {
      await this.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/pwa-192x192.svg',
        badge: payload.badge || '/pwa-192x192.svg',

        tag: payload.tag,
        data: payload.data,

        requireInteraction: payload.requireInteraction,
        silent: payload.silent
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray.buffer
  }
}

// Convenience functions
export const notificationManager = NotificationManager.getInstance()

export async function initializeNotifications(): Promise<boolean> {
  return await notificationManager.initialize()
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await notificationManager.requestPermission()
}

export async function showNotification(payload: NotificationPayload): Promise<void> {
  return await notificationManager.showNotification(payload)
}

export async function subscribeToPushNotifications(vapidPublicKey: string): Promise<PushSubscription | null> {
  return await notificationManager.subscribeToPush(vapidPublicKey)
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  return await notificationManager.unsubscribeFromPush()
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  return await notificationManager.getSubscription()
}

// Notification templates
export const NotificationTemplates = {
  welcome: (userName: string): NotificationPayload => ({
    title: 'Hoş Geldiniz!',
    body: `Merhaba ${userName}, panele başarıyla giriş yaptınız.`,
    icon: '/pwa-192x192.svg',
    tag: 'welcome'
  }),

  newMessage: (sender: string, preview: string): NotificationPayload => ({
    title: `Yeni Mesaj - ${sender}`,
    body: preview,
    icon: '/pwa-192x192.svg',
    tag: 'new-message',
    actions: [
      { action: 'reply', title: 'Yanıtla' },
      { action: 'mark-read', title: 'Okundu İşaretle' }
    ]
  }),

  systemAlert: (message: string): NotificationPayload => ({
    title: 'Sistem Bildirimi',
    body: message,
    icon: '/pwa-192x192.svg',
    tag: 'system-alert',
    requireInteraction: true
  }),

  taskReminder: (taskTitle: string, dueDate: string): NotificationPayload => ({
    title: 'Görev Hatırlatması',
    body: `"${taskTitle}" görevi ${dueDate} tarihinde tamamlanmalı.`,
    icon: '/pwa-192x192.svg',
    tag: 'task-reminder',
    actions: [
      { action: 'complete', title: 'Tamamlandı' },
      { action: 'snooze', title: 'Ertele' }
    ]
  })
}