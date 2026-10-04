# ADR-0003: Key Lock via WSOLA in an AudioWorklet

## Status
Accepted

## Context

Round 2 shipped tempo-sync: `AudioBufferSourceNode.playbackRate` changes both
tempo *and* pitch (varispeed). At +16 % tempo a track in A minor sounds a
minor third sharp — unusable for harmonic mixing. The next P1 is
**key lock** (master tempo): change tempo while preserving pitch.

First-principles constraint: a browser page has no DSP library. The options:

1. **Phase vocoder** — FFT per frame, phase unwrap, resynthesize. High
   quality on polyphonic material but ~3x the code, transient smearing, and
   still needs a transient detector for DJ use.
2. **TD-PSOLA** — pitch-synchronous overlap-add; needs a reliable pitch
   tracker (fails on percussion/complex mixes).
3. **WSOLA** (Verhelst & Roelands 1993) — waveform-similarity OLA: emit a
   fixed synthesis hop, search ±D around the nominal input position for the
   window maximizing cross-correlation, crossfade. No pitch tracking,
   O(W·D) per frame, proven in production DJ/streaming stacks (SoundTouch).
4. **External library** (rubberband-wasm, soundtouchjs) — adds a dependency
   and a build step, violating the zero-dep constraint of ADR-0001.

## Decision

WSOLA, implemented inline as an `AudioWorkletProcessor` (~60 lines), with
the **entire decoded buffer transferred into the processor** at load time:

- Window `W` = 2048 (~46 ms @ 44.1 kHz), synthesis hop `H` = 512 (75 %
  overlap), similarity search radius `D` = 256 (~±5.8 ms).
- Each output frame emits `H` samples while the read position advances
  `H·rate`, so content runs at `rate`× with pitch preserved by the OLA.
- Hann window normalized ×0.5 so the 4-way overlap sums to unity gain.
- Correlation search steps by 4 samples (~0.1 ms resolution — below the
  ~12 ms beat-grid resolution already accepted in ADR-0002) and prefers
  smaller displacement on ties, keeping the search drift-free.
- Key lock off → linear-interpolated passthrough at `rate`, bit-comparable
  to the old `playbackRate` path.
- `pos` messages every ~86 ms keep the UI playhead/beats-per-position in
  sync; `seek`/`rate`/`keylock`/`play`/`pause` are port messages.

The worklet module is delivered as a `blob:` URL generated from a template
literal — still zero files beyond `index.html`.

## Dual-engine constraint (verified)

`file://` pages run on an opaque origin; Chrome/Safari reject worklet module
loads (`blob:null ... was blocked`). Therefore the deck runs one of two
engines chosen at first load:

- **worklet** — full features incl. key lock (requires http(s)).
- **buffer** — `AudioBufferSourceNode.playbackRate`, identical to rounds
  1–2; key-lock button is disabled with a tooltip explaining the `http://`
  requirement. `file://` playback keeps working.

## Consequences

- Whole-buffer residence costs one extra copy of the decoded audio per deck
  (~2 MB/min stereo) — acceptable; the ArrayBuffers are *transferred*, not
  cloned, so the main thread copy is freed.
- WSOLA's single-periodicity assumption smears polyphonic onsets slightly
  at extreme rates (>±20 %). Within the hardware-standard ±16 % range the
  artifacts are comparable to entry-level DJ gear.
- No streaming input yet — a future stems/live-input feature needs the
  chunked-input variant (input FIFO + latency) noted in the code comment.

## Rejected alternatives

- rubberband-wasm / soundtouchjs: external dependency + build step.
- Phase vocoder: 3x code, transient smearing, needs transient detection.
- TD-PSOLA: needs a pitch tracker; fragile on percussion.
