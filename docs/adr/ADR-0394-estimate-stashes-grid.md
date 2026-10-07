# ADR-0394: The auto estimate is a grid writer too

## Context
Every synchronous grid writer (manual BPM, tap tempo, nudge, undo)
stashes `_prevGrid` so right-click on `.bpmctl` restores the grid the
last write destroyed (ADR-0292). `estimateBpm` is the one writer that
doesn't: it lands asynchronously, so a manual BPM typed while
analysis is in flight gets overwritten — and `_prevGrid` still holds
whatever the manual write stashed, i.e. the grid *before* the manual
entry. Undo then restores the wrong (older) grid and the DJ's typed
tempo is unrecoverable.

## Decision
`estimateBpm` stashes `_prevGrid` before writing, after the
`buf !== this.buffer` staleness guard, using the same
`grid ? {bpm, beatOff} : null` shape as the other writers. Undoing
now restores the manual grid the estimate clobbered — or the
no-grid state when analysis wrote into empty space.

## Consequences
One-level undo semantics stay honest across the async boundary:
"restore the grid the last write destroyed" now includes the write
the app makes on its own.
