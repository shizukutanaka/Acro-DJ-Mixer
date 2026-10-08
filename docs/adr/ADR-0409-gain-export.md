# ADR-0409: Auto-gain rides the library export/import like every other prep field

## Status
Accepted

## Context
ADR-0407 persists the computed auto-gain on the library record
(`tagLib({ gain })`). The metadata export/import carried every
restored field except it — moving a crate between machines (the
feature's purpose: analysis + prep is portable, blobs stay put)
dropped the loudness normalization and every re-load paid the
O(track) downmix again on the far side.

## Decision
- `LIB_META_KEYS` gains `'gain'` — export filters `undefined`
  keys, so records without the field export identically to before.
- The import patch loop forwards `gain` alongside
  `duration`/`bpm`/`beatOff`/`cueIn` in the finite-number group —
  same type validation, and the consumer-side sanitize
  (0 < gain ≤ 1, ADR-0367 doctrine) rejects hostile values at
  load rather than here.

## Consequences
- Crate moves keep the normalization; the far side skips the
  resample exactly like a local re-load.
- No-op for libraries that predate the field.
