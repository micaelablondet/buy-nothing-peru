# Handoff

Newest entry on top. Read this when you pick up the project; add a new entry when you finish a stage.

---

## 2026-11-17 — Prod bootstrap (SRD v0.6.1 / DEC-30)

**Stage:** Branch `prod-bootstrap` — fix empty production reference data + admin invite chicken-and-egg.

### Spec
- Migration `INSERT OR IGNORE` Barranco + Torres Paz; seed.sql same for those rows.
- AUTH-02: `ADMIN_EMAILS` skip invite when `INVITE_REQUIRED=true`.
- `phase0-launch.md`: migrate → deploy → admin sign-in → create invite → share.
- **OQ-14:** districts beyond Barranco (brief said OQ-13; that ID is barrios).

### Done in this stage
- Migration `0008_reference_districts.sql`; seed `INSERT OR IGNORE` for Barranco + Torres Paz.
- `mustEnterInviteCode` + unit tests; Google callback uses it.
- Launch checklist updated for admin → create invite → share.

### Next owner
Mica: `db:migrate:remote`, deploy, sign in as ADMIN_EMAILS, create invite in `/admin`, then share.

---

## 2026-11-17 — Feed cards / no categories / barrio (SRD v0.6)

**Stage:** Branch `ui-feed-cards` — docs + implementation.

### Done
- **DEC-28 / DEC-29 / LAND-01 / ADMIN-05 (partial):** categories removed from UI; `neighborhoods` + Torres Paz seed; optional barrio on onboarding/perfil; feed cards (photo, title, barrio/district, first name, `hace…`); no Perfil → `/admin`; landing copy updated.
- Migration `0007_neighborhoods.sql`; posts store category default `Otros`.
- Tests: `formatPostAge` unit; browser e2e feed cards + no admin link; full suite 54 unit + 27 e2e green.
- Screenshots: `captures/ui-feed-cards/{375,1280}/` (entrar, feed, perfil).

### Open
- **OQ-13:** which Barranco barrios before Phase 1.
- Phase 0 launch ops; then M10.

---

## 2026-11-17 — E-01 WhatsApp-group baseline (evidence)

**Evidence:** [`SRD.md`](./SRD.md) §2.4 **E-01** — building WhatsApp group answered 1 of 3 posts (~33%); one same-day doorstep handoff; staff not in the group. Risks/OQs updated: R-01, R-05, **OQ-11**.

### Comparison seed (track in Phase 0)
When seeding Barrio for launch, include counterparts of the E-01 items and **check whether they find takers** (and how the handoff compares to the group):
- **3 plushies (one post)**
- **Pikachu + lunchbox** (or separate Pikachu / lonchera posts — already in local seed photos)

Also note the third E-01 post (**kids ice-cream maker**) if a similar item is available to seed. Goal: compare group baseline vs Barrio response rate and friction (see OQ-11).

### Next owner
Still Phase 0 launch ops first (`phase0-launch.md`). Before invite goes out: ask building staff about Google accounts (R-05 / H4).

---

## 2026-11-17 — Recover UI merged onto main (NAV / Busca / landing / Source Serif 4)

**Stage:** Branch `recover/ui-nov16` brings Nov 16 UI recover work up to date with `main` (M8/M9/launch + Valere docs). Phase 0 still **not** live.

### Done in this stage
- **DEC-25–27 / SRD v0.5:** Source Serif 4 for all text; keyword search in V1; desktop sidebar from 768px.
- **NAV-01 / NAV-02:** Header ☰ menu (Términos, Privacidad, Salir); bottom tabs &lt;768px, left sidebar ≥768px.
- **SRCH-01:** `GET /api/search?q=` (signed-in, own district, max 50, no WhatsApp in payload).
- **LAND-01:** `/entrar` hero landing.
- Seed: M8 e2e fixtures **plus** real photo posts (`scripts/seed-photos/`).
- Fonts: self-hosted Source Serif 4 WOFF2; EB Garamond / Work Sans / Google Fonts links removed.
- Browser Playwright for NAV-01/02 (375/768/1280) + API tests for SRCH-01; full suite 25 green.
- Screenshots: `captures/recover-ui/{375,1280}/` (entrar, feed, busca, menu-open, post-detail).

### Landing colors vs Parkside
| Token | Mapping |
|---|---|
| `--landing-paper` | `--color-surface` |
| `--landing-ink` | `--color-ink` |
| `--landing-muted` | `--color-ink-muted` |
| `--landing-accent` | `--color-primary` |
| `--landing-olive` | `--color-olive` |
| `--landing-flush` (#c45c48) | **no close Parkside match** (kept barrio-only) |
| `--landing-sky` (#6f6280) | **no close Parkside match** (kept barrio-only) |

### Real vs mocked / stubbed
Same as prior entry: stub auth local-only; WhatsApp self-declared; admin still in-app `/admin`.

### What the next owner does first
1. Review PR screenshots at 375 and 1280.
2. Phase 0 launch ops (`docs/phase0-launch.md`): secrets, `db:migrate:remote`, deploy, Google redirect URI.
3. Then M10 admin portal split.

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
- Browser e2e for NAV added later the same day (see entry above). Core loop remains API-level Playwright.
- No real-device check of fonts / 3s-on-4G feed yet (launch checklist).
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
