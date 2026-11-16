# M10 setup: admin portal on its own URL

Steps **Mica** does in Cloudflare while the agent builds slice M10 (`SPEC.md` section 13, ADR 0001). Do them in this order. The old `/admin` stays until step 5 passes.

| App | Worker | URL now | URL with a domain (OQ-04) |
|---|---|---|---|
| End-user app | `barrio` | `barrio.<account>.workers.dev` | `<domain>` |
| Admin portal | `barrio-admin` | `barrio-admin.<account>.workers.dev` | `admin.<domain>` |

## 1. Agent deploys the empty admin Worker

- [ ] The agent adds `wrangler.admin.toml` (same D1 `database_id` as `wrangler.toml`) and runs `npm run deploy:admin`. The Worker answers with a placeholder page and **403 on every API route** until step 3 is done.

## 2. Turn on Zero Trust

- [ ] Cloudflare dashboard → **Zero Trust**. Pick a team name (your team domain becomes `<team>.cloudflareaccess.com`) and the **Free** plan (up to 50 users). It may ask for a payment method.
- [ ] Login method: **One-time PIN** (a code by email) works out of the box. Optionally add Google.

## 3. Protect the admin Worker

- [ ] Workers & Pages → `barrio-admin` → **Access** tab → **Protect this Worker behind Access**.
- [ ] Policy: **Allow**, emails = your admin email (plus a co-admin's, if any).
- [ ] Do **not** use "Protect all Workers" for the account. It would also lock the end-user app.
- [ ] Copy the application's **AUD tag** and your **team domain**.

## 4. Set the admin Worker's settings

Run in Cursor's terminal. Values never go in the repo.

| Name | Kind | Value |
|---|---|---|
| `ACCESS_TEAM_DOMAIN` | var | `https://<team>.cloudflareaccess.com` |
| `ACCESS_AUD` | secret | AUD tag from step 3 |
| `ADMIN_EMAILS` | secret | Same emails as the Access policy, comma-separated |

```bash
npx wrangler secret put ACCESS_AUD --config wrangler.admin.toml
npx wrangler secret put ADMIN_EMAILS --config wrangler.admin.toml
```

## 5. Check it

- [ ] Open the admin URL in a **private window**: it asks you to log in. After login you see reports, posts, invites and metrics.
- [ ] Log in with an email **not** in the policy: blocked by Access.
- [ ] Open the end-user URL in a private window: it does **not** ask for Access login.
- [ ] Remove a seed post in the admin portal: it disappears from the end-user feed and its public page shows `Esta publicación ya no está disponible`.

## 6. Agent removes the old admin

- [ ] Only after step 5 passes: the agent removes `/admin`, `/api/admin/*`, the Profile link and `ADMIN_EMAILS` from `barrio`, and drops `users.is_admin` with a migration.
- [ ] Check: `<end-user URL>/admin` and `/api/admin/metrics` return 404.
- [ ] Remove the `ADMIN_EMAILS` secret from `barrio`: `npx wrangler secret delete ADMIN_EMAILS`.

## Later: custom domain (OQ-04)

- [ ] `barrio` → Settings → Domains & Routes → add Custom Domain `<domain>`; `barrio-admin` → add `admin.<domain>`.
- [ ] Update `APP_BASE_URL` on `barrio`; add `<domain>/api/auth/google/callback` as a Google redirect URI.
- [ ] Check the admin portal in a private window again. Access follows the Worker.
