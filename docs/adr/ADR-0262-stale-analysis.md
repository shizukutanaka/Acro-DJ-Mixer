# ADR-0262: Stale analysis can't overwrite a newer track's grid

## Status
Accepted.

## Context
`estimateBpm`/`estimateKey` await the analysis worker, then write
`this.grid`/`this.key`, the readouts, and `tagLib` unconditionally.
Analysis can take seconds; a load that lands in between gets its
(cached or incoming) grid overwritten by the *previous* track's
result — and `tagLib` stamps the old track's bpm/key onto the new
record, poisoning the library.

## Decision
Capture `this.buffer` at call time and re-check it after the
await: a changed buffer means a newer load owns the deck, so the
stale continuation returns without writing grid, key, readouts,
or the library. Failure paths keep the same guard.

## Consequences
B's prep can no longer be clobbered by A's late-arriving
analysis; library records only ever carry their own track's
numbers. Complements the load token (ADR-0261) — that one
guards loads against loads, this guards analysis against loads.

## Round
Improvement round 262.
