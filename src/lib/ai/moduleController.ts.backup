import { supabase } from '../supabase'
import type { ProcessedCommand, CommandResult } from './commandProcessor'
import { uploadBeneficiaryDocument } from '../documents'

export type ModuleAction = {
  create?: (data: any) => Promise<any>
  read?: (params?: any) => Promise<any>
  update?: (id: string, data: any) => Promise<any>
  delete?: (id: string) => Promise<any>
  list?: (filters?: any) => Promise<any>
  export?: (filters?: any) => Promise<any>
  search?: (query: string) => Promise<any>
  report?: (params?: any) => Promise<any>
  custom?: Record<string, (params: any) => Promise<any>>
}

export class ModuleController {
  private modules: Record<string, ModuleAction> = {}

  constructor() {
    this.initializeModules()
  }

  private initializeModules() {
    // Hak Sahibi Modülü
    this.modules.beneficiaries = {
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('beneficiaries')
          .insert([{
            name: data.name,
            surname: data.surname,
            phone: data.phone,
            email: data.email,
            address: data.address,
            notes: data.notes,
            status: 'active'
          }])
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      read: async (params) => {
        let query = supabase.from('beneficiaries').select('*')
        
        if (params?.id) {
          query = query.eq('id', params.id)
          const { data, error } = await query.single()
          if (error) throw error
          return data
        }
        
        if (params?.name) {
          query = query.ilike('name', `%${params.name}%`)
        }
        if (params?.status) {
          query = query.eq('status', params.status)
        }
        if (params?.limit) {
          query = query.limit(params.limit)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('beneficiaries')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('beneficiaries')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        return { success: true }
      },
      
      list: async (filters = {}) => {
        let query = supabase.from('beneficiaries').select('*')
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
        
        const { data, error } = await query.order('created_at', { ascending: false })
        if (error) throw error
        return data
      },
      
      search: async (searchTerm) => {
        const { data, error } = await supabase
          .from('beneficiaries')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
          .limit(50)
        
        if (error) throw error
        return data
      },
      
      export: async (filters = {}) => {
        const data = await this.modules.beneficiaries.list!(filters)
        // CSV export logic burada olacak
        return { format: 'csv', data, filename: `beneficiaries_${Date.now()}.csv` }
      },
      
      custom: {
        uploadDocument: async (params: { id: string, file: File, type?: string }) => {
          return await uploadBeneficiaryDocument(params.id, params.file, params.type || 'document')
        },
        
        getStatistics: async () => {
          const [
            { count: totalCount },
            { count: activeCount },
            { count: monthlyCount }
          ] = await Promise.all([
            supabase.from('beneficiaries').select('*', { count: 'exact', head: true }),
            supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('beneficiaries').select('*', { count: 'exact', head: true })
              .gte('created_at', new Date(new Date().setDate(1)).toISOString())
          ])
          
          return {
            total: totalCount || 0,
            active: activeCount || 0,
            newThisMonth: monthlyCount || 0
          }
        }
      }
    }

    // Bağış Modülü
    this.modules.donations = {
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('donations')
          .insert([{
            donor_name: data.donorName,
            amount: data.amount,
            currency: data.currency || 'TRY',
            method: data.method || 'cash',
            notes: data.notes,
            status: 'completed'
          }])
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      list: async (filters = {}) => {
        let query = supabase.from('donations').select('*')
        
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom)
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo)
        }
        if (filters.method) {
          query = query.eq('method', filters.method)
        }
        if (filters.minAmount) {
          query = query.gte('amount', filters.minAmount)
        }
        
        const { data, error } = await query.order('created_at', { ascending: false })
        if (error) throw error
        return data
      },
      
