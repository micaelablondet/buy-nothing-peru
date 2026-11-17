# AGENTS.md: rules for any coding agent working on Barrio

Barrio is a free-giving web app (PWA) for neighbors in Peru. **`docs/SRD.md` is the single source of truth.** Read it before doing anything. These rules apply to Cursor, Claude Code, or any other agent. Docs map: `docs/README.md`.

**Where things stand:** see `docs/handoff.md` (newest entry on top). Slices M0 to M9 are built. Next: Phase 0 launch ops, then M10 (admin portal split) before Phase 1. See `docs/SRD.md` section 13. Ready-to-paste prompts: `docs/cursor-prompts.md`.

## 1. Spec first

1. Read `docs/SRD.md` sections 0 (how to read), 5 (non-goals), 7 (domain model), 11 (architecture) and the requirement IDs you were asked to implement.
2. Work **by slice and requirement ID** (e.g. "implement M10: AUTH-04 (M10 version), ADMIN-04 to ADMIN-06"). Do not build anything that is not in the SRD.
3. **Never build a non-goal** (section 5.2), even if it seems helpful. No Presto, no chat, no phone verification, no SMS or email sending, no AI features, no ratings, no dark mode.
4. If the SRD is ambiguous, contradictory or silent: **stop**, add an entry to `docs/assumptions-and-questions.md` and ask Mica. Do not guess.
5. Do not edit `docs/SRD.md` requirements yourself. Propose the change in the PR description. Mica approves it, then it gets a changelog line.
6. If a step needs something only Mica can do (Cloudflare dashboard, Access, Google console, secrets), stop and name the step from `docs/m0-setup.md`, `docs/phase0-launch.md` or `docs/m10-admin-portal-setup.md`.

## 2. Repo map

```
worker/                  end-user Worker "barrio" (wrangler.toml): index.ts, routes/, auth/, session.ts
worker/domain/ db/ lib/  shared code: state machines, queries, metrics, rules
worker/admin/            M10 only: admin Worker "barrio-admin" (wrangler.admin.toml)
src/                     end-user React PWA: pages, components, copy/es-PE.ts, styles/tokens.css
admin/                   M10 only: admin React app with its own copy file
migrations/              D1 migrations, the only place, used by both Workers
scripts/                 seed.sql; build-tokens.mjs (M9)
design/                  parkside.tokens.json (Parkside source, DEC-17)
docs/                    SRD, decisions, handoff, feature plan, setup, ADRs, Cursor prompts
```

**Boundaries (enforced by a CI test from M10):** `worker/admin/**` may import only `worker/domain`, `worker/db` and `worker/lib`. End-user Worker code never imports `worker/admin/**`. `admin/**` may import only `src/styles/**` from `src/`. `src/**` never imports `admin/**`. Do not restructure the repo into `apps/` and `packages/` (DEC-21).

## 3. Architecture rules

- Stack: Cloudflare Workers + Hono (TypeScript), React + Vite, D1, R2, GitHub Actions. If you want a different option, write a short ADR in `docs/adr/` and **wait for approval**.
- Use **migrations** (SQL files in `migrations/`, committed) for every schema change. Never change the database by hand.
- Post and response **status changes go through the state machines** in `worker/domain` (`postStateMachine`, `responseStateMachine`), including admin removal. Never write a status directly from a route or a component. The legal transitions are in `docs/SRD.md` 7.3 and 7.4.
- Cron jobs (post expiry, 48h nudge) live in `barrio` only and must be **idempotent**.
- Secrets and personal data live only in Cloudflare secrets (`wrangler secret put`) or `.dev.vars` locally. **The repo is public:** never commit secrets, tokens, `.env` / `.dev.vars` files, or personal data such as emails. This includes `wrangler.toml`.
- Never hard-code a hostname. Use `APP_BASE_URL`.
- From M10, each Worker has its own config, secrets and deploy command. Local dev runs both Workers against one shared local D1 state.

## 4. Privacy and security rules (non-negotiable)

