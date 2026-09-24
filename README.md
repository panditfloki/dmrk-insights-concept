# DMRK Insights

Client website built by **Shwetank Pandey / dydxfx** for DMRK Insights.

**Live website:** https://dmrkinsights.com/

This public repository showcases the Next.js frontend and its integration with a separately hosted Laravel/Filament CMS. Backend source, production databases, uploaded client files and credentials are not included.

## Features

- CMS-managed pages, navigation, categories, services and industries
- Articles, reports and case studies with category and sector filtering
- Reader registration, sign-in and gated article access
- Contact enquiries routed through the backend API
- Responsive navigation, scroll progress and reduced-motion support
- DMRK favicon and shared, keyboard-accessible themed dropdowns

## Stack

Next.js 16, React 19, TypeScript, CSS and GSAP. Production runs on the client's existing AWS server. Laravel/Filament supplies content and administration at `/admin`.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3210. Without backend configuration, the frontend uses bundled public demonstration content. Reader authentication and enquiry delivery require the backend.

For an existing local backend, create `.env.local` (never commit it):

```dotenv
DMRK_API_URL=http://127.0.0.1:8091/api/v1
DMRK_REQUIRE_API=true
DMRK_PUBLIC_SITE=false
```

`DMRK_PUBLIC_SITE=true` enables the public-site mode. Local and preview builds remain non-indexable by default. AWS uses standalone output; Vercel packages Next.js directly.

## Checks

```bash
npm run typecheck
node tests/enquiries.cjs
node tests/reader-proxy.cjs
node tests/published-content.cjs
node tests/motion.cjs
npm run build
```

## Ownership

Design and implementation by dydxfx. DMRK Insights owns its name, logo and editorial material. Public visibility is for portfolio review and does not grant reuse rights. See [LICENSE](LICENSE).

## Operational limits

Password recovery requires configured email delivery on the backend. SMTP setup and inbox verification are separate from this frontend release.
