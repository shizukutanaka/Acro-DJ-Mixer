# ADR-0050: Loop move — slide an armed loop by its own length

## Status
Accepted (2026-10-04)

## Context
An armed loop could be halved/doubled (ADR-0009) and persisted
(ADR-0038) but never *moved*. If the loop sits a bar off from where
the phrase actually turns, the only fix was disarm and re-arm —
losing the exact length you'd set. CDJs have LOOP MOVE for exactly
this: shift the region by its own length.

## Decision
`◂`/`▸` buttons join the `½`/`2×` controls in the loop-length group.
`moveLoop(dir)` adds `dir * len` to both bounds, clamped to
`[0, duration - len]`, then `applyLoop()` re-sends the bounds to the
engine and `tagLib` persists the new pair (ADR-0038 contract).

## Consequences
- A 4-beat loop jumps bar to bar; with halving it's an arbitrary
  grid-length slide.
- Playback continues inside the moved loop — the engine wraps on its
  own bounds, matching hardware.
- `seekTo` escape semantics are unchanged: seeking out still disarms.
