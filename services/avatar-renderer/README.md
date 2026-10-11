# X1 Avatar GPU Renderer | Standalone service scaffold
This is a transport and container **placeholder**, not neural video generation. It always returns HTTP 503 so callers never confuse a stub with genuine rendering.

## Intended contract
`POST /v1/sessions` accepts authenticated tenant-bound avatar and consent references through the owned X1 session broker. Realtime audio and video via WebRTC/LiveKit requires a separately validated gateway adapter. GPU worker should accept approved source identity, licensed weights, bounded model job, time-coded audio segments, return frame stream and tear down on interrupt / timeout.

## Production-safety gates
No public unauthenticated endpoint. Do not deploy this placeholder as production. Authenticate via service-to-service identity and allowlisted network; validate commercial model/checkpoint licenses, approved source likeness, GPU cost, output policy, rights revocation and worker teardown before activation.

Railway remains supervisor/queue, actual GPU host chosen only after verified capacity/cost. Vercel frontend must never block waiting for serverless GPU.
