import { invalidateQueries, prefetchQueries } from '@lib/queryClient'
import { uploadBeneficiaryDocument } from '@lib/documents'
import { supabase } from '@lib/supabase'
import { runAgent } from './agent'

export type ActionContext = {
  navigateTo: (path: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleChat: () => void
}

export type CommandAction = {
  id: string
  label: string
  description?: string
  keywords?: string[]
  run: (ctx: ActionContext, payload?: any) => Promise<void> | void
}

export const actions: CommandAction[] = [
  {
    id: 'go:dashboard',
    label: 'Go to Dashboard',
    keywords: ['anasayfa', 'dashboard', 'home'],
    run: (ctx) => ctx.navigateTo('/')
  },
  {
    id: 'agent:run',
    label: 'AI Agent: Run Goal',
    description: 'Doğal dille hedef ver, agent uygulasın',
    keywords: ['agent', 'ai', 'hedef', 'goal', 'otomasyon'],
    run: async (ctx, payload?: { query?: string }) => {
      const goal = payload?.query || ''
      await runAgent(goal, ctx)
    }
  },
  {
    id: 'beneficiary:upload-document',
    label: 'Beneficiary: Upload Document',
    description: 'Belirli bir kişi/ID için belge yükle',
    keywords: ['kişi', 'belge', 'yükle', 'upload', 'dosya'],
    run: async (_ctx, payload?: { query?: string }) => {
      const q = (payload?.query || '').toLowerCase()
      // Extract id like id:XXXX or numeric uuid-like
      let beneficiaryId = ''
      const idMatch = q.match(/id\s*[:=]\s*([a-z0-9-]+)/i)
      if (idMatch) beneficiaryId = idMatch[1]

      if (!beneficiaryId) {
        // Try to find by name "ad soyad"
        const nameMatch = q.match(/(?:ad|name)\s*[:=]\s*([^,]+)/i) || q.match(/([^,]+)\s*(?:için|adlı|kişisi)/i)
        const name = nameMatch ? nameMatch[1].trim() : ''
        if (name) {
          const [first, ...rest] = name.split(/\s+/)
          const last = rest.join(' ')
          const { data } = await supabase
            .from('beneficiaries')
            .select('id, name, surname')
            .ilike('name', `%${first}%`)
            .ilike('surname', last ? `%${last}%` : '%')
            .limit(1)
            .maybeSingle()
          if (data?.id) beneficiaryId = data.id
        }
      }

      if (!beneficiaryId) throw new Error('Kişi ID bulunamadı. Lütfen komutta ID belirtin: id:xxxx')

      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '*/*'
      const file: File = await new Promise((resolve, reject) => {
        input.onchange = () => {
          const f = input.files?.[0]
          if (f) resolve(f)
          else reject(new Error('Dosya seçilmedi'))
        }
        input.click()
      })

      await uploadBeneficiaryDocument(beneficiaryId, file, 'uploaded')
    }
  },
  {
    id: 'go:donations',
    label: 'Open Donations',
    keywords: ['bağış', 'donations'],
    run: (ctx) => ctx.navigateTo('/donations')
  },
  {
    id: 'go:messages',
    label: 'Open Messages',
    keywords: ['mesaj', 'messages'],
    run: (ctx) => ctx.navigateTo('/messages')
  },
  {
    id: 'go:aid',
    label: 'Open Aid',
    keywords: ['yardım', 'aid'],
    run: (ctx) => ctx.navigateTo('/aid')
  },
  {
    id: 'go:definitions',
    label: 'Open Definitions',
    keywords: ['tanımlar', 'definitions'],
    run: (ctx) => ctx.navigateTo('/definitions/units')
  },
  {
    id: 'theme:light',
    label: 'Theme: Light',
    keywords: ['tema', 'light', 'açık'],
    run: (ctx) => ctx.setTheme('light')
  },
  {
    id: 'theme:dark',
    label: 'Theme: Dark',
    keywords: ['tema', 'dark', 'koyu'],
    run: (ctx) => ctx.setTheme('dark')
  },
  {
    id: 'theme:system',
    label: 'Theme: System',
    keywords: ['tema', 'system', 'sistem'],
    run: (ctx) => ctx.setTheme('system')
  },
  {
    id: 'chat:toggle',
    label: 'Toggle Chat',
    keywords: ['sohbet', 'chat'],
    run: (ctx) => ctx.toggleChat()
  },
  {
    id: 'cache:invalidate',
    label: 'Refresh All Data (Invalidate Cache)',
    keywords: ['refresh', 'cache', 'yenile'],
    run: async () => {
      await invalidateQueries.all()
    }
  },
  {
    id: 'prefetch:dashboard',
    label: 'Prefetch Dashboard Data',
    keywords: ['prefetch', 'dashboard'],
    run: async () => {
      await prefetchQueries.dashboard()
    }
  },
  {
    id: 'app:reload',
    label: 'Reload Application',
    keywords: ['yeniden yükle', 'reload', 'refresh'],
    run: () => {
      window.location.reload()
    }
  },
  {
    id: 'go:login',
    label: 'Go to Login',
    keywords: ['login', 'giriş'],
    run: (ctx) => ctx.navigateTo('/login')
  },
]

export const getAllActions = (): CommandAction[] => actions

export const findActionById = (id: string): CommandAction | undefined =>
  actions.find(a => a.id === id)


