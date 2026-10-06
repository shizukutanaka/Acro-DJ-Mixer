# ADR-0268: Resume the AudioContext when the tab returns

## Status
Accepted.

## Context
WakeLock was already reclaimed on `visibilitychange`, but a
suspended `AudioContext` wasn't: OSes that park backgrounded
tabs (mobile Safari notably) can suspend audio mid-set, and the
decks stayed silent until the next gesture happened to call
`audio()` — which a returning user's first click might not.

## Decision
The existing `visibilitychange` handler also checks
`ctx.state === 'suspended'` and calls `ctx.resume()` — one line
beside the wake-lock reclaim it mirrors.

## Consequences
Audio comes back with the tab instead of silently waiting for
the next lucky gesture. Resuming a running context is a no-op,
so the check is the only cost.

## Round
Improvement round 268.
