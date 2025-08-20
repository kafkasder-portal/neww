import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { InternalMessage, TaskComment, MeetingNotification, Task, Meeting } from '@/types/collaboration'

// General notification interface
export interface Notification {
  id: string
  user_id: string
  type: 'task_assigned' | 'meeting_invite' | 'message' | 'system' | 'reminder'
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
  expires_at?: string
}

export enum RealtimeEventType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export interface RealtimeEvent<T = unknown> {
  eventType: RealtimeEventType
  new: T
  old: T
  table: string
  schema: string
}

export type RealtimeCallback<T = unknown> = (event: RealtimeEvent<T>) => void

// Specific presence user interface
export interface PresenceUser {
  userId: string
  userName?: string
  email?: string
  status?: 'online' | 'away' | 'busy'
  lastSeen?: string
}

// Broadcast payload interfaces
export interface TypingIndicatorPayload {
  userId: string
  userName: string
  isTyping: boolean
  timestamp: number
}

export interface BroadcastPayload {
  [key: string]: unknown
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()
  private callbacks: Map<string, Set<RealtimeCallback<unknown>>> = new Map()
  private userPresence: Map<string, Record<string, PresenceUser[]>> = new Map()
  private isConnected = false

  constructor() {
    this.setupConnectionListener()
  }

  private setupConnectionListener() {
    // Connection status is managed by individual channels in modern Supabase
    // We'll track connection status through channel subscription status
    this.isConnected = true // Assume connected by default
    console.log('Realtime service initialized')
  }

