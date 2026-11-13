# Phase 0 launch checklist (SPEC §16)

Code slices **M0–M6** are in `main`. This doc tracks launch ops that Mica owns.

## Done in product (agents)

- [x] M0–M6 shipped
- [x] Authorization contract tests + API e2e (`npm test`, `npm run test:e2e`)
- [x] Terms + Privacy pages (`/legal/terminos`, `/legal/privacidad`) linked from Entrar and app footer
- [x] Admin metrics (`/admin`)
- [x] PWA manifest + `Añadir a inicio` prompt after first post/response (R-06)
- [x] CI workflow (`.github/workflows/ci.yml`)

## Mica / ops (before go-live)

- [ ] Google OAuth consent screen **In production** with Privacy Policy URL (OQ-04)
- [ ] Production secrets: `SESSION_SECRET`, `GOOGLE_CLIENT_*`, optional VAPID; `ENVIRONMENT=production`; `DEV_STUB_AUTH` off
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
