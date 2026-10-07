# ADR-0381: Every fader writer owns the edge bookkeeping

## Context
`xfEdgeCheck` keeps `xfPrev` — the last checked fader position —
so an edge fires only when the fader crosses into a deck's outer
5%. Three writers moved `xfader.value` without calling it: the
mid-fade eject park, the auto-mix cancel rollback, and the
per-frame fade sweep. Each parks the fader at an extreme with
`xfPrev` stale on the OTHER side; the next physical nudge then
read as a fresh entry and ghost-fired a start.

## Decision
All three writers now call `xfEdgeCheck()` after `applyCrossfade()`
— the same contract the arrow keys, `0` and MIDI already followed.
Parking into a stopped deck's side intentionally starts it once
(whoever moves the fader into a side owns the start); the next
move away can no longer misfire, because `xfPrev` is truthful.

## Consequences
`xfPrev` is now maintained by construction — any future writer
that skips the check reintroduces the phantom; there are no
unchecked `xfader.value` writes left.
