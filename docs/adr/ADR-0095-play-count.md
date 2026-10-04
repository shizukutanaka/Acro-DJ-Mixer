# ADR-0095: Play count — `×N` badge on library rows

## Status
Accepted (2026-10-04)

## Context
The library knew which tracks had prep (⚑ cues, ∞ loop) but not
which tracks had actually been played. Digging for the next record
benefits from knowing what already got rinsed.

## Decision
`play()` increments `plays` on the track's library record once per
load (pause/resume doesn't re-count), routed through `tagLib` so it
merges with other pending patches instead of racing them. The row
prep badge gains `×N` and shows even when plays is the only mark.

## Consequences
- Auto-mix and auto-loaded tracks count too — every play flows
  through `play()`.
- `plays` is a plain record field; no schema or export-key change
  needed (it rides with the record, and would export naturally if
  added to `LIB_META_KEYS` later).
