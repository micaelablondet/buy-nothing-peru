# M0 setup — Cloudflare project and local shell

Exit criteria (docs/SRD.md §13): repo, Cloudflare project, CI, seed script, `tokens.css`, copy file, empty authenticated app shell.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # local ENVIRONMENT + APP_BASE_URL + DEV_STUB_AUTH
npm run db:reset:local    # D1 migrations + seed (local)
npm run dev:worker        # API on :8787 (also serves built assets if present)
npm run build && npm run dev:worker   # full Worker + SPA locally

# UI with hot reload (proxies /api → :8787):
npm run dev:worker   # terminal 1
npm run dev          # terminal 2 → Vite
```

`wrangler.toml` `[vars]` are **production**. Local overrides come from `.dev.vars` (`ENVIRONMENT=development`, `APP_BASE_URL=http://127.0.0.1:8787`).

Open the Vite URL, tap **Continuar** for the stub session when `DEV_STUB_AUTH=true` (Google for production).

## CI workflow file

CI lives at [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (typecheck, unit tests, build, Playwright e2e). A reference copy remains in `docs/ci/github-actions-ci.yml`.

## Create the Cloudflare project (once)

1. Install Wrangler and log in: `npx wrangler login`
2. Create D1: `npx wrangler d1 create barrio` → paste the `database_id` into `wrangler.toml`
3. Create R2 bucket: `npx wrangler r2 bucket create barrio-photos` (and optional preview bucket)
4. Apply migrations remotely: `npx wrangler d1 migrations apply barrio --remote`
5. Seed remote (optional, staging only): `npx wrangler d1 execute barrio --remote --file=./scripts/seed.sql`
6. Deploy: `npm run deploy`

## Tokens (OQ-01)

Resolved: Barrio uses the **Parkside** design system (DEC-17). Source: `design/parkside.tokens.json`. Slice M9 generates `src/styles/tokens.css` from it and renames variables (mapping in `docs/SRD.md` 11.3).

## Stub auth

`POST /api/dev/session` is **disabled when `ENVIRONMENT=production`**. Do not rely on it after Google OIDC (M1).
