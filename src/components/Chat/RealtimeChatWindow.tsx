import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar'
import { Badge } from '@ui/badge'
import { ScrollArea } from '@ui/scroll-area'
import { Separator } from '@ui/separator'
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Smile,
  Phone,
  Video,
  Search,
  Settings,
  Users,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react'
import { supabase } from '@lib/supabase'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'audio'
  status: 'sent' | 'delivered' | 'read'
}

interface DatabaseMessage {
  id: string
  content: string
  type: 'text' | 'image' | 'file' | 'audio'
  status: 'sent' | 'delivered' | 'read'
  created_at: string
  sender_id: string
  sender_name?: string
  sender_avatar?: string
}

interface SupabasePayload {
  new: DatabaseMessage
  old: DatabaseMessage | null
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
}

interface ChatWindowProps {
  channelId: string
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
}

export function RealtimeChatWindow({ channelId, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            type,
            status,
            created_at,
            sender:profiles(id, name, avatar_url)
          `)
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true })
          .limit(50)

        if (error) throw error

        const formattedMessages: Message[] = data?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: {
            id: msg.sender?.[0]?.id || '',
            name: msg.sender?.[0]?.name || 'Unknown',
            avatar: msg.sender?.[0]?.avatar_url
          },
          timestamp: new Date(msg.created_at),
          type: msg.type,
          status: msg.status
        })) || []

        setMessages(formattedMessages)
      } catch (error) {
        console.error('Error loading messages:', error)
        toast.error('Mesajlar yüklenirken hata oluştu')
      }
    }

    loadMessages()
  }, [channelId])

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on('postgres_changes' as any, {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, (payload: SupabasePayload) => {
        const newMessage = payload.new
        const message: Message = {
          id: newMessage.id,
          content: newMessage.content,
          sender: {
            id: newMessage.sender_id,
            name: newMessage.sender_name || 'Unknown',
            avatar: newMessage.sender_avatar
          },
          timestamp: new Date(newMessage.created_at),
          type: newMessage.type,
          status: newMessage.status
        }
        setMessages(prev => [...prev, message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId])

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          sender_id: currentUser.id,
          content: newMessage,
          type: attachments.length > 0 ? 'file' : 'text',
          status: 'sent'
        })

      if (error) throw error

      setNewMessage('')
      setAttachments([])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Mesaj gönderilirken hata oluştu')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const startRecording = () => {
    setIsRecording(true)
    // Audio recording logic would go here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Stop recording and send audio message
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>GC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Genel Chat</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {messages.length} mesaj
                </Badge>
                <span>•</span>
                <span>Son görülme 2 dk önce</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[70%] ${message.sender.id === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.sender.id !== currentUser.id && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${message.sender.id === currentUser.id ? 'items-end' : 'items-start'}`}>
                    {message.sender.id !== currentUser.id && (
                      <span className="text-xs text-muted-foreground mb-1">
                        {message.sender.name}
                      </span>
                    )}
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.sender.id === currentUser.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.type === 'text' && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      {message.type === 'image' && (
                        <img 
                          src={message.content} 
                          alt="Shared image" 
                          className="max-w-full rounded"
                        />
                      )}
                      {message.type === 'file' && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{message.content}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender.id === currentUser.id && (
                        <span className="text-xs text-muted-foreground">
                          {message.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Typing indicator would go here */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-muted px-2 py-1 rounded">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-4 w-4 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message input */}
        <div className="p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 flex items-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="min-h-[40px] max-h-32 resize-none"
                  // multiline prop removed
                />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-8 w-8 p-0 ${isRecording ? 'text-red-500' : ''}`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() && attachments.length === 0}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
