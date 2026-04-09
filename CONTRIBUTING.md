# Contributing

## Local development

```bash
npm install
npm run dev
```

## Quality checks

Before opening a PR:

```bash
npm run format
npm run lint
npm run typecheck
npm test
```

## Branch + PR conventions

- Branch naming: `feat/<short>`, `fix/<short>`, `chore/<short>`
- PRs should include:
  - summary of what/why
  - screenshots (for UI changes)
  - test plan (commands run)

## Project structure (baseline)

- `src/`: application code
- `src/test/`: shared test setup/utilities
- `.github/workflows/`: CI workflows
