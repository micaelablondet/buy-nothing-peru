# Barrio · MVP 1 (Regalo y Pido)

Clickable, mobile-first prototype inspired by the [Buy Nothing Project](https://buynothingproject.org/): neighbors **regalan** and **piden** cosas gratis en su barrio. Mock data only — no backend, no real accounts.

| | |
| --- | --- |
| **Live demo** | [micaelablondet.github.io/buy-nothing-peru](https://micaelablondet.github.io/buy-nothing-peru/) (after deploy) |
| **Pilot district** | Barranco, Lima |
| **Demo persona** | Mica (onboarding + seed posts) |
| **Product brief** | [Buy Nothing Perú — Product Brief.md](./Buy%20Nothing%20Per%C3%BA%20%E2%80%94%20Product%20Brief.md) |

**Roadmap:** MVP 1 = Regalo / Pido (this repo) → MVP 2 = Presto (prestar cosas) → MVP 3 = Presto Servicios (trueque).

## What this prototype tests

Can givers and receivers finish the loop **publicar → Me interesa (o Yo tengo en Pido) → quien publica elige → WhatsApp → marcar entregado** without friction?

## Tech stack

- [Vite](https://vite.dev/) 6 + [React](https://react.dev/) 19 + TypeScript  
- [React Router](https://reactrouter.com/) 7 (client-side routes)  
- [Tailwind CSS](https://tailwindcss.com/) 4  
- [Zustand](https://zustand.docs.pmnd.rs/) (persisted prototype state in `localStorage`)

## Repository layout

```
src/
  app/          # Router, mobile shell (430px), onboarding gate
  pages/        # Feed, Busca, Publica, Perfil, settings, legal, etc.
  components/   # Post cards, onboarding, menu
  store/        # prototypeStore.ts — seed data + demo actions
  data/         # Seed neighbors/posts, catalog (Barranco pilot)
public/         # Static assets (seed images, splash icons)
.github/workflows/deploy-pages.yml   # GitHub Pages CI
```

## Run locally

Requires **Node.js 22** (or compatible LTS).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

Copy `.env.example` to `.env` only if you need custom store URLs for **Invita a un amigx**; local dev works without it.

## Deploy to GitHub Pages

This repo is set up for **GitHub Actions** deployment (project site under `/buy-nothing-peru/`).

1. Push the default branch **`main`** to [github.com/micaelablondet/buy-nothing-peru](https://github.com/micaelablondet/buy-nothing-peru).
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions** → wait for **Deploy Barrio prototype to GitHub Pages** to succeed.
4. Site URL: **https://micaelablondet.github.io/buy-nothing-peru/**

Every push to `main` redeploys. CI sets `VITE_BASE_PATH` and `VITE_APP_PUBLIC_URL` for asset paths and share links (see workflow file).

## Facilitator script (5–8 testers, Barranco)

1. Complete onboarding; choose **Barranco** (seed posts are there).
2. **Givers:** publish a **Regalo**, or open a seeded Regalo (e.g. microwave) → **Elegir receptor**.
3. **Receivers:** **Me interesa** on Regalo posts; if chosen → **Ir a coordinar entrega** → WhatsApp.
4. Mark delivery on active posts from **Mi perfil** when prompted.
5. **Pido:** publish an ask or use **Yo tengo** on a neighbor’s Pido (prototype opens WhatsApp for photos).
6. Watch for confusion, time to publish, and early phone-number hunting.

**Presto** and **Presto Servicios** are not in this build.

## Prototype behavior (not production)

- State persists in the browser (`localStorage` key `barrio-mvp-buynothing`); clear site data to reset.
- **Reportar** on neighbor profiles / posts → toast only (no moderation backend).
- **Apoya a tu Barrio** → simulated native IAP in browser; real StoreKit / Play Billing via `window.BarrioNative` when wrapped in an app shell.
- No SMS verification, payments, or server sync.

## Key commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck + Vite build (same as CI) |
| `npm run preview` | Preview production build |

## License / usage

Internal Valere / product exploration prototype. Buy Nothing is a separate organization; this project is **Barrio** for Peru and is not affiliated with Buy Nothing Project LLC.
