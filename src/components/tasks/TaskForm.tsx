import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, X, User, Calendar, Flag, Clock, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { tasksApi } from '../../api/tasks'
import type { Task } from '../../types/tasks'

interface CreateTaskData {
  title: string
  description?: string
  assigned_to: string
  due_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  estimated_hours?: number
}
import toast from 'react-hot-toast'

const taskSchema = z.object({
  title: z.string().min(1, 'Görev başlığı zorunludur'),
  description: z.string().optional(),
  assigned_to: z.string().min(1, 'Görev atanacak kişi seçilmelidir'),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.string().optional(),
  estimated_hours: z.number().min(0).optional()
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<CreateTaskData | Task>
  isEditMode?: boolean
  taskId?: string
}

export default function TaskForm({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false,
  taskId
}: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  
  const canCreateTask = true
  const canEditTask = true
  const canAssignTask = true

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      assigned_to: initialData?.assigned_to || '',
      due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : '',
      priority: initialData?.priority || 'medium',
      category: initialData?.category || '',
      estimated_hours: initialData?.estimated_hours || 0
    }
  })

  const priority = watch('priority')

  const onSubmit = async (data: TaskFormData) => {
    if ((!canCreateTask && !isEditMode) || (!canEditTask && isEditMode)) {
      toast.error('Bu işlem için yetkiniz bulunmamaktadır')
      return
    }

    setLoading(true)
    try {
      const taskData: CreateTaskData = {
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
        priority: data.priority,
        category: data.category,
        estimated_hours: data.estimated_hours
      }

      if (isEditMode && taskId) {
        await tasksApi.updateTask(taskId, taskData)
        toast.success('Görev güncellendi')
      } else {
        await tasksApi.createTask(taskData)
        toast.success('Görev oluşturuldu')
      }

      onSuccess?.()
    } catch (error) {
      console.error('Task operation failed:', error)
      toast.error(isEditMode ? 'Görev güncellenirken hata oluştu' : 'Görev oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-300 bg-white'
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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Görev Düzenle' : 'Yeni Görev Oluştur'}
        </h2>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Başlık */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Görev Başlığı *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Görev başlığını giriniz"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Açıklama
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Görev açıklamasını giriniz"
          />
        </div>

        {/* Atanan Kişi ve Öncelik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Atanan Kişi *
            </label>
            <select
              {...register('assigned_to')}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={!canAssignTask}
            >
              <option value="">Kişi seçin</option>
              <option value="user1">Ali Veli</option>
              <option value="user2">Ayşe Demir</option>
              <option value="user3">Mehmet Can</option>
            </select>
            {errors.assigned_to && (
              <p className="text-red-500 text-sm mt-1">{errors.assigned_to.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              <Flag className="h-4 w-4 inline mr-2" />
              Öncelik
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['low', 'medium', 'high', 'urgent'].map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-center p-2 border-2 rounded-md cursor-pointer transition-all ${
                    priority === p
                      ? getPriorityColor(p)
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    {...register('priority')}
                    type="radio"
                    value={p}
                    className="sr-only"
                  />
                  <span className="text-xs font-medium">{getPriorityText(p)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Bitiş Tarihi ve Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Bitiş Tarihi
            </label>
            <input
              {...register('due_date')}
              type="datetime-local"
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              <Tag className="h-4 w-4 inline mr-2" />
              Kategori
            </label>
            <select
              {...register('category')}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Kategori seçin</option>
              <option value="development">Geliştirme</option>
              <option value="reporting">Raporlama</option>
              <option value="database">Veritabanı</option>
              <option value="design">Tasarım</option>
              <option value="testing">Test</option>
              <option value="documentation">Dökümantasyon</option>
            </select>
          </div>
        </div>

        {/* Tahmini Süre */}
        <div>
          <label htmlFor="estimated_hours" className="block text-sm font-medium mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Tahmini Süre (Saat)
          </label>
          <input
            {...register('estimated_hours', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.5"
            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="0"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
