# X1 | Infrastructure inventory and provisioning plan
## Verified reuse (read only)
| Provider | Current | Action |
| --- | --- | --- |
| GitHub | `Strategic-Minds-AI/X1-OPERATING-SYSTEM` (main initially README only) | build this feature branch; draft PR |
| Supabase | `X1 AI Hub Staging` `uvdkzsbjackpjvpoxtyk` | tenant-bound data adapter after security review |
| Supabase | `X1 AI Hub` `vgsmyhqqtkkluhypxyua` | source audit only; NEVER migrate/change prod by inference |
| Railway | `X1 AI Hub Swarm Preview` `f442cf0a-7275-4c2b-bf73-2dda4254e002` | reuse preview worker; no second heartbeat |
| Railway | `x1-swarm-preview`, service `b9c79ead-1edc-44b9-9823-98d37b20399e` | audit runtime and auth; new tool capability needs signed scope |
| Railway | `project-zero-control-plane-preview` `22cfb464-605d-407c-a76f-9be1e0eaf68a` | preserve |
| Vercel | team `team_aFdds8lsbHMwe2ip4aQdbQ3d` | preview-capable identity |
| Vercel | `x1-smai-v2-frontend-preview` `prj_zIyHERu9LRPkmiGFUUHvie8Jzof1` | donor/avoid unapproved overwrite |
| Eden | `Strategic-Minds/EDENSKYESTUDIOS` | source/character API donor; preserve commerce routes |

## New app provisioning sequence
1. Confirm main/feature Git authority; CI/test on source branch.
2. Use existing Vercel team. Create/connect a distinct `x1-avatar-studio` project only when Git source, project root and permitted preview route are validated; no implicit production-public release. The existing X1 V2 preview is not to be repointed without explicit approval.
3. Bind staging Supabase with server-scoped credentials via provider secret manager *only after scoped approval* and tenant/RLS tests; no direct DB SQL migration before reviewed additive plan.
4. Reuse existing Railway worker and semaphore/idempotent job queue. Add specialist code-gateway capability in existing worker repository via separate branch/review. GPU compute decision requires verified vendor, terms and spending approval.
5. Validate first no-cost stub endpoints, then staging model canary, then consented real media.
6. Independent test, source SHA, auth, costs, rollback, production gate.

## Env contract (names only)
`NEXT_PUBLIC_X1_API_BASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `X1_GATEWAY_API_KEY`, `X1_RAILWAY_WORKER_URL`, `X1_RENDERER_URL`, `X1_WEBRTC_SIGNALING_URL`, `X1_APPROVAL_SERVICE_URL`.
Do not paste values into ChatGPT or GitHub. Use Vercel/Railway/Supabase vault-bound deployment secrets, approved by Guardian.

## Provisioning receipt
Resource reuse vs creation; exact owner/team; project ID; DNS/prod exposure; billing implications; deploy SHA; rollback; security evidence. No evidence means `NOT VERIFIED`, not `READY`.
