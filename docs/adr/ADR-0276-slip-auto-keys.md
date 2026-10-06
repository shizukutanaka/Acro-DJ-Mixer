# ADR-0276: Slip and auto-mix on the keyboard

## Status
Accepted.

## Context
After cue got keys (ADR-0275), two latching controls still forced a
pointer reach mid-mix: Slip (the scratch-workflow mode toggle) and
Auto (the continuous-mix arm). Both are single toggles a keyboard mix
should reach without a mouse.

## Decision
`g` / `'` click the deck A / B Slip buttons (under the left/right
hand, pairing with the cue keys); `.` clicks Auto — one key for the
rig-wide latch. Keys drive the same click handlers as the mouse, so
suppress/momentary logic is untouched. Help overlay updated.

## Consequences
Every transport-level latch is now reachable from the keyboard;
no remapped keys (g, ', . were free).

## Round
Improvement round 278.
