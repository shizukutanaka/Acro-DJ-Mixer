# ADR-0412: carried-gain sanitize follows the control's own range [0, 1]

## Status

Accepted (2026-10-08)

## Context

ADR-0407/0409/0411 established the `meta.gain` round-trip: write on
first compute, carry through export/import/snapshot, consume on load.
Devin Review on #417 found two edge cases in the sanitize bound:

- `meta.gain > 0` rejected `0` — but the gain slider's minimum *is* 0,
  so `deckSnap` can legitimately carry `gain: 0` (a muted deck). A
  swap or instant double of that deck hit `applyAutoGain` instead and
  the clone came back audible.
- The check accepted up to `1.5`, but the slider's maximum is `1`.
  A carried `1.4` clamped the *display* to 1 while `setGain` applied
  1.4 to `deckGain` — knob and playback disagreed, and the next
  `deckSnap` read back the clamped value.

## Decision

The sanitize is the control's own range: `0 <= meta.gain <= 1`, read
straight from the slider's `min`/`max` semantics — zero included,
above-max rejected.

- Zero is a legitimate carried value: a muted deck's snapshot must
  clone muted.
- Above-max is rejected, not clamped: falling back to `gatedGain`
  recompute is the same consumer-side policy as `meta.bpm`
  (ADR-0367) — a corrupt record degrades to recompute, never to a
  display/playback mismatch.
- Since the accepted range equals the slider range, `gainEl.value`
  can never clamp on assignment, so `setGain(mg)` always equals what
  the knob shows.

## Consequences

- Swap/doubles preserve a muted deck's mute; imports with `gain > 1`
  recompute to a sane baseline instead of playing hotter than shown.
- The bound now encodes "what the control can represent", which is
  the honest contract for a value that round-trips through a knob —
  future range changes to the slider change the sanitize in the same
  place.
