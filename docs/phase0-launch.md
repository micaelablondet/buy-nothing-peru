# Phase 0 launch checklist (SRD §16)

Code slices **M0–M9** are in `main` (or about to be). This doc tracks launch ops that Mica owns.

## Done in product (agents)

- [x] M0–M9 shipped (hardening + Parkside)
- [x] Authorization contract tests + API e2e (`npm test`, `npm run test:e2e`)
- [x] Terms + Privacy pages (`/legal/terminos`, `/legal/privacidad`) linked from Entrar and app footer
- [x] Admin metrics (`/admin`)
- [x] PWA manifest + `Añadir a inicio` prompt after first post/response (R-06)
- [x] CI workflow (`.github/workflows/ci.yml`)
- [x] `wrangler.toml` `[vars]` are production (`ENVIRONMENT=production`); local overrides in `.dev.vars`
- [x] `DEV_STUB_AUTH` is code-gated off whenever `ENVIRONMENT=production` (`worker/lib/stubAuth.ts`)

## Mica / ops (before go-live)

- [ ] Google OAuth consent screen **In production** with Privacy Policy URL (OQ-04)
- [ ] Production secrets via `wrangler secret put`: `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS` (never in `wrangler.toml`); optional VAPID. Do **not** set `DEV_STUB_AUTH` in production.
- [x] Real `database_id` and `APP_BASE_URL=https://barrio.mica-ea3.workers.dev` in `wrangler.toml` (PR #14)
- [ ] Google redirect URI `<APP_BASE_URL>/api/auth/google/callback` added in Google Cloud console
- [ ] R2 bucket created (Cloudflare may ask for a payment method when R2 is first enabled; see OQ-03)
- [ ] Branch protection on `main`: require a PR and green CI (available on GitHub Free because the repo is public)
- [ ] Fonts and feed checked on a mid-range Android over 4G (3s budget)
- [ ] Invite code created in Admin and ready for the building WhatsApp group
- [ ] Seed 5–8 real Regalos and 2–3 Pidos
- [ ] Ask building staff whether they have a Google account (R-05)
- [ ] Spot-check Admin metrics vs hand-counted seed
- [ ] Weekly check-ins + 5+ user conversations planned for the 3 weeks
- [ ] Phase gate review date on the calendar (end of week 3)

## Commands

```bash
# Local
cp .dev.vars.example .dev.vars   # includes ENVIRONMENT=development + APP_BASE_URL for local
npm run build && npm run test:e2e

# Production deploy (after secrets + real database_id + APP_BASE_URL)
npm run db:migrate:remote
npm run deploy
```

## After migrate + deploy (first admin / invite — DEC-30)

Migrations insert Barranco + Torres Paz. Invite codes are **not** in migrations; create them in the app:

1. **Sign in as admin** with a Google account whose email is in the `ADMIN_EMAILS` secret (that email skips the invite gate).
2. Complete profile if needed, then open **`/admin`** and **create the invite code**.
3. **Only then** share the code in the building WhatsApp group (and seed real Regalos/Pidos).

Do not share an invite before step 2 — there is no bootstrap code in production.

## Before Phase 1

M10 admin portal split (`docs/m10-admin-portal-setup.md`). See `docs/SRD.md` section 16, "Before opening Phase 1".
