#!/usr/bin/env node
/* eslint-disable */
/*
 * Veritas Builders blog drafter — supervised pipeline CLI.
 *
 * Usage:
 *   node .pipeline/draft-blog-post.js              # draft the next queued slug
 *   node .pipeline/draft-blog-post.js <slug>       # draft a specific slug
 *   npm run draft                                  # shortcut
 *
 * What it does:
 *   1. Reads .pipeline/blog-keyword-queue.md, finds the next slug with
 *      status `queued` (or the slug passed on the command line).
 *   2. Reads the two existing template posts (kitchen-remodel-magnolia and
 *      commercial-site-development-process-overview) as voice/structure
 *      examples.
 *   3. Calls Claude Opus 4.7 (adaptive thinking, effort=high) and asks it to
 *      produce a JSON payload — title, meta, headline, card copy, body HTML.
 *   4. Wraps that payload in the standard page template (head, header, OG +
 *      JSON-LD, footer) and writes blog/<slug>.html.
 *   5. Inserts a placeholder-thumbnail card into blog/index.html.
 *   6. Adds the URL to sitemap.xml.
 *   7. Flips the queue status from `queued` to `published`.
 *   8. Prints the matching image-generation prompt so you can paste it into
 *      ChatGPT (or your image generator of choice).
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY    — your Anthropic API key.
 *
 * Optional:
 *   DEBUG=1              — print stack traces on error.
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// --- Paths ---------------------------------------------------------------
const REPO = path.resolve(__dirname, '..');
const PIPELINE = __dirname;
const BLOG_DIR = path.join(REPO, 'blog');
const QUEUE_PATH = path.join(PIPELINE, 'blog-keyword-queue.md');
const IMAGE_PROMPTS_PATH = path.join(PIPELINE, 'blog-image-prompts.md');
const SITEMAP_PATH = path.join(REPO, 'sitemap.xml');
const BLOG_INDEX_PATH = path.join(BLOG_DIR, 'index.html');
const TEMPLATE_KITCHEN_PATH = path.join(BLOG_DIR, 'kitchen-remodel-magnolia-tx-what-to-expect.html');
const TEMPLATE_COMMERCIAL_PATH = path.join(BLOG_DIR, 'commercial-site-development-process-overview.html');

const SITE = 'https://www.veritasbuilderstx.com';

// Bucket -> default card tag mapping. Claude can override if a different
// tag fits better, but the prompt encourages it to keep this default.
const BUCKET_TAGS = {
  1: 'Local Guide',
  2: 'Process Guide',
  3: 'Comparison',
  4: 'Permit Guide',
  5: 'Seasonal Guide',
  6: 'Guide',
  7: 'Roofing Guide',
  8: 'Site Work Guide',
  9: 'Commercial Guide',
  10: 'Cost Guide',
};

// --- Queue parser --------------------------------------------------------
function parseQueue(text) {
  const lines = text.split('\n');
  let bucket = null;
  const rows = [];
  for (const line of lines) {
    const bucketHeader = line.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (bucketHeader) {
      bucket = parseInt(bucketHeader[1], 10);
      continue;
    }
    if (bucket === null) continue;
    // Row: | # | slug | intent | diff | status | (seasonal)?
    const m = line.match(/^\|\s*\d+\s*\|\s*([a-z0-9-]+)\s*\|\s*([^|]+?)\s*\|\s*([LMH])\s*\|\s*(\w+)\s*(?:\|\s*([^|]+?)\s*)?\|/);
    if (!m) continue;
    rows.push({
      slug: m[1],
      intent: m[2],
      difficulty: m[3],
      status: m[4],
      seasonal: (m[5] || '').trim() || null,
      bucket,
      tag: BUCKET_TAGS[bucket] || 'Guide',
    });
  }
  return rows;
}

function pickNextQueued(rows) {
  for (const r of rows) {
    if (r.status !== 'queued') continue;
    if (fs.existsSync(path.join(BLOG_DIR, `${r.slug}.html`))) continue;
    return r;
  }
  return null;
}

function readImagePrompt(slug) {
  const text = fs.readFileSync(IMAGE_PROMPTS_PATH, 'utf8');
  // ### <num>. <slug>\n<body>
  const re = new RegExp(`### \\d+\\.\\s+${escapeRegex(slug)}\\s*\\n([\\s\\S]+?)(?=\\n### |\\n## |$)`, 'm');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Claude call ---------------------------------------------------------
function extractArticleBody(html) {
  // Pull body between <p class="hero-lead"...> and </div></article>
  const m = html.match(/<p class="hero-lead"[\s\S]+?(?=\s*<\/div>\s*<\/article>)/);
  return m ? m[0] : html.slice(0, 8000);
}

const SYSTEM_PROMPT = `You are a senior content writer for Veritas Builders, a Texas general contractor based in Magnolia, TX, serving Greater Houston, Montgomery County, and the broader Gulf Coast. You write blog posts in the brand's established voice: honest, direct, practical, slightly contrarian (willing to say "you don't actually need this"), warm but never folksy.

CRITICAL RULES — failing any of these means a bad draft:

1. NEVER quote specific dollar amounts, $/sf prices, or hard week/month timelines. Use broad qualitative ranges only: "mid-range to high-end", "a few weeks to a few months", "scales with scope and finish level", "drivers that move the number". Every job varies, and specific numbers in a public post become customer expectations the contractor gets held to.

2. Always end with a "Ready to talk about [topic]?" CTA section that includes Veritas's offer (free walkthroughs, written line-item estimates, no cash deposits) and two buttons: <a href="/#contact" class="btn btn-primary">Request a Free Walkthrough</a> and <a href="/" class="btn btn-ghost">About Veritas Builders</a>. For commercial posts, substitute "Request a Project Conversation" for the primary button text.

3. Use Texas / Houston / Magnolia / Montgomery County / Gulf Coast local context where natural. Reference clay soils, hurricane season, freeze events, expansive soils, Hill Country, TCEQ, SWPPP, oak trees, pine forests — the specific local detail that makes the post obviously written by someone who works here.

4. Target 900–1100 words in the body. Brand voice is tight and scannable. NOT pillar-post bloat.

5. Section structure: a 2–4 sentence hero-lead paragraph, then 5–7 <h2> sections with substantive content, then the closing CTA section. Use a mix of paragraphs, bulleted lists (<ul>), and ordered lists (<ol>). Bold key terms with <strong> sparingly.

6. Link to other Veritas posts where it's natural. Common targets you can use:
   - <a href="how-to-choose-a-contractor-in-houston">How to Choose a Contractor in Greater Houston</a>
   - <a href="kitchen-remodel-magnolia-tx-what-to-expect">Kitchen Remodel in Magnolia, TX: What to Expect</a>
   - <a href="commercial-site-development-process-overview">Commercial Site Development: A Process Overview</a>

7. Tone: confident but not salesy. Reader is a homeowner or commercial owner doing research before they're ready to buy. Earn their trust by being useful and direct, not by selling.

OUTPUT FORMAT — exactly one fenced JSON code block, no prose outside it:

\`\`\`json
{
  "title": "Page <title> tag — 55-70 chars max, ends with ' | Veritas Builders'",
  "metaDescription": "150-160 char meta description for SEO",
  "keywords": "comma-separated SEO keywords, 5-8 of them",
  "headline": "H1 / JSON-LD headline — concise, no brand suffix",
  "schemaDescription": "JSON-LD description, 100-200 chars",
  "cardTag": "MUST be one of: Local Guide, Cost Guide, Process Guide, Comparison, Permit Guide, Seasonal Guide, Guide, Roofing Guide, Site Work Guide, Commercial Guide",
  "cardDescription": "1-2 sentence summary for the blog index card, 150-250 chars",
  "heroAlt": "Alt text for the hero image — describe what the photo shows in concrete terms",
  "bodyHtml": "Full HTML for the article body. Starts with <p class=\\"hero-lead\\" style=\\"margin-bottom: var(--space-8)\\">...hero lead paragraph...</p>. Then alternating <h2 style=\\"margin-top: var(--space-10)\\">section title</h2> and section content (<p>, <ul>, <ol> as needed). Ends with the CTA section. Use the same Tailwind-style helper styles as the example posts (color: var(--text-soft); line-height: 1.8; padding-left: 1.25rem on <ul> elements, padding-left: 1.5rem on <ol>). NO outer <article>/<main>/<div class=\\"container\\"> wrappers — those are added by the build script."
}
\`\`\``;

async function generatePost(entry, templates) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY env var is not set. Export it before running this script.');
  }
  const client = new Anthropic();

  const userMessage = [
    'Here are two example posts that set the voice and structure benchmark. Match this tone, length (~1000 words body), and section pattern exactly. Do not copy these word-for-word — they are calibration only.',
    '',
    '=== EXAMPLE 1 — Local residential guide (Kitchen Remodel in Magnolia, TX) ===',
    extractArticleBody(templates.kitchen),
    '',
    '=== EXAMPLE 2 — Commercial / B2B guide (Commercial Site Development Process Overview) ===',
    extractArticleBody(templates.commercial),
    '',
    '=== WRITE THE NEXT POST ===',
    `Slug:               ${entry.slug}`,
    `Topical bucket:     ${entry.bucket} — ${entry.tag}`,
    `Search intent:      ${entry.intent}`,
    `Ranking difficulty: ${entry.difficulty}`,
    entry.seasonal ? `Seasonal:           ${entry.seasonal}` : null,
    '',
    `Default cardTag for this bucket is "${entry.tag}". Use it unless a different value in the allowed list is genuinely a better fit.`,
    '',
    'Produce the JSON object per the system-prompt schema.',
  ].filter(Boolean).join('\n');

  process.stdout.write('📝 Drafting via Claude Opus 4.7 (adaptive thinking, effort=high)... ');
  const t0 = Date.now();

  const stream = client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const message = await stream.finalMessage();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`done in ${elapsed}s`);

  const text = message.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const jsonMatch = text.match(/```json\s*([\s\S]+?)\s*```/);
  if (!jsonMatch) {
    throw new Error(`Claude did not return a JSON code block. First 800 chars of response:\n${text.slice(0, 800)}`);
  }
  let payload;
  try {
    payload = JSON.parse(jsonMatch[1]);
  } catch (e) {
    throw new Error(`Claude returned malformed JSON: ${e.message}\n\nRaw block:\n${jsonMatch[1].slice(0, 800)}`);
  }
  for (const f of ['title', 'metaDescription', 'keywords', 'headline', 'schemaDescription', 'cardTag', 'cardDescription', 'heroAlt', 'bodyHtml']) {
    if (!payload[f] || typeof payload[f] !== 'string') {
      throw new Error(`Claude response missing or non-string field: ${f}`);
    }
  }
  // Clean up: some models wrap bodyHtml in ```html ... ``` fences. Strip if present.
  payload.bodyHtml = payload.bodyHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();
  return payload;
}

// --- HTML escaping -------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// --- Page builder --------------------------------------------------------
const FOOTER_HTML = `<footer class="site-footer">
    <div class="container footer-grid">
      <a href="/" class="logo" aria-label="Veritas Builders home">
        <img src="../images/veritas-builders-logo.png" alt="Veritas Builders" style="height:34px;width:auto" />
      </a>
            <nav class="footer-links" aria-label="Footer">
        <a href="/services">Services</a>
        <a href="/#process">Process</a>
        <a href="/#why">Why Us</a>
        <a href="/blog/">Blog</a>
        <a href="/#contact">Contact</a>
        <a href="https://veritasgrouptx.com/">Veritas Ventures</a>
      </nav>
      <div class="footer-social" aria-label="Veritas Builders on social media">
        <a href="https://www.instagram.com/veritasbuilderstx" target="_blank" rel="noopener" aria-label="Follow Veritas Builders on Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.4.6.23 1 .5 1.5 1s.77.9 1 1.5c.15.4.34 1 .4 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.06 1.2-.25 1.8-.4 2.2a4 4 0 0 1-1 1.5 4 4 0 0 1-1.5 1c-.4.15-1 .34-2.2.4-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-1.8-.25-2.2-.4a4 4 0 0 1-1.5-1 4 4 0 0 1-1-1.5c-.15-.4-.34-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-1.8.4-2.2a4 4 0 0 1 1-1.5 4 4 0 0 1 1.5-1c.4-.15 1-.34 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.23-2.1.38a2.2 2.2 0 0 0-.9.6 2.2 2.2 0 0 0-.6.9c-.15.4-.33 1-.38 2.1C3.3 8.5 3.3 8.9 3.3 12s0 3.5.07 4.7c.05 1.1.23 1.7.38 2.1.13.4.3.7.6.9.3.3.6.5.9.6.4.15 1 .33 2.1.38 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.23 2.1-.38.4-.13.7-.3.9-.6.3-.3.5-.6.6-.9.15-.4.33-1 .38-2.1.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1.1-.23-1.7-.38-2.1a2.2 2.2 0 0 0-.6-.9 2.2 2.2 0 0 0-.9-.6c-.4-.15-1-.33-2.1-.38C15.5 4 15.1 4 12 4zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>
        </a>
        <a href="https://www.facebook.com/VeritasBuildersTX/" target="_blank" rel="noopener" aria-label="Follow Veritas Builders on Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21.7v-8h2.7l.4-3.1h-3.1V8.6c0-.9.25-1.5 1.55-1.5H17V4.3c-.3-.04-1.25-.13-2.36-.13-2.34 0-3.94 1.42-3.94 4.04v2.25h-2.7v3.1h2.7v8h2.8z"/></svg>
        </a>
        <a href="https://share.google/3ZoTKBIXKHMaNW8Gb" target="_blank" rel="noopener" aria-label="View Veritas Builders on Google">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.35 11.1H12v2.9h5.35a4.5 4.5 0 0 1-1.95 2.95 5.5 5.5 0 0 1-3.4 1.05 5.5 5.5 0 1 1 3.4-9.9l2.05-2.05A8.4 8.4 0 0 0 12 3.6a8.4 8.4 0 1 0 0 16.8c2.34 0 4.3-.78 5.74-2.1a8 8 0 0 0 2.36-6c0-.4 0-.8-.05-1.2h-3.0z"/></svg>
        </a>
      </div>
      <p class="footer-copy">© <span id="year"></span> Veritas Builders, a Veritas company.</p>
    </div>
  </footer>`;

function buildHtml(entry, payload) {
  const slug = entry.slug;
  const today = new Date().toISOString().slice(0, 10);
  const monthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const url = `${SITE}/blog/${slug}`;
  const imageUrl = `${SITE}/images/projects/${slug}.jpg`;

  return `<!DOCTYPE html>
<html lang="en" data-brand="builders">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escapeHtml(payload.title)}</title>
  <meta name="description" content="${escapeHtml(payload.metaDescription)}" />
  <meta name="keywords" content="${escapeHtml(payload.keywords)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow" />

  <meta property="og:title" content="${escapeHtml(payload.title)}" />
  <meta property="og:description" content="${escapeHtml(payload.metaDescription)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Veritas Builders" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${today}" />
  <meta property="article:author" content="Veritas Builders" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1600" />
  <meta property="og:image:height" content="900" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${imageUrl}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

  <link rel="icon" href="../favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png" />

  <link rel="stylesheet" href="../styles.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(payload.headline)},
    "description": ${JSON.stringify(payload.schemaDescription)},
    "datePublished": "${today}",
    "author": { "@type": "Organization", "name": "Veritas Builders" },
    "publisher": {
      "@type": "Organization",
      "name": "Veritas Builders",
      "logo": { "@type": "ImageObject", "url": "${SITE}/images/veritas-builders-logo.png" }
    },
    "image": "${imageUrl}",
    "mainEntityOfPage": "${url}"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Veritas Builders", "item": "${SITE}/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${SITE}/blog/" },
      { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(payload.headline)}, "item": "${url}" }
    ]
  }
  </script>
</head>
<body>

  <header class="site-header" id="header">
    <div class="container nav">
      <a href="/" class="logo" aria-label="Veritas Builders home">
        <img src="../images/veritas-builders-logo.png" alt="Veritas Builders" style="height:42px;width:auto" />
      </a>
      <nav class="nav-links" id="navLinks" aria-label="Primary">
        <a href="/services">Services</a>
        <a href="/#process">Process</a>
        <a href="/#why">Why Us</a>
        <a href="/blog/">Blog</a>
        <a href="/#contact">Contact</a>
        <a href="https://veritasgrouptx.com/" class="back-link">← Veritas Ventures</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </header>

  <main>
    <article class="section">
      <div class="container" style="max-width: 760px">
        <p style="color: var(--text-faint); font-size: var(--text-sm); margin-bottom: var(--space-4)">
          <a href="/blog/" style="color: var(--text-faint)">Blog</a> · ${escapeHtml(payload.cardTag)} · Published ${monthYear}
        </p>
        <h1 class="section-title" style="margin-bottom: var(--space-6)">${escapeHtml(payload.headline)}</h1>

        <div class="blog-hero" aria-label="Cover image coming soon"></div>

        ${payload.bodyHtml}
      </div>
    </article>
  </main>

  ${FOOTER_HTML}

  <script src="../main.js"></script>
</body>
</html>
`;
}

// --- Site-file updates ---------------------------------------------------
function insertBlogIndexCard(entry, payload) {
  const html = fs.readFileSync(BLOG_INDEX_PATH, 'utf8');
  const cardHtml = `          <article class="card has-thumb">
            <a href="${entry.slug}" class="card-thumb placeholder" aria-label="Cover image coming soon"></a>
            <span class="card-tag">${escapeHtml(payload.cardTag)}</span>
            <h3><a href="${entry.slug}" style="color:inherit">${escapeHtml(payload.headline)}</a></h3>
            <p>${escapeHtml(payload.cardDescription)}</p>
            <a href="${entry.slug}" class="card-link">Read the guide <span>→</span></a>
          </article>

`;
  // Insert just before the closing </div> of .cards (right before the
  // "Want a guide on a specific topic?" paragraph).
  const re = /(\s*<\/div>\s*<p style="margin-top: var\(--space-10\); color: var\(--text-soft\)">)/;
  const updated = html.replace(re, `${cardHtml}$1`);
  if (updated === html) {
    throw new Error('Could not find blog/index.html insertion point (.cards closing div). Update the regex if the template changed.');
  }
  fs.writeFileSync(BLOG_INDEX_PATH, updated);
}

function insertSitemapEntry(slug) {
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const url = `${SITE}/blog/${slug}`;
  if (sitemap.includes(`<loc>${url}</loc>`)) return false;
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`;
  const updated = sitemap.replace(/<\/urlset>\s*$/, entry);
  if (updated === sitemap) {
    throw new Error('Could not find </urlset> close tag in sitemap.xml');
  }
  fs.writeFileSync(SITEMAP_PATH, updated);
  return true;
}

function markQueuePublished(slug) {
  const text = fs.readFileSync(QUEUE_PATH, 'utf8');
  const re = new RegExp(`(\\|\\s*${escapeRegex(slug)}\\s*\\|[^|]*\\|[^|]*\\|\\s*)queued(\\s*\\|)`);
  const updated = text.replace(re, '$1published$2');
  if (updated === text) {
    throw new Error(`Could not find queued row for slug "${slug}" in queue file`);
  }
  fs.writeFileSync(QUEUE_PATH, updated);
}

// --- Main ----------------------------------------------------------------
async function main() {
  const argSlug = process.argv[2];

  const rows = parseQueue(fs.readFileSync(QUEUE_PATH, 'utf8'));

  let entry;
  if (argSlug) {
    entry = rows.find(r => r.slug === argSlug);
    if (!entry) {
      console.error(`Slug "${argSlug}" not found in queue. First few queued slugs:`);
      console.error(rows.filter(r => r.status === 'queued').slice(0, 5).map(r => `  ${r.slug}`).join('\n'));
      process.exit(1);
    }
    if (fs.existsSync(path.join(BLOG_DIR, `${argSlug}.html`))) {
      console.error(`Post already exists at blog/${argSlug}.html — refusing to overwrite.`);
      process.exit(1);
    }
  } else {
    entry = pickNextQueued(rows);
    if (!entry) {
      console.error('No queued slugs left in the queue — everything is drafted or published.');
      process.exit(0);
    }
  }

  console.log(`Slug:       ${entry.slug}`);
  console.log(`Bucket:     ${entry.bucket} (${entry.tag})`);
  console.log(`Intent:     ${entry.intent}`);
  console.log(`Difficulty: ${entry.difficulty}`);
  if (entry.seasonal) console.log(`Seasonal:   ${entry.seasonal}`);
  console.log('');

  const templates = {
    kitchen: fs.readFileSync(TEMPLATE_KITCHEN_PATH, 'utf8'),
    commercial: fs.readFileSync(TEMPLATE_COMMERCIAL_PATH, 'utf8'),
  };

  const payload = await generatePost(entry, templates);

  const html = buildHtml(entry, payload);
  const blogPath = path.join(BLOG_DIR, `${entry.slug}.html`);
  fs.writeFileSync(blogPath, html);
  console.log(`✓ Wrote ${path.relative(REPO, blogPath)}`);

  insertBlogIndexCard(entry, payload);
  console.log(`✓ Added card to blog/index.html`);

  insertSitemapEntry(entry.slug);
  console.log(`✓ Added sitemap.xml entry`);

  markQueuePublished(entry.slug);
  console.log(`✓ Marked queue status as published`);

  const imagePrompt = readImagePrompt(entry.slug);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📸 Hero image prompt for ChatGPT / DALL-E:`);
  console.log('');
  console.log(imagePrompt || `(No prompt found in blog-image-prompts.md for slug "${entry.slug}". Write your own — keep the master style block.)`);
  console.log('');
  console.log(`Save the generated image as: images/projects/${entry.slug}.jpg`);
  console.log(`Then swap the <div class="blog-hero"> placeholder for an <img class="blog-hero" src=... /> tag.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log(`Done. Review with: git diff`);
  console.log(`Publish with:     git add -A && git commit -m "Blog: ${entry.slug}" && git push`);
}

main().catch(err => {
  console.error('\n✗ Error:', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
