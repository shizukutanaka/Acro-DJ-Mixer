# ADR-0272: Every audition voice disconnects when it dies

## Status
Accepted.

## Context
Two audition voices leaked a graph edge on teardown: `smpPrev`
never called `disconnect()` at all (stop + null only), and both
`smpPrev`'s and `padPrev`'s `onended` cleared the reference without
unhooking the node. A stopped or ended source that stays connected
keeps an edge into the cue bus — small, but the graph should lose
the node when the voice dies, like every other teardown.

## Decision
Kill paths now `disconnect()` the outgoing source (matching the
library preview's discipline), and `onended` disconnects the source
before nulling the reference.

## Consequences
No audition node survives its own death in the graph; repeated
auditions can't accumulate dangling edges on the cue bus.

## Round
Improvement round 272.
