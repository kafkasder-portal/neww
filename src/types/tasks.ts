export interface Task {
  id: string
  title: string
  description?: string
  assigned_to: string
  assigned_by: string
  due_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  category?: string
  estimated_hours?: number
  actual_hours?: number
  completion_notes?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface TaskComment {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface TaskAttachment {
  id: string
  task_id: string
  file_name: string
  file_url: string
  file_size: number
  uploaded_by: string
  uploaded_at: string
}

export interface TaskNotification {
  id: string
  task_id: string
  user_id: string
  type: 'assignment' | 'due_reminder' | 'completion' | 'comment' | 'status_change'
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface TaskActivity {
  id: string
  task_id: string
  user_id: string
  activity_type: 'created' | 'assigned' | 'status_changed' | 'commented' | 'completed' | 'due_date_changed'
  old_value?: string
  new_value?: string
  description: string
  created_at: string
}

export interface TaskStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
  completion_rate: number
  avg_completion_time: number
}

export interface UserTaskStats {
  user_id: string
  user_name: string
  total_assigned: number
  completed: number
  pending: number
  overdue: number
  completion_rate: number
  avg_completion_time: number
}

export interface TaskWithDetails extends Task {
  assigned_to_user: {
    id: string
    full_name: string
    avatar_url?: string
  }
  assigned_by_user: {
    id: string
    full_name: string
  }
  comments: (TaskComment & {
    user: {
      full_name: string
      avatar_url?: string
    }
  })[]
  attachments: TaskAttachment[]
  activities: (TaskActivity & {
    user: {
      full_name: string
    }
  })[]
}

export interface TaskFilter {
  status?: Task['status'][]
  priority?: Task['priority'][]
  assigned_to?: string[]
  assigned_by?: string[]
  category?: string[]
  due_date_from?: string
  due_date_to?: string
  created_date_from?: string
  created_date_to?: string
}

export type TaskFormData = Omit<Task, 'id' | 'status' | 'created_at' | 'updated_at' | 'completed_at'> & {
  attachments?: File[]
}

export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']
export type ActivityType = TaskActivity['activity_type']
export type NotificationType = TaskNotification['type']

export const TASK_PRIORITY_COLORS = {
  low: 'bg-brand-primary/10 text-brand-primary',
  medium: 'bg-semantic-warning/10 text-semantic-warning',
  high: 'bg-semantic-warning text-white',
  urgent: 'bg-semantic-destructive/10 text-semantic-destructive'
}

export const TASK_STATUS_COLORS = {
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-brand-primary/10 text-brand-primary',
  completed: 'bg-semantic-success/10 text-semantic-success',
  cancelled: 'bg-semantic-destructive/10 text-semantic-destructive',
  overdue: 'bg-semantic-destructive/10 text-semantic-destructive'
}

export const TASK_PRIORITY_LABELS = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil'
}

export const TASK_STATUS_LABELS = {
  pending: 'Bekliyor',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  overdue: 'Süresi Geçti'
}
