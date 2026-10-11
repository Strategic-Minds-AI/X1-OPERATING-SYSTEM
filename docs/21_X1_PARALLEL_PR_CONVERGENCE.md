# X1 convergence matrix | 2026-10-11
This workspace has multiple **simultaneous, unmerged** X1 drafts. Independent green CI in each branch is not proof that all branches can safely merge together.

## Current verified open draft PRs
| PR | Source | Scope | Treatment |
|---|---|---|---|
| X1 OS #4 | feature/x1-avatar-studio-foundation-20261011 | Next.js multi-avatar frontend, source-controlled mission DAG, CI receipts, inactive API and renderer scaffolds | **PRESERVE** as X1 Avatar Studio lane; one review boundary |
| X1 OS #5 | feature/x1-autonomous-studio-v0-workflow-20261011 | chat-first studio kernel, visual inspector, mission/council contracts and tests | **EXTRACT/INTEGRATE** modular APIs; do not overwrite Next.js routes or duplicate controller |
| X1 OS #6 | feature/x1-universal-template-registry-20261011 | programmatic website/template catalog and source docs | **PRESERVE** as X1 Website/Growth Library module; don't indiscriminately merge all templates into avatar frontend |
| X1 OS #2/#3/#1 | alternate foundation, pricing, identity UI lanes | competing platform shell/frontends | **AUDIT/MERGE SELECTIVELY**, not blind merge |
| X1 swarm #9 | feature/x1-coding-agent-gateway-foundation-20261011 | normalized coding packet, dry-run repair loop, signed-grant branch writer, Gateway model adapter, independent CI verifier | **PRESERVE** as coding capability extension; disabled by default |
| X1 swarm #8 | feature/ephemeral-sandbox-fleet-v1 | sandbox lifecycle + isolated preview pipeline | **INTEGRATE** after compatibility tests; do not build duplicate sandbox fleet |
| X1 swarm #7 | feature/x1-autonomy-auth-failclosed-20261011 | auth failure hardening | **PRESERVE/CHERRY PICK** after independent tests, no silent supervisor overwrite |

## Safe convergence ordering
1. Independently validate X1 swarm #7 authorization fix, then #8 ephemeral sandbox fleet; reconcile with #9 contract on one **fresh feature branch** and rerun full test suite, mock lease, dry-run branch write, gateway disabled, rollback.
2. Preserve X1 #4 as visual Avatar Studio bounded context. Do not replace it with the standalone #5 node kernel; integrate kernel as independent runtime adapter through owned API only after authentication.
3. Treat #6 templates as separate module; catalog/website marketing requires Google's index-eligibility checks and no misleading local footprint.
4. Read exact PR head SHAs before every integration. Do not rely on a listed SHA after parallel agents write.
5. Obtain explicit scoped approval before default-branch merge, runtime secrets, prod schemas, production deploy, GPU usage or any source overwrite.

## One owner per subsystem
Product/UI => X1 Avatar Studio branch; execution queue/leases => X1 Supabase staging; persistent worker => existing Railway swarm; model => Vercel AI Gateway; rendering => licensed independently controlled GPU adapter; QA => separate CI/validator; research/templates => X1 Growth Engine. No duplicate cron.

## Verified vs incomplete
VERIFIED: PRs #2, #3, #4, #5, #6 and swarm PRs #7, #8, #9 existed as open drafts during readback and their trees disclosed the functionality above.
INFERRED: PR #8's sandbox lifecycle can become the coding runtime's sandbox after interface comparison.
BLOCKED: no merge compatibility run, code migration, authorized live coding harness or global task dispatch yet.
