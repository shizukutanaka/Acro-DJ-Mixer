# ADR-0365: Every cue-point write feeds the one-level undo

## Context
Shift+Cue records `_prevCueIn` and refreshes the Cue button title;
the two waveform cue-point writes did neither — dragging the cyan
tick and right-clicking a spot on the waveform overwrote `cueIn`
with no undo record and left the tooltip showing the old time.
Right-click undo after a waveform edit restored whatever shift+Cue
last saved — skipping the actual last write — and could silently do
nothing when `_prevCueIn` was already consumed.

## Decision
- `cueInDrag` saves `_prevCueIn` on pointerdown (one record per
  gesture) and refreshes `_cueTitle()` when the drag ends.
- The waveform right-click drop saves `_prevCueIn` and refreshes
  `_cueTitle()` immediately.
- `cueDrag` (hot-cue ticks) needs none: pads already undo via
  right-click-empty-pad `_prevCue` records.

## Consequences
Right-click undo means "undo the last cue-point write" on every
path, and the tooltip names the real cue time after any write.
