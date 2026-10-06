# ADR-0282: Keyboard beat jump — [ ] / - =

## Status
Accepted.

## Context
The ‹ › beat-jump buttons existed only on the pointer layer — the
keyboard map covered play, pads, sync, and loop but not the
most-used seek verb a controller/DVS DJ reaches for. `[`/`]` (deck
A) and `-`/`=` (deck B) are the unused key pairs that read as
back/forward.

## Decision
Plain key = `beatJump(±1)`, shifted = `beatJump(±4)` — the same ±1/±4
split the buttons take under shift. Shifted glyphs get their own
cases (`{` `}` `_` `+`) since `e.key` reports the shifted character.
Help overlay lists the pairs.

## Consequences
One-beat and one-bar jumps are reachable with both hands off the
mouse; no existing key moved.

## Round
Improvement round 284.
