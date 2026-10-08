# ADR-0408: Instant doubles refuse during an auto-mix fade

## Status
Accepted

## Context
`swapWith` refuses to run while `autoMix.fade` is armed —
loading over a fading deck would tear down a deck the
crossfader is actively sweeping. `instantDouble` loads onto
the partner with no such check, and today `load()` on main
has no fade refusal of its own: a double fired mid-fade
replaces the partner's buffer/nodes out from under the fade.

The failure is worse once `load()` learns to refuse mid-fade
decks: `p.load(...)` returns without loading, and the
rate/seek/play calls that follow in `instantDouble` apply to
the partner's *old* track — a wrong-track mutation plus a
`play()` racing the fade.

## Decision
`instantDouble` takes the same up-front guard `swapWith` has:
`autoMix.fade` armed → status "Finish or cancel the fade
first." and return. The guard is correct on both semantics —
it prevents the mid-fade load entirely on current main, and
prevents post-refusal wrong-track writes once load refusal
lands.

## Consequences
- Doubling during a fade is refused with an explanation,
  matching the swap contract.
- Verified: fake `autoMix.fade` set → `instantDouble` leaves
  the partner's file/rate/offset/play state untouched.
