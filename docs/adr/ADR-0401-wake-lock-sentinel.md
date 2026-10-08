# ADR-0401: Wake-lock bookkeeping owns its sentinel lifecycle

## Status
Accepted

## Context
`wakeSync()` exists for one reason: a laptop sleeping mid-set is the
worst failure mode a DJ app can have. It held a `wakeLock` reference
and re-requested only when the ref was `null`. Two bookkeeping gaps
broke that contract:

1. **Released sentinel masqueraded as a held lock.** The OS can drop
   the screen wake lock without the tab hiding (power policy, memory
   pressure, battery saver). The `release` event fired, nothing
   listened, `wakeLock` stayed non-null, and every later `wakeSync`
   saw `want && !wakeLock` as false — the lock was never re-acquired.
   The decks kept playing while the screen could sleep: exactly the
   failure the feature exists to prevent, and silent about it.

2. **In-flight request race.** `tick` calls `wakeSync` every frame.
   `await navigator.wakeLock.request('screen')` leaves `wakeLock`
   `null` until the promise resolves; a request slower than one frame
   let the next `wakeSync` fire a second request. The losing
   sentinel's reference is overwritten — held forever with nothing
   able to release it.

Same doctrine as every other shared-resource bookkeeping fix in this
tree: the one who owns the handle owns its lifecycle events
(ADR-0358 `xfPrev`, ADR-0378 `_faderPrev`, ADR-0398 `_loopT`).

## Decision
- Guard becomes `want && (!wakeLock || wakeLock.released) && !wakeReq`.
- `wakeReq` holds the in-flight request promise; cleared in `finally`.
- A `release` listener nulls the ref so the next `wakeSync`
  re-requests instead of trusting a dead sentinel.

## Consequences
- OS-dropped locks are re-acquired on the next frame while a deck
  plays — no silent loss of the sleep guard.
- One request in flight at a time; no leaked sentinels.
- `release()` on an already-released sentinel is spec-idempotent, so
  the stop path is unchanged.
