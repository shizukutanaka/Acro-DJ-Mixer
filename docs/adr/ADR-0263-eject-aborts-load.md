# ADR-0263: Eject during decode aborts the load

## Status
Accepted. Stacked on ADR-0261 (the load token it invalidates).

## Context
`eject()` returned immediately when `!this.buffer`. During
'decoding…' the buffer is still null, so an eject in that window
was silently ignored — and the in-flight load landed moments
later on a deck the user had just cleared.

## Decision
`eject()` bumps `this._loadSeq` (ADR-0261) before the empty-deck
guard: any load continuation then sees a stale sequence and
returns. An eject on an empty deck also clears the status line
so 'decoding…' doesn't linger after the abort.

## Consequences
⏏ during decode is now a real cancel: on an empty deck it aborts
the load, on a loaded deck it aborts the load *and* does the
full channel reset as before.

## Round
Improvement round 263.
