# ADR-0298: loadInto forwards the saved loop-memory slots

## Context

ADR-0221 persists the two loop-memory slots on the library record
(`mem1`/`mem2`, saved via `tagLib`, exported and imported through
`LIB_META_KEYS`) — but `loadInto` never forwarded them. `load()`
reads `meta.mem1`/`meta.mem2` and got `undefined`, so every
library reload silently dropped both saved loop memories: the
slots existed on disk yet always arrived empty on the deck.

## Decision

Add `mem1`/`mem2` to the meta `loadInto` builds from the record —
the same one-line passthrough cues, loop and grid already take.

## Consequences

- Loop memories now behave like every other saved prep: write once,
  restore on every load. No record-schema change; fields were
  already stored.
