# Barrio: Solution Requirements Document (SRD)

**Version:** v0.1 | **Date:** November 10, 2026 | **Status:** DRAFT, ready to build Phase 0
**Owner:** Micaela (Mica) Blondet, product | **Builders:** Mica + coding agents (Cursor)
**Source of truth:** this file (`SPEC.md`) in the repo. Any hosted copy (Claude Doc, Google Doc) is an export.
**Adapted from:** the Valere SRD template, trimmed for a solo, agent-built side project.

---

## 0. How to read this document (humans and agents)

- Every requirement has a stable ID (e.g. `RESP-05`). Work and test by ID: "implement RESP-01 to RESP-05".
- **P0** = needed for Phase 0 launch. **P1** = include in V1 if time allows, can ship after P0. Nothing outside this file gets built (see section 5, Non-goals).
- Each requirement has acceptance criteria in Given/When/Then form or a single testable statement. A requirement is **done** only when its criteria pass in an automated test (see section 12).
- If something is ambiguous or missing, **stop and add it to section 14 (Open questions)**. Do not guess.
- UI copy is Spanish (Peru, informal "tú"). This document is English. Spanish strings are in `code font`.
- Rules specific to coding agents live in `AGENTS.md`.

### Change log
| Version | Date | Change |
|---|---|---|
| v0.1 | 2026-11-10 | First draft from the product brief and the decision session (see section 15) |

---

## 1. Summary

**Barrio** is a free-giving app for neighbors in Peru, modelled on the US "Buy Nothing" idea. Neighbors **give** things (**Regalo**) or **ask** for things (**Pido**). Nothing is sold. When a giver and a receiver are matched, they coordinate pickup on **WhatsApp**, not in an in-app chat.

**V1 is a thin, working, Spanish-only mobile web app (PWA)** with real accounts, real posts and real handoffs, launched in two phases:

- **Phase 0:** inside Mica's own 32-apartment building in Barranco (neighbors and building staff such as concierges and cleaning staff), 3 weeks.
- **Phase 1:** all of Barranco, 4 to 6 weeks, only if Phase 0 passes its gate.

The goal of V1 is **learning**, not scale: does the give/ask loop actually happen between real neighbors, and does it happen *because of* Barrio?

---

## 2. Problem, hypotheses and evidence status

### 2.1 Problem (hypothesis, not yet validated)
People have usable things they would give away and neighbors who need those things, but finding each other is clumsy. Today this happens in building or neighborhood WhatsApp groups and social media groups, where posts get buried, have no status ("is this still available?"), and carry no history.

### 2.2 Alternatives people use today
- Building / neighborhood WhatsApp groups (free, familiar, unstructured). **This is the strongest competitor and it exists inside the Phase 0 beachhead.**
- Facebook groups and marketplaces (mostly selling, not giving).
- Throwing away, or giving to family and friends.
- No Buy Nothing equivalent in Peru was confirmed in earlier research (see the product brief).

### 2.3 Riskiest assumptions (what V1 must test)
| ID | Assumption | How V1 tests it | Evidence needed |
|---|---|---|---|
| H1 | Neighbors will post items to give away, in an app, to people they barely know | Posts per week in Phase 0 | 3+ completed handoffs/week by week 3 |
| H2 | Requests (Pido) get answered fast enough to feel useful | 48h response rate | 60%+ of posts get a response within 48h |
| H3 | Barrio adds something a building WhatsApp group does not (status, structure, reach beyond the building) | Post-handoff micro-survey (DISC-01) plus conversations with users | A meaningful share of handoffs say "I wouldn't have done it via the group" |
| H4 | Building staff will participate | Account count includes staff | At least some staff accounts and a handoff involving staff |
| H5 | The WhatsApp-share loop pulls neighbors from district groups into Barrio | Public page views and sign-ups from shared links (Phase 1) | Sign-ups attributable to shared links |

No user research has been done yet beyond Mica's own experience of her building. Phase 0 is also a discovery period: talk to users, do not only read dashboards.

---

## 3. Vision, north star, strategic principles

**Vision:** a neighborhood where giving something away is as easy as sending a WhatsApp message, and nothing useful gets thrown away.

**North star metric:** **Completed handoffs per week (CH/wk).** A handoff is complete when the giver taps **Entregado** (see HAND-03).

**Guardrails:** share of posts with at least one response within 48 hours; median time to create a post on mobile; share of handoffs with the receiver's optional "Lo recibí" confirmation (measures inflation).

