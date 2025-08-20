import { useState, useEffect } from 'react'
import { CheckCircle, Clock, User, MessageSquare, AlertCircle } from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useAuthStore } from '@store/auth'
import { realtimeService } from '@services/realtimeService'

import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import { supabase } from '@lib/supabase'

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  assigned_by: string
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  assignee?: {
    full_name: string
    avatar_url?: string
  }
  assigner?: {
    full_name: string
  }
}

interface TaskComment {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

interface RealtimeTaskUpdatesProps {
  className?: string
  showMyTasks?: boolean
  showAssignedByMe?: boolean
  onTaskClick?: (task: Task) => void
}

export function RealtimeTaskUpdates({ 
  className,
  showMyTasks = true,
  showAssignedByMe = false,
  onTaskClick
}: RealtimeTaskUpdatesProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [recentComments, setRecentComments] = useState<TaskComment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      loadTasks()
      loadRecentComments()
      subscribeToTaskUpdates()
    }
  }, [user, showMyTasks, showAssignedByMe])

  const loadTasks = async () => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:user_profiles!tasks_assigned_to_fkey(full_name, avatar_url),
          assigner:user_profiles!tasks_assigned_by_fkey(full_name)
        `)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (showMyTasks && !showAssignedByMe) {
        query = query.eq('assigned_to', user?.id)
      } else if (showAssignedByMe && !showMyTasks) {
        query = query.eq('assigned_by', user?.id)
      } else if (showMyTasks && showAssignedByMe) {
        query = query.or(`assigned_to.eq.${user?.id},assigned_by.eq.${user?.id}`)
      }

      const { data, error } = await query

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Görevler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const loadRecentComments = async () => {
    try {
      // Get recent comments from tasks user is involved in
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          user:user_profiles!task_comments_user_id_fkey(full_name, avatar_url),
          task:tasks!task_comments_task_id_fkey(
            title,
            assigned_to,
            assigned_by
          )
        `)
        .or(`tasks.assigned_to.eq.${user?.id},tasks.assigned_by.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentComments(data || [])
    } catch (error) {
      console.error('Error loading recent comments:', error)
    }
  }

  const subscribeToTaskUpdates = () => {
    if (!user) return

    // Subscribe to task updates
    const unsubscribeTasks = realtimeService.subscribeToTasks((event) => {
      switch (event.eventType) {
        case 'INSERT': {
          // New task assigned to user
          const newTask = event.new as Task
          if (newTask.assigned_to === user.id) {
            setTasks(prev => [newTask, ...prev.slice(0, 9)])
            toast.success(`Yeni görev atandı: ${newTask.title}`)
          }
          // Task created by user
          else if (newTask.assigned_by === user.id) {
            setTasks(prev => [newTask, ...prev.slice(0, 9)])
          }
          break
        }

        case 'UPDATE': {
          const updatedTask = event.new as Task
          const oldTask = event.old as Task
          setTasks(prev => 
            prev.map(task => 
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            )
          )

          // Show notification for status changes
          if (oldTask.status !== updatedTask.status) {
            if (updatedTask.status === 'completed') {
              toast.success(`Görev tamamlandı: ${updatedTask.title}`)
            } else if (updatedTask.status === 'in_progress') {
              toast.info(`Görev üzerinde çalışılmaya başlandı: ${updatedTask.title}`)
            }
          }
          break
        }

        case 'DELETE': {
          const deletedTask = event.old as Task
          setTasks(prev => prev.filter(task => task.id !== deletedTask.id))
          break
        }
      }
    })

    // Subscribe to comments on user's tasks
    const unsubscribeComments = realtimeService.subscribe(
      'task_comments',
      (event) => {
        if (event.eventType === 'INSERT') {
          const newComment = event.new as TaskComment
          // Only show if it's not the user's own comment
          if (newComment.user_id !== user.id) {
            setRecentComments(prev => [newComment, ...prev.slice(0, 4)])
            toast.info(`${newComment.user?.full_name} göreve yorum ekledi`)
          }
        }
      },
      { event: 'INSERT' }
    )

    return () => {
      unsubscribeTasks()
      unsubscribeComments()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Görev durumu güncellenemedi')
    }
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            {showMyTasks && !showAssignedByMe && 'Görevlerim'}
            {!showMyTasks && showAssignedByMe && 'Atadığım Görevler'}
            {showMyTasks && showAssignedByMe && 'Tüm Görevlerim'}
          </h3>
          <Badge variant="outline">
            {tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length} aktif
          </Badge>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Henüz görev bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(task.status)}
                      <h4 className="font-medium text-gray-900 truncate">
                        {task.title}
                      </h4>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{task.assignee.full_name}</span>
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(task.due_date) < new Date() ? 'Gecikmiş' : 
                             formatDistanceToNow(new Date(task.due_date), { addSuffix: true, locale: tr })}
                          </span>
                        </div>
                      )}

                      <span>
                        {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true, locale: tr })}
                      </span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status === 'todo' && task.assigned_to === user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTaskStatus(task.id, 'in_progress')
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        Başla
                      </Button>
                    )}
                    
                    {task.status === 'in_progress' && task.assigned_to === user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTaskStatus(task.id, 'completed')
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        Tamamla
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Tüm görevleri görüntüle ({tasks.length})
            </Button>
          </div>
        )}
      </Card>

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Son Yorumlar
          </h3>

          <div className="space-y-3">
            {recentComments.map(comment => (
              <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.user?.full_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {comment.content}
                    </p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
