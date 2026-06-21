# Veritas Builders blog keyword queue

Source-of-truth backlog for the supervised blog pipeline. Each row is one
future post. When the drafting cron is wired up, it pops the next unwritten
slug and produces a draft into `.pipeline/blog-drafts/`.

## Conventions

- **Slug** — the URL the post will eventually live at: `/blog/<slug>`. Use
  kebab-case, no stop words at the front, geography last for ranking.
- **Intent** — what someone searching this is trying to do.
  - `informational` — "what is X / how does X work / what to expect"
  - `local` — geo-modified searches (Houston, Magnolia, etc.)
  - `transactional` — "near me / quote / cost" — buyer ready
  - `comparison` — "X vs Y / best X for Y"
- **Diff** — ranking difficulty for a local Houston site:
  - `L` — long-tail / low competition, can rank in a few months
  - `M` — moderate competition, will take 6–12 months + internal linking
  - `H` — head term competing with HomeAdvisor/Houzz/Angi; only attempt with
    a strong internal-link cluster pointing at it
- **No specific numbers in body copy.** Every post uses broad qualitative
  ranges per [veritas-blog-no-specific-pricing-numbers] — never quote
  dollar amounts, $/sf, or hard week counts. Always end with a "talk to
  the team for a project-specific estimate" CTA pointing at `/#contact`.
- **Status** — `queued` / `drafting` / `drafted` / `published`.

---

## 1. Residential remodel — geo-modified (kitchen / bath / whole-home)

These are the highest-converting local searches for the brand. Lead with
neighborhood + service. Avoid putting dollar amounts in the body.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 1 | kitchen-remodel-magnolia-tx-what-to-expect | local + informational | L | published |
| 2 | kitchen-remodel-the-woodlands-tx-guide | local | L | queued |
| 3 | kitchen-remodel-cypress-tx-guide | local | L | queued |
| 4 | kitchen-remodel-tomball-tx-guide | local | L | queued |
| 5 | kitchen-remodel-spring-tx-guide | local | L | queued |
| 6 | kitchen-remodel-conroe-tx-guide | local | L | queued |
| 7 | kitchen-remodel-katy-tx-guide | local | L | queued |
| 8 | bathroom-remodel-magnolia-tx-guide | local | L | queued |
| 9 | bathroom-remodel-the-woodlands-tx-guide | local | L | queued |
| 10 | bathroom-remodel-cypress-tx-guide | local | L | queued |
| 11 | bathroom-remodel-tomball-tx-guide | local | L | queued |
| 12 | bathroom-remodel-conroe-tx-guide | local | L | queued |
| 13 | primary-suite-addition-houston-guide | local + transactional | M | queued |
| 14 | mother-in-law-suite-addition-magnolia-tx | local | L | queued |
| 15 | garage-conversion-houston-what-to-know | local + informational | L | queued |
| 16 | second-story-addition-houston-guide | local | M | queued |
| 17 | whole-home-renovation-magnolia-tx-guide | local | L | queued |
| 18 | aging-in-place-bathroom-remodel-houston | local + informational | L | queued |

## 2. Process / what-to-expect / phase-by-phase

These rank for "what to expect" and "how long does X take" — high intent,
low competition, and they build trust with readers who are still deciding.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 19 | what-to-expect-kitchen-remodel-process-houston | informational | L | queued |
| 20 | what-to-expect-bathroom-remodel-process-houston | informational | L | queued |
| 21 | how-long-does-a-home-addition-take-houston | informational | L | queued |
| 22 | how-long-does-a-roof-replacement-take-texas | informational | L | queued |
| 23 | what-to-expect-whole-home-renovation-week-by-week | informational | L | queued |
| 24 | how-to-prepare-your-home-for-a-remodel-houston | informational | L | queued |
| 25 | living-through-a-remodel-survival-guide | informational | L | queued |
| 26 | construction-noise-schedule-what-to-expect | informational | L | queued |
| 27 | pre-construction-meeting-what-to-ask | informational | L | queued |
| 28 | construction-punch-list-what-it-means | informational | L | queued |
| 29 | change-orders-what-they-are-and-why-they-happen | informational | L | queued |
| 30 | what-happens-during-rough-in-stage | informational | L | queued |

## 3. Materials / design choices (mid-funnel)

