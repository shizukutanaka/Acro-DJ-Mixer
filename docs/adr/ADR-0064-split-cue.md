# ADR-0064: Split cue — PFL left ear, PGM right ear

## Status
Accepted (2026-10-04)

## Context
The phones bus blends cue and program on top of each other (ADR-0051).
Mixers that serve one-ear monitoring offer SPLIT CUE instead: PFL in
the left cup, program in the right, so one ear can track the room
while the other preps the next track.

## Decision
Two `StereoPannerNode`s already-free in the cue chain:
`cueIn → cuePan → cueDest` and `pgmSend → pgmPan → cueDest`, both
centred normally. The `Split` button (Phones row, next to `Mono`)
flips them to −1/+1. The cue meter taps `cueIn` pre-pan, so metering
is unaffected.

## Consequences
- One-ear monitoring without unplugging a cup — the booth-standard
  workflow — now works.
- Split + Cue mix combine freely: panning positions the signals,
  the mix knob still sets PGM level.
- Mixer-level state, not persisted.
