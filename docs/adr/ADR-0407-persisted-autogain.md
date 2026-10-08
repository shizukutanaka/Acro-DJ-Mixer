# ADR-0407: Auto-gain persists on the record — re-loads skip the O(track) downmix

## Status
Accepted

## Context
`load()` ran `monoResample(buf)` unconditionally — an O(track)
downmix — to feed `applyAutoGain`, even when the library record
carried fully cached analysis (`bpm`/`beatOff`/`key` made the
estimators free). A cached library load still paid the full resample
just to re-derive a loudness number that can't change for the same
audio. This was audit weakness #33.

## Decision
- After computing auto-gain, `tagLib({ gain })` persists the clamped
  value on the record (first write only — additive patch in the
  `_wr` chain, tolerant reads for older records).
- `load()` sanitizes `meta.gain` (finite, 0 < g ≤ 1) and applies it
  directly, leaving the downmix `mono` lazy: it's built only when
  the record lacks `gain`, or lacks `bpm` and the estimators still
  need it.
- `loadInto` forwards `rec.gain` like every other restored field.
- `deckSnap` carries `gain: +d.gainEl.value` — a double or swap must
  sound identical anyway, so the live trim is the right value, and
  the clone skips the resample too.

## Consequences
- Cached library loads no longer decode-and-downmix the whole track
  for gain; doubles/swaps skip it as a bonus.
- `meta.gain` is sanitized like every foreign meta field (ADR-0367
  parity): anything outside (0, 1] falls back to computing.
- Verified: `applyAutoGain` not called when `meta.gain` present
  (0 calls), called exactly once when absent.
