# ADR-0099: Loop beat select — arm 2/4/8/16-beat loops

## Status
Accepted (2026-10-04)

## Context
Loop arm was fixed at 4 beats; changing length needed arm-then-
halve/double after the fact. CDJs pick the loop length up front.

## Decision
A `2b/4b/8b/16b` select beside the Loop button sizes the next armed
loop (`parseFloat(loopBeats.value) * beatLen`, clamped to track
end). Gridless decks get N seconds — same multiplication, different
`beatLen`. Halve/double still rescale an armed loop as before.

## Consequences
- 4b stays default: every previous gesture is unchanged.
- An 8/16-beat loop captures full phrases for breakdown-style holds.
