export type PublishedState = {
  v: 1
  templateId: 'blank' | 'landing'
  name: string
  accent: 'indigo' | 'emerald' | 'rose'
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

