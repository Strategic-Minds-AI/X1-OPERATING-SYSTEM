# X1 | Executive self-build demonstration

**Audience:** Strategic Minds AI / XPS leadership. **Target demonstration:** October 13, 2026.
**Canonical repo:** private `Strategic-Minds-AI/X1-OPERATING-SYSTEM`
**Branch:** `feature/x1-self-build-canary-20261011` (DRAFT, not merged).
**Original website reference remains visually locked and unchanged:** https://website-launch-engine-xps.vercel.app/

## Demo in under five minutes

1. **Show X1 Studio:** On an authorized development checkout, run `npm run studio`, then open `http://127.0.0.1:4391/studio`. Private local HTTP only.
2. **Give it an instruction:** Type “Build a premium client CRM dashboard with working lead management, search and analytics.” X1 drafts the mission and recommends a reusable template from the installed 97-document library. This general mission is **not dispatched** to a real LLM coding worker.
3. **Click “Build CRM canary”:** The bounded deterministic template compiler generates real HTML/CSS/JavaScript + README and SHA-256 manifest under `out/canary-*/`, performs Node syntax checks and local static preflight, and loads its actual app in the right preview pane. **Honest capability:** source generation works for this approved synthetic CRM template only.
4. **Show functional software:** Click Lead inbox, search Harborview, filter Qualified, add invented “Synthetic Canary Co”, advance its status, export CSV and reset demo. All data is fake and stays in this browser.
5. **Show independent proof:** The GitHub self-build CI builds the app in one ephemeral runner, downloads the emitted source into a separate runner, rechecks exact file hashes, policy and Node syntax, exercises 14 application interactions in headless Chromium and saves desktop (1440×900) and mobile (390×844) screenshots. Inspect the final run's **x1-canary-source** and **x1-canary-independent-qa** artifact ZIPs.

## QA evidence and status

- Latest passing proof must match the exact commit shown on the pull request and CI. Do not reuse evidence from earlier commits as acceptance for a later SHA.
- Source syntax, API and existing X1 Studio regression tests must pass.
- Independent static verifier: 23 checks, separate runner, hashed files and release locks.
- Browser proof: 14 deterministic functional DOM interactions on real generated app in headless Chromium plus two viewport screenshots.
- Screenshots are **not approved visual parity** and scripts are **not tenant RLS/security compliance tests**.
- Static demonstration is **not** general autonomous AI coding. No GPT-to-X1 authenticated durable worker dispatch, multi-sandbox coding or Manus parity yet.

## What this specifically demonstrates
An original premium, responsive application source produced from X1's versioned template; a working browser-based CRM simulation; repeatable CI compilation; bounded repair/test path and **real independent evidence**. Differentiate this from a slideshow or static mockup.

## Critical remaining work (P0)
1. Resolve the duplicate active `sm-estate-reconciler` containers and prove a single authoritative queue lease.
2. Authenticate local X1 API/tenant scope before exposing any remote chatbot command endpoint.
3. Bind a real isolated sandbox coding agent to the existing queue, with approved Vercel AI Gateway budget and model routing.
4. Implement durable checkpoints, workspace isolation, file diffs, test-and-repair cycles and independent cross-tenant QA.
5. Publish a protected nonproduction preview URL **only after scoped approval and accurate cost/visibility review**.
6. Validate approved Website Launch Engine pixel parity separately; don't replace its public website.

## Release gates
NO `main` merge, production deploy, DNS, secrets, permissions, production DB/RLS changes, paid provisioning, customer calls/email/SMS/social or production indexing from this canary. The 100 service candidates remain research only; Google mass doorway pages are prohibited.

**The presentation is a verified foundation for the autonomous coding system, not a finished autonomous Manus replacement.**
