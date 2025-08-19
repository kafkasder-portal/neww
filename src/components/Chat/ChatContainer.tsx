import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
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

interface ChatContainerProps {
  currentUserId: string
  isOpen: boolean
  onToggle: () => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  currentUserId,
  isOpen,
  onToggle
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const { isConnected } = useSocket()

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleCloseChat = () => {
    setSelectedConversation(null)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors relative"
        >
          <MessageCircle className="w-6 h-6" />
          {!isConnected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <h2 className="font-semibold">Mesajlar</h2>
            {!isConnected && (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {!selectedConversation ? (
            <div className="w-full">
              <ChatList
                onSelectConversation={handleSelectConversation}
                currentUserId={currentUserId}
              />
            </div>
          ) : (
            <div className="w-full flex">
              {/* Mobile: Show only chat window */}
              <div className="w-full md:hidden">
                <ChatWindow
                  conversationId={selectedConversation.id}
                  participant={selectedConversation.participant}
                  currentUserId={currentUserId}
                  onClose={handleCloseChat}
                />
              </div>
              
              {/* Desktop: Show both list and chat */}
              <div className="hidden md:flex w-full">
                <div className="w-1/3 border-r border-gray-200">
                  <ChatList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation.id}
                    currentUserId={currentUserId}
                  />
                </div>
                <div className="w-2/3">
                  <ChatWindow
                    conversationId={selectedConversation.id}
                    participant={selectedConversation.participant}
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="p-2 bg-red-50 border-t border-red-200">
            <p className="text-xs text-red-600 text-center">
              Bağlantı kesildi. Yeniden bağlanılıyor...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatContainer