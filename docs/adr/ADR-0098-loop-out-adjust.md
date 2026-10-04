# ADR-0098: Alt+‹loop› — loop out-point adjust

## Status
Accepted (2026-10-04)

## Context
ADR-0096 let `Shift+‹loop›` trim the in-point; a loop that ends one
beat too long (or short) still needed a re-arm. CDJ's LOOP OUT
ADJUST is the exit-side mirror.

## Decision
`Alt` (Option) on the same move buttons slides the out-point one
beat, clamped to `[start + min, duration]` — the shared
`loopMove(e, dir)` dispatcher routes plain → move, shift →
in-point, alt → out-point. Same step source, `applyLoop()` live
update, and `tagLib` persistence as the in-point path.

## Consequences
- In/out/move are now all reachable from the two buttons with a
  consistent modifier scheme: plain moves both, shift trims entry,
  alt trims exit.
- The loop length changes as the out-point moves — a trim, like
  the in-point variant.
