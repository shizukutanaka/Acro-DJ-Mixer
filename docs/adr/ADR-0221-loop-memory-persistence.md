# ADR-0221: Loop memory slots persist in the library record

## Context
Cues, cueIn, the armed loop, grid and key all persist per track —
but the two memory slots behind shift/alt+↺ were session-local,
so a reload threw away the only prep that can't be rebuilt by
listening once.

## Decision
Saves now `tagLib({ mem1 })` / `tagLib({ mem2 })`; `load` reads
`meta.mem1`/`meta.mem2` back into the slots alongside the other
prep. `LIB_META_KEYS` and the import whitelist carry them, so
memory slots travel in exports to another machine like the rest
of a track's prep.

## Consequences
- Loop memory joins the full set of persisted prep — a track's
  whole rehearsal state survives reloads and exports.
