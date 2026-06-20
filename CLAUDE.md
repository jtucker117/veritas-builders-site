# Veritas Builders — Marketing Site

Public marketing site for Veritas Builders (Texas general contractor) at
**veritasbuilderstx.com**. Static HTML/CSS/vanilla JS served by a small Express
server (`server.js`) that also powers the **AI intake chatbot**. No build step.

See [`README.md`](README.md) for the full file map and a plain-English editing
guide (where colors, text, and images live). Quick orientation below.

## Stack & layout
- No framework, no bundler. Edit a file, push, it deploys.
- `index.html` — home. Service landing pages: `kitchen-remodel.html`,
  `bathroom-remodel.html`, `home-additions.html`, `roofing.html`,
  `land-clearing.html`, `site-work-grading.html`, `civil-utilities.html`,
  `commercial-site-development.html`, plus `services.html`.
- `blog/` — listing (`index.html`) + article pages.
- `styles.css` — ALL styling. `main.js` — nav/scroll. `map.js` — service-area
  map. `chat.js` — chat widget. `server.js` — Express host + AI chat + lead email.
- `images/` — site images; drop project photos in `images/projects/`.

## Run
- `npm start` → `node server.js` (listens on `$PORT`, default 3000). Node >= 18.
- Deps: `express`, `@anthropic-ai/sdk`, `nodemailer`.

## Chatbot / env vars (set in Railway → Variables)
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (default `claude-haiku-4-5`)
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `LEAD_TO` (lead email)
- `BUILDERS_APP_URL` + `WEBSITE_INTAKE_TOKEN` — forwards captured leads to the
  ops app for tracking (shared secret must match the app's env var).
- Degrades gracefully: no `ANTHROPIC_API_KEY` → chat shows an "email us"
  fallback; no Gmail creds → leads aren't emailed. The site never breaks.

## Sister projects (separate repos, same parent folder)
- `../veritas-site` — Veritas Ventures parent-co site (veritasgrouptx.com).
- `../app` — Veritas Builders ops app (internal tool, veritasbuilders.app).
