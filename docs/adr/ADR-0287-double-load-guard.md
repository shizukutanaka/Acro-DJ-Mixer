# ADR-0287: Instant doubles share the load guard

## Status
Accepted.

## Context
ADR-0104's two-click confirm protects every deck-load path —
file drop, library row, ‹ › stepper, eject — from replacing a
playing track. `instantDouble()` called `p.load()` directly, so a
stray ×2 click overwrote the partner's playing song with zero
confirmation: exactly the footgun the guard exists for.

## Decision
The ×2 click handler now routes through `armConfirm` when the
partner deck is playing; stopped partners double instantly as
before.

## Consequences
Every way to overwrite a playing deck requires the same deliberate
second click; the last unguarded load path is closed.

## Round
Improvement round 289.
