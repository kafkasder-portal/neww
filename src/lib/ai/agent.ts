import type { ActionContext } from './actions'
import { uploadBeneficiaryDocument } from '../documents'
import { supabase } from '../supabase'
import { toast } from 'sonner'

export type AgentResult = {
  ok: boolean
  message?: string
}

// Optional LLM endpoint (proxy/edge recommended). Expose only if you have a secure server.
const LLM_ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT as string | undefined
const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY as string | undefined

export async function runAgent(goal: string, ctx: ActionContext): Promise<AgentResult> {
  const task = goal.trim().toLowerCase()

  // If an LLM endpoint is configured, try to get a structured plan
  let plan: { action?: string; args?: Record<string, any> } | null = null
  if (LLM_ENDPOINT) {
    try {
      const res = await fetch(LLM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(LLM_API_KEY ? { Authorization: `Bearer ${LLM_API_KEY}` } : {}),
        },
        body: JSON.stringify({ input: task }),
      })
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data && typeof data === 'object') plan = data
      }
    } catch {
      // ignore and fall back
    }
  }

  if (plan?.action) {
    return executePlanned({ action: String(plan.action), args: plan.args }, ctx)
  }

  // Heuristic fallback
  if (/(dashboard|anasayfa|home)/.test(task)) {
    ctx.navigateTo('/')
    return { ok: true, message: 'Navigated to dashboard' }
  }
  if (/(bağış|donation)/.test(task)) {
    ctx.navigateTo('/donations')
    return { ok: true, message: 'Navigated to donations' }
  }
  if (/(yardım|aid)/.test(task)) {
    ctx.navigateTo('/aid')
    return { ok: true, message: 'Navigated to aid' }
  }
  if (/(koyu|dark)/.test(task)) {
    ctx.setTheme('dark')
    return { ok: true, message: 'Theme set to dark' }
  }
  if (/(açık|light)/.test(task)) {
    ctx.setTheme('light')
    return { ok: true, message: 'Theme set to light' }
  }
  if (/(sistem|system)/.test(task) && /tema|theme/.test(task)) {
    ctx.setTheme('system')
    return { ok: true, message: 'Theme set to system' }
  }
  if (/chat|sohbet/.test(task)) {
    ctx.toggleChat()
    return { ok: true, message: 'Chat toggled' }
  }
  if (/belge|dosya|yukle|yükle|upload/.test(task)) {
    // try extract beneficiary id or name
    let beneficiaryId = extractId(task)
    if (!beneficiaryId) {
      const name = extractName(task)
      if (name) beneficiaryId = await findBeneficiaryIdByName(name)
    }
    if (!beneficiaryId) return { ok: false, message: 'Kişi ID/isim bulunamadı' }

    const file = await pickFile()
    toast.promise(uploadBeneficiaryDocument(beneficiaryId, file, 'uploaded'), {
      loading: 'Belge yükleniyor...',
      success: 'Belge yüklendi',
      error: 'Belge yüklenemedi',
    })
    return { ok: true }
  }

  return { ok: false, message: 'Anlaşılamadı' }
}

async function executePlanned(plan: { action: string; args?: Record<string, any> }, ctx: ActionContext): Promise<AgentResult> {
  const args = plan.args || {}
  switch (plan.action) {
    case 'navigate':
      ctx.navigateTo(args.path || '/')
      return { ok: true }
    case 'setTheme':
      ctx.setTheme(args.theme || 'system')
      return { ok: true }
    case 'toggleChat':
      ctx.toggleChat()
      return { ok: true }
    case 'uploadDocument': {
      const id = args.beneficiaryId || (args.name ? await findBeneficiaryIdByName(String(args.name)) : '')
      if (!id) return { ok: false, message: 'Kişi bulunamadı' }
      const file = await pickFile()
      await uploadBeneficiaryDocument(id, file, args.documentType || 'uploaded')
      return { ok: true }
    }
    default:
      return { ok: false, message: 'Desteklenmeyen plan' }
  }
}

function extractId(text: string): string | '' {
  const m = text.match(/id\s*[:=]\s*([a-z0-9-]+)/i)
  return m ? m[1] : ''
}

function extractName(text: string): string | '' {
  const m = text.match(/(?:ad|name)\s*[:=]\s*([^,]+)/i) || text.match(/([^,]+)\s*(?:için|adlı|kişisi)/i)
  return m ? m[1].trim() : ''
}

async function findBeneficiaryIdByName(fullName: string): Promise<string | ''> {
  const [first, ...rest] = fullName.split(/\s+/)
  const last = rest.join(' ')
  const { data } = await supabase
    .from('beneficiaries')
    .select('id, name, surname')
    .ilike('name', `%${first}%`)
    .ilike('surname', last ? `%${last}%` : '%')
    .limit(1)
    .maybeSingle()
  return data?.id || ''
}

async function pickFile(): Promise<File> {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '*/*'
  return await new Promise((resolve, reject) => {
    input.onchange = () => {
      const f = input.files?.[0]
      if (f) resolve(f)
      else reject(new Error('Dosya seçilmedi'))
    }
    input.click()
  })
}


