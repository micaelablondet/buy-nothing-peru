# ADR 0001: The admin portal becomes a separate app on its own URL

**Status:** Accepted | **Date:** 2026-11-16 | **Decisions:** DEC-21, DEC-22 in `SPEC.md` | **Slice:** M10 (before Phase 1)

## Context

As built (M6), admin lives inside the end-user app: the `/admin` screen in the PWA and `/api/admin/*` in the `barrio` Worker. A user is an admin if their email is in `ADMIN_EMAILS`, and that flag is stored in the 30-day session token.

Mica wants the end-user app and the admin portal on **separate URLs**.

## Decision

- Add a **second Worker, `barrio-admin`**, built from the **same repo and `package.json`**: its own `wrangler.admin.toml`, entry `worker/admin/index.ts`, and a small React app in `admin/` built to `dist-admin/`.
- It reuses the shared code in `worker/domain`, `worker/db` and `worker/lib` and binds the **same D1 database**. Migrations stay in `migrations/`.
- `barrio-admin` is protected by **Cloudflare Access** at the Worker level (Zero Trust free plan), so every URL it answers on requires login.
- `barrio-admin` **also** validates the Access JWT (`Cf-Access-Jwt-Assertion`) and checks `ADMIN_EMAILS` on every request, and fails closed. `ctx.access` is not passed in every Worker setup (for example with static assets), so the Worker does not rely on it alone.
- The end-user Worker loses `/admin`, `/api/admin/*` and the admin flag.
- **Timing (DEC-22):** before Phase 1, not before Phase 0. For Phase 0, M8 makes the existing `/admin` safe enough: the admin check reads the current allowlist on every request, `ADMIN_EMAILS` becomes a secret, and CORS is limited.

## Consequences

**Good**
- Admin code, routes and secrets never ship to neighbors.
- No admin login to build or maintain: Access handles it (email one-time PIN or Google).
- Each app deploys and fails on its own.
- No restructure of working code: one new folder per side, plus a config file.

**Costs**
- A second Worker to configure, secure and deploy (`docs/m10-admin-portal-setup.md`).
- Two sets of secrets.
- Local dev must point both Workers at the same local D1 state.
- Needs a boundary test so the two sides do not import each other.

## Alternatives rejected

| Option | Why not |
|---|---|
| Keep `/admin` in the same app forever | Mica asked for separate URLs; admin code ships to users; one auth bug exposes admin actions |
| Restructure into a monorepo (`apps/`, `packages/`) | Large churn on working, tested code for no user value |
| Separate repo or separate database | Shared rules and data would drift |
| Build our own admin login | Access does it for free and better |
| Split before Phase 0 | Delays learning; Phase 0 users are Mica's neighbors and M8 closes the real holes |
