# ADR-0057: Manual loop fallback without a beat grid

## Status
Accepted (2026-10-04)

## Context
`toggleLoop()` refused to arm without `this.grid` — ambient,
unquantized, or simply unanalysed tracks couldn't loop at all. Real
gear loops happily with no BPM (a loop is just in/out points; the grid
only snaps them).

## Decision
Drop the grid requirement. `beatLen = grid ? 60/bpm : 1`, so a
grid-less track arms a 4-second free loop starting at the press point
(the same shape quantize-off uses on a gridded track). Everything
downstream — `applyLoop`, ½/2×, `moveLoop`, persistence — already
operates on `loopStart`/`loopEnd`, so nothing else changes.

## Consequences
- Loop, loop halve/double, loop move, and persistence all work on
  unanalysed files.
- Roll still needs the grid (a roll is defined in beats, not
  seconds) — unchanged.
