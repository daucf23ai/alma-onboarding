import { useMemo, useState } from 'react'
import './App.css'
import {
  addFeedback,
  decodePublishedState,
  encodePublishedState,
  getNextChange,
  listFeedback,
  setNextChange,
  type FeedbackItem,
  type PublishedState,
} from './publish'

function safeId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`
  }
}

function FeedbackPanel({ publishKey }: { publishKey: string }) {
  const [items, setItems] = useState<FeedbackItem[]>(() => listFeedback(publishKey))
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nextChange, setNextChangeValue] = useState(() => getNextChange(publishKey) ?? items[0]?.message ?? '')
  const [copied, setCopied] = useState(false)

  function refresh() {
    setItems(listFeedback(publishKey))
    setNextChangeValue(getNextChange(publishKey) ?? listFeedback(publishKey)[0]?.message ?? '')
  }

  function submit() {
    const trimmed = message.trim()
    if (!trimmed) return
    addFeedback(publishKey, {
      id: safeId(),
      createdAt: Date.now(),
      message: trimmed,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    })
    setMessage('')
    refresh()
  }

  async function copyNext() {
    const trimmed = nextChange.trim()
    setCopied(false)
    if (!trimmed) return
    setNextChange(publishKey, trimmed)
    try {
      await navigator.clipboard.writeText(trimmed)
      setCopied(true)
    } catch {
      // noop: user can still select/copy manually
    }
  }

  return (
    <section className="card">
      <h2>Feedback</h2>
      <p className="muted">Leave one quick note. Stored locally in this browser for this published URL.</p>

      <label className="field">
        <span>Your feedback</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
      </label>
      <div className="row">
        <label className="field field--inline">
          <span>Name (optional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field field--inline">
          <span>Email (optional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <button type="button" onClick={() => submit()}>
          Submit feedback
        </button>
        <button type="button" className="secondary" onClick={() => refresh()}>
          Refresh
        </button>
        <span className="muted">{items.length ? `${items.length} received` : 'No feedback yet'}</span>
      </div>

      <hr className="divider" />

      <h3>Choose next change</h3>
      <p className="muted">Pick one next change and copy it out (a lightweight decision log).</p>
      <label className="field">
        <span>Next change</span>
        <input value={nextChange} onChange={(e) => setNextChangeValue(e.target.value)} />
      </label>
      <div className="row">
        <button type="button" className="secondary" onClick={() => setNextChangeValue(items[0]?.message ?? '')}>
          Use latest feedback
        </button>
        <button type="button" onClick={() => copyNext()}>
          Copy next change
        </button>
        {copied ? <span className="muted">Copied.</span> : null}
      </div>

      {items.length ? (
        <>
          <h3>Recent feedback</h3>
          <ul className="list">
            {items.slice(0, 5).map((it) => (
              <li key={it.id}>
                <strong>{it.message}</strong>
                <div className="muted">
                  {it.name ? `${it.name} · ` : ''}
                  {new Date(it.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}

function LandingTemplate({
  state,
  publishKey,
  onEdit,
}: {
  state: PublishedState
  publishKey: string
  onEdit: () => void
}) {
  const productName = state.name
  return (
    <main className={`app app--${state.accent}`}>
      <header className="app__header">
        <div className="topline">
          <span className="badge">MVP</span>
          <span className="muted">Published landing page</span>
        </div>
        <h1 className="hero">
          Ship a live product experience in minutes with <span className="accent">{productName}</span>.
        </h1>
        <p className="muted lead">
          Stop burning cycles on plumbing. Start from a minimal template, configure the essentials, and publish a shareable
          URL—fast.
        </p>

        <div className="row">
          <button type="button" onClick={onEdit}>
            Edit & republish
          </button>
        </div>
      </header>

      <section className="grid grid--3">
        <div className="card">
          <h2>Fast to live</h2>
          <p className="muted">Create → configure → publish to a live URL in under 10 minutes for an internal user.</p>
        </div>
        <div className="card">
          <h2>Iterate quickly</h2>
          <p className="muted">Make a change, preview, and republish in under 2 minutes—no complex setup.</p>
        </div>
        <div className="card">
          <h2>Learn sooner</h2>
          <p className="muted">Share the link, collect lightweight feedback, and decide the next change.</p>
        </div>
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol className="how">
          <li>
            <strong>Create</strong>
            <div className="muted">Pick a minimal template and start with a sensible default.</div>
          </li>
          <li>
            <strong>Configure</strong>
            <div className="muted">Name your experience and choose one required setting (accent).</div>
          </li>
          <li>
            <strong>Publish</strong>
            <div className="muted">Get a live URL you can share instantly (works on static hosting).</div>
          </li>
        </ol>
      </section>

      <section className="grid grid--2">
        <section className="card">
          <h2>Built for</h2>
          <ul className="list">
            <li>
              <strong>Solo builders and small teams</strong> shipping a v0 fast
            </li>
            <li>
              <strong>Teams learning by doing</strong>, not debating tooling
            </li>
            <li>
              <strong>Anyone prototyping UX</strong> before investing in infrastructure
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>Success metrics (first release)</h2>
          <ul className="list">
            <li>
              <strong>Time-to-live</strong>: start → public URL live in &lt; 10 minutes
            </li>
            <li>
              <strong>Iteration speed</strong>: edit → republish in &lt; 2 minutes
            </li>
            <li>
              <strong>Reliability</strong>: publish succeeds &gt; 95% on first attempt
            </li>
            <li>
              <strong>Adoption</strong>: 3+ end-to-end publishes completed without manual intervention
            </li>
          </ul>
        </section>
      </section>

      <FeedbackPanel publishKey={publishKey} />

      <footer className="footer muted">
        <span>Flow 1: Create → configure → publish</span>
      </footer>
    </main>
  )
}

function App() {
  const [initialFromUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('p')
    if (!raw) return { kind: 'none' as const }
    const decoded = decodePublishedState(raw)
    if (!decoded.ok) return { kind: 'error' as const, message: decoded.error }
    return { kind: 'published' as const, p: raw, state: decoded.value }
  })

  const [mode, setMode] = useState<'wizard' | 'published'>(() =>
    initialFromUrl.kind === 'published' ? 'published' : 'wizard',
  )
  const loadError = initialFromUrl.kind === 'error' ? initialFromUrl.message : null

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [templateId, setTemplateId] = useState<'blank' | 'landing'>('landing')
  const [name, setName] = useState('Untitled')
  const [accent, setAccent] = useState<'indigo' | 'emerald' | 'rose'>('indigo')

  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const publishedState: PublishedState = useMemo(
    () => ({
      v: 1,
      templateId,
      name: name.trim() || 'Untitled',
      accent,
    }),
    [templateId, name, accent],
  )

  function resetPublishUi() {
    setCopied(false)
    setPublishError(null)
  }

  function setDraftFromPublished(state: PublishedState) {
    setTemplateId(state.templateId)
    setName(state.name)
    setAccent(state.accent)
    setPublishedUrl(null)
    resetPublishUi()
    setMode('wizard')
    setStep(2)
  }

  function buildPublishedUrl(state: PublishedState) {
    const encoded = encodePublishedState(state)
    const url = new URL(window.location.href)
    url.searchParams.set('p', encoded)
    return url.toString()
  }

  function preview() {
    resetPublishUi()
    const url = buildPublishedUrl(publishedState)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function publish() {
    resetPublishUi()
    const url = buildPublishedUrl(publishedState)
    setPublishedUrl(url)
    setStep(3)

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setPublishError('Could not copy link automatically. Please copy it manually.')
    }
  }

  if (mode === 'published' && initialFromUrl.kind === 'published') {
    const s = initialFromUrl.state
    if (s.templateId === 'landing') {
      return <LandingTemplate state={s} publishKey={initialFromUrl.p} onEdit={() => setDraftFromPublished(s)} />
    }
    return (
      <main className={`app app--${s.accent}`}>
        <header className="app__header">
          <h1>{s.name}</h1>
          <p className="muted">Published view</p>
        </header>

        <section className="card">
          <h2>Template</h2>
          <p className="muted">{s.templateId === 'blank' ? 'Blank' : s.templateId}</p>
        </section>

        <section className="card">
          <h2>Next</h2>
          <p className="muted">Use the creator to make and publish a new version.</p>
          <button type="button" onClick={() => setDraftFromPublished(s)}>
            Edit & republish
          </button>
        </section>

        <FeedbackPanel publishKey={initialFromUrl.p} />

        <footer className="footer muted">
          <span>Flow 1: Create → configure → publish</span>
        </footer>
      </main>
    )
  }

  return (
    <main className={`app app--${accent}`}>
      <header className="app__header">
        <h1>Create → configure → publish</h1>
        <p className="muted">A static-hosted MVP flow: publishing generates a shareable URL.</p>
      </header>

      {loadError ? (
        <section className="card card--error" role="alert">
          <strong>Couldn’t load published state.</strong>
          <div className="muted">{loadError}</div>
        </section>
      ) : null}

      <section className="card">
        <div className="steps" aria-label="Progress">
          <span className={step === 1 ? 'step step--active' : 'step'}>1. Create</span>
          <span className={step === 2 ? 'step step--active' : 'step'}>2. Configure</span>
          <span className={step === 3 ? 'step step--active' : 'step'}>3. Publish</span>
        </div>
      </section>

      {step === 1 ? (
        <section className="card">
          <h2>Create</h2>
          <p className="muted">Start from a minimal template.</p>

          <fieldset className="fieldset">
            <legend>Template</legend>
            <label className="radio">
              <input
                type="radio"
                name="template"
                value="landing"
                checked={templateId === 'landing'}
                onChange={() => {
                  resetPublishUi()
                  setTemplateId('landing')
                }}
              />
              Landing page
            </label>
            <label className="radio">
              <input
                type="radio"
                name="template"
                value="blank"
                checked={templateId === 'blank'}
                onChange={() => {
                  resetPublishUi()
                  setTemplateId('blank')
                }}
              />
              Blank
            </label>
          </fieldset>

          <div className="row">
            <button type="button" onClick={() => setStep(2)}>
              Next: configure
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="card">
          <h2>Configure</h2>
          <p className="muted">Name + one required setting.</p>

          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => {
                resetPublishUi()
                setName(e.target.value)
              }}
            />
          </label>

          <label className="field">
            <span>Accent</span>
            <select
              value={accent}
              onChange={(e) => {
                resetPublishUi()
                setAccent(e.target.value as typeof accent)
              }}
            >
              <option value="indigo">Indigo</option>
              <option value="emerald">Emerald</option>
              <option value="rose">Rose</option>
            </select>
          </label>

          <div className="row">
            <button type="button" className="secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="secondary" onClick={() => preview()}>
              Preview
            </button>
            <button type="button" onClick={() => publish()}>
              Publish
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="card">
          <h2>Published</h2>
          <p className="muted">Share this URL. It includes the published state.</p>

          {publishedUrl ? (
            <>
              <label className="field">
                <span>Live URL</span>
                <input value={publishedUrl} readOnly />
              </label>
              <div className="row">
                <a className="button" href={publishedUrl}>
                  Open
                </a>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                resetPublishUi()
                    setPublishedUrl(null)
                    setStep(2)
                  }}
                >
                  Edit & republish
                </button>
              </div>
              {copied ? <p className="muted">Copied to clipboard.</p> : null}
              {publishError ? (
                <p className="muted" role="alert">
                  {publishError}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="muted">Nothing published yet.</p>
              <button type="button" onClick={() => setStep(2)}>
                Back to configure
              </button>
            </>
          )}
        </section>
      ) : null}

      <footer className="footer muted">
        <span>Publishing is URL-based (no backend) so it works on GitHub Pages.</span>
      </footer>
    </main>
  )
}

export default App
