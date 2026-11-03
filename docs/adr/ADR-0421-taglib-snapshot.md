# ADR-0421: tagLib snapshots the accumulated patch with the id promise it awaits

## Status

Accepted (2026-11-03)

## Context

`tagLib` accumulates patches into `this._libPatch`, then awaits
`this._libP` (the pending library-record id) and tags
`this._libPatch` onto the resolved record. Both fields are per-track:
`load()` resets them for the incoming track. The bug is the await in
the middle — the payload is re-read *after* the suspension point:

- tag a cue while the record is still being created (`_libP`
  pending), then load another track before it resolves;
- `load()` nulls `_libPatch` (or the new track's first tagLib fills
  it with the new track's prep);
- the awaited call resumes and writes `this._libPatch` — now null,
  or the NEW track's patch — onto the OLD record id that `_libP`
  resolved to. A no-op version bump at best; cross-track prep
  contamination at worst.

Same doctrine as the analysis guards: a value used after an await
must be captured before it.

## Decision

Snapshot `this._libPatch` into a local at accumulate time and tag
that snapshot onto whatever `libId ?? await _libP` resolves to. A
patch written before a track swap lands on the record it was written
for; a patch written after goes to the new object the swap made.

## Consequences

- The load-time cue/grid write during a slow `addFromFile` can no
  longer write the incoming track's prep onto the outgoing track's
  record, and never degrades to a `null` payload.
- No API or persistence change — the accumulate-then-tag shape is
  unchanged for the (common) un-awaited path.
