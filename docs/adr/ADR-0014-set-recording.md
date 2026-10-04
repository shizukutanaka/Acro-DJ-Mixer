# ADR-0014: Set Recording

## Status
Accepted

## Context

A DJ set you can't keep is half a product. Recording the master output
is a standard mixer feature — and we already solved the plumbing for the
cue bus (ADR-0007): `MediaStreamAudioDestinationNode` turns any Web
Audio tap into a `MediaStream`, which is exactly what `MediaRecorder`
consumes. The whole feature is graph tap + recorder + download, zero
dependencies.

What gets recorded matters: tapping `masterGain` captures the mix as
heard — crossfader, EQ, master level — but *not* the cue bus (PFL is
monitor-only by design; you don't want headphone clicks in the set).

## Decision

- `Rec` button beside `Auto`; first click starts a `MediaRecorder`
  (`.webm`/opus, 1 s chunks), second click stops and the browser
  downloads `acro-set-<timestamp>.webm`. `.on` styling while recording.
- `recDest` is a second `MediaStreamAudioDestinationNode` connected to
  `masterGain`, created lazily on first record (the click is a user
  gesture, so `audio()` may create/resume the context there).
- Object URL is revoked after 10 s; chunks are discarded on stop.

## Consequences

- Recordings are opus/webm — universal in Chrome/Firefox; Safari 17+
  handles webm playback, but `MediaRecorder` support itself is the only
  hard requirement (Safari ≥14.1 records to a different container —
  the blob type follows the browser, the filename stays `.webm` only
  where accurate; Safari would emit mp4 — acceptable, could refine
  extension from `blob.type` later if it matters).
- Stereo, ~128 kbps default bitrate — fine for set recording.

## Rejected alternatives

- WAV capture via a second worklet: lossless but huge files and another
  processor; opus is the right default.
- Recording into the library (IndexedDB): recordings aren't tracks —
  a download matches the user's mental model of "export my set".
