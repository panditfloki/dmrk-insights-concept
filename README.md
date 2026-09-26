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

Open http://127.0.0.1:3210. Without backend configuration, the frontend uses bundled public demonstration content. Reader authentication and enquiry delivery require the backend.

For an existing local backend, create `.env.local` (never commit it):

```dotenv
DMRK_API_URL=http://127.0.0.1:8091/api/v1
DMRK_REQUIRE_API=true
DMRK_PUBLIC_SITE=false
DMRK_SITE_ORIGIN=http://127.0.0.1:3210
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

## Google and Apple reader sign-in

The reader login and registration pages include both providers. Buttons remain disabled until the backend reports the provider as configured. Provider status and sign-in responses are not cached. This implementation has local mock-provider coverage; real-account acceptance requires configured provider apps.

Deploy the corresponding Laravel code and the `create_website_reader_social_tables` migration together with this frontend. Existing password accounts, sessions and admin authentication remain separate. The backend stores provider/subject identities and single-use, ten-minute OAuth attempts. Matching email addresses do not silently link accounts. An existing password-account holder must use password login or recovery until an explicit account-linking flow is added.

Backend configuration is listed in `DEPLOY/backend.env.example` in the private project workspace:

- Google: `GOOGLE_READER_CLIENT_ID`, `GOOGLE_READER_CLIENT_SECRET`, `GOOGLE_READER_REDIRECT_URI`.
- Apple: `APPLE_READER_CLIENT_ID` (Services ID), `APPLE_READER_TEAM_ID`, `APPLE_READER_KEY_ID`, `APPLE_READER_PRIVATE_KEY_PATH`, `APPLE_READER_REDIRECT_URI`.
- Production callbacks: `https://dmrkinsights.com/api/readers/social/google/callback` and `https://dmrkinsights.com/api/readers/social/apple/callback`.
- Local Google callback: `http://127.0.0.1:3210/api/readers/social/google/callback`. Register it in Google Cloud and use the exact same origin in `DMRK_SITE_ORIGIN`.
- Apple requires an HTTPS domain callback, so use an approved HTTPS review environment for real-account testing. Register its Services ID against a Sign in with Apple-enabled primary App ID. Its cross-site form POST uses a short-lived Secure, HttpOnly, SameSite=None binding cookie. Reader session cookies use SameSite=Lax.
- Apple private-relay email addresses are accepted. Apple display names are not trusted from unsigned callback form data; new Apple readers receive the neutral name “Reader”. Email delivery to relay addresses requires Apple's separate sender configuration.

Provider marks retain their own identity instead of being recoloured DMRK blue. The Google mark comes from Google's official branding page, the Apple vector from Apple's web sign-in SDK, and the subsetted Google Sans font is covered by `public/auth/Google-Sans-OFL.txt`. Apple and Google button styles are isolated from the site's general CTA hover styles.

Sources: [Google OIDC](https://developers.google.com/identity/openid-connect/openid-connect), [Google button branding](https://developers.google.com/identity/branding-guidelines), [Apple authentication](https://developer.apple.com/documentation/signinwithapple/authenticating-users-with-sign-in-with-apple), [Apple web setup](https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web/).

Run `node tests/reader-social-routes.mjs` after `npm run build` for isolated Next.js callback/cookie tests. Backend coverage: `php artisan test --compact tests/Feature/WebsiteReaderSocialTest.php tests/Feature/WebsiteReaderTest.php`. Never submit test accounts to production.
