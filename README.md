# Barrio

Free-giving PWA for neighbors in Peru: post a **Donación** or a **Pedido**, choose who gets it, finish on WhatsApp. Live: [https://barrio.mica-ea3.workers.dev](https://barrio.mica-ea3.workers.dev).

## Problem and evidence

Building WhatsApp groups already move some giveaways, but posts get buried and there is no status. In a small baseline test in Mica’s building group (**E-01**): **1 of 3** posts was answered, the first reply took about **3 hours**, and **staff are not in the group**. Barrio’s Phase 0 bar is **60%+** of posts answered within 48 hours — what it must beat next to that group. Details: [`docs/SRD.md`](./docs/SRD.md) §2.4.

## Status

**Phase 0 is live** since **2026-11-17** (invite-only, one building in Barranco). Verified on a real iPhone **2026-11-18** (sign-up, posting, alerts). Next: Phase 0 testing, then **M10** (admin portal split), then Phase 1 (Barranco). Current notes: [`docs/handoff.md`](./docs/handoff.md).

## Review in 15 minutes

1. [`docs/SRD.md`](./docs/SRD.md) — product requirements (source of truth)
2. [`docs/feature-prioritization.csv`](./docs/feature-prioritization.csv) — requirement status by ID
3. [`docs/decisions.md`](./docs/decisions.md) — product and architecture decisions
4. [`docs/handoff.md`](./docs/handoff.md) — where things stand
5. [`docs/assumptions-and-questions.md`](./docs/assumptions-and-questions.md) — risks and open questions
6. [`docs/adr/0001-separate-admin-portal.md`](./docs/adr/0001-separate-admin-portal.md) — why admin moves to its own app (M10)

Agent rules: [`AGENTS.md`](./AGENTS.md). Docs map: [`docs/README.md`](./docs/README.md).

## How it was built

Spec-first **docs relay**: SRD + decisions + handoff; work by slice and requirement ID. **M0–M9** shipped the core loop, then post-launch PRs (push send, copy/UI polish, routing fixes). Built in **Cursor** with a preferred **second-model PR review**. **CI** runs typecheck, Vitest unit tests, and Playwright e2e. Stack (DEC-15): Cloudflare Workers + Hono, React + Vite PWA, D1, R2, GitHub Actions.

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
| `npm run vapid:keys` | Print throwaway VAPID keys for web push (never commit) |

Setup: [`docs/m0-setup.md`](./docs/m0-setup.md). Launch ops: [`docs/phase0-launch.md`](./docs/phase0-launch.md). Free-plan limits: [`docs/cloudflare-free-limits.md`](./docs/cloudflare-free-limits.md).
