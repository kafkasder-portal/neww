import React, { useState, useRef } from 'react'
import { Send, Paperclip, X, Image, Smile } from 'lucide-react'
import { Button } from '../ui/button'
import { InternalMessage } from '@/types/internal-messages'

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'file' | 'image') => void
  onFileUpload?: (file: File) => Promise<{ url: string; name: string; size: number }>
  replyingTo?: InternalMessage | null
  onCancelReply?: () => void
  disabled?: boolean
  placeholder?: string
}

export default function MessageInput({
  onSendMessage,
  onFileUpload,
  replyingTo,
  onCancelReply,
  disabled = false,
  placeholder = "Mesajınızı yazın..."
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!onFileUpload) return

    setUploading(true)
    try {
      const uploadResult = await onFileUpload(file)
      
      // Determine message type based on file type
      const messageType = file.type.startsWith('image/') ? 'image' : 'file'
      
      // Send file message
      onSendMessage(
        file.type.startsWith('image/') ? '' : `📎 ${uploadResult.name}`,
        messageType
      )
    } catch (error) {
      console.error('File upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = Math.min(element.scrollHeight, 120) + 'px'
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    adjustTextareaHeight(e.target)
  }

  return (
    <div className="border-t bg-background p-4">
      {/* Reply Preview */}
      {replyingTo && (
        <div className="mb-3 p-3 bg-muted/50 border-l-2 border-primary rounded flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">
              Kullanıcı {replyingTo.sender_id} kullanıcısına yanıt veriyor
            </div>
            <div className="text-sm truncate mt-1">
              {replyingTo.content || (replyingTo.message_type === 'file' ? `📎 ${replyingTo.file_name}` : 'Dosya')}
            </div>
          </div>
          {onCancelReply && (
            <Button size="sm" variant="ghost" onClick={onCancelReply}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* File Upload Area */}
      <div
        className={`relative ${dragOver ? 'bg-primary/10 border-primary' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded-lg z-10">
            <div className="text-center">
              <Paperclip className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-primary font-medium">Dosyayı buraya bırakın</p>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end space-x-2">
          {/* File Upload Button */}
          {onFileUpload && (
            <div className="flex space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept="*/*"
              />
              
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="p-2"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*'
                    fileInputRef.current.click()
                  }
                }}
                disabled={disabled || uploading}
                className="p-2"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={uploading ? 'Dosya yükleniyor...' : placeholder}
              disabled={disabled || uploading}
              className="w-full min-h-[40px] max-h-[120px] px-3 py-2 border border-input rounded-md bg-background resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
              rows={1}
            />
            
            {/* Emoji Button */}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || uploading}
            size="sm"
            className="p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Dosya yükleniyor...
          </div>
        )}
      </div>

      {/* Input Info */}
      <div className="mt-2 text-xs text-muted-foreground">
        <span>Enter ile gönder, Shift+Enter ile yeni satır</span>
        {onFileUpload && (
          <span className="ml-2">• Dosya yüklemek için sürükleyip bırakabilirsiniz</span>
        )}
      </div>
    </div>
  )
}
