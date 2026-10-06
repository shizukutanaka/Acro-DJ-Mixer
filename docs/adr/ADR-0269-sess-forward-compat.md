# ADR-0269: Session restore tolerates older, smaller snapshots

## Status
Accepted.

## Context
The restore loop passed every deck field into `setV` unconditionally.
A snapshot written before a control existed — say `assign`, `range`,
`slip`, `fxon` — carried `undefined`, and `el.value = undefined`
became `parseFloat('undefined') = NaN` reaching the AudioParam write:
a TypeError that killed the *rest* of restore mid-flight (deck B
never applied). The `fxon`/`slip` toggles had the mirror bug — a
missing field read as `false` and could click a live control off.

## Decision
`setV` skips null/undefined fields, and the `fxon`/`slip` toggles
only replay a click when the field actually exists — forward-compat
with any snapshot older than the current control set, forever.

## Consequences
An old session no longer aborts restore partway or randomly
un-punches FX; it just leaves the fields it doesn't know at their
defaults.

## Round
Improvement round 269.
