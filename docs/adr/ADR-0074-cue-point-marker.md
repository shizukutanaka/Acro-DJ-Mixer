# ADR-0074: Cue-in marker on the waveform

## Status
Accepted (2026-10-04)

## Context
Auto-cue (ADR-0044) skips lead-in silence and Cue returns there — but
the waveform showed every marker *except* the one Cue jumps to. With
2 s of silence up front, the landing point was invisible.

## Decision
Draw `this.cueIn` as a 2 px cyan (`#4fc3f7`) tick in `drawWave`,
before the pad-colored hot-cue ticks. Cyan is unused elsewhere so the
cue-in point can't be confused with a pad or the white playhead.

## Consequences
- Presentation only: `cueIn` is already computed at load.
- Draws whenever in view, including zoomed — rides the same `xOf`.
