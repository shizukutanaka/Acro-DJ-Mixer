# ADR-0411: `meta.gain` drives playback and the computed gain is persisted

## Status

Accepted (2026-10-08)

## Context

ADR-0409 put `gain` on the record, the export/import, `loadInto`, and
`deckSnap` — the whole *write* side. The *read* side never landed:
`load()` recomputed `gatedGain` unconditionally, so a carried gain
(export → import → load, snapshot → swap/doubles) was silently
discarded and ordinary records never acquired a `gain` field at all.
Devin Review on #416 flagged exactly this, plus a smaller one: the
first-run help's `try` wrapped the `localStorage.getItem` *and* the
`helpEl.hidden = false`, so a denied storage read also suppressed the
one onboarding moment.

## Decision

- `load()`: a finite `meta.gain` in (0, 1.5] wins over recompute —
  `gainEl.value = meta.gain; setGain(meta.gain)`. The downmix still
  runs for analysis either way, so the honor-the-record choice costs
  nothing and keeps one source of truth: the record's value once it
  exists.
- When no carried gain exists, `applyAutoGain` computes as before and
  the result is persisted through `tagLib({ gain })` — the same
  write-once discipline as detected keys (ADR-0004), so records gain
  an exportable `gain` field on their first load.
- Manual knob adjustments are *not* written back: deck gain is a live
  mixer control persisted per-session (ADR-0158); the record field
  stays the computed baseline, like `bpm` staying the analysis value
  even while the tempo fader moves.
- First-run help: read the flag in its own `try`; on any failure or
  absence show the card first, then attempt `setItem` — storage denial
  degrades to "shows again next time", never to "never shown".

## Consequences

- Export → import → load round-trips the loudness normalization;
  swap/doubles keep the live knob via `deckSnap.gain` → `meta.gain`.
- A hostile `gain: -5` or `gain: 1e9` fails the range check and falls
  back to recompute (same consumer-side sanitize as `meta.bpm`,
  ADR-0367).
- Records written before ADR-0407/0409 have no `gain`: they compute
  once, then carry it forward — self-healing, no migration.