**Principles:**
1. **Neighbor-first and low friction.** Posting should take under ~90 seconds.
2. **WhatsApp is the conversation layer.** Barrio matches, WhatsApp talks.
3. **Privacy by default.** WhatsApp numbers are revealed only to the two people in a handoff, only after a choice is made.
4. **Small and honest.** One district, two post types, no growth hacks beyond the WhatsApp share button.

---

## 4. Users

| User | Who | What they need |
|---|---|---|
| **Giver** | A neighbor with something to give | Post quickly, pick the right recipient, hand over, mark done |
| **Asker** | A neighbor who needs something | Post a Pido, compare offers, pick one |
| **Building staff** | Concierges, cleaning staff and others who work in the building; counted as users | Same flows as neighbors. Simple, large-text, low-literacy-friendly UI |
| **Admin** | Mica | Review reports, remove posts, manage the invite code, read metrics |

Neighbors and staff are the same account type in the product. Nothing in the data model distinguishes them (see section 14, OQ-09 if you later want to segment).

---

## 5. Scope

### 5.1 In scope (V1)
Google sign-in; building invite code (Phase 0); profile with a self-declared WhatsApp number; Regalo and Pido posts with photos; feed with category filter; responses ("Me interesa" / "Yo tengo", max 7); choose a response; WhatsApp handoff; "Entregado" and optional "Lo recibí"; web push + in-app inbox notifications; public read-only post pages with a "Compartir en WhatsApp" button; report button, prohibited-items list, public-pickup tip; simple admin view; minimal analytics; Terms and Privacy pages.

### 5.2 Non-goals (do NOT build in V1)
- **Presto (lending)** and any lending states (due dates, returns, overdue).
- In-app chat or messaging.
- **Phone number verification** (SMS or WhatsApp). Deferred to the Phase 1 gate (see DEC-09).
- Ratings, reviews, reputation, public user profiles, user blocking or muting.
- Any AI feature in the product (photo-to-listing, AI moderation). Trigger to revisit: median post time over ~90 seconds.
- Payments, selling, donations, ads.
- SMS or email sending of any kind. Notifications are web push and in-app only.
- Full-text search, maps, geolocation, address collection.
- Native iOS/Android apps. Multiple languages. Offline mode.
- Moderation tooling beyond the admin report view.
- Cross-district discovery beyond a district filter.

### 5.3 Phases
| Phase | Where | Duration | Auth gate |
|---|---|---|---|
| 0 | Mica's building (32 apartments + staff) | 3 weeks | Google sign-in + building invite code |
| 1 | Barranco | 4 to 6 weeks | Google sign-in, invite code off (`INVITE_REQUIRED=false`), add phone verification before opening (see DEC-09) |

---

## 6. Goals and success metrics (pre-committed)

These numbers are set **before launch** so results cannot be rationalized afterwards. Edit only with a changelog entry and a reason.

### Phase 0: building pilot (3 weeks)
| Metric | Target | Notes |
|---|---|---|
| Signed-up accounts | **10+** | Neighbors **and** building staff both count |
| Completed handoffs per week | **3+ by week 3** | North star |
| Posts with 1+ response within 48h | **60%+** | Includes Regalo and Pido |
| **Gate:** pass all three to open Phase 1 | | If you miss, extend the pilot or revisit H1 to H3 before expanding |

### Phase 1: Barranco (4 to 6 weeks)
| Metric | Target |
|---|---|
| Completed handoffs per week | **10+ by week 4** |
| Posts with 1+ response within 48h | **60%+** |
| **Stop / pivot trigger** | **Under 3 handoffs/week by week 6 despite seeding** |

Metric definitions are in section 10 (ANLY-01).

---

## 7. Core concepts and domain model

### 7.1 The core loop
Post (Regalo or Pido) → neighbors respond → the poster chooses one response → both are handed each other's WhatsApp contact → pickup on WhatsApp → the giver taps **Entregado**.

Terminology (use consistently in code and UI):
| Concept | Regalo post | Pido post |
|---|---|---|
| Poster | **Giver** | **Asker** (receiver) |
| Responder | Interested neighbor (**Me interesa**), the receiver if chosen | Offerer (**Yo tengo**), the giver if chosen |
| Chooser | The giver | The asker |
| Who taps **Entregado** | The giver (the poster) | The giver (the chosen offerer) |

