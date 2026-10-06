# ADR-0232: Strip the audio blob on soft-delete; GC legacy records at boot

## Status
Accepted.

## Context
`Library.remove` soft-deletes by stamping `deleted_at`, but the
record — including `rec.blob`, the entire audio file — stays in
IndexedDB forever. A user who curates a crate (delete what you
won't play) steadily grows storage with bytes nothing can ever read:
`loadInto` refuses deleted records, every row query filters
`!t.deleted_at`, and there is no undelete UI. Deleting a 200 MB
crate's worth of tracks freed exactly zero bytes.

## Decision
`remove()` sets `rec.blob = null` alongside `deleted_at` — the
metadata row (name, cues, play count, hash) stays tiny for soft-delete
history while the audio bytes are freed. A one-shot `Library.gc()`
runs at boot and strips blobs from records soft-deleted before this
change, so existing databases reclaim their space without a migration.

## Consequences
Deleted tracks actually stop costing storage. The blob is the only
field dropped; if an undelete feature ever lands, metadata survives
but the audio must be re-imported — acceptable, since a record whose
audio is gone is not playable anyway. `tag()` is unaffected: it is
only reachable for live records (deleted records can't sit on a
deck), so it cannot resurrect a stripped blob.

## Round
Improvement round 232 (audit P1: blob GC).
