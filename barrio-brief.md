# Barrio (formerly Buy Nothing Perú) — Product Brief

Oct 16, 2026 · Mica Blondet
*(Local copy of the Claude Doc at https://claude.ai/artifact/N3u9a5jEnMuyXuSRFKHGdU, exported at rev 16 on Oct 19, 2026)*

## One-liner

A hyperlocal app where neighbors in Peru give away, lend, and ask for things for free, keeping usable items out of the trash and building trust between people who live near each other.

Status: early concept, pivoted from a vintage clothing marketplace. Next step is a quick clickable prototype to test the core give-and-receive flow. Working name: Barrio (placeholder, to be validated).

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
- **Posting:** three post types with photos and a short description: Regalo (give), Pido (ask), Presto (lend).
- **Local feed:** posts from your district, filterable by category.
- **Expressing interest:** on a Regalo, people tap "Me interesa" and the giver chooses who gets the item; on a Pido, neighbors who have the item tap "Yo tengo" (up to 7 offers) and the asker chooses which offer to accept.
- **Pickup coordination via WhatsApp:** once a recipient is chosen, both get a "Coordinar por WhatsApp" button that opens a chat with a pre-filled message (e.g. "Hola, soy [name] de [app], te escribo por el [item]"). This uses a standard WhatsApp link, so no chat needs to be built.
- **Mark as given:** a prompt to the giver a day or two after choosing ("¿Ya entregaste el [item]?") marks the post as given and keeps the feed clean.
- **Reporting:** an easy "Reportar" option on every post and profile, especially for anyone asking for money.

**Out of scope for MVP**

Public reputation scores, a gratitude feed, events, belonging to multiple communities, maps, and subscriptions.

**WhatsApp design rules**

- Share phone numbers only after the giver (or, on a Pido, the asker) has chosen, never at the "Me interesa" or "Yo tengo" stage.
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

## Prototype plan

The prototype should test one question: will givers and receivers complete the loop from post to handoff without friction?

*(The Doc has an embedded 6-step core loop diagram here, "core loop · 6 steps". It does not export to Markdown.)*

The giver's choice is the key moment: it protects against resellers and is the only point where phone numbers are shared.

| Screen | What it shows | Notes |
| --- | --- | --- |
| Onboarding | Phone number, district or neighborhood | Keep to 2 steps |
| Community rules | No selling, no trading, safe pickup tips | One screen, accept to continue |
| Feed | Local posts with tabs for Regalo, Pido, Presto | Category filter |
| Post detail | Photos, description, district, "Me interesa" button (on a Pido: "Yo tengo" button) | Share to WhatsApp |
| Create post | Type, photos, title, category, short description | Should take under a minute |
| Choose recipient | List of interested neighbors; giver picks one (on a Pido: list of up to 7 offers; asker picks one) | Notification to the chosen person |
| WhatsApp handoff | "Coordinar por WhatsApp" button with pre-filled message | Standard WhatsApp link |
| Mark as given | "¿Ya entregaste el [item]?" prompt | Removes the post from the feed |

- [ ] Build a clickable prototype of these 8 screens
- [ ] Test it with 5 to 8 people in one district: 3 givers, the rest receivers

## Pido: "Yo tengo" flow

**Decisions:** the call to action on a Pido is **"Yo tengo"**, a low-commitment "I've got it" (the gift is made explicit later, in the WhatsApp message). The asker judges offers and picks one. Offerers show their name and district before sending. Phone verification is required to offer. Offers are capped at 7 per Pido. The asker gets a nudge after 48 hours, and a Pido auto-expires after 7 days.

**Flow:** Yo tengo → offer posted on the Pido → asker compares offers → asker taps Elegir → WhatsApp handoff.

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
3. After I choose, WhatsApp opens with a pre-filled message to that neighbor ("Hola [nombre], elegí tu oferta en Barrio por [título]. ¿Coordinamos?"). If WhatsApp isn't installed, the message is copied and the contact is shown.
4. The chosen neighbor is notified. Other offerers get a gracious message ("Ya se resolvió este Pido. ¡Gracias por ofrecer!").
5. If the handoff falls through, I can reopen the Pido and choose another offer.
6. I can mark the Pido as "Resuelto" once I receive the item.

### Acceptance criteria: nudges and expiry

1. Given an asker has offers but hasn't chosen 48 hours after the first offer, they get a nudge ("Tienes [n] ofertas en tu Pido. ¿Cuál eliges?").
2. Given a Pido has no chosen offer 7 days after posting, it expires, leaves the feed, and offerers are notified. The asker can repost it in one tap.
3. A Pido that is "En coordinación" doesn't auto-expire.

### Metrics

- Share of Pidos that get at least one offer within 48 hours.
- Share of Pidos with offers where the asker chooses within 72 hours.
- Share of chosen offers that end as "Resuelto".

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
| Competing with free Facebook and WhatsApp groups | Be clearly better: searchable feed, structured posts, safe pickup |
| No visibility once chats move to WhatsApp | "Mark as given" prompt and visible reporting |
| Askers go silent after receiving offers on a Pido | Nudge after 48 hours, auto-expire after 7 days, cap offers at 7 |

- [ ] Validate that giving groups exist in Lima (Facebook and WhatsApp) and how active they are
- [ ] Pick the first one or two launch districts
- [ ] Validate the working name Barrio: Indecopi, app stores, handles, and a tone test in Lima
- [ ] Decide whether Presto (lend) is in the first prototype or later