### 7.2 Entities (logical; exact columns may vary, names must not)
| Entity | Key fields |
|---|---|
| `users` | id, google_sub (unique), display_name, whatsapp_e164, district, is_admin (derived from allowlist), created_at, deleted_at |
| `posts` | id, type (`regalo`\|`pido`), owner_id, title (max 60), description (max 500), category, district, status, chosen_response_id, created_at, expires_at, chosen_at, delivered_at, received_confirmed_at (nullable, HAND-04), disc_answer (nullable, DISC-01) |
| `post_photos` | id, post_id, r2_key, position (Regalo: 1 to 3 required; Pido: 0 to 1 optional) |
| `responses` | id, post_id, user_id, note (max 140), photo_r2_key (optional, Pido only), status, created_at |
| `notifications` | id, user_id, type, post_id, read_at, created_at |
| `push_subscriptions` | id, user_id, endpoint, keys, created_at |
| `reports` | id, reporter_id, post_id, response_id (nullable), reason, text, status, created_at |
| `invite_codes` | id, code, active, created_at |
| `events` | id, user_id (nullable), name, props (json), created_at |

### 7.3 Post state machine
`open` → `chosen` → `delivered`
`open` → `expired` (7 days after creation with no choice)
`open` or `chosen` → `withdrawn` (owner cancels)
`any` → `removed` (admin)
`chosen` → `closed` (14 days after choice with no delivery) *(assumption, see OQ-05)*

Only the transitions above are legal. All transitions go through one module (`postStateMachine`) with unit tests. UI never writes status directly.

### 7.4 Response state machine
`active` → `chosen` | `not_chosen` | `withdrawn`
A response is `not_chosen` when another response is chosen on the same post. A user may have at most one `active` response per post.

### 7.5 Rules shared by Regalo and Pido (single rule set)
- Max **7 active responses** per post. If one is withdrawn, the slot reopens.
- Posts **auto-expire 7 days after creation** if no response is chosen.
- The **poster chooses** the response. Not first-come, first-served.
- Responders show **name and district** (from their profile) before sending a response.
- A user needs a **WhatsApp number on their profile** to post or respond.
- **48 hours after the first response**, if the post is still `open`, the poster gets one nudge notification.

---

## 8. Functional requirements

### 8.1 Authentication and onboarding (AUTH, PROF)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| AUTH-01 | P0 | Sign in with **Google** (OpenID Connect), basic scopes only (`openid`, `email`, `profile`). No passwords. | **Given** a signed-out user **When** they tap `Continuar con Google` and complete consent **Then** they land signed in. No scope beyond openid/email/profile is ever requested. |
| AUTH-02 | P0 | **Invite code gate** for new accounts when `INVITE_REQUIRED=true`. Existing accounts are not asked again. | **Given** a new Google user and an active code **When** they enter the correct code **Then** the account is created. A wrong or inactive code shows `Código inválido` and creates nothing. With `INVITE_REQUIRED=false` the step is skipped. |
| AUTH-03 | P0 | Sessions via signed, HttpOnly, Secure, SameSite=Lax cookie, 30-day lifetime. Logout clears it. | A request without a valid session to any write endpoint returns 401. |
| AUTH-04 | P0 | Admin = user whose Google email is in the `ADMIN_EMAILS` allowlist (env var). | A non-admin receives 403 on every `/admin` route and API. |
| PROF-01 | P0 | Onboarding after first sign-in: display name (prefilled from Google, editable), **WhatsApp number (required)**, district (default `Barranco`). | **Given** an incomplete profile **When** the user tries to post or respond **Then** they are sent to complete the profile and returned to the same screen. |
| PROF-02 | P0 | WhatsApp number validated as a Peruvian mobile: `+51` followed by 9 digits starting with 9. Stored as E.164. **Not verified in V1.** | `987654321` and `+51987654321` are accepted and stored as `+51987654321`. `12345` is rejected with a clear message. |
| PROF-03 | P0 | User can edit name, number and district at any time. | Changes appear on the user's future posts and responses. |
| PROF-04 | P0 | **Account deletion** from the profile. Deletes name, number, push subscriptions and the Google link; withdraws open posts; renames the user on completed handoffs to `Ex vecino`. | After deletion the user cannot sign in with the old account and no personal data remains in `users`. |

