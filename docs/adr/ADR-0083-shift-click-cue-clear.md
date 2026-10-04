# ADR-0083: Shift-click clears a hot cue

## Status
Accepted (2026-10-04)

## Context
Hot cues were cleared only by right-click — a real gap on trackpads,
touchscreens, and any UI where a secondary click is awkward. The app
already uses Shift as its modifier language (phase sync, beat shift,
loop in/out, long fades).

## Decision
`click` with `e.shiftKey` routes to `clearPad(i)` instead of
`padCue(i)`; right-click still works. The `pointerdown` slip handler
skips shift-presses so a clear-gesture can't slip-seek first. Titles
mention both gestures.

## Consequences
- Modifier convention stays consistent: Shift = the alternate action
  of the same control.
