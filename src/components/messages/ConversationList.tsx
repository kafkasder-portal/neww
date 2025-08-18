import React, { useState, useEffect } from 'react'
import { Search, Plus, Users, MessageCircle, MoreVertical, Archive, Settings, Hash, Bell, BellOff, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Conversation } from '@/types/internal-messages'
import { messagesApi } from '../../api/messages'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  onCreateConversation?: () => void
  onSearchConversations?: (query: string) => void
  onUpdateConversations?: () => void
  loading?: boolean
  currentUserId?: string
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  onSearchConversations,
  onUpdateConversations,
  loading = false,
  currentUserId
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'direct'>('all')

  // Load unread counts for conversations
  useEffect(() => {
    const loadUnreadCounts = async () => {
      if (!currentUserId) return
      
      const counts: Record<string, number> = {}
      for (const conversation of conversations) {
        try {
          const count = await messagesApi.getUnreadCount(conversation.id, currentUserId)
          counts[conversation.id] = count
        } catch (error) {
          console.error('Failed to load unread count:', error)
        }
      }
      setUnreadCounts(counts)
    }

    loadUnreadCounts()
  }, [conversations, currentUserId])

  // Mock online users (in real implementation, this would come from real-time presence)
  useEffect(() => {
    setOnlineUsers(new Set(['user1', 'user2', 'user3']))
  }, [])

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowOptions(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearchConversations?.(query)
  }

  const filteredConversations = conversations.filter(conv => {
    // Search filter
    const matchesSearch = !searchQuery || 
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Type filter
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unread' && (unreadCounts[conv.id] || 0) > 0) ||
      (filter === 'groups' && conv.conversation_type === 'group') ||
      (filter === 'direct' && conv.conversation_type === 'direct')
    
    return matchesSearch && matchesFilter && !conv.is_archived
  })

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return ''
    
    const messageDate = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'şimdi'
    } else if (diffInHours < 24) {
      return format(messageDate, 'HH:mm')
    } else if (diffInHours < 168) { // 7 days
      return format(messageDate, 'EEE', { locale: tr })
    } else {
      return format(messageDate, 'dd/MM', { locale: tr })
    }
  }

  const getConversationName = (conversation: Conversation) => {
    if (conversation.conversation_type === 'group') {
      return conversation.name || 'İsimsiz Grup'
    }
    // For direct messages, we would typically show the other user's name
    return 'Direkt Mesaj'
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.avatar_url) {
      return (
        <img
          src={conversation.avatar_url}
          alt={getConversationName(conversation)}
          className="w-12 h-12 rounded-full object-cover"
        />
      )
    }
    
    return (
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white relative">
        {conversation.conversation_type === 'group' ? (
          <Users className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        
        {/* Online indicator for direct messages */}
        {conversation.conversation_type === 'direct' && onlineUsers.has('user1') && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
    )
  }

  const handleOptionsClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    setShowOptions(showOptions === conversationId ? null : conversationId)
  }

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await messagesApi.archiveConversation(conversationId)
      onUpdateConversations?.()
      setShowOptions(null)
    } catch (error) {
      console.error('Failed to archive conversation:', error)
    }
  }

  const handleMuteConversation = async (conversationId: string, muted: boolean) => {
    if (!currentUserId) return
    
    try {
      await messagesApi.muteConversation(conversationId, currentUserId, muted)
      setShowOptions(null)
    } catch (error) {
      console.error('Failed to mute conversation:', error)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (!window.confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) return
    
    try {
      await messagesApi.deleteConversation(conversationId)
      onUpdateConversations?.()
      setShowOptions(null)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const closeOptions = () => {
    setShowOptions(null)
  }

  const getUnreadCount = (conversationId: string) => {
    return unreadCounts[conversationId] || 0
  }

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Mesajlar</h2>
          {onCreateConversation && (
            <Button size="sm" onClick={onCreateConversation}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Konuşma ara..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          {[
            { id: 'all', label: 'Tümü', count: conversations.length },
            { id: 'unread', label: 'Okunmayan', count: Object.values(unreadCounts).reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0) },
            { id: 'groups', label: 'Gruplar', count: conversations.filter(c => c.conversation_type === 'group').length },
            { id: 'direct', label: 'Direkt', count: conversations.filter(c => c.conversation_type === 'direct').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 text-xs py-1.5 px-2 rounded transition-colors ${
                filter === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs">
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Yükleniyor...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation.id)
              
              return (
                <div
                  key={conversation.id}
                  className={`relative group cursor-pointer rounded-lg p-3 transition-colors ${
                    selectedConversationId === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    {getConversationAvatar(conversation)}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className={`truncate ${unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>
                            {getConversationName(conversation)}
                          </h3>
                          
                          {/* Conversation type indicator */}
                          {conversation.conversation_type === 'group' && (
                            <Hash className="h-3 w-3 text-muted-foreground" />
                          )}
                          
                          {/* Muted indicator */}
                          <BellOff className="h-3 w-3 text-muted-foreground opacity-0" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Unread count */}
                          {unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[18px] text-center font-medium">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                          
                          {/* Last message time */}
                          {conversation.last_message_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatLastMessageTime(conversation.last_message_at)}
                            </span>
                          )}
                          
                          {/* Options Menu */}
                          <button
                            onClick={(e) => handleOptionsClick(e, conversation.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background/50 rounded transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description or last message preview */}
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${
                          unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {conversation.description || 'Henüz mesaj yok'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options Dropdown */}
                  {showOptions === conversation.id && (
                    <div className="absolute top-12 right-3 bg-background border rounded-lg shadow-lg z-20 min-w-[160px]">
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-t-lg flex items-center"
                        onClick={() => handleMuteConversation(conversation.id, true)}
                      >
                        <BellOff className="h-4 w-4 mr-2" />
                        Sessize Al
                      </button>
                      
                      {conversation.conversation_type === 'group' && (
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Grup Ayarları
                        </button>
                      )}
                      
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                        onClick={() => handleArchiveConversation(conversation.id)}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Arşivle
                      </button>
                      
                      <div className="border-t border-muted my-1" />
                      
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-lg flex items-center text-destructive"
                        onClick={() => handleDeleteConversation(conversation.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {conversation.conversation_type === 'group' ? 'Gruptan Ayrıl' : 'Konuşmayı Sil'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? (
              <div>
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Arama kriterlerine uygun konuşma bulunamadı</p>
                <p className="text-xs mt-1">&apos;{searchQuery}&apos; için sonuç yok</p>
              </div>
            ) : filter === 'unread' ? (
              <div>
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Okunmamış mesaj yok</p>
              </div>
            ) : (
              <div>
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Henüz konuşma başlatılmamış</p>
                {onCreateConversation && (
                  <Button size="sm" className="mt-3" onClick={onCreateConversation}>
                    İlk konuşmayı başlat
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close options */}
      {showOptions && (
        <div
          className="fixed inset-0 z-10"
          onClick={closeOptions}
        />
      )}
    </div>
  )
}
