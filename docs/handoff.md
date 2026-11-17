# Handoff

Newest entry on top. Read this when you pick up the project; add a new entry when you finish a stage.

---

## 2026-11-17 — E-01 WhatsApp-group baseline (evidence)

**Evidence:** [`SRD.md`](./SRD.md) §2.4 **E-01** — building WhatsApp group answered 1 of 3 posts (~33%); one same-day doorstep handoff; staff not in the group. Risks/OQs updated: R-01, R-05, **OQ-11**.

### Comparison seed (track in Phase 0)
When seeding Barrio for launch, include counterparts of the E-01 items and **check whether they find takers** (and how the handoff compares to the group):
- **Plushies** (three / “dos peluches” style post)
- **Pikachu + lunchbox** (or separate Pikachu / lonchera posts — already in local seed photos)

Also note the third E-01 post (**kids ice-cream maker**) if a similar item is available to seed. Goal: compare group baseline vs Barrio response rate and friction (see OQ-11).

### Next owner
Still Phase 0 launch ops first (`phase0-launch.md`). Before invite goes out: ask building staff about Google accounts (R-05 / H4).

---

## 2026-11-17 — Docs convention + ready for Phase 0 launch ops

**Stage:** M0–M9 and launch-config are on `main`. Phase 0 is **not** live. Next product work for an agent is **ops support for Phase 0 launch**, then **M10 admin portal split** before Phase 1.

### Done
- Core product loop (Regalo / Pido → respond → choose → WhatsApp → Entregado), feed, profile, notifications, public `/p/{id}`, reports, in-app admin at `/admin`, Parkside tokens/fonts (M9).
- M8: `ADMIN_EMAILS` as secret (not in `wrangler.toml`), CORS locked to `APP_BASE_URL`, core-loop + authz API e2e.
- Launch config: production `ENVIRONMENT` / `APP_BASE_URL=https://barrio.mica-ea3.workers.dev`, real D1 `database_id`, `npm run db:migrate:remote`, stub auth forced off in production.
- Docs restructured to Valere layout (`docs/SRD.md`, `decisions.md`, `assumptions-and-questions.md`, `feature-prioritization.csv`, this file).

### Real vs mocked / stubbed
| Area | Reality |
|---|---|
| Google OAuth | Real code path; production needs secrets + consent screen. Local/CI uses **`DEV_STUB_AUTH`** (`Continuar` on `/entrar`) — **always off** when `ENVIRONMENT=production`. |
| WhatsApp numbers | **Self-declared**, format-validated only (PROF-02). **Not verified** (DEC-09). |
| WhatsApp handoff | Real `wa.me` deep links; conversation stays in WhatsApp (no in-app chat). |
| Web push | Real VAPID path when configured; inbox works without it. |
| Admin | Real `/admin` in the end-user app (Phase 0). Separate Access-protected portal is **M10 (not built)**. |
| Photos | Real R2 binding in config; production bucket/migrate/deploy still ops. |
| Production deploy | Config filled; **secrets, remote migrate, and deploy not done yet**. |

### Not tested / gaps
- **No browser-level (UI) Playwright e2e.** `npm run test:e2e` is **API-level** Playwright (request contexts): smoke, core loop, rules, authz.
- No real-device check of Parkside fonts / 3s-on-4G feed yet (launch checklist).
- M10 Access JWT / boundary / admin smoke tests do not exist yet.

### Known issues / open
- See [`assumptions-and-questions.md`](./assumptions-and-questions.md) (especially R-01 WhatsApp-group competitor, OQ-04 domain/OAuth, OQ-03 R2 payment method).
- Phone verification deferred to Phase 1 gate (OQ-06).

### What the next owner does first
1. Follow [`phase0-launch.md`](./phase0-launch.md): `wrangler secret put` (`SESSION_SECRET`, `GOOGLE_CLIENT_*`, `ADMIN_EMAILS`), `npm run db:migrate:remote`, `npm run deploy`, Google redirect URI for `https://barrio.mica-ea3.workers.dev/api/auth/google/callback`.
2. Do **not** set `DEV_STUB_AUTH` in production.
3. After go-live seeding/ops, only then start **M10** from [`cursor-prompts.md`](./cursor-prompts.md) / [`m10-admin-portal-setup.md`](./m10-admin-portal-setup.md).
4. Source of truth for requirements: [`SRD.md`](./SRD.md). Agent rules: [`../AGENTS.md`](../AGENTS.md). Feature status: [`feature-prioritization.csv`](./feature-prioritization.csv).

---

## 2026-10-19 — Early brief handoff (historical)

Earlier handoff lived in `barrio-handoff.md` (clickable prototype era; Presto still in play; phone verification assumed). Superseded by the SRD and the entry above. Kept only as history pointer — do not build from it.