### 8.2 Posts and feed (POST)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| POST-01 | P0 | Create a **Regalo**: title, description, category, **1 to 3 photos (required)**. District comes from the profile. | A submission without a photo is rejected. Photos are resized on the device before upload (max 1600px longest side). A valid submission appears in the feed immediately. |
| POST-02 | P0 | Create a **Pido**: title, description, category, optional single reference photo. | A Pido can be created with no photo. |
| POST-03 | P0 | Post detail screen: photos, title, description, category, district, poster's name, status, age, and the actions allowed to this viewer. | Own posts show `Ver ofertas` / `Ver interesados`. Posts of others show the response button (RESP-01). Closed states show a status label instead. |
| POST-04 | P0 | Feed with two tabs: `Regalos` and `Pidos`. Newest first. Default filter: the viewer's district. Category filter chip row. Only `open` posts are listed. | A `chosen`, `delivered`, `expired`, `withdrawn` or `removed` post is not in the feed. |
| POST-05 | P0 | Owner can **withdraw** a post while `open` or `chosen`. | The status becomes `withdrawn`, the post leaves the feed, and active responses become `not_chosen`. |
| POST-06 | P0 | Posts **expire 7 days after creation** if still `open` (scheduled job). | A post created 7 days ago with no choice becomes `expired` within one job cycle. A `chosen` post is not expired. |
| POST-07 | P1 | `Mis publicaciones` list (all statuses). | Shows the user's posts with status. |
| POST-08 | P0 | Categories (fixed list, admin-editable only via code): `Ropa`, `Calzado`, `Muebles`, `Electrodomésticos`, `Electrónica`, `Libros y útiles`, `Juguetes y bebé`, `Hogar y cocina`, `Plantas y jardín`, `Otros`. | Post creation requires one category. |

### 8.3 Responses and choosing (RESP)

Responding is **"Me interesa"** on a Regalo and **"Yo tengo"** on a Pido. One engine, two labels.

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| RESP-01 | P0 | Show a **filled primary** response button without scrolling at 375px width on someone else's open post. Tap opens a bottom sheet. | The sheet contains an editable note (max 140), the responder's **name and district** as the poster will see them, and a confirm button. **Pido** note is pre-filled with `Hola, yo tengo esto y te lo regalo.` The sheet includes an optional `Añadir foto` action on Pido only. |
| RESP-02 | P0 | On confirm, the response is added to the post, the button becomes `Ya ofreciste` (Pido) / `Ya te interesó` (Regalo), and the poster is notified (NOTIF-03). | One active response per user per post (second attempt is blocked). |
| RESP-03 | P0 | A responder can **withdraw** their response. | The response becomes `withdrawn`, the slot reopens, the button returns to its original state. |
| RESP-04 | P0 | If the viewer's profile has no WhatsApp number, tapping the button sends them through PROF-01 and back to the same post. | After completing the profile the user lands on the same post with the sheet open. |
| RESP-05 | P0 | **Cap of 7.** When 7 active responses exist, other users see `Ya hay 7 ofertas` (Pido) / `Ya hay 7 interesados` (Regalo) instead of the button. | Withdrawing one reopens the button for others. |
| RESP-06 | P0 | On own post the owner sees `Ver ofertas` / `Ver interesados`, never the response button. On `delivered`/`chosen`/`expired`/`withdrawn` posts the button is replaced by `Ya resuelto` or `Venció`. | |
| RESP-07 | P0 | **Choose.** The owner sees the list of active responses (name, district, note, photo if any, time), taps `Elegir` on one, and confirms. | Post becomes `chosen`, the chosen response becomes `chosen`, all other active responses become `not_chosen`, the chosen user is notified. The choice cannot be changed in V1 (the owner may withdraw the post). |

### 8.4 Handoff (HAND)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| HAND-01 | P0 | After a choice, **both parties** see a handoff screen for that post with the other person's **name and a `Escribir por WhatsApp` button** that opens `https://wa.me/<number>?text=<prefilled>`. | The prefilled text names the post: `Hola {nombre}, te escribo por «{título}» en Barrio. ¿Coordinamos el recojo?` |
| HAND-02 | P0 | **Number reveal rule:** a WhatsApp number is revealed **only** to the two parties of a `chosen` or `delivered` post, never in feed, detail of an open post, response list, public pages or logs. | A user who is not poster or chosen responder cannot retrieve the number through any API (tested). The number is not present in API payloads for open posts or response lists. |
| HAND-03 | P0 | The **giver** taps `Entregado` to complete the handoff. | Post becomes `delivered` with `delivered_at`. Event `handoff_delivered` is recorded. Only the giver may do it. |
| HAND-04 | P1 | The receiver can tap `Lo recibí` (optional). | Stored as `received_confirmed_at`. Not required for the handoff to count. |
| HAND-05 | P0 | The handoff screen shows a safety tip: `Coordina el recojo en un lugar público y de día.` | Visible on the handoff screen. |
| DISC-01 | P1 | After `Entregado`, ask the giver one question: `¿Cómo lo habrías hecho sin Barrio?` Options: `Por el grupo de WhatsApp`, `No lo habría hecho`, `De otra forma`. | Answer stored on the post. Dismissible. Used to test H3. |