People researching materials are usually 2–6 months out from hiring.
Capture them now, nurture them, convert later.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 31 | quartz-vs-granite-vs-marble-countertops-houston | comparison | M | queued |
| 32 | shaker-vs-flat-panel-cabinets-which-to-choose | comparison | L | queued |
| 33 | luxury-vinyl-plank-vs-engineered-hardwood-houston | comparison | M | queued |
| 34 | porcelain-vs-ceramic-tile-bathrooms-texas-humidity | comparison | L | queued |
| 35 | walk-in-shower-vs-tub-houston-bathroom-remodel | comparison | L | queued |
| 36 | open-vs-closed-kitchen-layout-houston | comparison | L | queued |
| 37 | island-vs-peninsula-kitchen-which-fits-your-space | comparison | L | queued |
| 38 | metal-vs-asphalt-shingle-roof-texas-climate | comparison | M | queued |
| 39 | impact-resistant-shingles-texas-hail-worth-it | informational | M | queued |
| 40 | spray-foam-vs-batt-insulation-houston-heat | comparison | L | queued |
| 41 | tankless-vs-tank-water-heater-houston-homes | comparison | M | queued |
| 42 | window-replacement-options-houston-heat | informational | M | queued |

## 4. Permits / regulations / local code (Magnolia, Houston, Montgomery County)

These are gold — almost no competition because they need local expertise,
and homeowners actively search them before starting projects.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 43 | do-i-need-a-permit-to-remodel-my-kitchen-houston | informational | L | queued |
| 44 | bathroom-remodel-permit-requirements-houston | informational | L | queued |
| 45 | adu-permit-process-magnolia-tx | local + informational | L | queued |
| 46 | home-addition-permits-montgomery-county-tx | local + informational | L | queued |
| 47 | setback-rules-magnolia-tx-what-you-need-to-know | local + informational | L | queued |
| 48 | hoa-approval-for-home-renovations-greater-houston | informational | L | queued |
| 49 | building-permits-conroe-tx-overview | local + informational | L | queued |
| 50 | electrical-permit-when-do-you-need-one-houston | informational | L | queued |
| 51 | plumbing-permit-requirements-residential-houston | informational | L | queued |
| 52 | unpermitted-work-how-to-handle-it-houston | informational | L | queued |
| 53 | commercial-building-permits-houston-overview | informational | M | queued |
| 54 | swppp-requirements-greater-houston-commercial | informational + local | L | queued |

## 5. Seasonal / climate / Gulf Coast realities

Texas-specific weather and seasonality content. Publish ahead of each
season — hurricane prep in May, freeze prep in November.

| # | Slug | Intent | Diff | Status | Seasonal |
|---|---|---|---|---|---|
| 55 | hurricane-prep-checklist-houston-homeowners | informational | M | queued | May–Jun |
| 56 | post-storm-roof-inspection-what-to-look-for-texas | informational | M | queued | Jun–Oct |
| 57 | hail-damage-roof-claim-houston-step-by-step | informational | M | queued | spring |
| 58 | winter-pipe-protection-houston-homes | informational | L | queued | Oct–Nov |
| 59 | post-freeze-home-repairs-houston | informational | L | queued | Feb–Mar |
| 60 | summer-heat-attic-ventilation-texas | informational | L | queued | May–Jul |
| 61 | rainy-season-foundation-watering-houston-clay-soil | informational | L | queued | Sep |
| 62 | best-time-of-year-to-remodel-in-houston | informational | L | queued | Oct |
| 63 | best-time-to-pour-concrete-houston-climate | informational | L | queued | Mar |
| 64 | when-not-to-do-exterior-painting-houston | informational | L | queued | Jun |

## 6. Vetting / contracting basics (top-of-funnel trust content)

Long-shelf-life evergreen content. These are the posts that convert
researchers into leads later.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 65 | red-flags-when-hiring-a-contractor-houston | informational | M | queued |
| 66 | questions-to-ask-before-signing-a-remodel-contract | informational | L | queued |
| 67 | how-to-read-a-construction-estimate-line-by-line | informational | L | queued |
| 68 | fixed-bid-vs-time-and-materials-which-is-better | comparison | M | queued |
| 69 | design-build-vs-design-bid-build-explained | comparison | M | queued |
| 70 | general-contractor-vs-handyman-when-to-use-each | comparison | L | queued |
| 71 | how-to-verify-a-contractor-license-in-texas | informational | L | queued |
| 72 | contractor-insurance-what-to-verify-before-hiring | informational | L | queued |
| 73 | what-makes-a-good-construction-contract-houston | informational | L | queued |
| 74 | progress-payments-how-construction-billing-works | informational | L | queued |
| 75 | construction-warranty-what-to-expect-houston | informational | L | queued |
| 76 | how-to-handle-construction-disputes-texas | informational | L | queued |

