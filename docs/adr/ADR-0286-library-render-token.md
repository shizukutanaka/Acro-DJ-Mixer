# ADR-0286: Library renders carry a recency token

## Status
Accepted.

## Context
`renderLibrary()` awaits `Library.all()` before painting, so two
overlapping calls race: a slow first render can finish after a
newer one and paint stale rows — e.g. a just-deleted track's row
resurrecting until the next render. Same interleave class as the
deck-load token (ADR-0261).

## Decision
A monotonically increasing `libSeq` stamps each call; after the
await, a render whose `seq` is no longer latest returns without
touching `innerHTML`.

## Consequences
Row paints are strictly ordered by call order — the newest
invocation always wins, matching the rest of the async-state
doctrine.

## Round
Improvement round 288.
