import React, { useState, useEffect } from 'react'
import { Search, MessageCircle, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useSocket } from '@contexts/SocketContext'

interface Conversation {
  id: string
  participant: {
    id: string
    full_name: string
    avatar_url?: string
  }
  lastMessage: {
    content: string
    created_at: string
    sender_id: string
  } | null
  updatedAt: string
  unreadCount: number
}

interface User {
  id: string
  full_name: string
  avatar_url?: string
  role: string
  unit_id?: string
}

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  type: 'text' | 'image' | 'file'
}

interface ChatListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
  currentUserId: string
}

export const ChatList: React.FC<ChatListProps> = ({
  onSelectConversation,
  selectedConversationId,
  currentUserId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchUsers, setSearchUsers] = useState('')
  
  const { socket } = useSocket()

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setConversations(data.conversations)
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [])

  // Load users for new chat
  useEffect(() => {
    if (!showNewChat) return

    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const params = new URLSearchParams()
        if (searchUsers) params.append('search', searchUsers)
        
        const response = await fetch(`/api/messages/users?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Error loading users:', error)
      }
    }

    loadUsers()
  }, [showNewChat, searchUsers])

  // Listen for new messages to update conversation list
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: {
                  content: data.message.content,
                  created_at: data.message.created_at,
                  sender_id: data.message.sender_id
                },
                updatedAt: data.message.created_at
              }
            : conv
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      )
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [socket])

  const filteredConversations = conversations.filter(conv =>
    conv.participant.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartNewChat = async (user: User) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participant_id: user.id })
      })
      
      if (response.ok) {
        const data = await response.json()
        const newConversation: Conversation = {
          id: data.conversation.id,
          participant: user,
          lastMessage: null,
          updatedAt: data.conversation.created_at,
          unreadCount: 0
        }
        
        setConversations(prev => [newConversation, ...prev])
        onSelectConversation(newConversation)
        setShowNewChat(false)
        setSearchUsers('')
      }
    } catch (error) {
      console.error('Error starting new chat:', error)
    }
  }

  const formatLastMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: false, 
      locale: tr 
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mesajlar</h2>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Sohbetlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* New Chat Panel */}
      {showNewChat && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Yeni Sohbet Başlat</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleStartNewChat(user)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4" />
            <p className="text-sm">Henüz mesajınız yok</p>
            <p className="text-xs">Yeni bir sohbet başlatın</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {conversation.participant.avatar_url ? (
                      <img
                        src={conversation.participant.avatar_url}
                        alt={conversation.participant.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {conversation.participant.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant.full_name}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatLastMessageTime(conversation.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.sender_id === currentUserId ? 'Sen: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Henüz mesaj yok</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList