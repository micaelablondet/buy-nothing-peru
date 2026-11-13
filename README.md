# Barrio

Free-giving PWA for neighbors in Peru (**Regalo** / **Pido**). Spec: [`SPEC.md`](./SPEC.md). Agent rules: [`AGENTS.md`](./AGENTS.md).

**Current slice:** **M7 Phase 0 launch** — product slices M0–M6 complete; launch ops checklist in [`docs/phase0-launch.md`](./docs/phase0-launch.md).

## Quick start

```bash
npm install
cp .dev.vars.example .dev.vars   # enable DEV_STUB_AUTH locally
npm run db:reset:local
npm run build
npm run dev:worker   # :8787 (API + built SPA + SSR /p/*)
npm run dev          # Vite UI with HMR (proxies /api and /p)
```

Sign in with **Continuar con cuenta seed (dev)** on `/entrar` when stub auth is on. Google OAuth for production.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite UI |
| `npm run dev:worker` | Wrangler / API + assets |
| `npm run build` | Typecheck client + Vite build → `dist/` |
| `npm run typecheck` | Client + Worker TypeScript |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke + authz (needs build + local D1) |
| `npm run db:reset:local` | Local D1 migrate + seed |
| `npm run deploy` | Build + `wrangler deploy` |

Setup: [`docs/m0-setup.md`](./docs/m0-setup.md). Launch: [`docs/phase0-launch.md`](./docs/phase0-launch.md). Free-plan limits: [`docs/cloudflare-free-limits.md`](./docs/cloudflare-free-limits.md).

## Stack (DEC-15)

Cloudflare Workers + Hono, React + Vite PWA, D1, R2, GitHub Actions.
