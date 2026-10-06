# ADR-0200: Shift+Cue respects Quantize

## Context
Every marker-setting gesture honours the Quantize button —
hot cues snap (ADR-0021), free-loop in/out snap (ADR-0176) —
but `Shift+Cue`, which sets the deck's cue point, stayed
freehand, so the one marker DJs rely on for a clean entry could
land off-grid while everything else landed on it.

## Decision
Route the shift+Cue write through `this.quantize(pos())` — same
one call the other gestures use, so Qtz on snaps to the nearest
grid line (buffer-clamped) and Qtz off keeps the freehand point.
`offset` and the `tagLib` persist use the snapped value, so a
cue set on the beat stays on the beat after reload.

## Consequences
- The marker grammar is now uniform: set a marker under Qtz and
  it's on the grid — cue point, hot cue, or loop edge.
- One-line change, zero new behaviour paths.
