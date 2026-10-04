# ADR-0089: Shift+Play — start on the next bar downbeat

## Status
Accepted (2026-10-04)

## Context
`▸bar` jumps the playhead to the next downbeat, but dropping a track
in on the one still takes two gestures (jump, then play). Phrase-
aligned entry is the most common "get it in" move in DJing.

## Decision
`Shift+Play` runs `jumpBar()` first, then `toggle()` — one click
lands the deck's next bar downbeat and starts it. While playing,
Shift is ignored (pause stays pause). No grid → plain play.

## Consequences
- Reuses `jumpBar` exactly — no new grid math, no duplication.
- Consistent with the Shift convention (alternate action of the same
  control).
