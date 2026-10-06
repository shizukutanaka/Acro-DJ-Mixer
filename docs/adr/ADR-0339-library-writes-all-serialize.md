# ADR-0339: Every library write serializes; loadInto forwards stem

## Context

Two remaining defects found auditing the instant-doubles path:

- **Un-serialized writers**: `addFromFile` did its dedupe
  read → mutate → `put` outside `Library._mutate`. The double path
  (`p.load(this._fileObj)`) re-adds the playing track's file — a tag
  written on the source deck mid-add could be clobbered by the add's
  stale read landing afterwards (ADR-0267's class). `gc` had the same
  shape, racing `padSave`'s `deleted_at` writes on clear.
- **Dropped field**: `loadInto` never forwarded `rec.stem`. ADR-0222
  saves stem mode on the record and `load()` reads `meta.stem`, but
  the only meta producer didn't pass it — a library-loaded deck
  always came back Full even after splitting the track once. (Same
  gap ADR-0336 fixed in the eject-undo snapshot; the primary path
  had it too.)

## Decision

- `addFromFile` and `gc` run their read-modify-write inside
  `this._mutate`, joining tag/remove/padSave on the `_wr` chain.
- `loadInto` passes `stem: rec.stem` in the load meta.

## Consequences

- Every record write now funnels through one serialized chain —
  no read can snapshot between another writer's read and put.
- Stem mode follows the track through the library like cueIn,
  cues, loop, and loop memories.
