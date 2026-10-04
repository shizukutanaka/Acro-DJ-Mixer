# ADR-0017: Pitch Bend

## Status
Accepted

## Context

Sync (ADR-0002) gets tempos matched, but drift correction in a live set
is a *manual feel* operation: hold the deck a touch faster/slower until
the grids realign. Every CDJ exposes this as jog/plate touch; every DJM
era mixer as ±bend buttons. Ours had no transient tempo control —
only the fader, which is for *setting* tempo, not *riding* it.

## Decision

- `−`/`+` buttons on the tempo row: `pointerdown` multiplies the engine
  rate by 0.95/1.05, `pointerup`/`leave`/`cancel` restores. `.on` state
  while held.
- `bendMul` lives on the deck and is applied inside `setRate`
  (`eff = r * bendMul`), so every rate path — slider, sync, bend — goes
  through one place and the slider keeps the *base* tempo.
- `pos()` multiplies by `bendMul` too. Without that, release would
  rebase `offset` from a playhead that never counted the bend — a
  position revert of up to ~5 % of hold time, audible as a tiny seek
  glitch.

## Consequences

- Sync while the *other* deck is bent reads `other.rate` (base tempo)
  — correct: you sync to the set tempo, not to someone's finger.
- Biquad/WSOLA/BufferSource engines all honour the eff rate uniformly.

## Rejected alternatives

- Proportional bend (bend amount scales with how long you hold): real
  platters do this via torque, but a fixed ±5 % matches the classic
  bend buttons and keeps the gesture predictable.
- Bending the slider itself (moving `this.rate`): loses the base
  tempo and fights with the user's hand on the fader.
