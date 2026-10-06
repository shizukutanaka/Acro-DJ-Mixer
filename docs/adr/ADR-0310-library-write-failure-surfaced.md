# ADR-0310: A dead library store says so on the status line

## Context

`_mutate` serializes library writes and swallows failures after a
`console.error` so the chain keeps running — correct for chaining,
but a dead store (quota exceeded, private-mode IndexedDB) then
loses every cue/grid/loop prep *silently*: the DJ notices only when
a reload comes back empty. Console output is invisible mid-set.

## Decision

The first write failure per session posts
`Library writes are failing — prep may not persist` to the deck
status line. One-shot flag: persistent failures shouldn't spam the
readout, and the chain's swallow-and-continue behaviour is
unchanged.

## Consequences

- Silent data loss becomes a visible warning; the write chain's
  resilience is untouched.
