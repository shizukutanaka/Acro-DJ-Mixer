# ADR-0334: Slice audition state is a deck field, abandoned on track swap

## Context

ADR-0209's alt+hold slice audition stored its restore point in a closure
`let _slice` shared by the deck's eight pads. Two leaks followed:

- **Track swap**: a load or eject while holding left the stale record
  live, so the release seeked the NEW track to the old track's
  position and could pause it — the same cross-track bookkeeping leak
  ADR-0328 fixed for `_slip`/`_roll`. Being a closure variable, it
  could not be cleared from `load()`/`eject()` at all.
- **Second pad**: a second pad's alt-press while one was held
  overwrote the record, losing the first pad's restore point and
  leaving its `on` lamp lit forever.

## Decision

- `_slice` becomes `this._slice` (a deck field).
- `load()` and `eject()` abandon it alongside `_slip`/`_roll`
  (ADR-0328 doctrine: a held gesture belongs to the old track), also
  unlighting the recorded pad.
- The alt-press path ignores presses while `this._slice` is already
  held — one audition's restore point can't be clobbered.

`stopPlayback` deliberately does NOT clear it: releasing after pausing
mid-hold should still snap back — pause is not a track swap.

## Consequences

- Ejecting or loading mid-slice no longer teleports the next track's
  playhead or leaves a pad lit.
- Multi-touch alt-presses on two pads can no longer corrupt the
  restore state.
