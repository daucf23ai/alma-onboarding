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

## Baseline stack decision

- **Runtime / tooling**: Node.js + npm
- **Language**: TypeScript
- **Frontend**: React
- **Bundler/dev server**: Vite

Why this baseline:

- **Fast iteration** (excellent dev UX, quick builds)
- **Common defaults** (easy to hire for / onboard contributors)
- **Low lock-in** for an MVP (can evolve into SSR, a fullstack framework, etc., later if needed)
