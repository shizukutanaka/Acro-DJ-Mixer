# ADR-0313: Persist brake mode per deck across reloads

## Context

Slip — the sibling mode latch on the same button row — survives a
reload through the session snapshot, but `brake` (spin-down mode)
did not: a deck configured for vinyl-style pauses silently reset to
instant pause on every reload. Same gap class as ADR-0290.

## Decision

`brake` joins the per-deck session snapshot and restores via the
existing click-replay idiom: only on class mismatch, so the real
click handler flips the backing flag rather than the class drifting
from state. Older snapshots simply lack the key — guarded by
`s2.brake != null`.

## Consequences

- Every per-deck mode latch now persists uniformly; reload no
  longer silently changes pause behaviour.
