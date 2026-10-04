# ADR-0033: Library Sort

## Status
Accepted

## Context

ADR-0032 solved find-by-name, but browsing tasks — "something near
this tempo", "everything in 8A" — still meant scanning an
`updated_at`-ordered list. The columns needed for those questions
(BPM, key) are already displayed; the missing piece was ordering.

## Decision

- A sort `<select>` beside the filter: `Recent` (existing
  `updated_at` order), `Name` (localeCompare), `BPM` (numeric),
  `Key` (Camelot order — `num*2 + letter` groups harmonic families
  together).
- Applied in `renderLibrary` after filtering — sort and filter
  compose.

## Consequences

- Four browse modes cover the real questions; ~10 lines of sorting,
  no schema change.
- Unknown values (`—` rows) group at the top on BPM/Key sorts.

## Rejected alternatives

- Clickable column headers with direction toggle: more state and UI
  than the data size justifies; the select is one control, four
  obvious orders.
- Persisting the sort preference: per-session state suffices —
  sorting is a browsing act, not a preference.