- A user's **WhatsApp number must never appear** in a feed, an open-post API, a response list, a public page, a notification, an analytics event, a log, **or any admin screen or admin API**. It is revealed only to the two parties of a `chosen` or `delivered` post (HAND-02).
- Public pages (`/p/{id}`) show only: title, photos, description, category, district, poster's **first name**, status.
- **Check authorization on the server for every write and every private read.** Do not rely on the UI hiding a button.
- **Admin status is never trusted from the session token.** Check the current user and `ADMIN_EMAILS` on every admin request (AUTH-04).
- CORS allows credentials only for the app's own origin (SAFE-05). Never reflect an arbitrary `Origin`.
- Cookies stay **host-only** (never set a `Domain` attribute).
- Do not put personal data in URLs, console logs or error messages.
- Request only Google scopes `openid`, `email`, `profile`.
- **M10 admin portal:** every request is checked in the Worker even though Cloudflare Access sits in front: validate the `Cf-Access-Jwt-Assertion` JWT (signature against the team's public keys, `aud` = `ACCESS_AUD`, expiry) and check the email against `ADMIN_EMAILS`. Fail closed (403). Never accept the end-user session cookie. Send `X-Robots-Tag: noindex`. Every admin write records one `admin_action` event. Never link to the admin URL from the end-user app.
- Do **not change auth, authorization, the admin check, the state machines, the notification jobs or the number-reveal logic without adding or updating tests** for that change.

## 5. UI and copy rules

- All UI copy is **Spanish for Peru, informal "tú"**, in one copy file per app (`src/copy/es-PE.ts`; from M10 also `admin/src/copy/es-PE.ts`). No hard-coded strings in components. Use the exact labels from the SRD (e.g. `Yo tengo`, `Me interesa`, `Elegir`, `Entregado`, `Lo recibí`, `Compartir en WhatsApp`, `Quitar publicación`).
- Mobile-first at **375px**. Body text at least 16px, tap targets at least 44px (`--tap-min`), WCAG AA contrast. The primary action on a screen is a **filled** button.
- **Design tokens only:** colors, spacing, radii and type come from CSS variables in `src/styles/tokens.css`. **No hard-coded hex values or pixel sizes** in components.
- **Parkside (from M9, DEC-17):** the Parkside block of `tokens.css` is **generated** from `design/parkside.tokens.json` by `node scripts/build-tokens.mjs`; never edit that block by hand. Use Parkside variable names (mapping in `docs/SRD.md` 11.3). Rules: one filled `primary` button per view; `leaf`, `clay` and `olive` only for text of 24px or more, icons, or decoration; `moss` and `robin` are backgrounds with `ink` text; `danger` only for errors and destructive actions; EB Garamond for headings, Work Sans for everything else; self-hosted WOFF2 fonts, weights 400 and 600, `font-display: swap`; light theme only.
- Keep the UI simple. Restyle existing components; do not invent new components, colors or flows that are not in the SRD.

## 6. How to work (workflow)

1. One **branch per slice** (e.g. `m10-admin-portal`). Never commit straight to `main`.
2. Implement in the slice order in `docs/SRD.md` section 13. Do not start a slice before the previous one passes its exit criteria.
3. Write tests **with** the code: unit tests for the state machines and rules, Playwright e2e for the core loop (12.2), and the authorization tests in `docs/SRD.md` 12.3. Test the M10 Access check with a locally signed test key, never a real Access token.
4. Before opening a PR, run: `npm run typecheck`, `npm test`, `npm run build`, `npm run db:reset:local`, `npm run test:e2e`. (No linter yet.) From M10 also the admin build and tests.
5. Open a **pull request** that lists the slice and requirement IDs covered, what changed, how it was tested, screenshots for UI changes (375px), and anything you were unsure about.
6. **CI must be green** before merge. If a check fails, fix it; do not disable or skip tests.
7. Prefer a **review by a different model or agent** than the one that wrote the code (a second model catches blind spots the first one shares with its own work).
8. Use the seed script for test data. Never use real users' data.
9. When you finish a stage, update `docs/handoff.md` (newest entry on top) and `docs/feature-prioritization.csv` status as needed.

## 7. Definition of done

A requirement is done only when all of this is true:
- Its acceptance criteria pass in automated tests.
- CI is green.
- Copy is in the right copy file and reads naturally.
- No scope beyond the requirement was added, and no code crossed a boundary in section 2.
- The PR notes any assumption or open question you hit.

## 8. When in doubt

Smaller is better. Ship the thinnest version that meets the acceptance criteria. If you are about to add something "just in case", don't, and write it as an open question in `docs/assumptions-and-questions.md` instead.
