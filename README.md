# Veritas Builders — Marketing Site

The Veritas Builders construction company website at **veritasbuilderstx.com**. Static-ish two-page site (HTML/CSS/vanilla JS) with an Express server for hosting and the AI intake chatbot.

```
veritas-builders-site/
├── index.html                      ← Home (Veritas Builders)
├── kitchen-remodel.html            ← Service landing pages
├── bathroom-remodel.html
├── home-additions.html
├── roofing.html
├── blog/
│   ├── index.html                  ← Blog listing
│   └── houston-bathroom-remodel-cost-2026.html
├── images/
│   ├── projects/                   ← Drop project photos here
│   └── ...
├── styles.css                      ← ALL styling
├── main.js                         ← nav menu, scroll effects
├── map.js                          ← Texas service-area map
├── chat.js                         ← AI intake chat widget
├── server.js                       ← Express + AI chat backend
└── README.md
```

## Sister sites

- **veritasgrouptx.com** — Veritas Ventures (parent holding company). Lives in `../veritas-site/`.
- **veritasbuilders.app** — Veritas Builders ops app (internal tool). Lives in `../app/`.

## Editing the site

Same patterns as the original Veritas Ventures site:

- **Colors:** `styles.css` `:root` block. Builders uses `--vb-accent` (electric blue).
- **Copy:** edit the HTML directly. Each section has a `<!-- =========== SECTION =========== -->` comment marker.
- **New project photos:** see `images/projects/README.md` for specs + how to add a project tile.
- **Service pages:** copy an existing one as a template, update title / meta / canonical / schema.

## Deploy (Railway)

Push to `main` → Railway auto-deploys.

Required env vars:

| Variable | What it does |
|---|---|
| `ANTHROPIC_API_KEY` | Powers the AI intake chatbot |
| `ANTHROPIC_MODEL` | Optional model override (default: `claude-haiku-4-5`) |
| `GMAIL_USER` | Sender for lead emails (e.g. `info@veritasgrouptx.com`) |
| `GMAIL_APP_PASSWORD` | App password for the Gmail account |
| `LEAD_TO` | Where lead summary emails go (default: `info@veritasgrouptx.com`) |
| `BUILDERS_APP_URL` | URL of the Veritas Builders ops app (e.g. `https://veritasbuilders.app`) |
| `WEBSITE_INTAKE_TOKEN` | Shared secret with the ops app for lead forwarding |

## SEO setup checklist

- [ ] Verify domain in Google Search Console (DNS TXT record)
- [ ] Submit `https://veritasbuilderstx.com/sitemap.xml` in Search Console
- [ ] Request indexing of `/`, `/kitchen-remodel`, `/bathroom-remodel`, `/home-additions`, `/roofing`
- [ ] Create a Google Business Profile for Veritas Builders at this domain
- [ ] Update social links to point at `veritasbuilderstx.com`
- [ ] Add 301 redirects from old `veritasgrouptx.com/builders` → `veritasbuilderstx.com/` (handled in `../veritas-site/server.js`)
