# ADR-0103: Shift+Roll — half-beat loop roll

## Status
Accepted (2026-10-04)

## Context
Loop roll was fixed at 1 beat — the broad build effect only. A
½-beat roll is the stuttering, tighter variant DJs ride into drops.

## Decision
`startRoll(beats = 1)` takes the roll length; the Roll button passes
`e.shiftKey ? 0.5 : 1`. Everything else (saved loop restore, slip
dead-reckoning, armed-state) is unchanged — only the rolled window
scales.

## Consequences
- Same modifier convention as the rest of the deck: shift = the
  finer/faster variant.
- Half-beat rolls still snap to the grid — they quantize to the
  same downbeat math as the 1-beat roll.
