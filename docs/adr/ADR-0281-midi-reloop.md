# ADR-0281: MIDI reloop — notes 78/79

## Status
Accepted.

## Context
Hardware controllers carry a RELOOP button beside the loop section,
but the MIDI map stopped at arm (48/49) — once a loop exited, only
the mouse's ↺ button could re-enter it. Notes 78/79 sit in the free
range between the cue block (76/77, PR pending) and nothing.

## Decision
Note 78 = `deckA.reloop()`, 79 = `deckB.reloop()` — the same method
the ↺ button calls, so it re-enters the last exited loop or a saved
memory slot and no-ops cleanly when neither exists.

## Consequences
The full loop verb set (arm, reloop, roll stays mouse-only) is
reachable from a controller's transport section.

## Round
Improvement round 283.
