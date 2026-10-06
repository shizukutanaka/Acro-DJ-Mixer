# ADR-0255: Help overlay and pad titles tell the current story

## Status
Accepted.

## Context
Two stale-text drift spots:

1. The `?` gesture overlay (ADR-0231) predates the merged library
   row gestures — type-to-filter, ▶ cue-bus preview, two-click
   delete, and the ‹ › library steppers were all discoverable
   only through the controls themselves.
2. Hot-cue pad titles still taught the pre-ADR-0161 grammar:
   the static markup and the clearPad/eject resets claimed
   "right-click clears" after right-click became cue-bus
   preview, and shift-click (the real clear since ADR-0083)
   wasn't always mentioned.

## Decision
- Overlay gains a `library` line covering filter/preview/delete/
  steppers — merged behaviour only.
- Every pad title site (static HTML, `padCue` set, `clearPad`
  reset, eject reset) uses one consistent sentence: click sets /
  jumps, shift-click clears, right-click previews.

## Consequences
The hints a user reads before touching a control match what the
gesture actually does; the overlay lists every merged gesture
group. Title text remains the single place where the whole pad
grammar is discoverable.

## Round
Improvement round 255.
