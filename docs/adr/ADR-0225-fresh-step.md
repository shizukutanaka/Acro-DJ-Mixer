# ADR-0225: Shift+‹ › steps through unplayed tracks only

## Context
The ‹ › deck steppers walk the whole library, so during a set
you'd land on tracks the floor already heard — the same
freshness rule the dimmed rows (ADR-0174) and auto-mix pick
(ADR-0203) follow.

## Decision
`stepLib` takes a `freshOnly` flag from the shift key: the row
list is filtered to `!t.plays` before the wraparound pick, so
shift+› always lands on an unplayed track. When nothing
unplayed remains it says so instead of loading a repeat.

## Consequences
- One gesture keeps the set moving through fresh material;
  the played-state semantics stay consistent across surfaces.
