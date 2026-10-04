# ADR-0011: Library Harmonic-Fit Highlighting

## Status
Accepted

## Context

The library (ADR-0008) stores BPM and Camelot key per track, and the
decks already compute harmonic compatibility (ADR-0004). The
recommendation roadmap item reduces to: given what's loaded, which
library rows will mix well? Hardware tools answer with colored rows;
we already own both inputs, so the recommendation layer is a scoring
render over existing data — no new subsystem.

Two compatibility axes, both already validated elsewhere in the app:

- **Tempo**: the slave deck's ±16% slider is the hard bound (Sync clamps
  there), so a row fits when `t.bpm / deck.bpm ∈ [0.84, 1.16]`.
- **Key**: `harmonic()` — same code, relative major/minor, ±1 same
  letter.

## Decision

- `renderLibrary` scores each row against every deck that has both a
  `grid` and a `key`; a hit adds `.fit` (green name + ● marker) and a
  title naming the deck it fits.
- `refreshKey()` re-renders the library — key landings (fresh analysis
  or cached meta) are the only events that change fit.

**Bug found and fixed while wiring this up**: `tagLib` issued
`Library.tag` per analysis result — `tag` is get→merge→put
read-modify-write, so the BPM tag (landing while `_libP` was still
pending) and the key tag raced; the last writer dropped the other's
patch (`bpm` silently missing from records). `tagLib` now accumulates a
per-deck `_libPatch` and always writes the cumulative merge — the last
write carries every field regardless of ordering.

## Consequences

- A track trivially fits itself when loaded (same key, ratio 1) — the
  green row confirms the deck state at a glance.
- Tempo-incompatible harmonics are hidden deliberately: a key-match at
  2× BPM is out of sync range, not a real recommendation.
- Zero new UI surface beyond a color + marker.

## Rejected alternatives

- Scoring/sorting rows by "fitness": hides rows, defeats scanning —
  highlighting keeps the list stable.
- Key-only fit (ignore tempo): recommends unmixable tracks.
