// import { supabase } from '../lib/supabase'
import { 
  Task, 
  TaskComment, 
  TaskAttachment,
  TaskNotification,
  TaskActivity,
  CreateTaskData,
  TaskStats
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
const generateMockTasks = (): Task[] => [
  {
    id: 'task_1',
    title: 'Yıllık Bütçe Raporu Hazırlama',
    description: 'Dernek 2024 yılı bütçe raporunu hazırlamak ve sunuma uygun hale getirmek',
    assigned_to: 'user2',
    assigned_by: 'user1',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'in_progress',
    category: 'Finans',
    estimated_hours: 20,
    actual_hours: 12,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task_2',
    title: 'Yeni Proje Önerisi Değerlendirmesi',
    description: 'Gelen proje önerilerini teknik ve bütçe açısından değerlendirme',
    assigned_to: 'user3',
    assigned_by: 'user1',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    status: 'pending',
    category: 'Proje Yönetimi',
    estimated_hours: 8,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task_3',
    title: 'Web Sitesi Güncelleme',
    description: 'Dernek web sitesindeki güncel olmayan bilgileri güncelleme',
    assigned_to: 'user1',
    assigned_by: 'user2',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    status: 'pending',
    category: 'İletişim',
    estimated_hours: 4,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task_4',
    title: 'Toplantı Salonu Rezervasyonu',
    description: 'Gelecek ay yapılacak genel kurul için toplantı salonu rezerve etme',
    assigned_to: 'user2',
    assigned_by: 'user3',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'urgent',
    status: 'overdue',
    category: 'Organizasyon',
    estimated_hours: 2,
    actual_hours: 1,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task_5',
    title: 'Bağışçı Teşekkür Mektupları',
    description: 'Bu ay bağış yapan tüm kişilere teşekkür mektupları hazırlayıp gönderme',
    assigned_to: 'user3',
    assigned_by: 'user1',
    priority: 'medium',
    status: 'completed',
    category: 'İletişim',
    estimated_hours: 6,
    actual_hours: 5,
    completion_notes: 'Tüm mektuplar hazırlandı ve gönderildi. Pozitif geri dönüşler alındı.',
    completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const generateMockComments = (taskId: string): TaskComment[] => [
  {
    id: 'comment_1',
    task_id: taskId,
    user_id: 'user1',
    content: 'Bu görev için ek kaynaklara ihtiyacımız olabilir. Finans ekibiyle görüştüm.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment_2',
    task_id: taskId,
    user_id: 'user2',
    content: 'Öncelikli verilerimi topladım. Yakında raporlamaya başlayacağım.',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment_3',
    task_id: taskId,
    user_id: 'user3',
    content: 'Harika! Herhangi bir desteğe ihtiyaç duyarsan bana ulaşabilirsin.',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
]

const generateMockAttachments = (taskId: string): TaskAttachment[] => [
  {
    id: 'attachment_1',
    task_id: taskId,
    file_name: 'budget_template.xlsx',
    file_url: 'https://example.com/budget_template.xlsx',
    file_size: 156780,
    uploaded_by: 'user1',
    uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'attachment_2',
    task_id: taskId,
    file_name: 'requirements.pdf',
    file_url: 'https://example.com/requirements.pdf',
    file_size: 245890,
    uploaded_by: 'user2',
    uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const generateMockActivities = (taskId: string): TaskActivity[] => [
  {
    id: 'activity_1',
    task_id: taskId,
    user_id: 'user1',
    activity_type: 'created',
    description: 'Görev oluşturuldu',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity_2',
    task_id: taskId,
    user_id: 'user1',
    activity_type: 'assigned',
    old_value: '',
    new_value: 'user2',
    description: 'Görev kullanıcıya atandı',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity_3',
    task_id: taskId,
    user_id: 'user2',
    activity_type: 'status_changed',
    old_value: 'pending',
    new_value: 'in_progress',
    description: 'Durum "Bekliyor" den "Devam Ediyor" ya değiştirildi',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity_4',
    task_id: taskId,
    user_id: 'user3',
    activity_type: 'commented',
    description: 'Göreve yorum ekledi',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// =====================================================
// Tasks API
// =====================================================

export const tasksApi = {
  // =====================================================
  // Tasks CRUD Operations
  // =====================================================

  async getTasks(): Promise<Task[]> {
    try {
      // Mock data for now - replace with real Supabase calls when tables are ready
      return generateMockTasks()
    } catch (error) {
      handleApiError(error, 'getTasks')
      return []
    }
  },

  async getTask(id: string): Promise<Task | null> {
    try {
      const tasks = generateMockTasks()
      return tasks.find(t => t.id === id) || null
    } catch (error) {
      handleApiError(error, 'getTask')
      return null
    }
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
        assigned_by: 'current_user',
        due_date: data.due_date,
        priority: data.priority,
        status: 'pending',
        category: data.category,
        estimated_hours: data.estimated_hours,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: task, _error } = await supabase
      //   .from('tasks')
      //   .insert([newTask])
      //   .select()
      //   .single()

      // Create activity log
      await this.createActivity(newTask.id, 'created', 'Görev oluşturuldu')
      await this.createActivity(newTask.id, 'assigned', 'Görev atandı', '', data.assigned_to)

      // Send notification to assigned user
      await this.createNotification(data.assigned_to, newTask.id, 'assignment', 'Yeni Görev', `"${newTask.title}" görevi size atandı.`)

      toast.success('Görev başarıyla oluşturuldu')
      return newTask
    } catch (error) {
      handleApiError(error, 'createTask')
      throw error
    }
  },

  async updateTask(_id: string, _data: Partial<CreateTaskData & { status: Task['status'] }>): Promise<Task> {
    try {
      const tasks = generateMockTasks()
      const existingTask = tasks.find(t => t.id === _id)
      
      if (!existingTask) {
        throw new Error('Görev bulunamadı')
      }

      const updatedTask: Task = {
        ...existingTask,
        ..._data,
        updated_at: new Date().toISOString(),
        ...(_data.status === 'completed' && !existingTask.completed_at ? {
          completed_at: new Date().toISOString()
        } : {})
      }

      // In real implementation, update in Supabase
      // const { _data: task, _error } = await supabase
      //   .from('tasks')
      //   .update(_data)
      //   .eq('id', _id)
      //   .select()
      //   .single()

      // Log status changes
      if (_data.status && _data.status !== existingTask.status) {
        await this.createActivity(_id, 'status_changed', 
          `Durum "${this.getStatusText(existingTask.status)}" den "${this.getStatusText(_data.status)}" ya değiştirildi`,
          existingTask.status, _data.status)
        
        // Send notification for status changes
        if (_data.status === 'completed') {
          await this.createNotification(existingTask.assigned_by, _id, 'completion', 'Görev Tamamlandı', 
            `"${existingTask.title}" görevi tamamlandı.`)
        }
      }

      toast.success('Görev başarıyla güncellendi')
      return updatedTask
    } catch (error) {
      handleApiError(error, 'updateTask')
      throw error
    }
  },

  async deleteTask(_id: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase (or soft delete)
      // const { _error } = await supabase
      //   .from('tasks')
      //   .delete()
      //   .eq('id', _id)

      toast.success('Görev başarıyla silindi')
    } catch (error) {
      handleApiError(error, 'deleteTask')
      throw error
    }
  },

  async assignTask(taskId: string, userId: string): Promise<void> {
    try {
      const task = await this.getTask(taskId)
      if (!task) throw new Error('Görev bulunamadı')

      await this.updateTask(taskId, { assigned_to: userId })
      await this.createActivity(taskId, 'assigned', 'Görev yeniden atandı', task.assigned_to, userId)
      await this.createNotification(userId, taskId, 'assignment', 'Görev Atandı', `"${task.title}" görevi size atandı.`)
    } catch (error) {
      handleApiError(error, 'assignTask')
      throw error
    }
  },

  // =====================================================
  // Task Comments
  // =====================================================

  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    try {
      return generateMockComments(taskId)
    } catch (error) {
      handleApiError(error, 'getTaskComments')
      return []
    }
  },

  async addTaskComment(taskId: string, content: string): Promise<TaskComment> {
    try {
      const newComment: TaskComment = {
        id: `comment_${Date.now()}`,
        task_id: taskId,
        user_id: 'current_user',
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: comment, _error } = await supabase
      //   .from('task_comments')
      //   .insert([newComment])
      //   .select()
      //   .single()

      // Create activity and notification
      await this.createActivity(taskId, 'commented', 'Göreve yorum eklendi')
      
      const task = await this.getTask(taskId)
      if (task) {
        await this.createNotification(task.assigned_to, taskId, 'comment', 'Yeni Yorum', 
          `"${task.title}" görevine yeni yorum eklendi.`)
      }

      toast.success('Yorum eklendi')
      return newComment
    } catch (error) {
      handleApiError(error, 'addTaskComment')
      throw error
    }
  },

  async updateTaskComment(commentId: string, content: string): Promise<TaskComment> {
    try {
      // Mock update
      const comments = generateMockComments('task_1')
      const existingComment = comments.find(c => c.id === commentId)
      
      if (!existingComment) {
        throw new Error('Yorum bulunamadı')
      }

      const updatedComment: TaskComment = {
        ...existingComment,
        content,
        updated_at: new Date().toISOString()
      }

      toast.success('Yorum güncellendi')
      return updatedComment
    } catch (error) {
      handleApiError(error, 'updateTaskComment')
      throw error
    }
  },

  async deleteTaskComment(_commentId: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase
      // const { _error } = await supabase
      //   .from('task_comments')
      //   .delete()
      //   .eq('id', commentId)

      toast.success('Yorum silindi')
    } catch (error) {
      handleApiError(error, 'deleteTaskComment')
      throw error
    }
  },

  // =====================================================
  // Task Attachments
  // =====================================================

  async getTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
    try {
      return generateMockAttachments(taskId)
    } catch (error) {
      handleApiError(error, 'getTaskAttachments')
      return []
    }
  },

  async uploadTaskAttachment(taskId: string, file: File): Promise<TaskAttachment> {
    try {
      // File validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (file.size > maxSize) {
        throw new Error('Dosya boyutu 10MB\'den küçük olmalıdır')
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Desteklenmeyen dosya türü')
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      // const filePath = `tasks/${fileName}`;

      // In real implementation, upload to Supabase Storage
      // const { _data, _error } = await supabase.storage
      //   .from('uploads')
      //   .upload(filePath, file);

      // if (error) throw error;

      // const { _data: urlData } = supabase.storage
      //   .from('uploads')
      //   .getPublicUrl(filePath);

      const newAttachment: TaskAttachment = {
        id: `attachment_${Date.now()}`,
        task_id: taskId,
        file_name: file.name,
        file_url: `https://example.com/${fileName}`, // Mock URL
        file_size: file.size,
        uploaded_by: 'current_user',
        uploaded_at: new Date().toISOString()
      }

      toast.success('Dosya yüklendi')
      return newAttachment
    } catch (error) {
      handleApiError(error, 'uploadTaskAttachment')
      throw error
    }
  },

  async deleteTaskAttachment(_attachmentId: string): Promise<void> {
    try {
      // In real implementation, delete from Supabase and storage
      // const { _error } = await supabase
      //   .from('task_attachments')
      //   .delete()
      //   .eq('id', attachmentId)

      toast.success('Dosya silindi')
    } catch (error) {
      handleApiError(error, 'deleteTaskAttachment')
      throw error
    }
  },

  // =====================================================
  // Task Activities
  // =====================================================

  async getTaskActivities(taskId: string): Promise<TaskActivity[]> {
    try {
      return generateMockActivities(taskId)
    } catch (error) {
      handleApiError(error, 'getTaskActivities')
      return []
    }
  },

  async createActivity(
    taskId: string, 
    activityType: TaskActivity['activity_type'], 
    description: string,
    oldValue?: string,
    newValue?: string
  ): Promise<TaskActivity> {
    try {
      const newActivity: TaskActivity = {
        id: `activity_${Date.now()}`,
        task_id: taskId,
        user_id: 'current_user',
        activity_type: activityType,
        old_value: oldValue,
        new_value: newValue,
        description,
        created_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: activity, _error } = await supabase
      //   .from('task_activities')
      //   .insert([newActivity])
      //   .select()
      //   .single()

      return newActivity
    } catch (error) {
      console.error('Failed to create activity:', error)
      throw error
    }
  },

  // =====================================================
  // Task Notifications
  // =====================================================

  async getTaskNotifications(userId: string): Promise<TaskNotification[]> {
    try {
      const mockNotifications: TaskNotification[] = [
        {
          id: 'notif_1',
          task_id: 'task_1',
          user_id: userId,
          type: 'assignment',
          title: 'Yeni Görev Atandı',
          message: '"Yıllık Bütçe Raporu Hazırlama" görevi size atandı.',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'notif_2',
          task_id: 'task_2',
          user_id: userId,
          type: 'due_reminder',
          title: 'Görev Süresi Yaklaşıyor',
          message: '"Yeni Proje Önerisi Değerlendirmesi" görevinin süresi yaklaşıyor.',
          is_read: false,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]

      return mockNotifications
    } catch (error) {
      handleApiError(error, 'getTaskNotifications')
      return []
    }
  },

  async createNotification(
    userId: string,
    taskId: string,
    type: TaskNotification['type'],
    title: string,
    message: string
  ): Promise<TaskNotification> {
    try {
      const newNotification: TaskNotification = {
        id: `notif_${Date.now()}`,
        task_id: taskId,
        user_id: userId,
        type,
        title,
        message,
        is_read: false,
        created_at: new Date().toISOString()
      }

      // In real implementation, save to Supabase
      // const { _data: notification, _error } = await supabase
      //   .from('task_notifications')
      //   .insert([newNotification])
      //   .select()
      //   .single()

      return newNotification
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  },

  async markNotificationAsRead(_notificationId: string): Promise<void> {
    try {
      // In real implementation, update in Supabase
      // const { _error } = await supabase
      //   .from('task_notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('id', notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  // =====================================================
  // Task Statistics
  // =====================================================

  async getTaskStats(): Promise<TaskStats> {
    try {
      const tasks = generateMockTasks()
      
      const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status === 'overdue').length,
        completion_rate: tasks.length > 0 ? 
          (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0
      }

      return stats
    } catch (error) {
      handleApiError(error, 'getTaskStats')
      return {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
        completion_rate: 0
      }
    }
  },

  // =====================================================
  // Search and Filters
  // =====================================================

  async searchTasks(query: string, filters?: {
    status?: Task['status']
    priority?: Task['priority']
    assigned_to?: string
    category?: string
  }): Promise<Task[]> {
    try {
      let tasks = generateMockTasks()

      // Apply search query
      if (query) {
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase()) ||
          task.category?.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Apply filters
      if (filters) {
        if (filters.status) {
          tasks = tasks.filter(task => task.status === filters.status)
        }
        if (filters.priority) {
          tasks = tasks.filter(task => task.priority === filters.priority)
        }
        if (filters.assigned_to) {
          tasks = tasks.filter(task => task.assigned_to === filters.assigned_to)
        }
        if (filters.category) {
          tasks = tasks.filter(task => task.category === filters.category)
        }
      }

      return tasks
    } catch (error) {
      handleApiError(error, 'searchTasks')
      return []
    }
  },

  async getTasksByUser(userId: string): Promise<Task[]> {
    try {
      const tasks = generateMockTasks()
      return tasks.filter(task => task.assigned_to === userId)
    } catch (error) {
      handleApiError(error, 'getTasksByUser')
      return []
    }
  },

  async getOverdueTasks(): Promise<Task[]> {
    try {
      const tasks = generateMockTasks()
      const now = new Date()
      
      return tasks.filter(task => {
        if (!task.due_date || task.status === 'completed' || task.status === 'cancelled') {
          return false
        }
        return new Date(task.due_date) < now
      })
    } catch (error) {
      handleApiError(error, 'getOverdueTasks')
      return []
    }
  },

  // =====================================================
  // Helper Functions
  // =====================================================

  getStatusText(status: Task['status']): string {
    const statusMap = {
      'pending': 'Bekliyor',
      'in_progress': 'Devam Ediyor',
      'completed': 'Tamamlandı',
      'cancelled': 'İptal Edildi',
      'overdue': 'Süresi Geçti'
    }
    return statusMap[status] || status
  },

  getPriorityText(priority: Task['priority']): string {
    const priorityMap = {
      'low': 'Düşük',
      'medium': 'Orta',
      'high': 'Yüksek',
      'urgent': 'Acil'
    }
    return priorityMap[priority] || priority
  },

  getPriorityColor(priority: Task['priority']): string {
    const colorMap = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    }
    return colorMap[priority] || 'bg-gray-100 text-gray-800'
  },

  getStatusColor(status: Task['status']): string {
    const colorMap = {
      'pending': 'bg-gray-100 text-gray-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'overdue': 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }
}

export default tasksApi
