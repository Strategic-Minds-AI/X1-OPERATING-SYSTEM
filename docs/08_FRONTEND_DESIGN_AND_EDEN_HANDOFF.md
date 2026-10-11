# X1 Avatar Studio | UI design + Eden frontend handoff
## Product design
A top-tier premium creative studio, not a Base44 template: precision editorial typography, cinematic panels, usable density, rich but controlled gradients, clear hierarchy, good contrast, keyboard focus, responsive layouts and informative operational states. Visual concept uses violet/plum over obsidian and a studio-like sidebar. Current code is a frontend **preview**. Decorative CSS silhouettes are abstract demo previews, NOT actual AI avatars or Eden's approved likeness.

## Existing feature map
- /: studio shell with Overview, Avatar Studio, Video Creator, Live Sessions, Voice Lab, Agent Workspace, Asset Library and Settings.
- Avatar Studio: searchable catalog, local draft creation form, rights checkbox, identity type, local reference filename; no network upload/training.
- Video Creator: editable script notes; local-only prepare action.
- Live Sessions: intentionally blocked until authenticated real-time media + neural rendering works. No prerecorded fake head.
- Voice Lab: local voice direction; no TTS/cloning.
- Agent Workspace: state-only integration readiness; no jobs dispatched.
- API: /api/health reports scaffold; /api/avatars and /api/engineering/jobs fail 503 closed until authenticated services are implemented.

## Eden identity lock
The official selected Eden image path and identity is dictated by V2 packet in Google Drive `02_EDEN_SKYE_HEYGEN`, not by a new generated face or generic stock portrait. Claimed hash `1627b0bda51a066dc034260349ecbbb9b09a5607a32e24c5768f59141bf1b998` has NOT been independently byte-verified. No unapproved face substitute. Glowing abstract UI imagery may accompany, never stand in for verified identity.

## Next independent frontend milestone
1. Obtain/access original Eden asset; hash bytes and verify rights.
2. Implement an actual Eden profile and protected asset-signed display; no generic portrait.
3. Wire session state hooks with typed event contract `eden.session.v1` from Drive `06_RUNTIME_EVENTS_TOOLS_MEMORY_API.md`.
4. Test WebRTC on Chrome/Safari desktop/mobile and interruption controls with feature flags.
5. Compare screenshot at 1440x900 and 390x844; verify avatar image crop, reading order, captions contrast, responsive controls, keyboard and permissions.

## Desktop hierarchy
Left rail (X1 product modules), top identity/scope, hero/workspace, avatar cards, detail tray. In LIVE mode hide noncritical chrome, maximize avatar video and chat captions. 'AI-generated' disclosure and stop/mute/interrupt must be visible.

## Accessibility
Semantic headings, alt text for actual photos, aria labels, tab focus, no autoplay microphone, user gesture required for audio, reduced-motion support and caption accessibility. Contrast WCAG AA where practical. Record Playwright output; no screenshot QA performed as of initial commit.
