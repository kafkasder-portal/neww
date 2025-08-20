import { supabase } from '../lib/supabase'

interface CreateNotificationData {
  user_id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
}

export class NotificationService {
  // Create a single notification
  static async createNotification(notificationData: CreateNotificationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(notificationData)

      if (error) throw error
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  // Create notifications for multiple users
  static async createBulkNotifications(
    userIds: string[],
    notificationData: Omit<CreateNotificationData, 'user_id'>
  ): Promise<void> {
    try {
      const notifications = userIds.map(userId => ({
        ...notificationData,
        user_id: userId
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error
    } catch (error) {
      console.error('Failed to create bulk notifications:', error)
      throw error
    }
  }

  // Meeting-related notifications
  static async notifyMeetingInvite(
    attendeeIds: string[],
    meetingId: string,
    meetingTitle: string,
    organizerName: string
  ): Promise<void> {
    await this.createBulkNotifications(attendeeIds, {
      type: 'meeting_invite',
      title: 'Yeni Toplantı Daveti',
      message: `${organizerName} tarafından "${meetingTitle}" toplantısına davet edildiniz.`,
      data: { meeting_id: meetingId }
    })
  }

  static async notifyMeetingReminder(
    attendeeIds: string[],
    meetingId: string,
    meetingTitle: string,
    startTime: string
  ): Promise<void> {
    await this.createBulkNotifications(attendeeIds, {
      type: 'meeting_reminder',
      title: 'Toplantı Hatırlatması',
      message: `"${meetingTitle}" toplantısı ${new Date(startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} saatinde başlayacak.`,
      data: { meeting_id: meetingId }
    })
  }

  static async notifyMeetingUpdate(
    attendeeIds: string[],
    meetingId: string,
    meetingTitle: string,
    updateType: 'time_changed' | 'location_changed' | 'cancelled'
  ): Promise<void> {
    let message = ''
    switch (updateType) {
      case 'time_changed':
        message = `"${meetingTitle}" toplantısının tarih/saati değiştirildi.`
        break
      case 'location_changed':
        message = `"${meetingTitle}" toplantısının konumu değiştirildi.`
        break
      case 'cancelled':
        message = `"${meetingTitle}" toplantısı iptal edildi.`
        break
    }

    await this.createBulkNotifications(attendeeIds, {
      type: 'meeting_update',
      title: 'Toplantı Güncellendi',
      message,
      data: { meeting_id: meetingId }
    })
  }

  // Task-related notifications
  static async notifyTaskAssigned(
    assigneeId: string,
    taskId: string,
    taskTitle: string,
    assignerName: string
  ): Promise<void> {
    await this.createNotification({
      user_id: assigneeId,
      type: 'task_assigned',
      title: 'Yeni Görev Atandı',
      message: `${assignerName} tarafından size "${taskTitle}" görevi atandı.`,
      data: { task_id: taskId }
    })
  }

  static async notifyTaskCompleted(
    assignerId: string,
    taskId: string,
    taskTitle: string,
    assigneeName: string
  ): Promise<void> {
    await this.createNotification({
      user_id: assignerId,
      type: 'task_completed',
      title: 'Görev Tamamlandı',
      message: `${assigneeName} "${taskTitle}" görevini tamamladı.`,
      data: { task_id: taskId }
    })
  }

  static async notifyTaskDueReminder(
    assigneeId: string,
    taskId: string,
    taskTitle: string,
    dueDate: string
  ): Promise<void> {
    const dueDateTime = new Date(dueDate)
    const now = new Date()
    const hoursUntilDue = Math.round((dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60))

    let message = ''
    if (hoursUntilDue <= 0) {
      message = `"${taskTitle}" görevinin süresi doldu.`
    } else if (hoursUntilDue <= 24) {
      message = `"${taskTitle}" görevinin süresi ${hoursUntilDue} saat içinde dolacak.`
    } else {
      const daysUntilDue = Math.round(hoursUntilDue / 24)
      message = `"${taskTitle}" görevinin süresi ${daysUntilDue} gün içinde dolacak.`
    }

    await this.createNotification({
      user_id: assigneeId,
      type: 'task_due_reminder',
      title: 'Görev Hatırlatması',
      message,
      data: { task_id: taskId }
    })
  }

  // Message-related notifications
  static async notifyNewMessage(
    recipientIds: string[],
    senderId: string,
    conversationId: string,
    messageContent: string,
    senderName: string,
    conversationName?: string
  ): Promise<void> {
    // Don't notify the sender
    const filteredRecipientIds = recipientIds.filter(id => id !== senderId)

    if (filteredRecipientIds.length === 0) return

    const truncatedMessage = messageContent.length > 50 
      ? messageContent.substring(0, 50) + '...' 
      : messageContent

    await this.createBulkNotifications(filteredRecipientIds, {
      type: 'new_message',
      title: conversationName ? `${conversationName} - Yeni Mesaj` : 'Yeni Mesaj',
      message: `${senderName}: ${truncatedMessage}`,
      data: { conversation_id: conversationId, sender_id: senderId }
    })
  }

  static async notifyMention(
    mentionedUserId: string,
    senderId: string,
    conversationId: string,
    messageContent: string,
    senderName: string,
    conversationName?: string
  ): Promise<void> {
    if (mentionedUserId === senderId) return

    const truncatedMessage = messageContent.length > 50 
      ? messageContent.substring(0, 50) + '...' 
      : messageContent

    await this.createNotification({
      user_id: mentionedUserId,
      type: 'mention',
      title: conversationName ? `${conversationName} - Bahsedildiniz` : 'Bahsedildiniz',
      message: `${senderName} sizi bir mesajda bahsetti: ${truncatedMessage}`,
      data: { conversation_id: conversationId, sender_id: senderId }
    })
  }

  // System notifications
  static async notifyUserJoined(
    existingUserIds: string[],
    newUserId: string,
    newUserName: string,
    contextType: 'organization' | 'group',
    contextName?: string
  ): Promise<void> {
    const message = contextType === 'organization' 
      ? `${newUserName} organizasyona katıldı.`
      : `${newUserName} ${contextName} grubuna katıldı.`

    await this.createBulkNotifications(existingUserIds, {
      type: 'user_joined',
      title: 'Yeni Üye',
      message,
      data: { user_id: newUserId }
    })
  }

  // Utility methods
  static async scheduleNotification(
    notificationData: CreateNotificationData,
    scheduleTime: Date
  ): Promise<void> {
    // This would require a job queue system in production
    // For now, we'll just create the notification immediately
    // In a real system, you'd use something like Bull Queue, Agenda, or cloud functions
    
    const delay = scheduleTime.getTime() - Date.now()
    
    if (delay <= 0) {
      // If the scheduled time is in the past or now, send immediately
      await this.createNotification(notificationData)
    } else {
      // In a real system, this would be handled by a proper job queue
      setTimeout(async () => {
        await this.createNotification(notificationData)
      }, delay)
    }
  }

  static async scheduleTaskReminders(): Promise<void> {
    try {
      // Get tasks that are due within the next 24 hours and haven't been completed
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('id, title, assigned_to, due_date')
        .lte('due_date', tomorrow.toISOString())
        .in('status', ['pending', 'in_progress'])

      if (error) throw error

      // Create reminders for each task
      for (const task of tasks || []) {
        await this.notifyTaskDueReminder(
          task.assigned_to,
          task.id,
          task.title,
          task.due_date
        )
      }
    } catch (error) {
      console.error('Failed to schedule task reminders:', error)
    }
  }

  static async scheduleMeetingReminders(): Promise<void> {
    try {
      // Get meetings that start within the next hour
      const oneHourFromNow = new Date()
      oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)
      
      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('id, title, start_date')
        .lte('start_date', oneHourFromNow.toISOString())
        .eq('status', 'scheduled')

      if (error) throw error

      // Get attendees for each meeting and send reminders
      for (const meeting of meetings || []) {
        const { data: attendees } = await supabase
          .from('meeting_participants')
          .select('user_id')
          .eq('meeting_id', meeting.id)
          .eq('response_status', 'accepted')

        if (attendees && attendees.length > 0) {
          await this.notifyMeetingReminder(
            attendees.map(a => a.user_id),
            meeting.id,
            meeting.title,
            meeting.start_date
          )
        }
      }
    } catch (error) {
      console.error('Failed to schedule meeting reminders:', error)
    }
  }
}

export default NotificationService