### 8.5 Notifications (NOTIF)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| NOTIF-01 | P0 | **In-app inbox** (bell icon with unread count). Each notification links to its post. | Opening a notification marks it read. |
| NOTIF-02 | P0 | **Web push** subscription offered after the user's first post or response (not on first load). Works as a PWA; on iOS push requires adding the app to the home screen. | If push is denied or unsupported, the inbox still works. No error is shown to the user. |
| NOTIF-03 | P0 | Three notification types, delivered to inbox and push: (1) `Nueva oferta` / `Nuevo interesado` on my post, (2) `Te eligieron` for the chosen responder, (3) `Recordatorio` nudge to the poster 48h after the first response if the post is still `open`. | Each fires once per event. No other notification types exist in V1. |
| NOTIF-04 | P0 | **Nudge job:** runs on a schedule, sends at most one nudge per post. | A post with a first response 48h ago and status `open` yields exactly one nudge, even if the job runs repeatedly. |

### 8.6 Public pages and sharing (PUB)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| PUB-01 | P0 | Each post has a **public read-only page** at `/p/{id}`, viewable without sign-in. Shows title, photos, description, category, district, **poster's first name**, and status. | Shows no WhatsApp number, no email, no responder list. Closed posts show their status. |
| PUB-02 | P0 | Public pages are **server-rendered** with Open Graph tags (title, first photo, short description) so WhatsApp previews work. | The HTML response contains correct `og:title`, `og:image`, `og:description` without running JavaScript. |
| PUB-03 | P0 | `Compartir en WhatsApp` button on post detail opens `https://wa.me/?text=<title + link>`. | Event `share_clicked` recorded. |
| PUB-04 | P0 | Acting on a public page (responding, posting) requires sign-in and returns the user to that page. | After Google sign-in and any needed invite/profile steps, the user returns to `/p/{id}`. |

### 8.7 Safety, reports and admin (SAFE, ADMIN)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| SAFE-01 | P0 | `Reportar` on every post and response with reasons: `Artículo prohibido`, `Estafa o engaño`, `Comportamiento inapropiado`, `Otro` plus optional text. | A report is stored and appears in the admin view. The reporter sees a confirmation. |
| SAFE-02 | P0 | **Prohibited-items list** shown at post creation and in the Terms. Draft list: weapons, drugs and alcohol, medicines, live animals, stolen or illegal items, perishable or opened food. | The list is visible before submit on both post types. Mica reviews the final list (OQ-07). |
| SAFE-03 | P0 | Admin can **remove** a post. | Post becomes `removed` and leaves feed and public page (public page shows `Esta publicación ya no está disponible`). |
| SAFE-04 | P0 | **Rate limits:** per user, max 10 posts/day and 30 responses/day; per IP, sensible limits on auth endpoints. | Exceeding returns a friendly Spanish message. |
| ADMIN-01 | P0 | Admin view at `/admin`: open reports, posts list with remove action. | Only admins can access (AUTH-04). |
| ADMIN-02 | P0 | Admin can create, activate and deactivate invite codes. | A deactivated code is rejected at AUTH-02. |
| ADMIN-03 | P0 | Admin metrics page showing the Phase gate numbers: accounts, CH/wk, 48h response rate, median post-form time, DISC-01 answers. | Numbers match section 10 definitions on seed data (tested). |

### 8.8 Legal (LEGAL)

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| LEGAL-01 | P0 | Spanish `Términos de uso` and `Política de privacidad` pages, linked from the sign-in screen, the footer and the Google consent screen. | Both URLs resolve publicly. Privacy policy states what is stored (name, email via Google, WhatsApp number, photos), why, and how to delete it. |

---

## 9. Non-functional requirements

