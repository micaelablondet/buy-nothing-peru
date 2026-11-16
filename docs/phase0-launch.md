# Phase 0 launch checklist (SPEC §16)

Code slices **M0–M7** are in `main`. Before launch: **M8 pre-launch hardening** and **M9 Parkside restyle** (`SPEC.md` section 13; prompts in `docs/cursor-prompts.md`). This doc tracks launch ops that Mica owns.

## Done in product (agents)

- [x] M0–M6 shipped
- [x] Authorization contract tests + API e2e (`npm test`, `npm run test:e2e`)
- [x] Terms + Privacy pages (`/legal/terminos`, `/legal/privacidad`) linked from Entrar and app footer
- [x] Admin metrics (`/admin`)
- [x] PWA manifest + `Añadir a inicio` prompt after first post/response (R-06)
- [x] CI workflow (`.github/workflows/ci.yml`)

## Before launch (agents)

- [ ] M8: admin check reads the current allowlist on every request; `ADMIN_EMAILS` out of `wrangler.toml`; CORS limited to the app origin; core-loop e2e for Regalo and Pido
- [ ] M9: Parkside restyle merged; Mica reviewed the 375px screenshots

## Mica / ops (before go-live)

- [ ] Google OAuth consent screen **In production** with Privacy Policy URL (OQ-04)
- [ ] Production secrets: `SESSION_SECRET`, `GOOGLE_CLIENT_*`, `ADMIN_EMAILS` (secret, never in `wrangler.toml`: the repo is public), optional VAPID; `ENVIRONMENT=production`; `DEV_STUB_AUTH` off
- [ ] Real `database_id` in `wrangler.toml`; `APP_BASE_URL` = the deployed `https://barrio.<account>.workers.dev`; Google redirect URI `<APP_BASE_URL>/api/auth/google/callback`
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
npm run db:reset:local
npm run build && npm run test:e2e
npm run deploy
```

## Before Phase 1

M10 admin portal split (`docs/m10-admin-portal-setup.md`). See `SPEC.md` section 16, "Before opening Phase 1".
