# ADR-0021: Hot-Cue Quantize

## Status
Accepted

## Context

Hot cues (ADR-0010) recorded the raw `pos()` — a click lands wherever
the finger was, typically tens of ms off the grid. Every hardware
deck has QUANTIZE for exactly this: cue points snap to the beat grid
so a pad hit lands musically, not "close enough".

## Decision

- `Deck.quantize(t)` — snap to the nearest grid beat:
  `beatOff + round((t - beatOff) / beat) * beat`, clamped to the
  track. `padCue` records `quantize(pos())`.
- No grid → raw time (same fallback contract as `beatJump`'s 1 s step,
  ADR-0012).
- Always-on, no toggle — quantize is the behaviour users reach for
  first; an off-grid pad is still reachable by clearing and re-
  recording on a grid-less track, and a manual-mode toggle is the
  kind of preference creep YAGNI excludes.

## Consequences

- Cue ticks in `drawWave` now align with the grid ticks — the pad
  marker *is* the beat marker.
- Persistence unchanged: the snapped value is what `tagLib` saves, so
  reloaded cues stay quantized (as loaded meta bypasses re-record).

## Rejected alternatives

- A QUANTIZE toggle button: adds UI state for a behaviour that's the
  default on every deck it appears on; revisit only if a use case for
  off-grid cues appears.
- Quantizing on *jump* instead of record: stores the sloppy value
  forever and fixes it late; snapping at write is simpler and makes
  the stored data correct.
