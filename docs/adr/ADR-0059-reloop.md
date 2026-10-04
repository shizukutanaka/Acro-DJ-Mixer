# ADR-0059: Reloop — re-enter the last exited loop

## Status
Accepted (2026-10-04)

## Context
Disarming a loop discarded its bounds — "exit the loop for a bar then
drop back in" (the classic outro trick) needed a hot cue spent on the
loop start plus a fresh in/out. Hardware keeps the last loop and
gives you EXIT/RELOOP.

## Decision
`toggleLoop`'s disarm path stores `_prevLoop = [loopStart, loopEnd]`;
a `↺` button next to `Loop`/`Roll` re-arms those exact bounds through
the same `applyLoop`/UI/persist tail. It no-ops while a loop is on,
with no previous loop, or when the stored end exceeds the loaded
track's duration. `_prevLoop` clears on track load (bounds are
track-relative; a stored library loop already restores across loads
via ADR-0038).

Seeking outside an active loop also routes through the disarm path, so
a seek-exit is equally reloop-able.

## Consequences
- Exit / re-enter is one click each way; the second loop of a phrase
  needn't be rebuilt.
- No persistence change: `_prevLoop` is session-level deck state.
