# ADR-0312: Deleting a library track clears the deck's link to it

## Context

`Library.remove()` soft-deleted the record but left a loaded deck's
`libId` pointing at it. Two broken promises followed: eject's
right-click undo stashed the id for a `loadInto` that `deleted_at`
silently refuses — the restore gesture did nothing — and `tagLib`
kept writing prep (cues, grid, loops) into a dead row the UI would
never show.

## Decision

On remove, any deck holding that `libId` drops to `null`. The deck
keeps playing (its buffer is decoded); it simply takes the same
posture as a file-loaded track — no library link, no library
restore, no library prep writes.

## Consequences

- Undo and prep-write semantics stay consistent with what the UI
  promises: a deleted track is gone everywhere a gesture could
  reach it.
