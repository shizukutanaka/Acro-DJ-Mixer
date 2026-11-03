# ADR-0423: loop-bounds edits join the right-click undo grammar

## Status

Accepted (2026-11-03)

## Context

Right-click is a one-level undo for every destructive write the app
makes: cleared hot cue, moved hot cue, overwritten sampler pad, cue
set, grid write, loop-memory overwrite, eject. The Socratic check —
"does every destructive write have an undo?" — found one family
still outside: the four loop-bounds editors (½, 2×, ◂, ▸ →
`setLoopLen`, `moveLoop`, `adjustLoopIn`, `adjustLoopOut`). Each
rewrites `loopStart`/`loopEnd` and persists it via `_syncLoop()` with
no way back; a fat-fingered nudge destroys a carefully trimmed loop.

## Decision

`_prevLoopEdit` stashes `[loopStart, loopEnd]` immediately before any
of the four mutators writes (after their no-change early-outs, so a
null edit doesn't push a no-op onto the stack). Right-click on any of
the four buttons restores the stash through `_syncLoop()` — the
restore is itself a write, so it persists to the library record like
the edit did. The stash is consumed on use and reset in
`_dropTrackGestures`, same lifetime as the other undo stashes.

A right-click while no loop is armed drops the stash instead of
reviving bounds onto a disarmed loop — the undo can only restore
onto the thing that was broken, not resurrect it.

## Consequences

- Every `_syncLoop()` caller that destructively overwrites bounds now
  has a way back; `reloop()` and `toggleLoop()` are excluded — they
  are restores/exits, not edits, and already own their recovery
  paths (`_prevLoop` exit memory, arm state).
- One-level, not a ring: second right-click does nothing, matching
  every other undo in the app until a multi-level ring lands.
