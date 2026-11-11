# M0 setup — Cloudflare project and local shell

Exit criteria (SPEC §13): repo, Cloudflare project, CI, seed script, `tokens.css`, copy file, empty authenticated app shell.

## Local development

```bash
npm install
npm run db:reset:local    # D1 migrations + seed (local)
npm run dev:worker        # API on :8787 (also serves built assets if present)
npm run build && npm run dev:worker   # full Worker + SPA locally

# UI with hot reload (proxies /api → :8787):
npm run dev:worker   # terminal 1
npm run dev          # terminal 2 → Vite
```

Open the Vite URL, tap **Continuar como Mica (prueba)** for the stub session (M1 replaces this with Google).

## Create the Cloudflare project (once)

1. Install Wrangler and log in: `npx wrangler login`
2. Create D1: `npx wrangler d1 create barrio` → paste the `database_id` into `wrangler.toml`
3. Create R2 bucket: `npx wrangler r2 bucket create barrio-photos` (and optional preview bucket)
4. Apply migrations remotely: `npx wrangler d1 migrations apply barrio --remote`
5. Seed remote (optional, staging only): `npx wrangler d1 execute barrio --remote --file=./scripts/seed.sql`
6. Deploy: `npm run deploy`

## Tokens (OQ-01)

`src/styles/tokens.css` proposes a Phase 0 green palette. Approve or send replacements before heavy UI work in M1+.

## Stub auth

`POST /api/dev/session` is **disabled when `ENVIRONMENT=production`**. Do not rely on it after Google OIDC (M1).
