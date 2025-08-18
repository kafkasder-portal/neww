import React, { useState, useEffect, useRef } from 'react'
import { Send, Smile, Paperclip, MoreVertical } from 'lucide-react'
import { useSocket } from '@contexts/SocketContext'
import { useRealTimeMessages } from '@hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  type: 'text' | 'image' | 'file'
  sender: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

interface ChatWindowProps {
  conversationId: string
  participant: {
    id: string
    full_name: string
    avatar_url?: string
  }
  currentUserId: string
  onClose?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  participant,
  currentUserId,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  // Removed unused setIsTyping state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { socket } = useSocket()
  const { sendMessage, typingUsers } = useRealTimeMessages()

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  // Listen for new messages
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data.message])
      }
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [socket, conversationId])

  // Handle typing indicators
  useEffect(() => {
    if (!socket) return

    let typingTimeout: NodeJS.Timeout

    const handleTyping = () => {
      socket.emit('typing', { conversationId, userId: currentUserId })
      
      clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => {
        socket.emit('stop_typing', { conversationId, userId: currentUserId })
      }, 1000)
    }

    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.addEventListener('input', handleTyping)
      
      return () => {
        inputElement.removeEventListener('input', handleTyping)
        clearTimeout(typingTimeout)
      }
    }
  }, [socket, conversationId, currentUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      await sendMessage({
        content: messageContent,
        userId: 'current_user', // This should be replaced with actual user ID
        type: 'text'
      })
    } catch (error) {
      console.error('Error sending message:', error)
      // Optionally show error toast
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: tr 
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {participant.avatar_url ? (
              <img
                src={participant.avatar_url}
                alt={participant.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {participant.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{participant.full_name}</h3>
            {typingUsers.length > 0 && (
              <p className="text-sm text-blue-600">yazıyor...</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow