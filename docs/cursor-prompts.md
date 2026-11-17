# Cursor prompts for the next slices

Paste one prompt per slice, in order, each on a fresh branch. Review the PR (and ask a second model to review it) before starting the next one. Source of truth: `docs/SRD.md` v0.4.

## M8: Pre-launch hardening (before Phase 0)

```
Read docs/SRD.md (sections 0, 8.1 AUTH-04, 8.7 SAFE-05, 12.2, 12.3, 13) and AGENTS.md.
Implement slice M8 only, on branch m8-prelaunch-hardening.

1. AUTH-04 (M8 version): admin routes must check the current user from the DB
   and the current ADMIN_EMAILS on every request. Stop trusting isAdmin from the
   session token (worker/routes/admin.ts, worker/session.ts). Keep isAdmin in
   /api/me only as a UI hint computed fresh.
2. Move ADMIN_EMAILS out of wrangler.toml. It becomes a Worker secret; document
   it in .dev.vars.example. No email may remain in any committed file.
3. SAFE-05: CORS in worker/index.ts allows credentials only for APP_BASE_URL
   (plus the Vite dev origin when ENVIRONMENT is not production).
4. Tests: unit/contract tests for 1 and 3; Playwright e2e for the core loop of
   Regalo and Pido (post, respond, choose, WhatsApp link shown to both parties,
   Entregado) and the 12.2 rule tests; the missing 12.3 cases (user A cannot
   choose on user B's post; a non-party cannot get the number).

Do not change the UI design or anything outside M8. Run typecheck, test, build,
db:reset:local, test:e2e. Open a PR listing the requirement IDs covered and
anything you were unsure about.
```

## M9: Parkside restyle (before Phase 0)

```
Read docs/SRD.md (sections 5.2, 11.3, DEC-17, DEC-23) and AGENTS.md section 5.
Implement slice M9 only, on branch m9-parkside.

1. Write scripts/build-tokens.mjs: it reads design/parkside.tokens.json and
   generates the Parkside block of src/styles/tokens.css (light values only).
   Keep the Barrio-only tokens listed in 11.3 in a hand-kept block. Add an
   npm script "tokens".
2. Rename CSS variables across src/ (components, pages, shell.css) using the
   mapping table in docs/SRD.md 11.3. No hard-coded hex or pixel sizes.
3. Self-host EB Garamond and Work Sans as WOFF2 subsets (Latin + Spanish
   characters), weights 400 and 600, font-display: swap. Headings use
   --font-display; everything else Work Sans.
4. Apply the Parkside rules in 11.3 (one filled primary button per view,
   contrast rules, moss/robin as backgrounds with ink text).

No new components, no dark mode, no copy changes. Add before/after screenshots
at 375px of Entrar, feed, post detail, create post, profile and /admin to the PR.
Run typecheck, test, build, test:e2e.
```

## M10: Admin portal split (before Phase 1)

```
Read docs/SRD.md (sections 8.1 AUTH-04, 8.8 ADMIN-01 to ADMIN-06, 11, 12.2, 12.3,
13 M10), docs/adr/0001-separate-admin-portal.md, docs/m10-admin-portal-setup.md
and AGENTS.md. Implement slice M10 only, on branch m10-admin-portal.

Phase A (do not remove anything yet):
1. Add a second Worker "barrio-admin": wrangler.admin.toml (same D1 database),
   entry worker/admin/index.ts, admin routes moved from worker/routes/admin.ts.
   It may import only worker/domain, worker/db and worker/lib.
2. ADMIN-04: validate Cf-Access-Jwt-Assertion on every request (team JWKS from
   ACCESS_TEAM_DOMAIN, aud = ACCESS_AUD, expiry) and check ADMIN_EMAILS. Fail
   closed with 403 when anything is missing. Tests with a locally signed key.
3. ADMIN-05 and ADMIN-06: noindex header, robots.txt, reject the end-user
   session cookie, one admin_action event per admin write; ADMIN-01 adds
   "mark report resolved" and resolves reports when a post is removed.
4. Admin React app in admin/ (own index.html, own copy file, imports only
   src/styles from src/), built to dist-admin/. Scripts: dev:admin (port 8788,
   shared local D1 state), build:admin, deploy:admin.
5. A CI test that fails if the boundary rules in docs/SRD.md 11.2 are broken; add
   the admin build and tests to .github/workflows/ci.yml.
Then stop and ask me to do docs/m10-admin-portal-setup.md steps 2 to 5.

Phase B (after I confirm step 5 passed):
6. Remove /admin, /api/admin/*, the Profile admin link and ADMIN_EMAILS from
   the end-user Worker; they must return 404 (AUTH-04 M10 version).
7. Migration that drops users.is_admin.
8. Admin smoke e2e (docs/SRD.md 12.2).

Open a PR for each phase.
```