| Area | Requirement |
|---|---|
| Devices | Mobile-first at **375px**. Android Chrome (last 2 versions) and iOS Safari 16.4+. Works on slow 4G. |
| Performance | Feed loads usable content in under **3s on 4G** on a mid-range Android. Photos resized client-side before upload; images served in web-appropriate sizes. |
| Accessibility | Body text at least 16px, tap targets at least 44px, WCAG AA color contrast, plain-language Spanish. Designed so staff with limited tech comfort can complete a post and a response. |
| Security | Authorization checked server-side on **every** write and on every read of private data. Secrets in Cloudflare environment variables only. No personal data in URLs or logs. Upload validation: image types only, size limit. Tests required (section 12.3). |
| Privacy | Collect only: Google name and email, WhatsApp number, district, photos the user uploads. Numbers revealed per HAND-02 only. Account deletion per PROF-04. |
| Cost | Run on **Cloudflare free plans**. Confirm free-plan limits for Workers, D1, R2 and Cron Triggers during setup (OQ-03). Must work within them for the pilot. |
| Reliability | Scheduled jobs (expiry, nudge) are idempotent. |
| Language | All UI copy in `es-PE`, kept in one copy file, never hard-coded in components. |

---

## 10. Analytics and metric definitions (ANLY-01)

Record these events (table `events`): `user_signed_up` (with `via_invite`), `post_form_opened` (type), `post_created` (type), `response_created`, `response_withdrawn`, `response_chosen`, `handoff_delivered`, `handoff_received_confirmed`, `post_expired`, `nudge_sent`, `share_clicked`, `public_page_viewed`, `report_created`, `disc_answered`.

**Definitions (ADMIN-03 computes these):**
- **Signed-up accounts:** count of users with `deleted_at` null.
- **CH/wk (north star):** posts whose `delivered_at` falls in the ISO week (America/Lima).
- **48h response rate:** posts created in the period that have at least one response created within 48h of `created_at`, divided by posts created in the period (excluding those withdrawn or removed within 48h).
- **Median post time:** median of (`post_created` time minus `post_form_opened` time) for the same user session.
- **Inflation check:** share of `delivered` posts with `received_confirmed_at`.

---

## 11. Technical architecture

Recommended defaults. A coding agent may propose a different option within Cloudflare, but must record it as an ADR (see `AGENTS.md`) and get Mica's approval first.

| Layer | Choice | Notes |
|---|---|---|
| Hosting and API | **Cloudflare Workers** with **Hono** (TypeScript) | One Worker serves the API, the server-rendered public pages and the static app |
| Frontend | React + Vite PWA, mobile-first | Installable, service worker used for push |
| Database | **Cloudflare D1** (SQLite) | Migrations as SQL files, committed |
| Photos | **Cloudflare R2** | Client-side resize before upload |
| Auth | Google OIDC implemented in the Worker, signed cookie sessions | No password storage. No SMS, no Twilio |
| Notifications | **Web Push (VAPID)** + in-app inbox | iOS needs the PWA installed |
| Jobs | **Cron Triggers** | Expiry and nudge, idempotent |
| Source control and CI | **GitHub** + GitHub Actions | Playwright e2e on every PR |
| Dev environment | **Cursor** | Agent-agnostic rules in `AGENTS.md` |

**Design tokens:** all colors, spacing and type sizes are CSS variables in `src/styles/tokens.css`. No hard-coded hex values in components. (A full Barrio design system is out of scope for V1; keep the UI simple and consistent.)

**Domain:** a custom domain is likely needed for the Google consent screen and a clean share link (OQ-04).

---

## 12. Quality and verification

### 12.1 Definition of done (per requirement)
1. Acceptance criteria pass in automated tests.
2. CI is green on the PR.
3. Copy is in the copy file and reads naturally in Peruvian Spanish.
4. No scope beyond the requirement was added.
5. Changed behavior is reflected in `SPEC.md` (with a changelog line) if the requirement itself changed.

### 12.2 E2E tests (Playwright, run in GitHub Actions)
The **core loop** must have e2e coverage: (1) sign in with a test user, (2) create Regalo with photo, (3) another user responds, (4) owner chooses, (5) both see the WhatsApp link, (6) giver marks `Entregado`. Plus the same for Pido, and these rule tests: cap of 7 and slot reopening, withdraw, expiry, 48h nudge fires once, public page shows no number.

### 12.3 Authorization tests (required)
- A signed-out user cannot write anything.
- User A cannot edit, withdraw or choose on user B's post.
- A user who is not a party to a handoff cannot get the other person's number.
- Non-admins get 403 on admin routes.
- Public pages and open-post APIs never include a number or email.

### 12.4 Test data
A **seed script** creates a test district, test users, posts in every status and responses at the cap. E2E tests use it.

