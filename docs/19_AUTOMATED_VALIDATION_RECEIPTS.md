# X1 CI receipt automation
Every matching GitHub PR runs TypeScript, unit/architecture/mission validation and Next.js production build. On pass or failure, `.github/workflows/quality.yml` uses `scripts/emit-ci-receipt.mjs` to write a machine-readable evidence document bound to commit SHA + run ID, then uploads a 30-day artifact.

Receipt states indicate **GitHub CI only**. The independent X1 coding verifier must refetch GitHub source SHA, workflow name, run conclusion and artifact before marking a task. A builder cannot assert its own success based on generated text. CI passing does not bypass production release approval, biometric consent, streaming GPU tests, browser QA, RLS or media sync tests.

Trigger: PR file changes or manual workflow_dispatch. No new hourly/5-minute cron; the preexisting Railway X1 supervisor remains runtime authority. Source and CI artifact can be retrieved across conversations through GitHub.
