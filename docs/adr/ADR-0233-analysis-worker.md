# ADR-0233: Run BPM/key analysis in a Web Worker

## Status
Accepted.

## Context
`estimateBpm` runs an O(frames × lags) comb scan and `estimateKey`
runs an 8192-point FFT per ~0.74 s window across the whole track —
on a long file the two block the main thread for seconds. During
that time waveforms freeze, meters stall, and a click on Play does
nothing: exactly the moment a DJ is loading the next track under
pressure. Both functions are pure — `Float32Array in, grid/key out` —
which makes them ideal Worker candidates (an audit P1 item).

## Decision
The estimators move off-main-thread via a Worker built from a Blob
URL containing their own source (`fft`, `estimateBpm`,
`estimateKey`, the K-S tables, `ANALYSIS_SR`) — the same
zero-dependency trick `WSOLA_URL` already uses for the playback
worklet, so the functions stay defined once in this file and the
worker embeds their text, never a second copy to drift.
`analyzeTrack(d)` posts the mono buffer and resolves
`{ bpm, key }` from one run — both deck readouts were fed by the
same buffer, so one `postMessage` replaces two calls. A shared
`_analysis` promise on the deck keeps `estimateBpm`/`estimateKey`
methods from spawning duplicate workers. If `Worker` is missing or
construction fails, the same functions run inline — identical
result, just synchronous, as before.

## Consequences
Loading a track no longer janks the surface during analysis.
Worker construction happens per track load — a few ms of spawn cost
against seconds of blocked UI. The estimators' output is
bit-identical to the sync path (verified); no behavioral change to
grids, keys, or tagging.

## Round
Improvement round 233 (audit P1: main-thread analysis).
