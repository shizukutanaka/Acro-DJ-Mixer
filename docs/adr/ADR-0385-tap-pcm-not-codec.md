# ADR-0385: Lossless takes tap PCM, not a codec round-trip

## Context
alt+Rec was sold as a "lossless take" but ran master audio through
MediaRecorder — Opus or AAC — then decoded the lossy file and
re-wrapped it as WAV. The output was a lossless container of an
already-lossy signal: the feature's promise contradicted its
implementation.

## Decision
A second processor in the deck worklet module (`rectap`) is a
passive PCM tap: it copies every input frame to the main thread
through `port.postMessage`. alt+Rec now connects
`limiter -> rectap -> zero-gain sink` (the sink exists only so the
graph pulls `process()`) and accumulates Float32 stereo frames;
stop interleaves them through the existing `bufToWav`. The tap
sits at the same point `recDest` taps — post-limiter — so what
you hear is literally what you record.

Pause (shift+Rec) drops frames while `recPcm.paused` — same
semantics as `recorder.pause()`. If `addModule`/`AudioWorkletNode`
fails, the take falls back to the encoded path with a status note
rather than failing silently.

## Consequences
Memory: ~21 MB per stereo minute at 48 kHz — bounded by take
length, comparable to a decoded deck buffer. The MediaRecorder
path is unchanged for default takes; `finishTake` now shares the
download + library-row tail between both engines.
