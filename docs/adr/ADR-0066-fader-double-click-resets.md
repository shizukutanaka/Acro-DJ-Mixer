# ADR-0066: Double-click resets on the remaining faders

## Status
Accepted (2026-10-04)

## Context
Double-click-to-default became the house reset gesture (EQ ADR-0005,
filter ADR-0016, echo ADR-0041, tempo ADR-0062) — but the three
faders a DJ rides most had no reset: deck Gain, the crossfader, and
Master. A scrambled crossfader is also a silent-gig hazard — fast
centre is a safety feature, not a nicety.

## Decision
`dblclick` handlers: deck Gain → 1.0 (unity), crossfader → 0.5 through
`applyCrossfade()` (curve-aware), Master → 0.9 (the markup default) via
a synthetic `input` event so the readout and `masterGain` update on the
existing path. Input titles document the gesture.

## Consequences
- Every fader resets the same way; no new controls.
- Gain reset deliberately returns to unity, not the auto-gain value —
  it's a manual override, and the normalizer re-runs on next load.
