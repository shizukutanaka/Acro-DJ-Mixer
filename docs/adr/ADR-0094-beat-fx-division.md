# ADR-0094: Beat FX division — echo time selectable in beats

## Status
Accepted (2026-10-04)

## Context
The beat echo was locked at 3/4 beat — one flavor only. DJM mixers
expose a BEAT parameter next to the effect: 1/4, 1/2, 3/4, 1.

## Decision
A division select (¼/½/¾/1) sits between the FX select and the level
knob. `_syncDelay` multiplies the grid beat by the chosen fraction,
so tempo changes and grid edits still re-sync — only the multiplier
became a parameter. The flanger ignores it: its character is the
2 ms comb, not a beat.

## Consequences
- Classic dotted-3/4 delay stays the default; ¼/1 give tighter or
  bar-length echoes for builds and breaks.
- Gridless decks still fall back to a fixed 0.45 s beat estimate.
