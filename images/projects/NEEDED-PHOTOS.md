# Needed Photos — generation prompts + filing

All project tiles crop to **4:3** (`object-fit: cover`). Generate every image
**landscape**, save as **.jpg**, target **under 500 KB**, and drop it in this
folder (`images/projects/`) using the exact filename listed.

---

## READ THIS FIRST — how to not look AI-generated

The earlier prompts said "luxury magazine quality," "pristine," "professional
architectural photography." **That language is exactly what makes images look
fake** — it pushes the model toward glossy, over-lit, plastic, too-perfect
scenes with glowing surfaces and impossibly clean everything. Real photos are
messier and flatter.

**Swap the goal from "magazine" to "a contractor's phone photo."** The style
line at the bottom of every prompt below does this. The moves that kill the AI
look:

- **Name a real camera/phone, not "architectural photography."**
  → "shot on an iPhone 15 Pro," "shot on a Canon DSLR," "real estate listing
  photo." This alone changes the render dramatically.
- **Add real-world imperfection.** A little clutter, dust on a jobsite, a tool
  left on the counter, a slightly crooked framing, ordinary wear. Perfect = fake.
- **Ask for flat, even, ordinary light** — "slightly overcast," "ordinary
  indoor lighting," "windows a little blown out." Kill the dramatic golden glow.
- **Ask for mid-range, ordinary finishes**, not "high-end / custom / luxury."
  Real suburban Texas homes, builder-grade-plus, not a showroom.
