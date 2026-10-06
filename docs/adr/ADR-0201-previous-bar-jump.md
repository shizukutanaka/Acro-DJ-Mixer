# ADR-0201: Shift+▸bar jumps to the previous bar

## Context
`▸bar` only moved forward — land on the next downbeat. Overshot
a section and wanted to re-drop it? Back up meant a 4-beat beat-
jump (shift+−1b) or a waveform drag — several gestures for one
"back to the last one".

## Decision
`jumpBar` takes a direction: `dir=-1` targets
`floor(pos/barLen) - 1`, i.e. one full bar back from the current
bar, clamped to track start. `Shift+▸bar` invokes it; plain click
and the shift+Play bar-snap (ADR-0089) keep the forward default.
Same seek path, same guards — direction is the only new input.

## Consequences
- The bar jump is now bidirectional: forward to land, back to
  re-drop — matching the ±-symmetry every other jump has.
- No-grid decks still no-op; track start clamps to 0.
