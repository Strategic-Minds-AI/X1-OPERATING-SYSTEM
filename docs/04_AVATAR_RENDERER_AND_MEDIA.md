# X1 | Owned rendering and media engine design
## Context
HeyGen LiveAvatar currently offers separate real-time avatar and video studio workflows. X1 must benchmark both but not copy proprietary implementation. The first actual open-rendering candidate is MuseTalk 1.5, which publishes audio-driven lip-sync experiments reporting 30fps+ on a V100; that is NOT a measured X1 result. Pose, blink, eye contact, identity stability and full-body motion require further adapters and product validation.

## Dedicated rendering service contract
```ts
type RendererRequest = {
 tenantId:string; avatarId:string; consentReceiptId:string;
 sessionId:string; codec:"pcm16"|"opus"; sampleRate:number;
 modelVersion:string; frameRateCap:number; traceId:string;
};
interface AvatarRenderer {
 health():Promise<{available:boolean; modelVersion?:string; gpu?:string}>;
 prepare(input:RendererRequest):Promise<{renderSessionId:string; supportsInterrupt:boolean}>;
 sendAudio(renderSessionId:string,pcm:Uint8Array,timestampMs:number):Promise<void>;
 interrupt(renderSessionId:string,sequence:number):Promise<void>;
 close(renderSessionId:string):Promise<void>;
}
```
Input audio and frames have monotonic timestamp/sequence. Never buffer interrupted responses back into a speaking state. Streaming should support loss/jitter and explicit stop ACK. Use WebRTC/LiveKit transport with signed user tokens; TTS output and avatar lip input must consume the SAME utterance audio path.

## Technology candidates (no silent auto-install)
- MuseTalk 1.5, https://github.com/TMElyralab/MuseTalk - lip-sync; commercial license/dependencies need an explicit audit.
- EchoMimicV3, https://github.com/antgroup/echomimic_v3 - R&D candidate for motion; GPU latency and license review required.
- NVIDIA ACE/Audio2Face: https://docs.nvidia.com/ace/audio2face-2d-microservice/latest/index.html - governed licensing/program access.
- Consider optimized Wav2Lip-style systems only after verifying commercial weights/license and quality, not assumed.

## Pipeline
Source identity media -> rights and quality gates -> encrypted storage -> avatar preparation job -> face/motion cache -> live session token -> WebRTC audio input -> Vercel AI Gateway voice / LLM output -> renderer audio frames -> lip/head/eye composition -> streamed A/V with sync metadata -> cleanup and cost receipt.

## Test matrix
Portrait vs source video; speech languages; glasses and hairstyle; head turns; 1, 2, 5s jitter; first frame p50/p95; speech-to-voice p50/p95; frame rate; dropped frames; A/V skew; 5/20 minute calls; interruption; invalid consent; idle expiry; disconnect/reconnect; burst 5 concurrent; low bandwidth/mobile.
Fail if uncanny identity drift/incorrect voice/ghost speaking after interruption. Each result needs video+logs+source SHA+config+cost, redacted as necessary.

## Provider requirement
Select GPU service using verified cost, limits, media throughput and available terms. Railway worker may coordinate it, but do not claim a GPU is attached until demonstrated. No model inference billed or training started by this branch.
