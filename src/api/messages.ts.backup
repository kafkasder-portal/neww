// import { supabase } from '../lib/supabase'
import { 
  Conversation, 
  ConversationParticipant,
  InternalMessage,
  SendMessageData,
  CreateConversationData,
  MessageReaction,
  MessageNotification
} from '../types/collaboration'
import { toast } from 'sonner'

// Helper function to handle API errors
const handleApiError = (error: any, context: string) => {
  console.error(`${context}:`, error)
  const message = error?.message || `Error in ${context}`
  toast.error(message)
  throw new Error(message)
}

// Mock data generators
const generateMockConversations = (): Conversation[] => [
  {
    id: 'conv_1',
    name: 'Yönetim Kurulu',
    conversation_type: 'group',
    created_by: 'user1',
    description: 'Yönetim kurulu iç iletişimi',
    is_archived: false,
    last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'conv_2',
    name: 'Proje Koordinasyonu',
    conversation_type: 'group',
    created_by: 'user2',
    description: 'Aktif projeler için koordinasyon',
    is_archived: false,
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'conv_3',
    conversation_type: 'direct',
    created_by: 'user1',
    is_archived: false,
    last_message_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

const generateMockMessages = (conversationId: string): InternalMessage[] => [
  {
    id: 'msg_1',
    sender_id: 'user1',
    conversation_id: conversationId,
    content: 'Merhaba, toplantı için gündem maddelerini gözden geçirelim.',
    message_type: 'text',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_2',
    sender_id: 'user2',
    conversation_id: conversationId,
    content: 'Evet, bütçe konularını da ekleyelim. Dosyayı paylaşıyorum.',
    message_type: 'text',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_3',
    sender_id: 'user2',
    conversation_id: conversationId,
    content: 'budget_2024.pdf',
    message_type: 'file',
    file_url: 'https://example.com/budget_2024.pdf',
    file_name: 'budget_2024.pdf',
    file_size: 245760,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_4',
    sender_id: 'user3',
    conversation_id: conversationId,
    content: 'Harika! Ben de proje raporlarını hazırladım. Yarın sunabilirim.',
    message_type: 'text',
    reply_to: 'msg_2',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_5',
    sender_id: 'user1',
    conversation_id: conversationId,
    content: 'Mükemmel! O zaman yarın saat 14:00\'da başlayalım.',
    message_type: 'text',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
]

const generateMockParticipants = (conversationId: string): ConversationParticipant[] => [
  {
    id: 'part_1',
    conversation_id: conversationId,
    user_id: 'user1',
    role: 'admin',
    joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_muted: false,
    last_read_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'part_2',
    conversation_id: conversationId,
    user_id: 'user2',
    role: 'member',
    joined_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    is_muted: false,
    last_read_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: 'part_3',
    conversation_id: conversationId,
    user_id: 'user3',
    role: 'member',
    joined_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    is_muted: false,
    last_read_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
]

// =====================================================
// Messages API
// =====================================================

export const messagesApi = {
  // =====================================================
  // Conversations
  // =====================================================

  async getConversations(): Promise<Conversation[]> {
    try {
      // Mock data for now - replace with real Supabase calls when tables are ready
      return generateMockConversations()
    } catch (error) {
      handleApiError(error, 'getConversations')
      return []
    }
  },

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const conversations = generateMockConversations()
      return conversations.find(c => c.id === id) || null
    } catch (error) {
      handleApiError(error, 'getConversation')
      return null
    }
  },

  async createConversation(data: CreateConversationData): Promise<Conversation> {
    try {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        name: data.name,
        conversation_type: data.conversation_type,
        created_by: 'current_user',
        description: data.description,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: conversation, _error } = await supabase
      //   .from('conversations')
      //   .insert([newConversation])
      //   .select()
      //   .single()

      // Add participants
      if (data.participants.length > 0) {
        await this.addParticipants(newConversation.id, data.participants)
      }

      toast.success('Konuşma oluşturuldu')
      return newConversation
    } catch (error) {
      handleApiError(error, 'createConversation')
      throw error
    }
  },

  async updateConversation(_id: string, _data: Partial<CreateConversationData>): Promise<Conversation> {
    try {
      const conversations = generateMockConversations()
      const existing = conversations.find(c => c.id === _id)
      
      if (!existing) {
        throw new Error('Konuşma bulunamadı')
      }

      const updated: Conversation = {
        ...existing,
        ..._data,
        updated_at: new Date().toISOString()
      }

      toast.success('Konuşma güncellendi')
      return updated
    } catch (error) {
      handleApiError(error, 'updateConversation')
      throw error
    }
  },

  async deleteConversation(_id: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase
      // const { _error } = await supabase
      //   .from('conversations')
      //   .delete()
      //   .eq('id', _id)

      toast.success('Konuşma silindi')
    } catch (error) {
      handleApiError(error, 'deleteConversation')
      throw error
    }
  },

  async archiveConversation(_id: string): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('conversations')
      //   .update({ is_archived: true })
      //   .eq('id', _id)

      toast.success('Konuşma arşivlendi')
    } catch (error) {
      handleApiError(error, 'archiveConversation')
      throw error
    }
  },

  // =====================================================
  // Messages
  // =====================================================

  async getMessages(conversationId: string): Promise<InternalMessage[]> {
    try {
      return generateMockMessages(conversationId)
    } catch (error) {
      handleApiError(error, 'getMessages')
      return []
    }
  },

  async sendMessage(data: SendMessageData): Promise<InternalMessage> {
    try {
      const newMessage: InternalMessage = {
        id: `msg_${Date.now()}`,
        sender_id: 'current_user',
        conversation_id: data.conversation_id,
        content: data.content,
        message_type: data.message_type || 'text',
        file_url: data.file_url,
        file_name: data.file_name,
        file_size: data.file_size,
        reply_to: data.reply_to,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: message, _error } = await supabase
      //   .from('internal_messages')
      //   .insert([newMessage])
      //   .select()
      //   .single()

      // Update conversation last message time
      await this.updateConversationLastMessage(data.conversation_id)

      return newMessage
    } catch (error) {
      handleApiError(error, 'sendMessage')
      throw error
    }
  },

  async editMessage(messageId: string, content: string): Promise<InternalMessage> {
    try {
      // Mock update
      const messages = generateMockMessages('conv_1')
      const existingMessage = messages.find(m => m.id === messageId)
      
      if (!existingMessage) {
        throw new Error('Mesaj bulunamadı')
      }

      const updatedMessage: InternalMessage = {
        ...existingMessage,
        content: content,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      toast.success('Mesaj düzenlendi')
      return updatedMessage
    } catch (error) {
      handleApiError(error, 'editMessage')
      throw error
    }
  },

  async deleteMessage(_messageId: string): Promise<void> {
    try {
      // In real implementation, soft delete in Supabase
      // const { _error } = await supabase
      //   .from('internal_messages')
      //   .update({ deleted_at: new Date().toISOString() })
      //   .eq('id', messageId)

      toast.success('Mesaj silindi')
    } catch (error) {
      handleApiError(error, 'deleteMessage')
      throw error
    }
  },

  async markMessageAsRead(_messageId: string): Promise<void> {
    try {
      // In real implementation, update read status
      // const { _error } = await supabase
      //   .from('internal_messages')
      //   .update({ read_at: new Date().toISOString() })
      //   .eq('id', messageId)
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  },

  // =====================================================
  // Participants
  // =====================================================

  async getConversationParticipants(conversationId: string): Promise<ConversationParticipant[]> {
    try {
      return generateMockParticipants(conversationId)
    } catch (error) {
      handleApiError(error, 'getConversationParticipants')
      return []
    }
  },

  async addParticipants(conversationId: string, userIds: string[]): Promise<ConversationParticipant[]> {
    try {
      const newParticipants: ConversationParticipant[] = userIds.map(userId => ({
        id: `part_${Date.now()}_${userId}`,
        conversation_id: conversationId,
        user_id: userId,
        role: 'member',
        joined_at: new Date().toISOString(),
        is_muted: false
      }))

      // In real implementation, save to Supabase
      // const { _data: participants, _error } = await supabase
      //   .from('conversation_participants')
      //   .insert(newParticipants)
      //   .select()

      toast.success(`${userIds.length} katılımcı eklendi`)
      return newParticipants
    } catch (error) {
      handleApiError(error, 'addParticipants')
      throw error
    }
  },

  async removeParticipant(_conversationId: string, _userId: string): Promise<void> {
    try {
      // In real implementation, update left_at in Supabase
      // const { _error } = await supabase
      //   .from('conversation_participants')
      //   .update({ left_at: new Date().toISOString() })
      //   .eq('conversation_id', conversationId)
      //   .eq('user_id', userId)

      toast.success('Katılımcı çıkarıldı')
    } catch (error) {
      handleApiError(error, 'removeParticipant')
      throw error
    }
  },

  async updateParticipantRole(_conversationId: string, _userId: string, _role: 'admin' | 'member'): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('conversation_participants')
      //   .update({ role })
      //   .eq('conversation_id', conversationId)
      //   .eq('user_id', userId)

      toast.success('Katılımcı rolü güncellendi')
    } catch (error) {
      handleApiError(error, 'updateParticipantRole')
      throw error
    }
  },

  async muteConversation(_conversationId: string, _userId: string, _muted: boolean): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('conversation_participants')
      //   .update({ is_muted: _muted })
      //   .eq('conversation_id', _conversationId)
      //   .eq('user_id', _userId)

      toast.success(_muted ? 'Konuşma sessize alındı' : 'Konuşma sessize alma kaldırıldı')
    } catch (error) {
      handleApiError(error, 'muteConversation')
      throw error
    }
  },

  async markConversationAsRead(_conversationId: string): Promise<void> {
    try {
      // In real implementation, update last_read_at
      // const { _error } = await supabase
      //   .from('conversation_participants')
      //   .update({ last_read_at: new Date().toISOString() })
      //   .eq('conversation_id', conversationId)
      //   .eq('user_id', currentUserId)
    } catch (error) {
      console.error('Failed to mark conversation as read:', error)
    }
  },

  // =====================================================
  // Message Reactions
  // =====================================================

  async addReaction(_messageId: string, _emoji: string): Promise<MessageReaction> {
    try {
      const newReaction: MessageReaction = {
        id: `reaction_${Date.now()}`,
        message_id: _messageId,
        user_id: 'current_user',
        emoji: _emoji,
        created_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: reaction, _error } = await supabase
      //   .from('message_reactions')
      //   .insert([newReaction])
      //   .select()
      //   .single()

      return newReaction
    } catch (error) {
      handleApiError(error, 'addReaction')
      throw error
    }
  },

  async removeReaction(_reactionId: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase
      // const { _error } = await supabase
      //   .from('message_reactions')
      //   .delete()
      //   .eq('id', reactionId)
    } catch (error) {
      handleApiError(error, 'removeReaction')
      throw error
    }
  },

  async getMessageReactions(_messageId: string): Promise<MessageReaction[]> {
    try {
      // Mock reactions
      const mockReactions: MessageReaction[] = [
        {
          id: 'reaction_1',
          message_id: _messageId,
          user_id: 'user1',
          emoji: '👍',
          created_at: new Date().toISOString()
        },
        {
          id: 'reaction_2',
          message_id: _messageId,
          user_id: 'user2',
          emoji: '❤️',
          created_at: new Date().toISOString()
        }
      ]

      return mockReactions
    } catch (error) {
      handleApiError(error, 'getMessageReactions')
      return []
    }
  },

  // =====================================================
  // Search and Notifications
  // =====================================================

  async searchMessages(query: string, conversationId?: string): Promise<InternalMessage[]> {
    try {
      // Mock search implementation
      const allMessages = generateMockMessages(conversationId || 'conv_1')
      return allMessages.filter(message => 
        message.content.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      handleApiError(error, 'searchMessages')
      return []
    }
  },

  async getNotifications(userId: string): Promise<MessageNotification[]> {
    try {
      const mockNotifications: MessageNotification[] = [
        {
          id: 'notif_1',
          user_id: userId,
          conversation_id: 'conv_1',
          message_id: 'msg_1',
          type: 'new_message',
          is_read: false,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'notif_2',
          user_id: userId,
          conversation_id: 'conv_2',
          message_id: 'msg_2',
          type: 'mention',
          is_read: false,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ]

      return mockNotifications
    } catch (error) {
      handleApiError(error, 'getNotifications')
      return []
    }
  },

  async markNotificationAsRead(_notificationId: string): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('message_notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('id', _notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  // =====================================================
  // Real-time Subscriptions
  // =====================================================

  subscribeToConversation(conversationId: string, _callback: (message: InternalMessage) => void) {
    // In real implementation, set up Supabase real-time subscription
    // return supabase
    //   .channel(`conversation_${conversationId}`)
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'internal_messages',
    //     filter: `conversation_id=eq.${conversationId}`
    //   }, (payload) => {
    //     _callback(payload.new as InternalMessage)
    //   })
    //   .subscribe()

    // Mock subscription
    console.log(`Subscribed to conversation ${conversationId}`)
    return {
      unsubscribe: () => console.log(`Unsubscribed from conversation ${conversationId}`)
    }
  },

  subscribeToNotifications(userId: string, _callback: (notification: MessageNotification) => void) {
    // In real implementation, set up Supabase real-time subscription
    // return supabase
    //   .channel(`notifications_${userId}`)
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'message_notifications',
    //     filter: `user_id=eq.${userId}`
    //   }, (payload) => {
    //     _callback(payload.new as MessageNotification)
    //   })
    //   .subscribe()

    // Mock subscription
    console.log(`Subscribed to notifications for user ${userId}`)
    return {
      unsubscribe: () => console.log(`Unsubscribed from notifications for user ${userId}`)
    }
  },

  // =====================================================
  // Helper Functions
  // =====================================================

  async updateConversationLastMessage(_conversationId: string): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('conversations')
      //   .update({ last_message_at: new Date().toISOString() })
      //   .eq('id', _conversationId)
    } catch (error) {
      console.error('Failed to update conversation last message:', error)
    }
  },

  async getUnreadCount(_conversationId: string, _userId: string): Promise<number> {
    try {
      // In real implementation, count unread messages
      // const { _count, _error } = await supabase
      //   .from('internal_messages')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('conversation_id', _conversationId)
      //   .is('read_at', null)
      //   .neq('sender_id', _userId)

      // Mock unread count
      return Math.floor(Math.random() * 5)
    } catch (error) {
      console.error('Failed to get unread count:', error)
      return 0
    }
  }
}

export default messagesApi
