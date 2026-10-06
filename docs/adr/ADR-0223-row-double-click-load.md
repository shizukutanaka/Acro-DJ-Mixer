# ADR-0223: Double-click a library row loads into the free deck

## Context
Loading a row meant aiming at a 40 px `→A`/`→B` — two precise
targets for what is really one intent: "put it in the open
slot". Every track browser treats double-click as that intent.

## Decision
A `dblclick` handler on the rows container picks the stopped
deck (A when both are stopped, nothing when both are playing —
a blind replace is what the load guard exists for) and calls
the same `Library.loadInto` the buttons use, so cues, loops,
grid, key and memory all land identically.

## Consequences
- One gesture covers the common "load into the vacated deck"
  move; destructive ambiguity stays guarded.
