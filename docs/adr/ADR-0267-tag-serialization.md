# ADR-0267: Library mutations serialize, never interleave

## Status
Accepted.

## Context
`Library.tag`/`remove` are get → merge → put — read-modify-write
with no ordering. Two writers on the same record race: the later
`put` resurrects a stale copy of fields it never touched, silently
deleting the earlier writer's patch. A track on both decks makes
this reachable — one deck's `plays` increment racing the other's
`cues` write loses one of them. `tagLib`'s `_libPatch` accumulation
only protects patches from the *same* deck.

## Decision
Chain every mutation through `Library._wr`, a single promise:
`tag` and `remove` enqueue behind it, so reads and writes can't
interleave. A failed write logs and releases the chain — one bad
mutation must not stall the queue.

## Consequences
Concurrent prep writes (cues, plays, key, loop, bpm) can no longer
eat each other, whether they come from the same deck or both decks
sharing a record.

## Round
Improvement round 267.
