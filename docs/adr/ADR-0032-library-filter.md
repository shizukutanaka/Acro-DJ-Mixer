# ADR-0032: Library Filter

## Status
Accepted

## Context

The library is an append-only list sorted by `updated_at` — fine for a
handful of tracks, but it grows monotonically (every load is persisted,
ADR-0008) and there was no way to find a track but scrolling.
"Pick the next record in 3 seconds" is the core library interaction.

## Decision

- A text input above the rows: `libQuery` substring (case-insensitive)
  against track names, applied inside `renderLibrary` — the existing
  sort and harmonic-fit scoring run on the filtered set, so nothing
  else changes.
- Empty-filtered state says "No tracks match." instead of the
  first-run placeholder (a library that exists but has no match).

## Consequences

- Instant re-render per keystroke — the row count is bounded by the
  library size (hundreds at most), no debounce needed.
- No schema change; purely presentational.

## Rejected alternatives

- Sort columns / multi-field search: premature — name is what DJs
  recall first; BPM/key are already columns and the fit-dot already
  surfaces compatible tracks.
- Debounced input: sub-millisecond filter on this data size; the
  simpler `input` handler is correct.
