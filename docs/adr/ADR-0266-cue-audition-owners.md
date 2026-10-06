# ADR-0266: Hot-cue auditions die with their deck's track

## Status
Accepted.

## Context
`padPrev` — the right-click cue-bus audition voice — was a bare
global. Loading or ejecting a deck left its audition ringing from a
track that no longer existed there, the same leak class fixed for
library rows (ADR-0246/0248) and sampler pads (ADR-0250); this was
the last audition voice without an owner rule. A naive fix (kill
`padPrev` on any load/eject) would be wrong too: the voice is shared
across decks, so ejecting deck A must not silence deck B's audition.

## Decision
Track the owner: `padPrevOwner` is set beside `padPrev`, and
`killPadPrev(deck)` stops and disconnects the voice only when the
caller owns it. `load()` and `eject()` call it for `this`, so an
audition dies exactly when its track leaves the deck.

## Consequences
Every audition voice now dies with the thing it was auditioning.
Partner-deck auditions are untouched.

## Round
Improvement round 266.
