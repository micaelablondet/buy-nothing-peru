# Assumptions and open questions

Risks (`R-*`) and open questions (`OQ-*`) for Barrio. IDs are stable. For the Valere docs map, see [`README.md`](./README.md).

| ID | Level | Risk / open question | Mitigation or next step | Owner |
|---|---|---|---|---|
| R-01 | **CRITICAL** | **The building already has a WhatsApp group.** Barrio may add too little over a free, familiar tool inside the Phase 0 beachhead. | Test H3 explicitly: DISC-01 survey, user conversations, and Phase 1 reach beyond the building as the real value. Seed with items people would otherwise post in the group. | Mica |
| R-02 | HIGH | **Thin density**: 32 apartments may produce too few posts to learn from. | Mica seeds first items; invite code shared in the building group; Phase 0 bar is calibrated to the building. | Mica |
| R-03 | HIGH | **Unverified WhatsApp numbers**: wrong or fake numbers, or impersonating a neighbor. | Show the Google name beside offers; report button; fix-my-number path; add verification at the Phase 1 gate. | Mica |
| R-04 | HIGH | **Verification options after Phase 0:** WhatsApp inbound verification needs a dedicated number (a prepaid SIM) and a Meta business setup; SMS costs money. | Decide at the Phase 1 gate (OQ-06). | Mica |
| R-05 | MEDIUM | **Staff may not have a Google account** (or may not remember its password). | Ask staff before launch; help them sign in once at onboarding. If several cannot, revisit the identity design (DEC-09) before Phase 1. | Mica |
| R-06 | MEDIUM | **iOS web push** works only for PWAs added to the home screen. | In-app inbox is the fallback; prompt `Añadir a inicio` after the first post. | Agent / Mica |
| R-07 | MEDIUM | **Free-plan limits** on Cloudflare (requests, D1, R2, cron; Workers Free has a 10 ms CPU limit per request). | Limits recorded in `docs/cloudflare-free-limits.md`; keep queries light; a second Worker in M10 stays within the 100-Worker limit. | Agent |
| R-08 | MEDIUM | **Peru data-protection obligations** when collecting phone numbers (Ley 29733) and Terms/Privacy adequacy. | Get legal advice before expanding beyond the pilot. | Mica |
| R-09 | MEDIUM | **Two apps means more setup and more ways to drift** (M10): two Workers, two sets of secrets, Access, one shared database and its migrations; Access identity (`ctx.access`) is not passed in some Worker setups. | Same repo and package; migrations only in `migrations/`; shared code only in `worker/domain`, `worker/db`, `worker/lib`; boundary test in CI; `docs/m10-admin-portal-setup.md`; ADMIN-04 validates the JWT header itself and is proven on the deployed URL before the old `/admin` is removed. | Agent / Mica |
| R-10 | MEDIUM | **Public repo**: anything committed stays in git history (today: the admin email in `wrangler.toml`). | M8 moves `ADMIN_EMAILS` to a secret. Never commit personal data, keys or real user data. Consider a secret scan in CI later. | Mica / Agent |
| OQ-01 | ~~LOW~~ **RESOLVED** | Visual identity: Parkside design system (DEC-17). Logo is a text wordmark until OQ-08. | None. | Mica |
| OQ-02 | LOW (part resolved) | Seeding is decided (Mica + 2 friendly neighbors, DEC-18). **Still open: the Phase 0 start date.** | Set the start date once M9 is merged; add the gate review date to the calendar. | Mica |
| OQ-03 | MEDIUM | Confirm the exact Cloudflare free-plan limits, and whether enabling **R2** and **Zero Trust** requires a payment method on file (likely for R2) even when usage stays free. | Workers, D1 and R2 limits are in `docs/cloudflare-free-limits.md`. Payment-method question: check when creating the R2 bucket (before Phase 0 launch) and Zero Trust (M10). If Mica won't add a card, the agent proposes an alternative in an ADR. | Agent / Mica |
| OQ-04 | MEDIUM | Is a custom domain required for the Google OAuth consent screen (privacy policy and homepage URLs)? Which domain? It will serve **two hostnames**: the end-user app on the root and the admin portal on `admin.` (section 11.4). | Check Google's requirements; likely buy a domain through Cloudflare (small annual cost). | Mica |
| OQ-05 | ~~LOW~~ **RESOLVED** | A `chosen` post with no `Entregado` auto-closes after 14 days (DEC-19). | None. | Mica |
| OQ-06 | MEDIUM | Which verification method at the Phase 1 gate: WhatsApp inbound (needs a number) or SMS (cost)? | Decide before opening Barranco. | Mica |
| OQ-07 | LOW | Final prohibited-items list. | Mica reviews the draft in SAFE-02. | Mica |
| OQ-08 | LOW | **Name validation:** Barrio is a working name (Indecopi, app stores, handles, tone test in Lima). | Do before any public launch. | Mica |
| OQ-09 | LOW | Do you want to segment neighbors vs staff in metrics? Currently not tracked. | Add an optional profile field only if useful. | Mica |
| OQ-10 | LOW | Should an admin see a **reported user's WhatsApp number or email** to follow up on a scam report? Default in V1: no (ADMIN-01). | Decide after the first real report. If yes, show it only on that report, record it as an `admin_action` event, and state it in the privacy policy. | Mica |

---
