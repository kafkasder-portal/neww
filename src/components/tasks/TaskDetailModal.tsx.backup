import React, { useState, useEffect } from 'react'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Flag, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Paperclip, 
  Activity,
  Plus,
  Download,
  CheckCircle,
  AlertTriangle,
  Target,
  FileText,
  Send,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { tasksApi } from '../../api/tasks'
import { Task, TaskComment, TaskAttachment, TaskActivity } from '@/types/collaboration'

import { useAuthStore } from '@store/auth'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TaskDetailModalProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export default function TaskDetailModal({
  taskId,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<TaskComment[]>([])
  const [attachments, setAttachments] = useState<TaskAttachment[]>([])
  const [activities, setActivities] = useState<TaskActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'attachments' | 'activity'>('overview')
  
  // Form states
  const [newComment, setNewComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  
  const { user } = useAuthStore()
  const canEditTask = true
  const canDeleteTask = true
  const canCompleteTask = true
  const currentUserId = user?.id

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails()
    }
  }, [isOpen, taskId])

  const fetchTaskDetails = async () => {
    setLoading(true)
    try {
      const [taskData, commentsData, attachmentsData, activitiesData] = await Promise.all([
        tasksApi.getTask(taskId),
        tasksApi.getTaskComments(taskId),
        tasksApi.getTaskAttachments(taskId),
        tasksApi.getTaskActivities(taskId)
      ])
      
      setTask(taskData)
      setComments(commentsData)
      setAttachments(attachmentsData)
      setActivities(activitiesData)
    } catch (error) {
      console.error('Failed to fetch task details:', error)
      toast.error('Görev detayları yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return

    try {
      const updatedTask = await tasksApi.updateTask(taskId, { status: newStatus })
      setTask(updatedTask)
      
      // Refresh activities to show the status change
      const newActivities = await tasksApi.getTaskActivities(taskId)
      setActivities(newActivities)
      
      toast.success('Görev durumu güncellendi')
    } catch (error) {
      console.error('Failed to update task status:', error)
      toast.error('Görev durumu güncellenirken hata oluştu')
    }
  }

  const handleDelete = async () => {
    if (!task) return

    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        await tasksApi.deleteTask(taskId)
        toast.success('Görev silindi')
        onDelete?.(taskId)
        onClose()
      } catch (error) {
        console.error('Failed to delete task:', error)
        toast.error('Görev silinirken hata oluştu')
      }
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const comment = await tasksApi.addTaskComment(taskId, newComment)
      setComments(prev => [...prev, comment])
      setNewComment('')
      setAddingComment(false)
      
      // Refresh activities
      const newActivities = await tasksApi.getTaskActivities(taskId)
      setActivities(newActivities)
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Yorum eklenirken hata oluştu')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const attachment = await tasksApi.uploadTaskAttachment(taskId, file)
      setAttachments(prev => [...prev, attachment])
    } catch (error) {
      console.error('Failed to upload file:', error)
      toast.error('Dosya yüklenirken hata oluştu')
    } finally {
      setUploadingFile(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return

    try {
      await tasksApi.deleteTaskAttachment(attachmentId)
      setAttachments(prev => prev.filter(a => a.id !== attachmentId))
    } catch (error) {
      console.error('Failed to delete attachment:', error)
      toast.error('Dosya silinirken hata oluştu')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'cancelled': return <X className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high': return <Flag className="h-4 w-4 text-orange-600" />
      case 'medium': return <Flag className="h-4 w-4 text-yellow-600" />
      default: return <Flag className="h-4 w-4 text-blue-600" />
    }
  }

  const getActivityIcon = (activityType: TaskActivity['activity_type']) => {
    switch (activityType) {
      case 'created': return <Plus className="h-4 w-4 text-green-600" />
      case 'assigned': return <User className="h-4 w-4 text-blue-600" />
      case 'status_changed': return <RotateCcw className="h-4 w-4 text-orange-600" />
      case 'commented': return <MessageSquare className="h-4 w-4 text-purple-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'due_date_changed': return <Calendar className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Görev Detayları</h2>
          </div>
          <div className="flex items-center space-x-2">
            {task && canEditTask && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit?.(task)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Düzenle
              </Button>
            )}
            {canDeleteTask && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Yükleniyor...</p>
          </div>
        ) : task ? (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: FileText },
                { id: 'comments', label: 'Yorumlar', icon: MessageSquare, count: comments.length },
                { id: 'attachments', label: 'Dosyalar', icon: Paperclip, count: attachments.length },
                { id: 'activity', label: 'Aktivite', icon: Activity, count: activities.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'comments' | 'attachments' | 'activity')}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Task Header */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{task.title}</h3>
                        {task.description && (
                          <p className="text-muted-foreground text-lg">{task.description}</p>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      {task.assigned_to === currentUserId && canCompleteTask && (
                        <div className="flex space-x-2 ml-4">
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange('in_progress')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Başlat
                            </Button>
                          )}
                          
                          {task.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange('pending')}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Duraklat
                            </Button>
                          )}
                          
                          {(task.status === 'pending' || task.status === 'in_progress') && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange('completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Tamamla
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status and Priority */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Durum ve Öncelik</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Durum</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tasksApi.getStatusColor(task.status)}`}>
                              {tasksApi.getStatusText(task.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Öncelik</span>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(task.priority)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tasksApi.getPriorityColor(task.priority)}`}>
                              {tasksApi.getPriorityText(task.priority)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Assignment and Dates */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Atama ve Tarihler</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Atanan</span>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Kullanıcı {task.assigned_to}</span>
                            {task.assigned_to === currentUserId && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Benim
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Oluşturan</span>
                          <span className="text-sm">Kullanıcı {task.assigned_by}</span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Bitiş Tarihi</span>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(task.due_date), 'dd MMM yyyy', { locale: tr })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Time Tracking */}
                    {(task.estimated_hours || task.actual_hours) && (
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Zaman Takibi</h4>
                        <div className="space-y-3">
                          {task.estimated_hours && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Tahmini Süre</span>
                              <span className="text-sm">{task.estimated_hours} saat</span>
                            </div>
                          )}
                          {task.actual_hours && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Harcanan Süre</span>
                              <span className="text-sm">{task.actual_hours} saat</span>
                            </div>
                          )}
                          {task.estimated_hours && task.actual_hours && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Verimlilik</span>
                              <span className={`text-sm ${
                                task.actual_hours <= task.estimated_hours ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {((task.estimated_hours / task.actual_hours) * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    {/* Category and Dates */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Kategori ve Tarihler</h4>
                      <div className="space-y-3">
                        {task.category && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Kategori</span>
                            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.category}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Oluşturulma</span>
                          <span className="text-sm">
                            {format(new Date(task.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Son Güncelleme</span>
                          <span className="text-sm">
                            {format(new Date(task.updated_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                          </span>
                        </div>
                        {task.completed_at && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tamamlanma</span>
                            <span className="text-sm text-green-600">
                              {format(new Date(task.completed_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Completion Notes */}
                  {task.completion_notes && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Tamamlanma Notları</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {task.completion_notes}
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Yorumlar ({comments.length})
                    </h3>
                    {!addingComment && (
                      <Button size="sm" onClick={() => setAddingComment(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yorum Ekle
                      </Button>
                    )}
                  </div>

                  {addingComment && (
                    <Card className="p-4">
                      <div className="space-y-3">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Yorumunuzu yazın..."
                          className="w-full h-24 p-3 border rounded-md resize-none"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddComment}>
                            <Send className="h-4 w-4 mr-2" />
                            Gönder
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setAddingComment(false)
                            setNewComment('')
                          }}>
                            İptal
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {comments.length > 0 ? (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                              U
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-sm">Kullanıcı {comment.user_id}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : !addingComment && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz yorum eklenmemiş</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Dosyalar ({attachments.length})
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {uploadingFile ? 'Yükleniyor...' : 'Dosya Ekle'}
                      </Button>
                    </div>
                  </div>
                  
                  {attachments.length > 0 ? (
                    <div className="grid gap-3">
                      {attachments.map((attachment) => (
                        <Card key={attachment.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Paperclip className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">{attachment.file_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatFileSize(attachment.file_size)} • 
                                  Yüklendi: {format(new Date(attachment.uploaded_at), 'dd MMM yyyy', { locale: tr })} • 
                                  Yükleyen: Kullanıcı {attachment.uploaded_by}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(attachment.file_url, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                İndir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAttachment(attachment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz dosya eklenmemiş</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Aktivite Geçmişi ({activities.length})
                  </h3>
                  
                  {activities.length > 0 ? (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <Card key={activity.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">Kullanıcı {activity.user_id}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">{activity.description}</p>
                              {activity.old_value && activity.new_value && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <span className="line-through">{activity.old_value}</span>
                                  {' → '}
                                  <span className="font-medium">{activity.new_value}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz aktivite kaydı yok</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Görev bulunamadı
          </div>
        )}
      </div>
    </div>
  )
}
