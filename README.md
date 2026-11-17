# Barrio

Free-giving PWA for neighbors in Peru (**Regalo** / **Pido**). Requirements: [`docs/SRD.md`](./docs/SRD.md). Docs map: [`docs/README.md`](./docs/README.md). Agent rules: [`AGENTS.md`](./AGENTS.md).

**Status:** see [`docs/handoff.md`](./docs/handoff.md). Slices M0–M9 built. **Next:** Phase 0 launch ([`docs/phase0-launch.md`](./docs/phase0-launch.md)). M10 moves admin to its own URL before Phase 1. Prompts: [`docs/cursor-prompts.md`](./docs/cursor-prompts.md).

## Quick start

```bash
npm install
cp .dev.vars.example .dev.vars   # local ENVIRONMENT + APP_BASE_URL + DEV_STUB_AUTH
npm run db:reset:local
npm run build
npm run dev:worker   # :8787 (API + built SPA + SSR /p/*)
npm run dev          # Vite UI with HMR (proxies /api and /p)
```

`wrangler.toml` `[vars]` are production. Local overrides live in `.dev.vars`.

Sign in with **Continuar** on `/entrar` when stub auth is on. Google OAuth for production.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite UI |
| `npm run dev:worker` | Wrangler / API + assets |
| `npm run build` | Typecheck client + Vite build → `dist/` |
| `npm run typecheck` | Client + Worker TypeScript |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Reset local D1 + Playwright e2e (needs build) |
| `npm run db:reset:local` | Local D1 migrate + seed |
| `npm run db:migrate:remote` | Apply D1 migrations to production |
| `npm run deploy` | Build + `wrangler deploy` (run `db:migrate:remote` first) |

Setup: [`docs/m0-setup.md`](./docs/m0-setup.md), admin portal (M10): [`docs/m10-admin-portal-setup.md`](./docs/m10-admin-portal-setup.md). Product decisions: [`docs/decisions.md`](./docs/decisions.md). ADRs: [`docs/adr/`](./docs/adr/). Launch: [`docs/phase0-launch.md`](./docs/phase0-launch.md). Free-plan limits: [`docs/cloudflare-free-limits.md`](./docs/cloudflare-free-limits.md).

## Stack (DEC-15)

Cloudflare Workers + Hono, React + Vite PWA, D1, R2, GitHub Actions.
