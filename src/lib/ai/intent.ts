import type { CommandAction } from './actions'
import { getAllActions } from './actions'

export type ParsedIntent = {
  action: CommandAction | null
  confidence: number
  payload?: any
}

const normalize = (text: string) => text.toLowerCase().trim()

export function parseIntent(input: string): ParsedIntent {
  const q = normalize(input)
  if (!q) return { action: null, confidence: 0 }

  const actions = getAllActions()

  // direct id match
  const exact = actions.find(a => a.id === q)
  if (exact) return { action: exact, confidence: 1 }

  // keyword match scoring
  let best: { action: CommandAction; score: number } | null = null
  for (const a of actions) {
    const labelScore = a.label ? similarity(q, normalize(a.label)) : 0
    const kwScore = (a.keywords || []).reduce((acc, kw) => Math.max(acc, similarity(q, normalize(kw))), 0)
    const score = Math.max(labelScore, kwScore)
    if (!best || score > best.score) best = { action: a, score }
  }

  if (best && best.score >= 0.55) return { action: best.action, confidence: best.score }
  return { action: null, confidence: best ? best.score : 0 }
}

// Simple similarity based on overlap
function similarity(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 1
  // token overlap
  const at = new Set(a.split(/\s+|[/:_-]+/g))
  const bt = new Set(b.split(/\s+|[/:_-]+/g))
  let overlap = 0
  for (const t of at) if (bt.has(t)) overlap++
  const denom = Math.max(at.size, bt.size)
  return denom ? overlap / denom : 0
}


