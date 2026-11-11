# AGENTS.md: rules for any coding agent working on Barrio

Barrio is a free-giving web app (PWA) for neighbors in Peru. **`SPEC.md` is the single source of truth.** Read it before doing anything. These rules apply to Cursor, Claude Code, or any other agent.

## 1. Spec first

1. Read `SPEC.md` sections 0 (how to read), 5 (non-goals), 7 (domain model) and the requirement IDs you were asked to implement.
2. Work **by requirement ID** (e.g. "implement RESP-01 to RESP-07"). Do not build anything that is not in the spec.
3. **Never build a non-goal** (section 5.2), even if it seems helpful. No Presto, no chat, no phone verification, no SMS or email sending, no AI features, no ratings.
4. If the spec is ambiguous, contradictory or silent: **stop**, add an entry to `SPEC.md` section 14 (Open questions) and ask Mica. Do not guess.
5. Do not edit `SPEC.md` requirements yourself. Propose the change in the PR description. Mica approves it, then it gets a changelog line.

## 2. Architecture rules

- Stack: Cloudflare Workers + Hono (TypeScript), React + Vite PWA, D1, R2, GitHub Actions. If you want a different option, write a short ADR in `docs/adr/` and **wait for approval**.
- Use **migrations** (SQL files, committed) for every schema change. Never change the database by hand.
- Post and response **status changes go through one module** (`postStateMachine`). Never write a status directly from a route or a component. The legal transitions are in `SPEC.md` 7.3 and 7.4.
- Scheduled jobs (post expiry, 48h nudge) must be **idempotent**.
- Secrets live only in Cloudflare environment variables. Never commit secrets, tokens, or `.env` files.

## 3. Privacy and security rules (non-negotiable)

- A user's **WhatsApp number must never appear** in a feed, an open-post API, a response list, a public page, a notification, an analytics event, or a log. It is revealed only to the two parties of a `chosen` or `delivered` post (HAND-02).
- Public pages (`/p/{id}`) show only: title, photos, description, category, district, poster's **first name**, status.
- **Check authorization on the server for every write and every private read.** Do not rely on the UI hiding a button.
- Do not put personal data in URLs, console logs or error messages.
- Request only Google scopes `openid`, `email`, `profile`.
- Do **not change auth, authorization, the state machine, the notification jobs or the number-reveal logic without adding or updating tests** for that change.

## 4. UI and copy rules

- All UI copy is **Spanish for Peru, informal "tú"**, stored in one copy file (`src/copy/es-PE.ts`). No hard-coded strings in components. Use the exact labels from the spec (e.g. `Yo tengo`, `Me interesa`, `Elegir`, `Entregado`, `Lo recibí`, `Compartir en WhatsApp`).
- Mobile-first at **375px**. Body text at least 16px, tap targets at least 44px, WCAG AA contrast. The primary action on a screen is a **filled** button.
- **Design tokens only:** colors, spacing and type sizes come from CSS variables in `src/styles/tokens.css`. **No hard-coded hex values or pixel sizes** in components. If a token you need is missing, add it to the tokens file.
- Keep the UI simple. Do not invent new components, colors or flows that are not in the spec.

## 5. How to work (workflow)

1. Create a **branch per requirement group** (e.g. `m3-responses-handoff`). Never commit straight to `main`.
2. Implement in the vertical-slice order in `SPEC.md` section 13. Do not start a slice before the previous one passes its exit criteria.
3. Write tests **with** the code: unit tests for the state machine and rules, Playwright e2e for the core loop, and the authorization tests in `SPEC.md` 12.3.
4. Run lint, type-check, unit tests and e2e before opening a PR. (Exact commands live in `package.json`; keep this line in sync: `TODO fill in once scaffolded`.)
5. Open a **pull request** that lists the requirement IDs covered, what changed, how it was tested, and anything you were unsure about.
6. **CI must be green** before merge. If a check fails, fix it; do not disable or skip tests.
7. Prefer a **review by a different model or agent** than the one that wrote the code (a second model catches blind spots the first one shares with its own work).
8. Use the seed script for test data. Never use real users' data.

## 6. Definition of done

A requirement is done only when all of this is true:
- Its acceptance criteria pass in automated tests.
- CI is green.
- Copy is in the copy file and reads naturally.
- No scope beyond the requirement was added.
- The PR notes any assumption or open question you hit.

## 7. When in doubt

Smaller is better. Ship the thinnest version that meets the acceptance criteria. If you are about to add something "just in case", don't, and write it as an open question instead.
