# DMRK Insights — Brand Rules (client-supplied + measured)

Source of truth: the LIVE site's own `styles.css` and `dmrk-logo.svg`, pulled 2026-09-13 and
kept in `_RECON/`. Every value below was **read off the running site**, not recalled, not
sampled by eye from a screenshot.

🔒 **CLIENT LOCK: the blue stays.** His instruction — *"उसको यही blue color ही चाहिए"*. The
primary is `#0f67c7`. Do not substitute a "better" blue, do not shift it for contrast, do not
let a design tool re-derive it. If a design needs a different blue somewhere, it comes from the
ramp below or it gets asked about first.

## Colour tokens (verbatim from `:root` in the live `styles.css`)

| Token | Hex | Role on the live site |
|---|---|---|
| `--accent` | `#0f67c7` | **THE blue.** Primary actions, links, logo tile, brand mark |
| `--accent-dark` | `#094f9e` | Hover / pressed state of the primary |
| `--accent-soft` | `#e7f1fb` | Tinted fills behind accented blocks |
| `--navy` | `#08223d` | Top bar, deep sections, brand wordmark |
| `--ink` | `#0d2238` | Body text |
| `--charcoal` | `#112b42` | Secondary dark surfaces |
| `--muted` | `#60758a` | Secondary / meta text |
| `--line` | `#d4e3ef` | Borders, rules, card edges |
| `--paper` | `#ffffff` | Page base |
| `--soft` | `#f2f7fc` | Section wash |
| `--surface-blue` | `#f7fbff` | Lightest blue wash |
| `--blue-soft` | `#e8f2fb` | Alternate tint |
| `--gold` | `#5aa7e8` | ⚠️ misnamed — it is a light blue, not gold. Do not "fix" it to a
  gold; fix the NAME if the variables are rewritten |

Other live values worth carrying: gradient bar `linear-gradient(90deg, #08223d, #0f3f68)`,
shadow `0 18px 50px rgba(8,34,61,0.13)`, error red `#bd1e1e`, topbar link `#b9ead8`.

Logo (`dmrk-logo.svg`, 64×64, rx 12): tile `#0f67c7`, glyph `#fff`, ghost letters `#d9ecff` at
0.55 opacity. It is a plain SVG with no wordmark — there is no separate logotype file on the site.

## Measured contrast (WCAG 2.1, computed not estimated)
- `#0f67c7` on white — **5.55:1** ✅ AA for normal text, ❌ AAA
- `#094f9e` on white — **8.00:1** ✅ AAA
- `#0d2238` / `#08223d` on white — **16.1:1** ✅ AAA
- `#60758a` on white — **4.76:1** ✅ AA normal text, ❌ AA for small/light weights in practice
- `#5aa7e8` on white — **2.58:1** ❌ fails AA. Decorative only, never text, never an icon that
  carries meaning
- White on `#0f67c7` — 5.55:1 ✅ AA — so white-on-blue buttons are safe

## Typography — NOT locked, and currently a default rather than a decision
The live CSS declares exactly two families: `Arial, Helvetica, sans-serif` for body and
`Georgia, "Times New Roman", serif` for display. No webfont is loaded anywhere. This is the
cheapest visible upgrade on the whole site — but the client locked the COLOUR, not the type, so
raise it as its own question instead of changing it quietly.

Geometry in use: `border-radius` 8px dominant (27 uses), 999px for pills, 6–7px for small
controls. Keep the 8px rhythm unless the redesign is explicitly signed off.

## Standing rules for anyone building here
1. Read this file before writing markup, CSS, or a design brief. Colours never come from memory.
2. `#0f67c7` is the client's instruction, not a preference. Any deviation is a question, never a
   change.
3. When in doubt about a value, open `_RECON/styles.css` — the running site is the referee.
