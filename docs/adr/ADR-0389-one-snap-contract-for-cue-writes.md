# ADR-0389: One snap contract for cue writes

## Context
Every cue-point write snaps to the beat grid when Quantize is on —
shift+Cue, hot-cue pads, the cue-tick drag, free-loop bounds. The
waveform right-click drop was the exception: it wrote `cueIn` raw.
Its own comment claims "same write as Shift+Cue (persisted)", and
Shift+Cue quantizes — so the asymmetry was drift, not design.
With Qtz on, a right-click drop landed off-grid by up to half a
beat while an identical drag of the same marker snapped.

## Decision
The right-click drop now runs the drop position through
`this.quantize(...)` like every sibling write: Qtz on snaps to the
grid, Qtz off stays freehand — one snap contract for all cue writes.

## Consequences
Pixel-exact freehand placement remains available with Quantize
off; with it on, right-click behaves identically to dragging the
same tick.
