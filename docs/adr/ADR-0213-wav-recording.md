# ADR-0213: Alt+Rec records a lossless WAV take

## Context
Set recording always produced opus-in-webm — fine for replay,
lossy for anything else (a take you want to master or share as
an archive should not start from a lossy transcode). Browsers
don't offer PCM to MediaRecorder, so webm is the only direct
capture format.

## Decision
`Alt`+Rec flags the take `recWav`; on stop the webm is decoded
(`decodeAudioData` reads opus fine) and re-encoded to 16-bit
interleaved PCM by `bufToWav`, which is what downloads and lands
in the library. Decode failure falls back to the webm rather
than losing the take. The button shows "Rec WAV" so the take's
format is visible while it runs.

## Consequences
- One modifier separates "replay material" from "archival take"
  with no extra UI surface.
- A long set doubles memory briefly at stop (webm + decode +
  WAV) — acceptable for a deliberate lossless take.
