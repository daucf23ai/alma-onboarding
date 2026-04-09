# Onboarding App (baseline)

Minimal web app skeleton to unblock iteration.

## Local setup

Requirements:

- Node.js (recommended: current LTS)

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
```

## Deployment (initial)

Target: **GitHub Pages** (static site).

- **Release**: merge to `main` → workflow `Deploy (GitHub Pages)` builds and publishes `dist/`
- **Rollback**: revert the commit on `main` (or restore a prior successful Pages deployment) and the next deploy will republish

## MVP Flow 2: Iterate → preview → republish

Happy path (no backend; works on GitHub Pages):

- **Start from a published URL**: open the app with `?p=...`
- **Edit**: click **Edit & republish** to load the wizard pre-filled from the published state
- **Preview quickly**: in **Configure**, click **Preview** (opens a new tab with the current draft state)
- **Republish**: adjust Name/Accent and click **Publish** to generate a new shareable URL (copied to clipboard when possible)
- **Verify update is live**: open the new URL and confirm the published view reflects your change

## MVP Flow 3: Share → capture lightweight feedback → choose next change

Happy path (no backend; works on GitHub Pages):

- **Share**: send someone a published URL (`?p=...`)
- **Capture feedback**: on the published page, use **Feedback → Submit feedback**
- **Review feedback**: revisit the same published URL in your browser to see the feedback count + recent items
- **Choose next change**: set **Choose next change → Next change** (or click **Use latest feedback**) and click **Copy next change**

Notes:

- Feedback is stored in `localStorage` for that browser + published URL (intentionally minimal; no server-side persistence).

## Baseline stack decision

- **Runtime / tooling**: Node.js + npm
- **Language**: TypeScript
- **Frontend**: React
- **Bundler/dev server**: Vite

Why this baseline:

- **Fast iteration** (excellent dev UX, quick builds)
- **Common defaults** (easy to hire for / onboard contributors)
- **Low lock-in** for an MVP (can evolve into SSR, a fullstack framework, etc., later if needed)
