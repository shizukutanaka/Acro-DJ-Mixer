# ADR-0405: Cue landing outside an armed loop exits it

## Status
Accepted

## Context
`seekTo` carries the deck-standard escape: landing outside an armed
loop disengages it. `cue()` never went through `seekTo` — it writes
`offset` and posts `seek` itself — so the rule didn't apply there.
With a loop armed at 4–7 s and the cue point at 1 s, pressing Cue on
a stopped deck parked the playhead at 1 s **with `loopOn` still
true**: the next Play would run forward, cross `loopEnd`, and wrap
back into the loop — a surprise teleport away from where the user
asked to be. Same for Cue while playing: the post-cue playhead
would re-enter the armed region it had just left.

## Decision
`cue()` applies the same escape: `at < loopStart || at >= loopEnd`
with `loopOn` → `toggleLoop()` before the seek. A cue point inside
the armed region keeps the loop armed — the common "cue inside my
loop" case is untouched. The Cue-preview hold goes through `cue()`
too, so an audition outside the region exits the loop exactly once,
on the press.

## Consequences
- One escape doctrine for every position jump: `seekTo`, `cue()`,
  slip/roll exits (which already ride `seekTo`).
- CDJ parity: CUE while looping is the standard loop-out.
