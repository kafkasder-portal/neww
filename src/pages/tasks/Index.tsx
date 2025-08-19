import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle, Clock, AlertTriangle, User, Search, Filter, Eye, Play, Check } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import TaskForm from '@components/tasks/TaskForm'
import TaskDetailModal from '@components/tasks/TaskDetailModal'
import { tasksApi } from '../../api/tasks'
import { Task } from '@/types/collaboration'
// import { usePermissions } from '@hooks/usePermissions'
import { useAuthStore } from '@store/auth'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function TasksIndex() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  // const permissions = usePermissions()
  const { user } = useAuthStore()
  // YETKİ KONTROLÜ KALDIRILDI - TÜM KULLANICILAR ERİŞEBİLİR
  const canCreateTask = true
  // const canViewTasks = true
  const canCompleteTask = true
  const currentUserId = user?.id

  useEffect(() => {
    // Yetki kontrolü kaldırıldı, direkt yükle
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await tasksApi.getTasks()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      toast.error('Görevler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    setShowForm(false)
    setEditingTask(null)
    fetchTasks()
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
    setDetailModalOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setDetailModalOpen(true)
  }

  const handleQuickStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await tasksApi.updateTask(taskId, { status: newStatus })
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      toast.success('Görev durumu güncellendi')
    } catch (error) {
      console.error('Failed to update task status:', error)
      toast.error('Görev durumu güncellenirken hata oluştu')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || 
                           (assigneeFilter === 'me' && task.assigned_to === currentUserId) ||
                           (assigneeFilter === 'others' && task.assigned_to !== currentUserId)
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  // Stats calculation
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    myTasks: tasks.filter(t => t.assigned_to === currentUserId).length
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Acil'
      case 'high': return 'Yüksek'
      case 'medium': return 'Orta'
      case 'low': return 'Düşük'
      default: return 'Orta'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı'
      case 'in_progress': return 'Devam Ediyor'
      case 'overdue': return 'Süresi Geçti'
      case 'cancelled': return 'İptal Edildi'
      default: return 'Bekliyor'
    }
  }

  // YETKİ KONTROLÜ KALDIRILDI - ERİŞİM ENGELİ KALKTI
  // if (!canViewTasks) {
  //   return (
  //     <div className="p-8 text-center">
  //       <h1 className="text-2xl font-bold text-muted-foreground">Erişim Engellendi</h1>
  //       <p className="text-muted-foreground mt-2">
  //         Bu sayfayı görüntülemek için yetkiniz bulunmamaktadır.
  //       </p>
  //     </div>
  //   )
  // }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          >
            ← Geri
          </Button>
          <h1 className="text-3xl font-bold">
            {editingTask ? 'Görev Düzenle' : 'Yeni Görev'}
          </h1>
        </div>
        
        <TaskForm
          onSuccess={handleCreateSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
          initialData={editingTask || undefined}
          isEditMode={!!editingTask}
          taskId={editingTask?.id}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Görevler</h1>
          <p className="text-muted-foreground">
            Görev atama ve takip sistemi
          </p>
        </div>
        {canCreateTask && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Görev
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Görev</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Devam Eden</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tamamlanan</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Süresi Geçen</p>
              <p className="text-2xl font-bold">{stats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Benim Görevlerim</p>
              <p className="text-2xl font-bold">{stats.myTasks}</p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Görev ara..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="overdue">Süresi Geçti</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="urgent">Acil</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
          <select
            value={assigneeFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">Tüm Atamalar</option>
            <option value="me">Benim Görevlerim</option>
            <option value="others">Diğer Görevler</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Görevler yükleniyor...</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Görev</th>
                    <th className="text-left p-4 font-medium">Atanan</th>
                    <th className="text-left p-4 font-medium">Bitiş Tarihi</th>
                    <th className="text-left p-4 font-medium">Öncelik</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-left p-4 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                          {task.category && (
                            <div className="text-xs text-muted-foreground mt-1 capitalize">
                              {task.category}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Kullanıcı {task.assigned_to}</span>
                          {task.assigned_to === currentUserId && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Benim
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {task.due_date ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(task.due_date), 'dd MMM yyyy', { locale: tr })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Belirsiz</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(task)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detay
                          </Button>
                          
                          {/* Quick Actions */}
                          {task.assigned_to === currentUserId && canCompleteTask && (
                            <>
                              {task.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {(task.status === 'pending' || task.status === 'in_progress') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickStatusChange(task.id, 'completed')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all' 
                ? 'Arama kriterlerine uygun görev bulunamadı' 
                : 'Henüz görev oluşturulmamış'
              }
            </div>
          )}
        </Card>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          taskId={selectedTask.id}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false)
            setSelectedTask(null)
          }}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}
