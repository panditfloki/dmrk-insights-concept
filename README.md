# DMRK Insights — frontend concept

A design concept for [dmrkinsights.com](https://dmrkinsights.com), built by
**dydxfx** as a consulting deliverable. **This is not the live site.**

The owner requested removal of the visible concept banner on 2026-09-16.
Every page retains `noindex, nofollow, noarchive, nosnippet` in HTML metadata
and HTTP-header configuration. The license remains unchanged. This is still
a concept, not the client's live site.

## What it is

- **Next.js 16** (App Router), all pages statically generated
- **11 routes** — home, about, services + 4 service detail pages, industries,
  insights library, insight detail, contact
- **24 content items** — the client's own articles, reports and case studies,
  read from their live site, not invented
- **Motion** calibrated by measurement against the two reference sites the
  client chose: Kantar's restraint as the baseline (CSS, 180/320/500ms), GLG's
  accents via GSAP ScrollTrigger, and a rebuild of GLG's mega-menu using their
  own shipped configuration

## Brand

The blue `#0f67c7` is a client lock, read from their live stylesheet. Full
palette and rules in `BRAND.md`. Typography (Inter + Source Serif 4) is a
proposal, not a lock — the client locked the colour, not the typeface.

## Scroll progress

The shared layout mounts `ScrollProgress`, a React port of dydxfx's exec spine.
It shows page-wide scroll progress as `000%` through `100%` after 24px of scrolling.
Labels come from each main section's `data-exec`, accessible label, heading, or ID;
the article body explicitly uses `Reading`. Progress still updates on pages with
no identifiable sections. Route changes rebuild the labels, and content resizing
or filtering refreshes the measurement. A fixed-width caret holds the existing
DMRK D mark; the blue cell and white mark blink together using stepped timing.
Reduced motion disables the blink and leaves the D visible. There is no animated
interpolation of scroll progress. The sticky navigation
stays accessible below the panel. Colours use existing DMRK brand tokens only.

The tagline and progress strips share a fixed 32px slot, swapping by transform
after the existing 24px threshold. The sticky nav's offset stays 32px throughout;
neither strip changes the document's height. Reduced motion disables the slide.
The progress surface uses 8% DMRK paper with the reference's 7px blur and 1.25
saturation. Contrast over dark content or imagery requires rendered review.

## Known limits

- The contact form does not submit anywhere and says so on screen. There is no
  backend yet; building one is the other half of the proposed engagement.
- Hero imagery is still hot-linked from Unsplash, inherited from the live site.
- Newsletter, privacy policy and terms are marked "not in this concept".

## Run locally

```bash
npm install
npm run dev     # http://localhost:3210
```

---

© 2026 dydxfx — https://dydxfx.com · Pandit Floki <pandit@dydxfx.com>