      report: async (params = {}) => {
        const { data, error } = await supabase
          .from('donations')
          .select('amount, currency, method, created_at')
          .gte('created_at', params.dateFrom || new Date(new Date().setMonth(0, 1)).toISOString())
          .lte('created_at', params.dateTo || new Date().toISOString())
        
        if (error) throw error
        
        const summary = data.reduce((acc, donation) => {
          const method = donation.method || 'unknown'
          if (!acc[method]) acc[method] = { count: 0, total: 0 }
          acc[method].count++
          acc[method].total += donation.amount
          return acc
        }, {} as Record<string, { count: number, total: number }>)
        
        return {
          donations: data,
          summary,
          totalAmount: data.reduce((sum, d) => sum + d.amount, 0),
          totalCount: data.length
        }
      }
    }

    // Toplantı Modülü
    this.modules.meetings = {
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('meetings')
          .insert([{
            title: data.title,
            description: data.description,
            meeting_date: data.date,
            location: data.location,
            organizer_id: data.organizerId,
            status: 'scheduled'
          }])
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      list: async (filters = {}) => {
        let query = supabase.from('meetings').select(`
          *,
          organizer:organizer_id(name, surname)
        `)
        
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.dateFrom) {
          query = query.gte('meeting_date', filters.dateFrom)
        }
        if (filters.dateTo) {
          query = query.lte('meeting_date', filters.dateTo)
        }
        
        const { data, error } = await query.order('meeting_date', { ascending: true })
        if (error) throw error
        return data
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('meetings')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        return result
      }
    }

    // Görev Modülü
    this.modules.tasks = {
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('tasks')
          .insert([{
            title: data.title,
            description: data.description,
            assigned_to: data.assignedTo,
            priority: data.priority || 'medium',
            due_date: data.dueDate,
            status: 'pending'
          }])
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      list: async (filters = {}) => {
        let query = supabase.from('tasks').select(`
          *,
          assigned_user:assigned_to(name, surname)
        `)
        
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.priority) {
          query = query.eq('priority', filters.priority)
        }
        if (filters.assignedTo) {
          query = query.eq('assigned_to', filters.assignedTo)
        }
        
        const { data, error } = await query.order('created_at', { ascending: false })
        if (error) throw error
        return data
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('tasks')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      custom: {
        markCompleted: async (params: { id: string }) => {
          return await this.modules.tasks.update!(params.id, { 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
        },
        
        assignBulk: async (params: { taskIds: string[], assignedTo: string }) => {
          const updates = params.taskIds.map(id => 
            this.modules.tasks.update!(id, { assigned_to: params.assignedTo })
          )
          return await Promise.all(updates)
        }
      }
    }

    // Mesaj Modülü
    this.modules.messages = {
      create: async (data) => {
        // Burada gerçek SMS/Email API entegrasyonu olacak
        const { data: result, error } = await supabase
          .from('messages')
          .insert([{
            title: data.title,
            content: data.content,
            type: data.type || 'sms',
            status: 'sent',
            sent_at: new Date().toISOString()
          }])
          .select()
          .single()
        
        if (error) throw error
        return result
      },
      
      list: async (filters = {}) => {
        let query = supabase.from('messages').select('*')
        
        if (filters.type) {
          query = query.eq('type', filters.type)
        }
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        
        const { data, error } = await query.order('sent_at', { ascending: false })
        if (error) throw error
        return data
      },
      
      custom: {
        sendBulk: async (params: { title: string, content: string, recipients: string[], type: 'sms' | 'email' }) => {
          const messages = params.recipients.map(recipient => ({
            title: params.title,
            content: params.content,
            type: params.type,
            recipient: recipient,
            status: 'sent',
            sent_at: new Date().toISOString()
          }))
          
          const { data, error } = await supabase
            .from('messages')
            .insert(messages)
            .select()
          
          if (error) throw error
          return data
        }
      }
    }

    // Sistem Modülü
    this.modules.system = {
      custom: {
        getUsers: async (filters = {}) => {
          let query = supabase.from('users').select('*')
          
          if (filters.role) {
            query = query.eq('role', filters.role)
          }
          if (filters.status) {
            query = query.eq('status', filters.status)
          }
          
          const { data, error } = await query
          if (error) throw error
          return data
        },
        
        updateUserRole: async (params: { userId: string, role: string }) => {
          const { data, error } = await supabase
            .from('users')
            .update({ role: params.role })
            .eq('id', params.userId)
            .select()
            .single()
          
          if (error) throw error
          return data
        },
        
        getSystemStats: async () => {
          const [
            { count: usersCount },
            { count: beneficiariesCount },
            { count: donationsCount },
            { count: tasksCount }
          ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('beneficiaries').select('*', { count: 'exact', head: true }),
            supabase.from('donations').select('*', { count: 'exact', head: true }),
            supabase.from('tasks').select('*', { count: 'exact', head: true })
          ])
          
          return {
            users: usersCount || 0,
            beneficiaries: beneficiariesCount || 0,
            donations: donationsCount || 0,
            tasks: tasksCount || 0
          }
        }
      }
    }
  }

  async executeCommand(command: ProcessedCommand): Promise<CommandResult> {
    try {
      const { module, action, parameters, target, conditions } = command
      
      if (!module || !this.modules[module]) {
        return {
          success: false,
          message: `Modül bulunamadı: ${module}`,
          suggestions: ['Desteklenen modüller: ' + Object.keys(this.modules).join(', ')]
        }
      }

      const moduleActions = this.modules[module]
      let result: any

      switch (action) {
        case 'create':
        case 'add':
          if (!moduleActions.create) {
            return { success: false, message: `${module} modülünde oluşturma işlemi desteklenmiyor` }
          }
          result = await moduleActions.create(parameters)
          break

        case 'list':
        case 'show':
          if (!moduleActions.list) {
            return { success: false, message: `${module} modülünde listeleme işlemi desteklenmiyor` }
          }
          result = await moduleActions.list(conditions)
          break

        case 'search':
        case 'find':
          if (!moduleActions.search) {
            return { success: false, message: `${module} modülünde arama işlemi desteklenmiyor` }
          }
          result = await moduleActions.search(target || '')
          break

        case 'update':
        case 'edit':
          if (!moduleActions.update || !target) {
            return { success: false, message: `${module} modülünde güncelleme işlemi desteklenmiyor veya hedef belirtilmedi` }
          }
          result = await moduleActions.update(target, parameters)
          break

        case 'delete':
        case 'remove':
          if (!moduleActions.delete || !target) {
            return { success: false, message: `${module} modülünde silme işlemi desteklenmiyor veya hedef belirtilmedi` }
          }
          result = await moduleActions.delete(target)
          break

        case 'export':
          if (!moduleActions.export) {
            return { success: false, message: `${module} modülünde dışa aktarma işlemi desteklenmiyor` }
          }
          result = await moduleActions.export(conditions)
          break

        case 'report':
          if (!moduleActions.report) {
            return { success: false, message: `${module} modülünde rapor işlemi desteklenmiyor` }
          }
          result = await moduleActions.report(parameters)
          break

        default:
          // Özel işlemler
          if (moduleActions.custom && moduleActions.custom[action]) {
            result = await moduleActions.custom[action]({ ...parameters, target, ...conditions })
          } else {
            return {
              success: false,
              message: `Desteklenmeyen işlem: ${action}`,
              suggestions: this.getAvailableActions(module)
            }
          }
      }

      return {
        success: true,
        message: this.generateSuccessMessage(action, module, result),
        data: result,
        nextSteps: this.generateNextSteps(action, module)
      }

    } catch (error: any) {
      return {
        success: false,
        message: `Hata oluştu: ${error.message}`,
        suggestions: ['Komutunuzu kontrol edin ve tekrar deneyin']
      }
    }
  }

  private generateSuccessMessage(action: string, module: string, result: any): string {
    const moduleNames: Record<string, string> = {
      beneficiaries: 'Hak Sahibi',
      donations: 'Bağış',
      meetings: 'Toplantı',
      tasks: 'Görev',
      messages: 'Mesaj',
      system: 'Sistem'
    }

    const actionNames: Record<string, string> = {
      create: 'oluşturuldu',
      list: 'listelendi',
      update: 'güncellendi',
      delete: 'silindi',
      export: 'dışa aktarıldı',
      report: 'raporu hazırlandı'
    }

    const moduleName = moduleNames[module] || module
    const actionName = actionNames[action] || action

    if (Array.isArray(result)) {
      return `${result.length} ${moduleName} kaydı ${actionName}`
    } else if (result && typeof result === 'object') {
      return `${moduleName} ${actionName}`
    } else {
      return `İşlem başarıyla tamamlandı`
    }
  }

  private generateNextSteps(action: string, module: string): string[] {
    const suggestions: string[] = []

    if (action === 'create') {
      suggestions.push(`${module} listele`, `${module} düzenle`)
    } else if (action === 'list') {
      suggestions.push(`${module} ara`, `${module} dışa aktar`)
    } else if (action === 'search') {
      suggestions.push(`Sonucu düzenle`, `Detayları göster`)
    }

    return suggestions
  }

  private getAvailableActions(module: string): string[] {
    const moduleActions = this.modules[module]
    const actions: string[] = []

    if (moduleActions.create) actions.push('create', 'add')
    if (moduleActions.list) actions.push('list', 'show')
    if (moduleActions.update) actions.push('update', 'edit')
    if (moduleActions.delete) actions.push('delete', 'remove')
    if (moduleActions.search) actions.push('search', 'find')
    if (moduleActions.export) actions.push('export')
    if (moduleActions.report) actions.push('report')
    if (moduleActions.custom) actions.push(...Object.keys(moduleActions.custom))

    return actions
  }

  getModules(): string[] {
    return Object.keys(this.modules)
  }

  getModuleActions(module: string): string[] {
    return this.getAvailableActions(module)
  }
}

// Singleton instance
export const moduleController = new ModuleController()
