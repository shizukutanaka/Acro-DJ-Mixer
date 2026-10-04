# ADR-0055: Quantize on/off

## Status
Accepted (2026-10-04)

## Context
Hot cues snapped to the grid unconditionally since ADR-0021, and loops
since ADR-0006. That's the right default — but freehand points are
legitimate too (off-grid hits, deliberate syncopation, damaged
grids). Hardware treats snapping as a mode, not a law: QUANTIZE is a
button.

## Decision
A global `quantizeOn` flag (default true — current behaviour) behind a
`Qtz` button on the crossfader row next to `Rev`. When off:

- `quantize()` returns the raw time → hot cues land where pressed.
- `toggleLoop()` uses `pos()` as the loop start directly (the 4-beat
  length still comes from the grid — QUANTIZE on hardware governs the
  *in point*, not the length).

Global rather than per-deck: it's a mixing mode, and it sits beside
the other mixer-level toggles (curve, Rev).

## Consequences
- Freehand cue points and off-grid loops are possible again without
  removing the snap that makes grid use safe.
- State is not persisted; defaults to on, the safe mode.
