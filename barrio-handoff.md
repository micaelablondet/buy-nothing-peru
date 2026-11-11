# Barrio: handoff to Claude Code

**Owner:** Mica Blondet (PM, Peru). **Date:** Oct 19, 2026.
**Source of truth for the product spec:** `barrio-brief.md` in this folder (local copy of the Claude Doc, exported at rev 16).

## What this project is

Barrio is a hyperlocal, Buy Nothing-style gifting app for Peru. Neighbors give (Regalo), ask (Pido) and lend (Presto) for free. The UX should feel like a neighbor's WhatsApp message, not a marketplace. Pickup is coordinated through a pre-filled WhatsApp link, so no in-app chat is built. Next step: a clickable prototype of 8 screens, tested with 5 to 8 people in one Lima district.

## Decisions made in this conversation

1. **Name:** working name is **Barrio**, "for now". Yapa was dropped: it's one letter from Yape (about 14M users in Peru, "yapear" is everyday slang), and I found no Peruvian product called Yapa, but the search wasn't conclusive. Veci was dropped: a Veci neighbor app exists in Bogotá. Barrio: no Peruvian product found, but it's a crowded generic word (miBarrio in Spain, Barrio 360 in Mexico, ActiBarrio in Argentina), and in Lima "barrio" may sound working-class compared with *zona*, *urbanización* or *cuadra*. Modifier fallbacks if needed: Barrio Regala, Mi Cuadra.
2. **Pido CTA:** **"Yo tengo"** (low-commitment "I've got it"). The gift is made explicit later in the WhatsApp message ("Te lo regalo"). It should be a filled primary button, not an outline.
3. **Asker judges offers:** offers live in the app first. The asker compares them and taps "Elegir", and only then does WhatsApp open. Phone numbers are shared only after that choice.
4. **Safety:** offerers show name and district before sending. **Phone verification (code) is required to offer.**
5. **Limits:** max **7 offers** per Pido. Nudge the asker **48 hours** after the first offer. A Pido with no chosen offer auto-expires **7 days** after posting. A Pido "En coordinación" doesn't expire.

Core flow: **Yo tengo → offer posted on the Pido → asker compares → asker taps Elegir → WhatsApp handoff.**

## Assumptions to confirm

- The 48-hour nudge counts from the *first offer*, not from posting.
- The 7-day expiry applies only to Pidos with no chosen offer.
- "Me interesa" on a Regalo: does it have the same 7-offer cap? Not decided.

## Open items

- Validate the name: Indecopi trademark search, App Store and Google Play, barrio.pe and handles, and a tone test with locals in Lima.
- Validate that giving groups exist in Lima (Facebook and WhatsApp) and how active they are.
- Pick the first one or two launch districts.
- Decide whether Presto (lend) is in the first prototype.
- Business model is still open (supporter subscription, sponsorships, B2B).

## Suggested first prompt for Claude Code

> Read `barrio-brief.md` and `barrio-handoff.md`. Build a clickable mobile-first prototype of the 8 screens in the Prototype plan table, in Spanish with a casual *tú* register. Start with the Pido flow, using the acceptance criteria in the "Pido: Yo tengo flow" section. Use mock data, no backend. Ask me before changing any decision listed in the handoff.

## Housekeeping

- The Claude Doc and these local files will drift once either is edited. Pick one as the source of truth, or re-export the Doc when it changes.
- The Doc has an embedded 6-step core loop diagram that did not export to Markdown.
