# ADR-0414: one sync path for armed-loop region edits

## Status

Accepted (2026-10-08)

## Context

Five methods edit the armed loop's region — `setLoopLen`, `reloop`,
`moveLoop`, `adjustLoopIn`, `adjustLoopOut` — and each carried an
identical four-step tail: `applyLoop()` (engine + button label),
`_drawnPos = undefined` (invalidate the draw cache), `drawWave()`
(repaint), `tagLib({ loop: [...] })` (persist). This is the same
"writer owns the bookkeeping" contract the ADR-0377..0406 cluster
unified elsewhere; left as copies, a sixth writer can (and eventually
would) forget the persist step or the invalidation — exactly the bug
class those fixes closed.

## Decision

Extract `_syncLoop()`: the four-step tail in one private method,
called by every armed-region writer.

- Scope is deliberately narrow: loop *off* writes (`toggleLoop`'s
  tail, `startRoll`/`stopRoll`) keep their own path — a disarm tags
  `null`, a roll doesn't persist at all; folding those in would
  widen the helper's contract, not simplify it.
- `reloop` also drops its hand-rolled tail — the button updates it
  does are independent of the draw/persist order.

## Consequences

- "A region edit reaches the engine, the screen, and the record"
  becomes one method, so a future loop-editing gesture inherits the
  whole contract by calling it.
- 20 duplicated lines collapse to 5 call sites; no behavior change.
