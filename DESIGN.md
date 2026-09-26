# DMRK Insights website design system

Read alongside BRAND.md and docs/BRAND-GUIDELINES.md. The client PDF is output/pdf/DMRK-Insights-Brand-Guidelines.pdf. Source of executable tokens: app/globals.css. Primary blue #0f67c7 remains client-locked. Broader identity standards are documented for client review, not retroactively described as approved.

## Colours

Use shared tokens. Primary: --accent #0f67c7; hover: --accent-dark #094f9e; pale interaction: --accent-soft #e7f1fb; headings/dark surfaces: --navy #08223d; body: --ink #0d2238; secondary copy/placeholders: --muted #60758a; white: --paper #ffffff. Secondary surfaces and on-dark text follow the exact palette in the guide. Do not add independent component colours. Logo SVG colours remain integral to its supplied artwork.

## Buttons

Each variant owns background AND foreground through --btn-bg/--btn-fg. General hover rules change those variables, never override the background property.

| Variant | Default background / text | Hover background / text |
|---|---|---|
| Primary | #0f67c7 / #ffffff | #094f9e / #ffffff |
| Secondary | transparent / #08223d | #e7f1fb / #094f9e |
| Inverse on blue/navy | #ffffff / #08223d | #e7f1fb / #08223d |
| Disabled | #f2f7fc / #60758a | unchanged |

Use visible keyboard focus with blue outline and white separation. Disabled controls do not animate. Do not let navigation-link selectors override CTA buttons.

## Type, geometry and movement

Inter for UI/body; Source Serif 4 for display, current implementation. Preserve font fallbacks. Base spacing 4px; standard radius 8px; small 6px; feature panels 14px; buttons pill-shaped. Use current fluid type and gutters. Normal text needs 4.5:1 contrast; large text 3:1. Motion is restrained, native scrolling is preserved, and reduced-motion preferences are respected.

## Controls

Industry search belongs inside the dropdown above the scrollable list. Search is case-insensitive, matches substrings, preserves the selected value while searching, and handles no matches. Arrow keys navigate, Enter selects, Escape cancels and returns focus, Tab leaves. Reopening clears the temporary search.

Market prices start collapsed without an iframe; Show mounts the widget and Hide removes it. Keep the CMS enable/disable setting and reader-page exclusion.

Mobile navigation must scroll independently and expose a working close control. Escape closes it and restores focus. All layouts must fit narrow viewports without horizontal document overflow.

## Review gate

Test mouse hover, keyboard focus/selection, actual navigation, empty states, mobile layout and filter reset. Inspect actual computed foreground/background colours; source tokens alone are insufficient. Verify localhost before any production publication.
