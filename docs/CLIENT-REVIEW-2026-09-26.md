# DMRK client review: 26 September 2026

Status: implemented locally; not deployed. This is implementation verification, not independent sign-off or a full backend/security audit.

## Findings and corrections

1. High: the general `.button:hover` background property overrode secondary/inverse colour variables. Production Browse insights rendered foreground and background both as rgb(9,79,158), a 1:1 ratio. Updated the shared hover rule to change the background token. Verified secondary hover #094f9e on #e7f1fb and inverse hover #08223d on #e7f1fb.
2. High: mobile navigation link styles overrode the CTA label colour. Scoped those rules to the navigation lists. Confirmed white text on #0f67c7 for the mobile CTA.
3. Requested change: stock prices started expanded. They now start collapsed with Show; no iframe is mounted before opt-in. Hide removes the iframe. CMS disabling and reader-page exclusions are preserved.
4. Requested change: category dropdown had keyboard type-ahead but no visible search. Added a focused search input above the scrolling list, substring/case-insensitive matching, empty state, Arrow/Enter selection, Escape and Tab exit, and selection preservation.
5. Medium: the mobile menu exceeded the viewport while body scrolling was locked. Added bounded internal scrolling and Escape dismissal with focus restoration.
6. Medium: valid sectors without content were ignored by URL filtering, showing all pieces. Sector options now include configured sectors. Verified Energy & Utilities shows 0 of 24 pieces; navigation to unfiltered Insights resets to 24.
7. Brand consistency: consolidated supporting colours, improved placeholders and blue-CTA supporting text, made keyboard button focus explicit, and defined disabled button treatment. Added DESIGN.md and a ten-page client PDF with palette, typography, logo, spacing, states, imagery, brand applications and contrast values.

## Checks performed

- `npm run typecheck`: passed.
- Production build with the public CMS API: passed. No new application dependencies.
- 51 linked local pages: HTTP 200, one h1 each, zero em dashes in parsed page text.
- Real pointer hover on secondary and inverse CTAs: correct computed foreground/background.
- Keyboard focus outline and Enter on bottom CTA: reached contact page.
- Desktop Services hover menu and Market Intelligence link: opened and reached intended service page.
- Category search `health` and padded uppercase `HEALTH`: Digital Health only; Enter selected it and showed 1 of 24 pieces.
- No-match search: explicit message; Escape preserved selection and focused Category.
- Mobile `market` search: six matching categories; ArrowDown/Enter selected a match; Clear filters restored full list.
- Tab left the search, closed the list, and reached the next article link.
- Contact Sector and Service controls: Healthcare and Expert Interviews selected through keyboard/click respectively. No enquiry submitted.
- 390px Insights and 360px Contact: no horizontal document overflow. Search panel fitted inside the 390px viewport. Mobile ticker expand/collapse fitted at 360px.
- Mobile menu: scrollable content height 1297px in a bounded ~733px panel; Escape closed it, restored toggle focus and released body scroll.
- Ticker: 0 frames at initial load, 1 after Show, removed after Hide.
- Reduced-motion emulation: nonessential arrow transition reduced to 0.00001s; ticker still collapsed. Emulation overrides cleared after testing.
- Browser error log during the checked flows: no errors.
- Client PDF: all ten pages rendered and visually inspected; text bounds checked. Actual website fonts and supplied SVG included.

## Limits and next step

Local rendering reads the public CMS configuration/content. No production records, enquiries, accounts or deployment were changed. SMTP delivery, account registration/reset and external market-feed accuracy were not retested. This review verifies shared frontend states and representative workflows; it is not a full accessibility certification.

Review at http://127.0.0.1:3210. Deploy only after approval of these changes. Current production is on AWS at dmrkinsights.com, not the earlier Vercel concept.

## Contact form follow-up

Removed the Sector dropdown at the client's request. Company now occupies the full form row. Backend accepts sector as nullable. TypeScript and local browser layout checks passed. Earlier Sector dropdown checks above describe the form before this removal. No enquiry was submitted and no deployment was performed.

## Reader social sign-in follow-up

Added Google and Apple buttons to login and registration. Real-account login remains pending provider configuration and an HTTPS Apple callback. Local unavailable states are explicit; email login remains available. Both enabled states were visually checked against isolated synthetic providers, including hover contrast, required consent, and 390 px mobile layout without overflow. All 28 backend authentication tests passed (169 assertions), covering new and repeat identities, signed JWT validation, replay/expiry rejection, email collisions, Apple private relay and password-session regressions. Next.js isolated callback/cookie tests and production build passed. No provider account was accessed, no production database was changed, and no deployment was performed.

## Insights filter follow-up

Replaced industry chips with one searchable Industry dropdown containing All sectors and all 11 CMS industries. Removed the Category control and its filtering logic. Retained All formats, Articles, Reports and Case studies buttons. Browser checks: BFSI yields 2 pieces, BFSI plus Reports yields 1, Clear filters restores 24, industry search and empty results work, and industry/type deep links resolve correctly after hydration. At 390 px the dropdown fits with no horizontal overflow. TypeScript and diff checks passed. Local only. This supersedes the earlier Category filter checks.
