# Barrio — Product Brief

Oct 16, 2026 · @mica blondet · Updated Oct 19, 2026 (Profile edit, native share on posts, Pido/Regalo UX, Barranco pilot; **Likes** documented for a future version)

## One-liner

**Barrio** is a hyperlocal app where neighbors in Peru **give and ask** for things for free (Buy Nothing spirit), then **lend** objects, and later **exchange services** without money.

Status: clickable prototype for **MVP phase 1 (Regalo + Pido)**. Piloto distrito: **Barranco**. **Presto** (cosas) and **Presto Servicios** (trueque) are later phases. Working name: **Barrio** (to be validated).

## Reference: how Buy Nothing works

Buy Nothing is a hyperlocal gift economy: neighbors give, ask for, lend, and thank each other, with no buying, selling, trading, or bartering.

- **Origin:** started in 2013 as a Facebook group on Bainbridge Island, Washington ([Buy Nothing press kit](https://buynothingproject.org/media/presskit)).
- **Scale:** reports 7.5 million members across 128,000 communities ([Great Transition Stories](https://greattransitionstories.org/resources/buy-nothing-project/)). Its own app, launched in 2021, passed 1 million downloads in August 2023 ([SavvyMoney](https://education.savvymoney.com/savvymoney-daily/what-is-the-buy-nothing-movement/)).
- **Post types:** give, ask, and gratitude posts, all scoped to a local community.
- **Funding:** the app is free; optional subscriptions cover servers and development, with no ads and no sale of personal data ([Buy Nothing help center](https://help.buynothingproject.org/article/99-why-do-i-have-to-pay-shouldn-t-buy-nothing-be-free)).
- **Lesson:** moving to an investor-backed app caused backlash, and some local groups split off and renamed themselves ([Marketplace](https://marketplace.org/2023/05/16/what-happened-to-the-buy-nothing-project)).

No dedicated gift-economy app was found for Peru. Elsewhere in Latin America, giving happens in Facebook groups that are active but closed, with posts buried within hours ([Colombia Move](https://colombiamove.com/blog/cosas-gratis-colombia/)). Peru likely looks similar, plus building and neighborhood WhatsApp groups; this is not yet verified.

## Problem

People in Peruvian cities have usable things they no longer need, and neighbors nearby need exactly those things but buy them new.

Today's options are all inconvenient. Selling takes effort and haggling. Donating means finding and traveling to an organization. Throwing things away is wasteful. Informal giving already happens in Facebook groups and WhatsApp chats, but posts get buried, nothing is searchable, and trusting strangers is hard.

## Target users

| Segment | Who they are | What they want |
| --- | --- | --- |
| Givers | Households decluttering or moving, parents whose kids outgrow things fast, sustainability-minded people | Get rid of things easily, knowing they go to someone who will use them |
| Askers and receivers | Students, young professionals furnishing a first apartment, families on a budget | Get what they need for free, close to home |
| Community builders | People who already run building or neighborhood WhatsApp groups | A better tool for their community; they are the early adopters and local moderators |

## Value proposition

Givers clear space easily and know their things went to a real neighbor. Receivers get what they need for free, nearby. Everyone gets a more connected neighborhood.

Compared to Facebook groups, the app adds a searchable local feed, clear post types, and trust features built for giving.

## MVP scope

The MVP covers one loop: post an item, neighbors show interest, the giver picks someone, they coordinate on WhatsApp, and the item is marked as given.

**In scope**

- **Onboarding:** sign up with a phone number (verified by a code, required before offering on a Pido), set your district or neighborhood, and accept the community rules (no selling, no trading).
- **Posting (phase 1):** Regalo and Pido with photos and a short description. **Presto (lend)** ships in phase 2.
- **Local feed:** posts from your district, filterable by category (**Ropa** includes **Bebés** listings such as ropa de bebé).
- **Home (Inicio):** a header with a menu icon on the left and a greeting ("¡Bienvenida, [nombre]!") above the local feed (see "Home screen, menu and Configuración" below).
- **Menu and Configuración:** a side menu (Configuración, Perfil, Haz una donación, Ayuda, Salir) and a Configuración screen with an "Apoya a tu Barrio" call to action and account options.
- **Search (Encuentra):** a search screen in the bottom nav, with a search bar ("Busca lo que necesitas") and results labeled Regalo or Pido (see "Search screen (Encuentra)" below).
- **Expressing interest:** on a Regalo, people tap "Me interesa" and the giver chooses who gets the item; on a Pido, neighbors who have the item tap "Yo tengo" (up to 7 offers) and the asker chooses which offer to accept.
- **Pickup coordination via WhatsApp:** once a recipient is chosen, both get a "Coordinar por WhatsApp" button that opens a chat with a pre-filled message (e.g. "Hola, soy \[name\] de \[app\], te escribo por el \[item\]"). This uses a standard WhatsApp link, so no chat needs to be built.
- **Mark as given:** a prompt to the giver a day or two after choosing ("¿Ya entregaste el \[item\]?") marks the post as given and keeps the feed clean.
- **Saving posts (Guardados):** anyone can save an open Regalo or Pido to come back to later; saved posts live in a "Guardados" tab on their profile.
- **Profile:** a greeting, district, raves count, member-since date, active Regalos and Pidos, and tabs for your posts and saved posts (see "Profile screen" below).
- **Reporting:** an easy "Reportar" option on every post and profile, especially for anyone asking for money.

**Out of scope for MVP**

Public reputation scores or ratings (a simple raves count on the profile is allowed, with no stars, scores or rankings), **post Likes** (see "Post likes (future)" below), a gratitude feed, events, belonging to multiple communities, maps, subscriptions, **Presto (lend)** in phase 1, and **Presto Servicios** (service barter) until their phases ship, and **Invita a un amigx** (V2). "Apoya a tu Barrio" and "Haz una donación" appear in the MVP only as placeholders that measure interest: no payments.

## Roadmap

Barrio grows in phases. Each phase reuses the same trust loop: post → Me interesa (on a Pido: Yo tengo) → quien publica elige → WhatsApp → cerrar.

| Phase | Lane | What it is | Money |
| --- | --- | --- | --- |
| **Now (MVP 1)** | **Buy Nothing** — **Regalo** / **Pido** | Regalar o pedir cosas entre vecinos | No — sin precio |
| **Next (MVP 2)** | **Presto** (cosas) | Prestar objetos y devolverlos | No — sin precio |
| **Later (MVP 3)** | **Presto Servicios** | Ofrecer un oficio (electricista, clases, etc.) **a cambio de algo else** | No soles — **trueque** |

Also planned for V2 (MVP 2): **Invita a un amigx**, the referral flow (see "Invita a un amigx (V2)" below), and **Likes** on Regalo and Pido posts (see "Post likes (future)" below).

### Presto Servicios (future — barter application)

Neighbors publish **what service they offer** and **what they would accept in return** (another service, herramientas prestadas, comida casera, favores — spelled out in the post). Examples:

- Electricista: arreglo de enchufes **a cambio de** ayuda pintando un cuarto o prestarme una escalera una semana.
- Diseñadora: logo sencillo **a cambio de** clases de inglés 2 horas.

**Design principles (draft)**

- **Still not a marketplace:** no listed prices, no payment in-app, no “desde S/50”. Exchange terms are negotiated in text, then WhatsApp after match — same phone privacy rules as earlier phases.
- **Structured trueque fields:** service title, category (Servicios), “Ofrezco…”, “A cambio de…”, photos optional (trabajo previo, certificado — no DNI en el feed).
- **Same chooser moment:** the person offering the service picks who to work with (not first-come spam).
- **Reporting:** money requests, scams, or “solo efectivo” → Reportar; may need extra rule copy for services vs objects.
- **Open questions:** liability for home repairs, licensed trades, reviews without turning into Yelp, and how to keep barter from becoming informal paid gig work.

Code sketch for when we build it: [`src/lib/roadmap.ts`](src/lib/roadmap.ts).

**WhatsApp design rules**

- Share phone numbers only after the giver (or, on a Pido, the asker) has chosen, never at the "Me interesa" or "Yo tengo" stage. **Exception:** the Oct 19 prototype opens WhatsApp on **Yo tengo** so offerers can send photos — tighten before production.
- The app can't see WhatsApp conversations, so reports depend on users; keep "Reportar" visible everywhere.
- Every post can also be shared to WhatsApp, which makes WhatsApp the app's communication and growth layer.

## User experience for Peru

The app should feel like a neighbor's WhatsApp message, not a marketplace.

- **Spanish-first and casual:** labels like Regalo, Pido, and Presto are clearer than translated English terms.
- **The giver chooses:** no first-come, first-served, so givers can pick who needs the item most; on a Pido, the asker picks the best offer. This also discourages people from claiming everything to resell it.
- **Safe pickup built in:** suggest handoff options such as leaving the item with the building's portero, meeting in a public place, or porch pickup. Phone verification adds a basic layer of trust.
- **Neighborhoods people recognize:** communities map to district, urbanización, or building, not an arbitrary radius. Launch in a few districts so each feed feels full.
- **WhatsApp everywhere:** easy sharing of posts to WhatsApp, and pickup coordinated there.
- **Light and mobile-first:** loads quickly on mid-range phones and limited data plans.
- **Typography (target):** a soft, rounded feel similar to **PinkSunset-Regular.otf** for headings and greetings. The clickable prototype still uses the system UI stack until a licensed or hosted webfont is added.

## Prototype plan

The prototype should test one question: will givers and receivers complete the loop from post to handoff without friction?

&#91;embedded content: core loop · 6 steps\]

The giver's choice is the key moment: it protects against resellers and is the only point where phone numbers are shared.

| Screen | What it shows | Notes |
| --- | --- | --- |
| Onboarding | Phone number, district or neighborhood | Keep to 2 steps |
| Community rules | No selling, no trading, safe pickup tips | One screen, accept to continue |
| Feed | Local **Regalo** and **Pido** posts (MVP 1) | Category filter; Presto in phase 2 |
| Post detail | **Regalo:** photo (`object-contain`), "Me interesa", **share** (native sheet). **Pido:** blue ask illustration (no photo), **Yo tengo** → WhatsApp DM, **share** (native sheet). **Likes** — future | See "Pido: prototype vs MVP" and "Post likes (future)" |
| Create post | **Regalo:** optional photos. **Pido:** no photos — message-style preview only | Should take under a minute |
| Choose recipient | List of interested neighbors; giver picks one (on a Pido: list of up to 7 offers; asker picks one) | Notification to the chosen person |
| WhatsApp handoff | "Coordinar por WhatsApp" button with pre-filled message | Standard WhatsApp link |
| Mark as given | "¿Ya entregaste el \[item\]?" prompt | Removes the post from the feed |
| Home | Menu icon on the left, "¡Bienvenida, [nombre]!", then the local feed | Modeled on the Buy Nothing home |
| Menu | Configuración, Perfil, Haz una donación, Ayuda, Salir | Slides in from the left |
| Configuración | "Apoya a tu Barrio" card, then Invita a un amigx, Ayuda, Política de Privacidad, Términos de Uso, Salir | Modeled on Buy Nothing Settings |
| Encuentra | Search bar "Busca lo que necesitas", results grid with a Regalo or Pido label on each item | Magnifying-glass icon in the bottom nav |
| Profile | **Mi perfil:** "Hola, soy [nombre]", **Barranco, Lima** pill, raves, member since, **Tus Regalos y Pedidos**, tabs **Tus publicaciones** / **Guardados**, filters **Todos · Regalos · Pedidos** | Demo persona **Mica**; no facilitator role switcher; **Reportar** only (no "Reiniciar demo" in UI) |
| Feed | Regalo / Pido tabs, category chips, district-scoped seed posts | **Ropa** chip includes **Bebés** (e.g. ropa de bebé) |

- [x] Build a clickable prototype of the first 8 screens
- [x] Add the **Mi perfil** screen (Buy Nothing–style layout; **Guardados** tab present — save/bookmark UI on feed cards **not** in current build)
- [x] Add the home header, menu and Configuración screen to the prototype (donation, help and legal pages are placeholders)
- [x] Add the Encuentra search screen and its bottom nav icon to the prototype
- [ ] Restore **Guardados** save control on feed/detail when testing bookmark flow
- [ ] Test it with 5 to 8 people in one district: 3 givers, the rest receivers (piloto: **Barranco**)

## Prototype build status (Oct 19, 2026)

What the hosted clickable build does today vs the MVP spec above.

| Area | In the prototype now | Still spec / later |
| --- | --- | --- |
| **Pilot** | Seed posts and demo profile target **Barranco**; feed empty in other districts | Multi-district launch |
| **Demo user** | **Mica**, **Barranco, Lima** on Perfil (`demo-user`; persisted onboarding normalized to Barranco) | Real accounts |
| **Regalo feed** | Photo cards (`object-contain`, white backdrop); local seed images (microondas, ropa bebé, lámpara de pie, etc.) | User-uploaded photos |
| **Pido feed** | Horizontal card: blue **speech bubble + ?** icon, title, snippet, **Ver más →**; **no images** | Same pattern in production |
| **Pido detail** | No **Compartir en WhatsApp**; **Yo tengo** opens `wa.me` to the asker with a prefilled note to send a photo and coordinate; then **Seguir por WhatsApp** | Bottom sheet offer, 7-cap, verification gate |
| **Regalo detail** | **Me interesa** → **Elegir receptor** → **Coordinar por WhatsApp** after choice | Notifications, nudges |
| **Perfil** | Greeting, location pill, raves count (tap = toast), member since, active post cards, **Pedidos** filter label on tabs | Edit profile, raves list |
| **Share** | Native **share** icon on feed cards, search results, and post detail (Web Share API) | — |
| **Removed from UI** | Facilitator role switcher, **Reiniciar demo**, bookmark on post cards | **Likes** (heart) on posts |

**Seed content (Barranco):** neighbors Carlos, Mariana, etc. post Regalos/Pidos; demo user has an open **Pido** (*Monitor HDMI*) on Perfil for walkthroughs.

## Pido: "Yo tengo" flow

**Decisions (MVP target):** the call to action on a Pido is **"Yo tengo"**, a low-commitment "I've got it" (the gift is made explicit later, in the WhatsApp message: "Te lo regalo"). In production it should be a **filled primary** button. The asker judges offers and picks one. Offerers show their name and district before sending. Phone verification is required to offer. Offers are capped at 7 per Pido. The asker gets a nudge after 48 hours, and a Pido auto-expires after 7 days.

**Flow (MVP target):** Yo tengo → offer posted on the Pido → asker compares offers → asker taps Elegir → WhatsApp handoff.

### Prototype vs MVP (Pido)

| Step | MVP (brief) | Clickable prototype (Oct 19) |
| --- | --- | --- |
| First tap **Yo tengo** | Bottom sheet + confirm offer | Opens WhatsApp to asker immediately; records one "offer" in the interest list for **Elegir receptor** testing |
| Button style | Filled primary | Outlined **Yo tengo**, then green **Seguir por WhatsApp** |
| Phone privacy | Number only after asker chooses | **Prototype shortcut:** DM opens on first **Yo tengo** so givers can send photos in WhatsApp |
| Share post | Optional on other types | **No** share row on Pido detail |

### Acceptance criteria: offering

1. Given an open Pido that isn't mine and I'm phone-verified, I see a filled primary "Yo tengo" button without scrolling at 375px width.
2. When I tap it, a bottom sheet shows an editable pre-filled note ("Hola, yo tengo esto y te lo regalo."), an optional "Añadir foto" action, and my name and district as the asker will see them.
3. When I confirm, my offer is added to the Pido, the button changes to "Ya ofreciste", and the asker is notified.
4. I can offer only once per Pido, and I can withdraw my offer.
5. Given I'm not phone-verified, tapping "Yo tengo" takes me through verification and then returns me to the same Pido.
6. Given the Pido already has 7 offers, others see "Ya hay 7 ofertas" instead of the button. If an offer is withdrawn, the slot reopens.
7. On my own Pido I see "Ver ofertas" instead of "Yo tengo". On a resolved or expired Pido the button is replaced by "Ya resuelto" or "Venció".

### Acceptance criteria: choosing

1. Given my Pido has offers, I see them newest first with offerer name, district, note, and photo if there is one.
2. When I tap "Elegir" on an offer and confirm, that offer is marked chosen and the Pido moves to "En coordinación".
3. After I choose, WhatsApp opens with a pre-filled message to that neighbor ("Hola \[nombre\], elegí tu oferta en Barrio por \[título\]. ¿Coordinamos?"). If WhatsApp isn't installed, the message is copied and the contact is shown.
4. The chosen neighbor is notified. Other offerers get a gracious message ("Ya se resolvió este Pido. ¡Gracias por ofrecer!").
5. If the handoff falls through, I can reopen the Pido and choose another offer.
6. I can mark the Pido as "Resuelto" once I receive the item.

### Acceptance criteria: nudges and expiry

1. Given an asker has offers but hasn't chosen 48 hours after the first offer, they get a nudge ("Tienes \[n\] ofertas en tu Pido. ¿Cuál eliges?").
2. Given a Pido has no chosen offer 7 days after posting, it expires, leaves the feed, and offerers are notified. The asker can repost it in one tap.
3. A Pido that is "En coordinación" doesn't auto-expire.

### Metrics

- Share of Pidos that get at least one offer within 48 hours.
- Share of Pidos with offers where the asker chooses within 72 hours.
- Share of chosen offers that end as "Resuelto".

### Assumptions to confirm

- The 48-hour nudge counts from the *first offer*, not from posting.
- The 7-day expiry applies only to Pidos with no chosen offer.
- "Me interesa" on a Regalo: does it have the same 7-offer cap? Not decided.

## Profile screen

The profile is modeled on the Buy Nothing profile: a warm greeting first, then trust signals, then the person's own activity. Copy is Spanish-first; the Buy Nothing equivalent is shown for reference.

**Layout, top to bottom**

1. **Header:** back arrow, title "Mi perfil", and an edit icon (edit photo, name, and district).
2. **Photo and greeting:** profile photo, then a large greeting: **"Hola, soy [nombre]"** (Buy Nothing: "Hi, I'm Mica Blondet").
3. **Location:** the person's district or neighborhood (e.g. "Barranco, Lima") in a pill with a pin icon. Changing it goes through the edit flow, since belonging to multiple communities is out of scope.
4. **Raves:** a heart icon and "[n] vecinos hablaron bien de ti" (Buy Nothing: "[n] people raved about you"). Tapping the count opens the list of raves.
5. **Member since:** "Miembro desde [mes año]" (e.g. "Miembro desde jul 2026").
6. **Active Regalos and Pidos:** a section titled "Tus Regalos y Pedidos", with one card per open post (see below).
7. **Tabs:** "Tus publicaciones [n]" and "Guardados [n]", with filter chips **Todos**, **Regalos**, and **Pedidos** under each tab (use **Pedidos** here — not "Pidos" — while the post type label elsewhere stays **Pido**).

**Active post card**

- Type icon (Regalo or Pido), title, and how long ago it was posted ("hace 2 meses").
- Counts: saves, and "Me interesa" (on a Regalo) or offers (on a Pido). Tapping the count opens "Ver interesados" or "Ver ofertas".
- An "Actualizar estado" menu (e.g. En coordinación, Entregado / Resuelto, Cerrar) and an edit icon.

**Raves (how they get created)**

- After a post is marked Entregado or Resuelto, the other person is invited to leave a short rave ("¿Cómo te fue con [nombre]?").
- The profile shows only the count and the list of raves: no stars, no score, no ranking.

**Viewing someone else's profile**

- The same layout with "Hola, soy [nombre]", district, raves, member since, and their active posts.
- No phone number, no Guardados tab, and a "Reportar" option.

### Acceptance criteria: profile

1. Given I open my profile, I see my photo, "Hola, soy [nombre]", my district, my raves count, and "Miembro desde [mes año]" without scrolling at 375px width.
2. I see a card for each of my open Regalos and Pidos, newest first. If I have none, I see an empty state with a "Publicar" button.
3. When I change a post's status from its card, the card updates and, if the post is closed, it leaves the active section.
4. "Tus publicaciones" shows all my posts, open and closed, with a count; "Guardados" shows my saved posts with a count.
5. On someone else's profile, I don't see their phone number or their Guardados.

## Saved posts (Guardados)

Anyone can save a Regalo or a Pido to come back to it later, the way Buy Nothing lets you save posts.

- **Where (MVP):** a bookmark icon on every post card in the feed and on the post detail screen.
- **Prototype (Oct 19):** **Guardados** tab and persisted save state exist in code, but the bookmark control was **removed from feed/detail** for a cleaner card UI — re-enable before testing save metrics.
- **What can be saved:** any open Regalo or Pido that isn't mine.
- **Private:** only I can see my Guardados. The poster sees how many people saved their post, but not who.
- **Expiry reminder:** if a saved post is about to expire, I get a notification 24 hours before it does ("[título] vence mañana. ¿Te interesa?").
- **Not a claim:** saving doesn't count as "Me interesa" or "Yo tengo", and it doesn't reserve the item.

### Acceptance criteria: saving

1. Given an open Regalo or Pido that isn't mine, I see a bookmark icon on its feed card and its detail screen.
2. When I tap it, the icon fills, the post is added to the top of my Guardados, and the Guardados count goes up by one. Tapping it again removes it.
3. My Guardados tab can be filtered by Regalos and Pidos.
4. Given a post I saved expires in 24 hours and is still open, I get a notification ("[título] vence mañana. ¿Te interesa?") that opens the post. I don't get it if I already tapped "Me interesa" or "Yo tengo" on it.
5. Given a saved post is resolved, given away, or expired, it stays in my Guardados marked "Ya no disponible", and I can remove it.
6. On my own posts, I see the number of saves but not who saved them.

### Metrics

- Share of saved posts that later get a "Me interesa" or "Yo tengo" from the same person.

## Post likes (future)

In a **future version** (after MVP 1), users will be able to **like** an open **Regalo** or **Pido** — a light way to show appreciation or “I’m paying attention” without claiming the item or sending an offer.

- **Not Me interesa / Yo tengo:** liking does **not** add the user to the interest list, does **not** share their phone number, and does **not** reserve the gift or the ask.
- **Where:** a heart (or similar) on the post detail screen and on feed/search cards, alongside **share** and (when restored) **Guardados**.
- **Visibility:** the poster sees a **like count** on their post; likers are not listed by name in the feed (same privacy posture as save counts).
- **Scope:** Regalo and Pido in phase 1; extend to **Presto** when that lane ships.

### Acceptance criteria: likes (future)

1. Given an open Regalo or Pido that isn’t mine, I see a like control on the feed card and on the detail screen.
2. When I tap like, the control fills, the count increases by one, and I can unlike with a second tap.
3. Liking does not trigger WhatsApp, does not notify the poster by name of who liked, and does not change **Me interesa** / **Yo tengo** state.
4. Closed or expired posts keep a historical like count but no longer accept new likes.

### Metrics (future)

- Like rate per post type (Regalo vs Pido).
- Share of posts that receive at least one like before they close.
- Correlation between likes and later **Me interesa** / **Yo tengo** (exploratory — likes must not substitute for the chooser flow).

## Home screen, menu and Configuración

Modeled on the Buy Nothing home, side menu and Settings screens. Copy is Spanish-first; the Buy Nothing equivalent is shown for reference.

### Home (Inicio)

- **Header:** a menu (hamburger) icon on the left.
- **Greeting:** "¡Bienvenida, [nombre]!" in large type (Buy Nothing: "Welcome back, Mica!"), using the person's first name.
- **Below the greeting:** the person's district and the local feed of Regalos and Pidos.

### Menu

Tapping the menu icon opens a panel from the left with the Barrio name, a close (X) button, and these options:

| Option | Buy Nothing equivalent | What it does |
| --- | --- | --- |
| Configuración | Settings | Opens Configuración |
| Perfil | Profile | Opens the Profile screen |
| Haz una donación | Make a donation | MVP: placeholder that measures interest, no payment |
| Ayuda | Help | MVP: placeholder for a help center |
| Salir | Sign out | Signs out and returns to the welcome screen |

### Configuración

1. **Header:** back arrow and the title "Configuración".
2. **Support card:** "Apoya a tu Barrio", a short line on why support matters (Barrio is free and has no ads), and a primary "Apoya a tu Barrio" button. In the MVP the button is a placeholder that measures interest; supporter subscriptions are still an open business-model question.
3. **Options:** Invita a un amigx (marked "Pronto" until V2), Ayuda, Política de Privacidad, Términos de Uso, and Salir.

### Acceptance criteria: home, menu and Configuración

1. Given I open Inicio, I see a menu icon on the left of the header and "¡Bienvenida, [nombre]!" with my first name.
2. When I tap the menu icon, a panel opens from the left with Configuración, Perfil, Haz una donación, Ayuda, and Salir. Tapping the X, outside the panel, or an option closes it.
3. When I tap Configuración, I see the "Apoya a tu Barrio" card first, then Invita a un amigx, Ayuda, Política de Privacidad, Términos de Uso, and Salir.
4. When I tap Salir (in the menu or in Configuración), I'm signed out and see the welcome screen.
5. Until V2, Invita a un amigx shows "Pronto" and doesn't open.

### Metrics

- Share of active users who tap "Apoya a tu Barrio" or "Haz una donación" (early signal for the supporter model).

## Invita a un amigx (V2)

Not in the MVP. Modeled on the Buy Nothing "Invite a friend" screen.

- **Entry point:** "Invita a un amigx" in Configuración.
- **Screen:** an illustration, the title **"Comparte Barrio"**, a short line about inviting neighbors and friends, and a primary **"Invita a un amigo"** button.
- **Sharing:** tapping the button generates a personal invite link and opens the phone's share sheet, so the person can send it by WhatsApp or any other app.
- **The link:** opens the Barrio listing in the App Store (or Google Play on Android) so the friend can download the app.

### Acceptance criteria: invite (V2)

1. Given I tap "Invita a un amigx" in Configuración, I see "Comparte Barrio" and an "Invita a un amigo" button.
2. When I tap the button, a share link is generated and the phone's share sheet opens with it.
3. When a friend opens the link, it takes them to Barrio in their phone's app store.

## Search screen (Encuentra)

A screen for finding a specific thing, modeled on the Buy Nothing Explore screen. The feed (Inicio) is for browsing what's new; Encuentra is for looking for something.

**Bottom nav**

- Four items: **Inicio**, **Encuentra** (magnifying-glass icon), **Publicar**, and **Perfil**.
- Tapping the magnifying glass opens Encuentra with the search bar at the top.

**Layout, top to bottom**

1. **Title:** "Encuentra".
2. **Search bar:** a magnifying-glass icon and the placeholder **"Busca lo que necesitas"**.
3. **Filters:** a district pill (your district, e.g. "Barranco") and a "Tipo" filter: Todos, Regalo, Pido.
4. **Results:** a two-column grid of open posts.

**Result item**

- Photo (or the Pido illustration if there is no photo).
- A label on the photo that identifies the post type: **"Regalo"** (gift icon) or **"Pido"** (question icon), each in its own color so the two are easy to tell apart.
- Title, the poster's name and photo, how long ago it was posted, and district.
- A bookmark icon to save it to Guardados (see "Saved posts (Guardados)") — **planned**; not on cards in the current prototype build.
- A **like** control — **future version** (see "Post likes (future)"); not in the current build.
- Tapping the item opens the post detail.

### Acceptance criteria: search

1. Given I tap the magnifying glass in the bottom nav, I see the title "Encuentra" and a search bar with the placeholder "Busca lo que necesitas" at the top of the screen.
2. Before I type anything, I see the newest open Regalos and Pidos in my district.
3. When I type, results update to posts whose title, description, or category match my search. Accents and capital letters don't matter ("lampara" finds "Lámpara").
4. Every result shows a "Regalo" or "Pido" label.
5. When I choose Regalo or Pido in the "Tipo" filter, only that type is shown.
6. Results only include open posts. Given, resolved, or expired posts don't appear.
7. Given nothing matches, I see "No encontramos [búsqueda] en tu barrio" and a "Pídelo" button that opens Create post as a Pido with the title filled in.

### Metrics

- Share of searches that end with a tap on a result.
- Share of searches with no results that lead to a new Pido.

## Business model (open question)

A pure gift economy can't take a cut of transactions, so revenue has to come from somewhere else.

- **Optional supporter subscription**, as Buy Nothing does, with core features always free.
- **Sponsorships** from municipalities or companies with sustainability goals.
- **B2B partnerships**, such as companies giving away office furniture or equipment.

Avoid anything that looks like commercializing generosity: that is what caused the backlash against Buy Nothing.

## Key risks and open questions

| Risk | Mitigation |
| --- | --- |
| Cold start: an empty feed kills a hyperlocal app | Launch in one or two districts with community builders already recruited |
| Resellers taking free items to sell them | Giver chooses the recipient; easy reporting |
| No revenue; depends on volunteers or grants | Test supporter subscriptions and sponsorships early |
| Competing with free Facebook and WhatsApp groups, plus Facebook Marketplace | Be clearly better for neighbors giving/asking: searchable local feed, structured posts, no haggling, safe pickup — not another place to sell |
| No visibility once chats move to WhatsApp | "Mark as given" prompt and visible reporting |
| Presto Servicios blurs into paid gig economy | No cash in posts; strong rules + reporting; optional “solo trueque” badge |
| Unsafe or unlicensed home services | Clear disclaimers; encourage portero / references; report flow |
| Askers go silent after receiving offers on a Pido | Nudge after 48 hours, auto-expire after 7 days, cap offers at 7 |

- [ ] Validate that giving groups exist in Lima (Facebook and WhatsApp) and how active they are
- [x] Pick the first one or two launch districts (**Barranco** for prototype pilot)
- [x] Decide whether Presto (lend) is in the first prototype or later (**Buy Nothing / Regalo+Pido first**; Presto next)
- [x] Choose a working product name (**Barrio**, "for now")
- [ ] Validate the name Barrio: Indecopi trademark search, App Store and Google Play, barrio.pe and handles, and a tone test with locals in Lima. Context: Yapa was dropped (one letter from Yape, ~14M users in Peru); Veci was dropped (a Veci neighbor app exists in Bogotá). Barrio is generic and crowded (miBarrio in Spain, Barrio 360 in Mexico, ActiBarrio in Argentina), and in Lima it may sound working-class compared with *zona*, *urbanización* or *cuadra*. Fallbacks: Barrio Regala, Mi Cuadra.
- [ ] Define Presto Servicios rules and MVP fields for trueque (post-build)
- [ ] Pick gender-neutral copy for the greeting ("¡Bienvenida, [nombre]!" is feminine) and make the invite labels match ("Invita a un amigx" vs. "Invita a un amigo")