  // Generic subscription method
  subscribe<T>(
    table: string,
    callback: RealtimeCallback<T>,
    options?: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema?: string
      filter?: string
    }
  ): () => void {
    const channelName = `${options?.schema || 'public'}:${table}`
    const callbackKey = `${channelName}:${options?.event || '*'}`

    // Get or create channel
    let channel = this.channels.get(channelName)
    if (!channel) {
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as any,
          {
            event: options?.event || '*',
            schema: options?.schema || 'public',
            table,
            filter: options?.filter
          },
          (payload: any) => {
            const realtimeEvent: RealtimeEvent<T> = {
              eventType: payload.eventType as RealtimeEventType,
              new: payload.new as T,
              old: payload.old as T,
              table: payload.table || table,
              schema: payload.schema || options?.schema || 'public'
            }

            // Call all registered callbacks for this subscription
            const callbacks = this.callbacks.get(callbackKey)
            if (callbacks) {
              callbacks.forEach(cb => cb(realtimeEvent))
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true
          } else if (status === 'CLOSED') {
            this.isConnected = false
          }
        })

      this.channels.set(channelName, channel)
    }

    // Add callback to the set
    if (!this.callbacks.has(callbackKey)) {
      this.callbacks.set(callbackKey, new Set())
    }
    this.callbacks.get(callbackKey)!.add(callback as RealtimeCallback<unknown>)

    // Return unsubscribe function
    return () => {
        const callbacks = this.callbacks.get(callbackKey)
        if (callbacks) {
          callbacks.delete(callback as RealtimeCallback<unknown>)
          if (callbacks.size === 0) {
          this.callbacks.delete(callbackKey)
          
          // If no more callbacks for this channel, unsubscribe
          const hasOtherCallbacks = Array.from(this.callbacks.keys())
            .some(key => key.startsWith(channelName))
          
          if (!hasOtherCallbacks) {
            channel?.unsubscribe()
            this.channels.delete(channelName)
          }
        }
      }
    }
  }

  // Specialized subscription methods
  subscribeToMessages(conversationId: string, callback: RealtimeCallback<InternalMessage>): () => void {
    return this.subscribe<InternalMessage>('internal_messages', callback, {
      event: '*',
      filter: `conversation_id=eq.${conversationId}`
    })
  }

  subscribeToTasks(callback: RealtimeCallback<Task>): () => void {
    const { user } = useAuthStore.getState()
    if (!user) return () => {}

    return this.subscribe<Task>('tasks', callback, {
      event: '*',
      filter: `assigned_to=eq.${user.id}`
    })
  }

  subscribeToMeetings(callback: RealtimeCallback<Meeting>): () => void {
    return this.subscribe<Meeting>('meetings', callback, {
      event: '*'
    })
  }

  subscribeToNotifications(userId: string, callback: RealtimeCallback<Notification>): () => void {
    return this.subscribe<Notification>('notifications', callback, {
      event: '*',
      filter: `user_id=eq.${userId}`
    })
  }

  subscribeToTaskComments(taskId: string, callback: RealtimeCallback<TaskComment>): () => void {
    return this.subscribe<TaskComment>('task_comments', callback, {
      event: '*',
      filter: `task_id=eq.${taskId}`
    })
  }

  subscribeToMeetingParticipants(meetingId: string, callback: RealtimeCallback<MeetingNotification>): () => void {
    return this.subscribe<MeetingNotification>('meeting_participants', callback, {
      event: '*',
      filter: `meeting_id=eq.${meetingId}`
    })
  }

  // User presence functionality
  async joinPresence(channelName: string, userState: PresenceUser): Promise<RealtimeChannel> {
    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: userState.userId }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        // Convert presence state to PresenceUser array
        const presenceUsers = Object.values(newState).flat() as unknown as PresenceUser[]
        this.userPresence.set(channelName, { [channelName]: presenceUsers })
        console.log('Presence sync:', presenceUsers)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }: { key: string; newPresences: PresenceUser[] }) => {
        console.log('User joined:', key, newPresences)
        toast.success(`${newPresences[0]?.userName || 'Bir kullanıcı'} katıldı`)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }: { key: string; leftPresences: PresenceUser[] }) => {
        console.log('User left:', key, leftPresences)
        toast.info(`${leftPresences[0]?.userName || 'Bir kullanıcı'} ayrıldı`)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userState)
        }
      })

    return channel
  }

  async leavePresence(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName)
    if (channel) {
      await channel.untrack()
      await channel.unsubscribe()
      this.channels.delete(channelName)
      this.userPresence.delete(channelName)
    }
  }

  getPresenceUsers(channelName: string): PresenceUser[] {
    const presence = this.userPresence.get(channelName)
    if (!presence) return []

    return Object.values(presence).flat()
  }

  // Broadcast functionality for real-time events
  async broadcast(channelName: string, event: string, payload: BroadcastPayload): Promise<void> {
    const channel = this.channels.get(channelName) || supabase.channel(channelName)
    
    if (!this.channels.has(channelName)) {
      await channel.subscribe()
      this.channels.set(channelName, channel)
    }

    channel.send({
      type: 'broadcast',
      event,
      payload
    })
  }

  // Listen to broadcast events
  onBroadcast(channelName: string, event: string, callback: (payload: BroadcastPayload) => void): () => void {
    let channel = this.channels.get(channelName)
    
    if (!channel) {
      channel = supabase.channel(channelName)
      this.channels.set(channelName, channel)
      channel.subscribe()
    }

    channel.on('broadcast', { event }, ({ payload }: { payload: BroadcastPayload }) => {
      callback(payload)
    })

    return () => {
      // Remove specific event listener - this is simplified
      // In a real implementation, you'd need to track listeners more carefully
      channel?.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // Typing indicators for chat
  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    const { user } = useAuthStore.getState()
    if (!user) return

    this.broadcast(`conversation:${conversationId}`, 'typing', {
      userId: user.id,
      userName: user.email,
      isTyping,
      timestamp: Date.now()
    })
  }

  onTypingIndicator(conversationId: string, callback: (data: TypingIndicatorPayload) => void): () => void {
    return this.onBroadcast(`conversation:${conversationId}`, 'typing', (payload: BroadcastPayload) => {
      callback(payload as unknown as TypingIndicatorPayload)
    })
  }

  // Connection status
  isRealtimeConnected(): boolean {
    return this.isConnected
  }

  // Cleanup all connections
  cleanup(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
    this.callbacks.clear()
    this.userPresence.clear()
  }

  // Health check
  async healthCheck(): Promise<{ status: string; channels: number; callbacks: number }> {
    return {
      status: this.isConnected ? 'connected' : 'disconnected',
      channels: this.channels.size,
      callbacks: this.callbacks.size
    }
  }
}

// Create singleton instance
export const realtimeService = new RealtimeService()

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  realtimeService.cleanup()
})
