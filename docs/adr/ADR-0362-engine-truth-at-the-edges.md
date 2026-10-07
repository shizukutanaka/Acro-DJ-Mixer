# ADR-0362: Engine truth at the handoff edges

## Context
Two bookkeeping leaks between the WSOLA engine and the deck:

1. The keylock-off handoff set `rPos = inPos`, but `inPos` counts
   input already synthesized into the output queue yet unplayed.
   `posSamples()` documents the live position as
   `inPos - qLen*rate`; the handoff used the raw `inPos`, skipping
   ~15 ms (qLen×rate samples) forward on every keylock release.
2. `onMsg('ended')` applied `offset = buffer.duration` unconditionally.
   The engine only posts 'ended' from a playing state, so one that
   lands while the deck is already stopped is a stale tail of the
   pre-pause/pre-load era — it stamped the current track's position
   to its end for no reason.

## Decision
The off-direction handoff uses the same formula `posSamples()`
publishes: `rPos = inPos - qLen*rate`. The deck ignores an 'ended'
that arrives while `!this.playing`.

## Consequences
Keylock toggles resume at the audible position instead of a frame
ahead, and a stale end-of-track can no longer clobber a fresh
track's bookkeeping.