---

## 13. Build plan (vertical slices for agents)

Each slice ends in something Mica can open and use. Do them in order.

| Slice | Requirement IDs | Exit criteria |
|---|---|---|
| M0 Foundation | (none) | Repo, Cloudflare project, CI, seed script, tokens file, copy file, empty authenticated app shell deployed |
| M1 Identity | AUTH-01 to AUTH-04, PROF-01 to PROF-04, LEGAL-01 | Sign in with Google, invite gate, profile, deletion |
| M2 Posts and feed | POST-01 to POST-08 | Create Regalo and Pido, feed, detail, withdraw, expiry job |
| M3 Responses and handoff | RESP-01 to RESP-07, HAND-01 to HAND-05 | Full loop works end to end; core e2e green |
| M4 Notifications | NOTIF-01 to NOTIF-04 | Inbox, push, nudge job |
| M5 Public and sharing | PUB-01 to PUB-04 | Public pages with working WhatsApp preview; share button |
| M6 Safety and admin | SAFE-01 to SAFE-04, ADMIN-01 to ADMIN-03, ANLY-01, DISC-01 | Reports, removal, rate limits, metrics page |
| M7 Phase 0 launch | | Launch checklist (section 16) done |

---

## 14. Risks and open questions

| ID | Level | Risk / open question | Mitigation or next step | Owner |
|---|---|---|---|---|
| R-01 | **CRITICAL** | **The building already has a WhatsApp group.** Barrio may add too little over a free, familiar tool inside the Phase 0 beachhead. | Test H3 explicitly: DISC-01 survey, user conversations, and Phase 1 reach beyond the building as the real value. Seed with items people would otherwise post in the group. | Mica |
| R-02 | HIGH | **Thin density**: 32 apartments may produce too few posts to learn from. | Mica seeds first items; invite code shared in the building group; Phase 0 bar is calibrated to the building. | Mica |
| R-03 | HIGH | **Unverified WhatsApp numbers**: wrong or fake numbers, or impersonating a neighbor. | Show the Google name beside offers; report button; fix-my-number path; add verification at the Phase 1 gate. | Mica |
| R-04 | HIGH | **Verification options after Phase 0:** WhatsApp inbound verification needs a dedicated number (a prepaid SIM) and a Meta business setup; SMS costs money. | Decide at the Phase 1 gate (OQ-06). | Mica |
| R-05 | MEDIUM | **Staff may not have a Google account** (or may not remember its password). | Ask staff before launch; help them sign in once at onboarding. If several cannot, revisit the identity design (DEC-09) before Phase 1. | Mica |
| R-06 | MEDIUM | **iOS web push** works only for PWAs added to the home screen. | In-app inbox is the fallback; prompt `Añadir a inicio` after the first post. | Agent / Mica |
| R-07 | MEDIUM | **Free-plan limits** on Cloudflare (requests, D1, R2, cron). | Verify in M0; design queries to be light. | Agent |
| R-08 | MEDIUM | **Peru data-protection obligations** when collecting phone numbers (Ley 29733) and Terms/Privacy adequacy. | Get legal advice before expanding beyond the pilot. | Mica |
| OQ-01 | LOW | **Visual identity:** who defines the first Barrio palette, type and logo (values for `tokens.css`)? A simple, consistent default is acceptable for Phase 0. | Pick a minimal palette before M0 ends, or let the agent propose one for approval. | Mica |
| OQ-02 | LOW | **Phase 0 start date** and who seeds the first 5 to 8 items and 2 to 3 Pidos. | Set the start date once M6 is done; add the gate review date to the calendar. | Mica |
| OQ-03 | MEDIUM | Confirm the exact Cloudflare free-plan limits. | Check in M0. | Agent |
| OQ-04 | MEDIUM | Is a custom domain required for the Google OAuth consent screen (privacy policy and homepage URLs)? Which domain? | Check Google's requirements; likely buy a domain through Cloudflare (small annual cost). | Mica |
| OQ-05 | LOW | **Assumption:** a `chosen` post with no `Entregado` after 14 days auto-closes (not counted). | Confirm or change. | Mica |
| OQ-06 | MEDIUM | Which verification method at the Phase 1 gate: WhatsApp inbound (needs a number) or SMS (cost)? | Decide before opening Barranco. | Mica |
| OQ-07 | LOW | Final prohibited-items list. | Mica reviews the draft in SAFE-02. | Mica |
| OQ-08 | LOW | **Name validation:** Barrio is a working name (Indecopi, app stores, handles, tone test in Lima). | Do before any public launch. | Mica |
| OQ-09 | LOW | Do you want to segment neighbors vs staff in metrics? Currently not tracked. | Add an optional profile field only if useful. | Mica |

