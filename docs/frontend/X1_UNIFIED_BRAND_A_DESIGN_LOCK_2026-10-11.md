# X1 | Unified Brand A, cinematic corporate identity (2026-10-11)

## Goal and canonical context
The operator supplied live V2 Design A at `/v2/a` and requested unified branding for the new **X1 Operating System**. Source is `Strategic-Minds-AI/X1-OPERATING-SYSTEM`, immutable donor SHA `0b1fe2c0d0e5af90c8114ebee728c742bafac574`, branch `feature/x1-v2-unified-brand-20261011`. Design A is the approved existing cinematic source, NOT permission to redesign from scratch.

## Brand relationship
Primary product: **X1 OPERATING SYSTEM**. Parent / creator: **STRATEGIC MINDS AI**. Umbrella brand promise: **INTELLIGENCE IN MOTION**.
- Preserve EXACT existing silver emblem, chrome wordmark, approved connected Earth artwork, star field, cyan pathways, slow motion, all interactive services, Eden and phone CTAs.
- Add an X1 monogram signature visually related to the X1 Avatar Studio sidebar monogram, with a chrome/ice/indigo spectral finish. Use X1 consistently in hero, footer, navigation and service taxonomy.
- Do not apply Base44 SDK, InvokeLLM or imported runtime.
- Preserve active route behaviors, noindex on draft previews, mailto consent, phone links, mobile nav, pricing, portal and Eden.

## Shared token specification
| Token | Value | Use |
|---|---|---|
| Night | `#02050d` | Hero / backgrounds |
| X1 Chrome | `#eaf5ff` | Wordmark / primary headings |
| X1 Ice | `#9ce4ff` | Trim / keyboard focus |
| X1 Electric | `#36caff` | Active links / CTA |
| X1 Iris | `#9e9bf7` | Avatar Studio subtype accent only |
| Product fill | `rgba(6,24,44,.88)` | Glass brand badge |
| Hairline | `rgba(156,206,255,.28)` | Edges |
- Keep one primary neon CTA per focal panel. Other routes remain CTA consistent. No gratuitous gold/orange visual drift.
- Desktop `1440x900`, mobile `390x844`; keep nav buttons at least usable touch target sizing, keyboard focus and reduced motion.

## Component diff
- `V2Experience.jsx`: X1 brand lockup, user-meaningful platform module labels, X1 Avatar Studio preview link clearly marked as preview, Eden relationship and footer identity.
- `X1Brand.css`: fully scoped dark-glass premium X1 badge, pathways, precise responsive typography. No external assets.
- `tests/x1-brand.test.mjs`: compile-time guardrails and brand consistency checks.

## QA and protected release
1. Run original `npm test`, `npm run build`, CSS audit, direct route `/v2/a` and `/v2/b`, mobile nav, original logo aspect ratio, no overflow.
2. Browser walkthrough of homepage, Eden, pricing, client portal and external Preview link. Compare screenshots with original when screenshot service is available.
3. Independent validator verifies exact branch SHA and visual acceptance; do not merge or publish to production until scoped approval.

## Runtime evidence
Browser read of original `/v2/a` succeeded, original source Vite public assets confirmed. Cloud Browser screenshot capture failed `BLOB_READ_WRITE_TOKEN not set`; this is a **capture infrastructure** failure, not proof of failed layout. Screenshot comparison remains unverified. Live preview must be reviewed before approval.