## 7. Roofing-specific

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 77 | roof-replacement-magnolia-tx-guide | local | L | queued |
| 78 | roof-replacement-the-woodlands-tx-guide | local | L | queued |
| 79 | roof-replacement-cypress-tx-guide | local | L | queued |
| 80 | how-to-pick-a-roofing-contractor-houston | informational | M | queued |
| 81 | roof-leak-vs-roof-replacement-when-to-act | informational | L | queued |
| 82 | metal-roof-cost-considerations-texas | informational | M | queued |
| 83 | what-is-roof-decking-and-when-it-needs-replacing | informational | L | queued |
| 84 | roof-insurance-claim-vs-paying-out-of-pocket-texas | comparison | M | queued |
| 85 | radiant-barrier-attic-houston-worth-it | informational | L | queued |

## 8. Land clearing / site work / civil utilities

Higher-value commercial+rural keywords. Lower volume, much higher
margin per click.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 86 | land-clearing-magnolia-tx-guide | local | L | queued |
| 87 | land-clearing-montgomery-county-tx | local | L | queued |
| 88 | forestry-mulching-vs-traditional-clearing | comparison | L | queued |
| 89 | stump-grinding-vs-stump-removal-which-to-choose | comparison | L | queued |
| 90 | how-to-prep-rural-land-for-a-build-texas | informational | L | queued |
| 91 | site-grading-what-it-involves-overview | informational | L | queued |
| 92 | excavation-services-houston-when-you-need-them | informational | L | queued |
| 93 | erosion-control-swppp-explained-texas | informational | L | queued |
| 94 | pad-prep-for-new-construction-houston | informational | L | queued |
| 95 | utility-trenching-what-to-expect | informational | L | queued |
| 96 | septic-vs-sewer-rural-houston-buildouts | comparison | L | queued |
| 97 | water-well-vs-municipal-water-greater-houston | comparison | L | queued |

## 9. Commercial site development (high-value B2B)

Lower volume but each lead is worth far more. Build a tight cluster here
so the existing commercial posts have internal links pointing in.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 98 | commercial-site-development-process-overview | informational | M | published |
| 99 | how-to-bid-a-commercial-site-development-project | informational | L | queued |
| 100 | retail-pad-site-development-houston-considerations | informational + local | L | queued |
| 101 | warehouse-pad-site-prep-greater-houston | informational + local | L | queued |
| 102 | restaurant-build-out-site-work-houston | informational + local | L | queued |
| 103 | gas-station-pad-site-development-houston | informational + local | L | queued |
| 104 | parking-lot-construction-overview-houston | informational + local | L | queued |
| 105 | commercial-drainage-design-overview-houston-clay-soil | informational | L | queued |
| 106 | commercial-utility-tap-process-greater-houston | informational + local | L | queued |
| 107 | commercial-fencing-options-for-developments | informational | L | queued |
| 108 | site-lighting-and-cameras-commercial-build-out | informational | L | queued |

## 10. Cost guides — geo-modified (no specific numbers, ranges only)

These are intentionally written WITHOUT specific dollar amounts. The post
explains the cost *drivers* (scope, finish level, condition, market) and
ranks for the "cost" query without making promises Jordan can't keep.

| # | Slug | Intent | Diff | Status |
|---|---|---|---|---|
| 109 | kitchen-remodel-cost-drivers-greater-houston | local + informational | M | queued |
| 110 | bathroom-remodel-cost-drivers-greater-houston | local + informational | M | queued |
| 111 | home-addition-cost-drivers-explained-houston | local + informational | M | queued |
| 112 | roof-replacement-cost-drivers-texas | local + informational | M | queued |
| 113 | land-clearing-cost-drivers-greater-houston | local + informational | L | queued |
| 114 | whole-home-renovation-cost-drivers-magnolia-tx | local + informational | L | queued |
| 115 | commercial-site-work-cost-drivers-houston | local + informational | L | queued |
| 116 | why-construction-quotes-vary-so-much-houston | informational | L | queued |
| 117 | true-cost-of-cheapest-contractor-bid | informational | L | queued |
| 118 | scope-creep-on-remodels-how-to-prevent-it | informational | L | queued |

---

## Next steps

1. **Jordan reviews this queue** — strike any topics that aren't a fit,
   add neighborhoods or services I missed, reorder priorities.
2. **Pick the first 5 to draft manually as templates** — these become the
   voice/structure benchmark the cron uses for everything else.
3. **Wire the daily drafting cron** — pops the next `queued` slug, calls
   Claude with the template + the no-numbers rule, writes a draft to
   `.pipeline/blog-drafts/<slug>.html` with OG tags, JSON-LD, hero image
   placeholder, and a "talk to the team" CTA prefilled.
4. **Jordan reviews + publishes 1–2/day** by moving drafts from
   `_drafts/` to `blog/` (15 sec/post if the draft is good).
