# X1 Recursive Auto-Complete

Use the existing verified X1 supervisor, queues, workers and development branches. Convert each authorized mission to a durable typed task with an idempotency key, bounded lease, acceptance tests, retry budget, source SHA and rollback reference.

Execution cycle: discover -> dispatch -> build -> test -> diagnose -> repair -> harden -> optimize -> independently validate -> complete. Repeat only eligible failed checks, maximum three distinct repairs per defect, and use existing durable reconciliation workers to resume. Never add another heartbeat. Reuse current templates and agents.

Require a worker-generated GitHub commit, passing tests, Vercel Preview, and Guardian receipt all linked to the same mission before declaring completion. Keep ChatGPT and Admin on one authenticated mission endpoint. Never bypass permissions or protected approvals, touch production without explicit authorization, or claim permanent background execution without worker receipts.

On every cycle record mission ID, source SHA, worker identity, lease, test results, deployment and Guardian receipt. If blocked, continue independent safe tasks and state exact blocker and next action.