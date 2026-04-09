export type PublishedState = {
  v: 1
  templateId: 'blank' | 'landing'
  name: string
  accent: 'indigo' | 'emerald' | 'rose'
}

export type FeedbackItem = {
  id: string
  createdAt: number
  message: string
  name?: string
  email?: string
}

type Ok<T> = { ok: true; value: T }
type Err = { ok: false; error: string }

function base64UrlEncode(text: string) {
  const b64 = btoa(unescape(encodeURIComponent(text)))
  return b64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function base64UrlDecode(b64url: string) {
  const padded = b64url.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=')
  const text = decodeURIComponent(escape(atob(padded)))
  return text
}

export function encodePublishedState(state: PublishedState) {
  return base64UrlEncode(JSON.stringify(state))
}

export function decodePublishedState(raw: string): Ok<PublishedState> | Err {
  try {
    const text = base64UrlDecode(raw)
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'Invalid payload.' }

    const obj = parsed as Record<string, unknown>
    const v = obj.v
    const templateId = obj.templateId
    const name = obj.name
    const accent = obj.accent

    if (v !== 1) return { ok: false, error: 'Unsupported published version.' }
    if (templateId !== 'blank' && templateId !== 'landing') return { ok: false, error: 'Invalid template.' }
    if (typeof name !== 'string' || name.trim().length === 0) return { ok: false, error: 'Invalid name.' }
    if (accent !== 'indigo' && accent !== 'emerald' && accent !== 'rose') return { ok: false, error: 'Invalid accent.' }

    return {
      ok: true,
      value: { v: 1, templateId, name, accent },
    }
  } catch {
    return { ok: false, error: 'Invalid publish link.' }
  }
}

function feedbackKey(p: string) {
  return `alma:feedback:${p}`
}

function nextChangeKey(p: string) {
  return `alma:nextChange:${p}`
}

const memoryStore = new Map<string, string>()

function getStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  const s: unknown = globalThis.localStorage
  if (s && typeof (s as { getItem?: unknown }).getItem === 'function') {
    return s as Storage
  }
  return {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, value) => {
      memoryStore.set(key, value)
    },
    removeItem: (key) => {
      memoryStore.delete(key)
    },
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function listFeedback(p: string): FeedbackItem[] {
  const raw = getStorage().getItem(feedbackKey(p))
  if (!raw) return []
  const parsed = safeJsonParse(raw)
  if (!Array.isArray(parsed)) return []
  return parsed.filter((x): x is FeedbackItem => !!x && typeof x === 'object') as FeedbackItem[]
}

export function addFeedback(p: string, item: FeedbackItem) {
  const next = [item, ...listFeedback(p)].slice(0, 50)
  getStorage().setItem(feedbackKey(p), JSON.stringify(next))
}

export function getNextChange(p: string): string | null {
  const raw = getStorage().getItem(nextChangeKey(p))
  return raw && raw.trim().length > 0 ? raw : null
}

export function setNextChange(p: string, text: string) {
  const trimmed = text.trim()
  if (!trimmed) {
    getStorage().removeItem(nextChangeKey(p))
    return
  }
  getStorage().setItem(nextChangeKey(p), trimmed)
}

