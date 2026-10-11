# X1 Autonomous Build V2 | Continuous validation without duplicate runtime
**Status:** generator-scaffold on an isolated source branch, not a live signed queue dispatch. No more repeating CONTINUE *once the authorized bridge and harness are activated and proven*.

## Immediate code
- `config/mission.x1-avatar-studio.json`: ordered, dependency-aware, machine-readable ten-packet queue with verified initial frontend CI receipt and protected action holds.
- `scripts/validate-mission.mjs`: checks schema, statuses, dependency DAG, evidence and default-off execution.
- `tests/mission.test.mjs`: negative tests for cycles, unsafe activation and unexpected spend.
- `npm run test`: includes mission manifest validation and typecheck in CI.
- Existing `.github/workflows/quality.yml` validates PR source without any model API secret.
- Linked swarm PR includes `src/autobuild-mission.ts` + `src/autobuild-pipeline.ts` for bounded, dry-run analysis/independent validation/retry. Railway must reuse a single supervisor.

## Future activation sequence (gated)
1. Safe health/lease/queue canary on existing X1 Supabase staging project; verify tenant scope, exact worker and receipt.
2. Wire authenticated mission submission to existing Supabase work queue; all task IDs stable, idempotency SHA256.
3. Wire source-controlled branch authoring sandbox and Vercel AI Gateway adapter; account spend cap and credential binding approval needed.
4. Independent validator checks actual candidate SHA in separate process/identity, not in model's imagination.
5. Retry maximum three times after evidence-backed failures and store receipts. Never retry protected commands.
6. GitHub Actions/PR checks run automatically after code pushes; worker proceeds only after re-fetching CI run conclusion, then picks next authorized mission packet.
7. Production deployment and paid GPU sessions stay BLOCKED without operator's exact approval.

## Observability
Use existing X1 worker heartbeat, queue statuses, authorization receipts and failure incidents. UI Agent Workspace can show statuses when tenant-safe API binds. No second 5-minute cron created by this scaffold.

## Next concrete tasks
- 1) Authorization-scoped queue canary on staging. 2) GitHub branch writer restricted to repo/branch/paths. 3) Independent CI validator, 4) Gateway coding adapter, 5) existing Railway handler integration default-off. 
- Eden frontend: verify original portrait bytes/rights, add authentic image and accessibility, create microphone/lip-sync private stream after secure gateway and renderer binding.

## Truth
The existing CI can validate checked-in code now. **AI model-driven self-editing and continuous Railway-run coding are not yet activated.** This manifest does not silently enqueue jobs, store secrets or promise background execution by itself.