- **Say "landscape orientation"** in words — the model ignores pixel dimensions
  (that's why the last one came out portrait).
- **Add these negatives:** no CGI, no 3D render, not a video game, no
  over-saturation, no glossy plastic surfaces, no perfect symmetry, no glowing
  highlights.

If one still looks fake: regenerate asking for it to be **"a candid snapshot,
slightly imperfect, taken quickly on a phone,"** and add a mundane detail
(a power outlet, a light switch, a garden hose, tire tracks in the dirt).

**Universal style line (paste at the end of every prompt):**
> Shot on an iPhone 15 Pro, real estate listing photo, natural available light,
> flat and even (not dramatic), realistic ordinary finishes, a few real-world
> imperfections. Photojournalistic and candid, not staged. Landscape
> orientation, 3:2. No people, no text, no watermarks, no logos, no brand names.
> Negative: no CGI, no 3D render, not a video game, no over-saturation, no
> glossy plastic surfaces, no perfect symmetry, no glowing highlights, no
> HDR halos.

---

## GROUP A — Replaces the live "Photo coming soon" tiles

### A1 — `kitchen-custom-cabinetry.jpg`
Fills: `kitchen-remodel.html:161` — "Custom Cabinetry Remodel"

> A remodeled kitchen in an ordinary suburban Texas home. Painted greige shaker
> cabinets running to the ceiling, a quartz countertop with light veining, a
> stainless range and microwave, simple undercabinet lighting, light oak
> laminate floors. Everyday details: a paper-towel roll, a coffee maker on the
> counter, a dish towel over the oven handle. Shot at eye level from the dining
> side, flat daylight from a window on the left, window slightly blown out.
> Shot on an iPhone 15 Pro, real estate listing photo, natural available light,
> flat and even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos, no brand names. Negative: no CGI, no
> 3D render, no over-saturation, no glossy plastic surfaces, no perfect
> symmetry, no glowing highlights, no HDR halos.

### A2 — `bathroom-tub-to-shower.jpg`
Fills: `bathroom-remodel.html:162` — "Tub-to-Shower Conversion"

> A converted walk-in shower in a normal suburban bathroom where a tub used to
> be. Frameless clear glass, white subway tile to the ceiling, a tiled niche
> holding an ordinary bottle of shampoo, matte black fixtures, a linear drain, a
> small bench. A bath mat on the floor, a towel on a hook. Compact room, ordinary
> flat bathroom lighting, no drama. Shot on an iPhone 15 Pro, real estate listing
> photo, natural available light, flat and even, realistic ordinary finishes, a
> few real-world imperfections. Photojournalistic and candid, not staged.
> Landscape orientation, 3:2. No people, no text, no watermarks, no logos, no
> brand names. Negative: no CGI, no 3D render, no over-saturation, no glossy
> plastic surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

### A3 — `bathroom-guest-refresh.jpg`
Fills: `bathroom-remodel.html:170` — "Guest Bath Refresh"

> A refreshed guest bathroom in a suburban Texas home. A single stained oak
> vanity, quartz top with an undermount sink, a large rectangular framed mirror,
> one sconce above, chrome faucet, patterned matte floor tile. Ordinary touches:
> a hand towel, a small soap dispenser, a light switch and outlet on the wall.
> Small room, flat even light. Shot on an iPhone 15 Pro, real estate listing
> photo, natural available light, flat and even, realistic ordinary finishes, a
> few real-world imperfections. Photojournalistic and candid, not staged.
> Landscape orientation, 3:2. No people, no text, no watermarks, no logos, no
> brand names. Negative: no CGI, no 3D render, no over-saturation, no glossy
> plastic surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

---

## GROUP B — Service pages that currently have zero photos

Each page needs a 3-tile gallery. Where an image already exists in this folder,
reuse it — only the NEW files below need generating.

### home-additions.html
Reuse: `houston-home-addition-cost-2026.jpg`, `houston-home-addition-cost-2026-recent-room-addition.jpg`

**B1 — `home-addition-master-suite.jpg`**
> A newly built primary-bedroom addition on an ordinary Texas home, just
> finished. Vaulted ceiling with painted beams, a couple of windows facing a
> plain green backyard, oak floors, neutral walls, a doorway into the bathroom.
> Mostly empty — a bed, two nightstands, a lamp, a stray cardboard box in the
> corner from moving in. Flat overcast daylight through the windows. Shot on an
> iPhone 15 Pro, real estate listing photo, natural available light, flat and
> even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos, no brand names. Negative: no CGI, no
> 3D render, no over-saturation, no glossy plastic surfaces, no perfect
> symmetry, no glowing highlights, no HDR halos.

### roofing.html
Reuse: `signs-you-need-a-new-roof-in-texas.jpg`, `signs-you-need-a-new-roof-in-texas-hail-damage-close-up.jpg`

**B2 — `roofing-full-replacement.jpg`**
> An ordinary suburban Texas house mid roof-replacement. New charcoal
> architectural shingles cover about two thirds of the roof; the rest shows
> synthetic underlayment and new drip edge. An extension ladder leans against the
> gutter, a few opened bundles of shingles sit on the roof, some loose debris and
> a tarp on the lawn below. Plain hazy sky, flat midday light, shot from the
> front yard at an angle. Shot on an iPhone 15 Pro, real estate listing photo,
> natural available light, flat and even, realistic ordinary finishes, a few
> real-world imperfections. Photojournalistic and candid, not staged. Landscape
> orientation, 3:2. No people, no text, no watermarks, no logos, no brand names.
> Negative: no CGI, no 3D render, no over-saturation, no glossy plastic
> surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

### land-clearing.html
Reuse: `cost-of-land-clearing-in-texas-2026.jpg`

**B3 — `land-clearing-mulching-in-progress.jpg`**
> Forestry mulching in progress on a Texas acreage lot. A tracked skid steer with
> a mulching head chewing through underbrush and small cedars; a mulched strip
> behind it, thick brush still ahead, dust hanging in the air, mud on the tracks.
> Mature oaks left standing. Flat late-afternoon light, plain sky. Shot on an
> iPhone 15 Pro, real estate listing photo, natural available light, flat and
> even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos, no brand names on equipment.
> Negative: no CGI, no 3D render, no over-saturation, no glossy plastic
> surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

**B4 — `land-clearing-finished-pad.jpg`**
> A freshly cleared and graded rural Texas homesite. Flat compacted dirt pad,
> brush and stumps gone, a ragged line of preserved oaks around the edge, a
> gravel drive coming in from the road, survey stakes with faded pink flagging,
> tire ruts in the dirt. Plain overcast sky, flat light, slightly elevated angle.
> Shot on an iPhone 15 Pro, real estate listing photo, natural available light,
> flat and even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos. Negative: no CGI, no 3D render, no
> over-saturation, no glossy plastic surfaces, no perfect symmetry, no glowing
> highlights, no HDR halos.

### site-work-grading.html
Reuse: `site-grading-vs-excavation-explained.jpg`

**B5 — `site-work-grading-motor-grader.jpg`**
> A motor grader cutting a slope across a large dirt pad on a Texas commercial
> site. A windrow of soil along the blade, a GPS mast on the machine, string
> lines and grade stakes in the foreground, a roller compactor working in the
> background, dust and tire tracks everywhere. Flat overcast-bright daylight.
> Shot on an iPhone 15 Pro, real estate listing photo, natural available light,
> flat and even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos, no brand names on equipment.
> Negative: no CGI, no 3D render, no over-saturation, no glossy plastic
> surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

**B6 — `site-work-grading-detention-pond.jpg`**
> A newly dug stormwater detention pond on a Texas commercial site. Graded
> earthen side slopes, a plain concrete outfall structure, a rock rip-rap apron,
> orange silt fence around the perimeter, an excavator parked at the top, muddy
> water pooled at the bottom. Plain sky, flat daylight, shot from the pond rim.
> Shot on an iPhone 15 Pro, real estate listing photo, natural available light,
> flat and even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos. Negative: no CGI, no 3D render, no
> over-saturation, no glossy plastic surfaces, no perfect symmetry, no glowing
> highlights, no HDR halos.

### commercial-site-development.html
Reuse: `what-commercial-site-development-includes.jpg`, `commercial-site-development-process-overview.jpg`

**B7 — `commercial-site-development-paving.jpg`**
> A commercial parking lot under construction in Texas. Freshly poured concrete
> sections with control joints on one side, compacted tan subgrade on the other,
> formed curb and gutter, storm inlets set in place, a plain building shell in the
> background, mud tracked across the pavement. Flat daylight, low angle. Shot on
> an iPhone 15 Pro, real estate listing photo, natural available light, flat and
> even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos. Negative: no CGI, no 3D render, no
> over-saturation, no glossy plastic surfaces, no perfect symmetry, no glowing
> highlights, no HDR halos.

### civil-utilities.html
Reuse: `civil-site-work-checklist-commercial-projects.jpg` (loosely related — or generate all three)

**B8 — `civil-utilities-sanitary-sewer-trench.jpg`**
> A sanitary sewer installation on a Texas commercial site. An open trench with a
> steel trench box, green PVC pipe on gravel bedding, a spoil pile alongside, an
> excavator at the trench edge, orange safety fence, muddy boots-worth of mess
> around the hole. Flat daylight, plain sky. Shot on an iPhone 15 Pro, real
> estate listing photo, natural available light, flat and even, realistic
> ordinary finishes, a few real-world imperfections. Photojournalistic and
> candid, not staged. Landscape orientation, 3:2. No people, no text, no
> watermarks, no logos, no brand names on equipment. Negative: no CGI, no 3D
> render, no over-saturation, no glossy plastic surfaces, no perfect symmetry, no
> glowing highlights, no HDR halos.

**B9 — `civil-utilities-waterline-fire-hydrant.jpg`**
> A newly set commercial waterline connection in Texas. A yellow fire hydrant on
> a concrete thrust block, blue PVC pipe and a gate valve in a half-backfilled
> trench, tracer wire, a valve box, compacted gravel around it, dirt clods and
> tire tracks. Plain overcast sky, flat light. Shot on an iPhone 15 Pro, real
> estate listing photo, natural available light, flat and even, realistic
> ordinary finishes, a few real-world imperfections. Photojournalistic and
> candid, not staged. Landscape orientation, 3:2. No people, no text, no
> watermarks, no logos. Negative: no CGI, no 3D render, no over-saturation, no
> glossy plastic surfaces, no perfect symmetry, no glowing highlights, no HDR
> halos.

**B10 — `civil-utilities-storm-drain-inlet.jpg`**
> A storm drainage install on a Texas commercial site. A precast concrete curb
> inlet set in place, big RCP storm pipe staged and partly laid in an open
> trench, a backhoe positioning a pipe section, graded dirt and orange silt fence
> behind, mud and tracks in the foreground. Flat daylight, plain sky. Shot on an
> iPhone 15 Pro, real estate listing photo, natural available light, flat and
> even, realistic ordinary finishes, a few real-world imperfections.
> Photojournalistic and candid, not staged. Landscape orientation, 3:2. No
> people, no text, no watermarks, no logos, no brand names on equipment.
> Negative: no CGI, no 3D render, no over-saturation, no glossy plastic
> surfaces, no perfect symmetry, no glowing highlights, no HDR halos.

---

## Filing checklist

1. Save each generated image as **.jpg**, landscape (3:2 or 4:3 is fine — tiles
   crop to 4:3).
2. Compress to **under 500 KB** (Preview → Export → Quality ~70, or `sips`).
   Tell Claude the file is in the folder and it'll crop/resize/wire it in.
3. Drop it into `images/projects/` with the **exact filename** above.
4. Wiring into the page (Claude handles this):
   - **Group A:** replace the `<article class="project placeholder">` block with a
     real `<article class="project">` block (copy the working example above it in
     the same file) and delete the `<div class="project-photo" role="img" ...>`.
   - **Group B:** these pages have no gallery yet — a new
     `<section class="section" id="work">` block gets added, modeled on
     `kitchen-remodel.html`.
5. Real descriptive `alt` text (location + scope + finishes), matching the
   existing tiles — it's doing SEO work on these pages.
