# ADR-0190: Drag the deck cue point on the waveform

## Context
The cyan `cueIn` tick was display-only: repositioning the deck cue
meant jogging the playhead and pressing shift+Cue at the right
moment. The tick you can see should be the tick you can move —
the same reasoning behind dragging hot-cue markers (ADR-0189).

## Decision
Pointerdown within 8 px of the cyan cue tick captures it instead of
scrubbing; the drag writes `cueIn` + `offset` live through
`quantize()` (snaps when Qtz is on), clamped inside the buffer.
Pointer-up persists via `tagLib`, identical to the shift+Cue path.

## Consequences
- Cue placement is fix-where-you-see-it on every marker type.
- No cue point set (cueIn null) falls through to plain scrubbing.
