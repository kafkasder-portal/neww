import { useState } from 'react'
import { MoreVertical, Reply, Edit2, Trash2, Download, File, Check, X } from 'lucide-react'
import { InternalMessage } from '@/types/internal-messages'
import { format } from 'date-fns'
import tr from 'date-fns/locale/tr'

interface ChatMessageProps {
  message: InternalMessage
  isCurrentUser: boolean
  onReply?: (message: InternalMessage) => void
  onEdit?: (message: InternalMessage) => void
  onDelete?: (messageId: string) => void
  showSender?: boolean
  onFileDownload?: (fileUrl: string, fileName: string) => void
  isEditing?: boolean
  onSaveEdit?: (messageId: string, newContent: string) => void
  onCancelEdit?: () => void
}

export default function ChatMessage({
  message,
  isCurrentUser,
  onReply,
  onEdit,
  onDelete,
  showSender = true,
  onFileDownload,
  isEditing = false,
  onSaveEdit,
  onCancelEdit
}: ChatMessageProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [editContent, setEditContent] = useState(message.content || '')

  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp)
    const now = new Date()
    const isToday = messageDate.toDateString() === now.toDateString()
    
    if (isToday) {
      return format(messageDate, 'HH:mm')
    } else {
      return format(messageDate, 'dd MMM HH:mm', { locale: tr })
    }
  }

  const handleSaveEdit = () => {
    if (editContent.trim() && onSaveEdit) {
      onSaveEdit(message.id, editContent.trim())
    }
  }

  const handleCancelEdit = () => {
    setEditContent(message.content || '')
    onCancelEdit?.()
  }

  const renderMessageContent = () => {
    // If editing and it's a text message, show edit input
    if (isEditing && message.message_type === 'text') {
      return (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSaveEdit()
              } else if (e.key === 'Escape') {
                handleCancelEdit()
              }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-3 w-3" />
              Kaydet
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              <X className="h-3 w-3" />
              İptal
            </button>
          </div>
        </div>
      )
    }

    switch (message.message_type) {
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50">
            <File className="h-8 w-8 text-blue-500" />
            <div className="flex-1">
              <div className="font-medium">{message.file_name}</div>
              {message.file_size && (
                <div className="text-sm text-muted-foreground">
                  {(message.file_size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
            {message.file_url && (
              <button
                onClick={() => onFileDownload?.(message.file_url!, message.file_name!)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      
      case 'image':
        return (
          <div className="space-y-2">
            {message.file_url && (
              <img
                src={message.file_url}
                alt={message.file_name || 'Resim'}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => window.open(message.file_url, '_blank')}
              />
            )}
            {message.content && (
              <div className="text-sm">{message.content}</div>
            )}
          </div>
        )
      
      case 'system':
        return (
          <div className="text-sm text-muted-foreground italic">
            {message.content}
          </div>
        )
      
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )
    }
  }

  return (
    <div className={`flex gap-3 group ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {showSender && !isCurrentUser && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
          {message.sender_id.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
        {/* Sender Name (for group chats) */}
        {showSender && !isCurrentUser && (
          <div className="text-sm text-muted-foreground mb-1">
            Kullanıcı {message.sender_id}
          </div>
        )}

        {/* Reply Reference */}
        {message.reply_to && (
          <div className="mb-2 p-2 bg-muted/50 border-l-2 border-primary rounded text-sm">
            <div className="text-muted-foreground">Yanıtlanan mesaj</div>
            <div className="truncate">...</div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative rounded-lg p-3 ${
            message.message_type === 'system'
              ? 'bg-muted/30 text-center'
              : isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border'
          }`}
        >
          {renderMessageContent()}

          {/* Message Time */}
          <div
            className={`text-xs mt-2 ${
              message.message_type === 'system'
                ? 'text-muted-foreground'
                : isCurrentUser
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground'
            }`}
          >
            {formatMessageTime(message.created_at)}
            {message.edited_at && (
              <span className="ml-1">(düzenlendi)</span>
            )}
          </div>

          {/* Message Actions */}
          {message.message_type !== 'system' && !isEditing && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-background/20 rounded"
                >
                  <MoreVertical className="h-3 w-3" />
                </button>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 min-w-[120px]">
                    {onReply && (
                      <button
                        onClick={() => {
                          onReply(message)
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-t-lg flex items-center"
                      >
                        <Reply className="h-3 w-3 mr-2" />
                        Yanıtla
                      </button>
                    )}

                    {isCurrentUser && onEdit && message.message_type === 'text' && (
                      <button
                        onClick={() => {
                          onEdit(message)
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-2" />
                        Düzenle
                      </button>
                    )}

                    {isCurrentUser && onDelete && (
                      <button
                        onClick={() => {
                          onDelete(message.id)
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-lg flex items-center text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Sil
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}
