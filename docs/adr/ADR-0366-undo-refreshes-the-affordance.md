# ADR-0366: An undo refreshes the affordance it restores

## Context
The right-click loop-memory undo (`_prevLoopMem`) restored the slot
and persisted it, but never refreshed `_memTitle()` — the Reloop
tooltip kept advertising the memory region that had just been
un-saved. Both save paths call `_memTitle()`; the restore path was
the odd one out (same class as ADR-0344/ADR-0365: a write that
leaves the tooltip lying about what it will do).

## Decision
Call `_memTitle()` after the slot restore — one line inside the
existing undo handler.

## Consequences
After an undo the title names the slot that is actually armed, on
both memory banks and on cleared-slot restores.