---

## 15. Decision log

| ID | Date | Decision | Why | Alternatives rejected |
|---|---|---|---|---|
| DEC-01 | 2026-11-10 | V1 is a **thin working PWA**, not a clickable prototype | The riskiest assumptions are behavioral (do people post and respond?) | Clickable prototype only; full multi-district app |
| DEC-02 | 2026-11-10 | **Phase 0 = Mica's building (32 apts + staff), Phase 1 = Barranco** | Density: one community Mica can seed | Lima-wide; campus; skip the building |
| DEC-03 | 2026-11-10 | Spec lives in **repo markdown** (`SPEC.md` + `AGENTS.md`) | Agents read it directly; avoids Doc/local drift | Claude Doc as canonical |
| DEC-04 | 2026-11-10 | **Regalo + Pido only**, Presto deferred | Lending adds states and trust problems before the loop is proven | Add Presto; Regalo only |
| DEC-05 | 2026-11-10 | Open signup with self-declared district, feed defaults to Barranco, no geofencing | Cheapest; shows who actually shows up | Lock to district; no filtering |
| DEC-06 | 2026-11-10 | **No AI in the product in V1** | Measure post time first; add photo-to-listing only if median post time exceeds ~90s | Photo-to-listing; AI moderation |
| DEC-07 | 2026-11-10 | North star is **completed handoffs/week**; handoff = giver taps `Entregado` alone; receiver's `Lo recibí` optional and tracked | Simple single state; inflation measurable | Both sides confirm; count choices |
| DEC-08 | 2026-11-10 | Regalo uses the **same rules as Pido**: cap 7, expiry 7 days, poster chooses, 48h nudge | One state machine | Different rules for Regalo |
| DEC-09 | 2026-11-10 | **Identity: Google sign-in + self-declared WhatsApp number + building invite code.** Phone verification deferred to the Phase 1 gate. Overrides the earlier "phone verification required to offer" | Free and simplest; Twilio, Firebase phone and Meta WhatsApp verification all cost money or need a dedicated number | Phone + SMS (Twilio); WhatsApp inbound verification (needs a number); email magic link (needs a domain and vendor) |
| DEC-10 | 2026-11-10 | **Notifications: web push + in-app inbox** | Free; works on Android; no SMS cost | In-app only; SMS |
| DEC-11 | 2026-11-10 | Safety minimum: report button, prohibited-items list, public-pickup tip, manual admin view | Enough to hear about incidents and remove posts | Nothing; blocking and reputation |
| DEC-12 | 2026-11-10 | Growth loop: **public read-only post pages + `Compartir en WhatsApp`** | Reaches people already in WhatsApp groups | Login wall; invite codes only |
| DEC-13 | 2026-11-10 | Success bars pre-committed (section 6) | Prevents rationalizing results | Set after a baseline; no bar |
| DEC-14 | 2026-11-10 | Phase 0 sign-up bar is **10+ accounts including staff** (lowered from an earlier proposal of 15) | Building-scale realism | 15+ households |
| DEC-15 | 2026-11-10 | Stack: **Cursor + GitHub + Cloudflare (Workers, D1, R2), free plans** | Tools Mica already uses; one platform | Vercel + Supabase; Firebase |
| DEC-16 | 2026-11-10 | **One `SPEC.md` with stable IDs + `AGENTS.md`**; Given/When/Then criteria; e2e tests on the core loop | Precise for agents, traceable tests | Per-feature spec folder; narrative brief |

---

## 16. Phase 0 launch checklist

- [ ] M0 to M6 done; core e2e green; authorization tests green
- [ ] Google OAuth consent screen set to **In production** with basic scopes and a Privacy Policy URL (OQ-04)
- [ ] Terms and Privacy pages live (LEGAL-01)
- [ ] Invite code created and ready to post in the building WhatsApp group
- [ ] Mica has 5 to 8 real items to seed (Regalo) and 2 to 3 Pidos
- [ ] Asked building staff whether they have a Google account (R-05)
- [ ] Admin metrics page checked against hand-counted seed data
- [ ] Plan for weekly check-ins and 5+ user conversations during the 3 weeks (discovery, not only dashboards)
- [ ] Phase gate review date on the calendar (end of week 3)
