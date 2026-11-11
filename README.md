# Barrio

Free-giving PWA for neighbors in Peru (**Regalo** / **Pido**). Spec: [`SPEC.md`](./SPEC.md). Agent rules: [`AGENTS.md`](./AGENTS.md).

**Current slice:** **M0 Foundation** — Cloudflare Worker + Hono API, Vite React shell, D1 migration + seed, design tokens, Spanish copy, CI.

## Quick start

```bash
npm install
npm run db:reset:local
npm run dev:worker   # :8787
npm run dev          # Vite UI (proxies /api)
```

Sign in with the **stub** button on `/entrar` (Google OAuth is **M1**).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite UI |
| `npm run dev:worker` | Wrangler / API |
| `npm run build` | Typecheck client + Vite build → `dist/` |
| `npm run typecheck` | Client + Worker TypeScript |
| `npm test` | Vitest unit tests |
| `npm run db:reset:local` | Local D1 migrate + seed |
| `npm run deploy` | Build + `wrangler deploy` |

Setup details: [`docs/m0-setup.md`](./docs/m0-setup.md). Free-plan limits: [`docs/cloudflare-free-limits.md`](./docs/cloudflare-free-limits.md).

## Stack (DEC-15)

Cloudflare Workers + Hono, React + Vite, D1, R2, GitHub Actions.
