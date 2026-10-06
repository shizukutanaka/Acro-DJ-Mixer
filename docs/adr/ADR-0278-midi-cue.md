# ADR-0278: MIDI headphone cue

## Status
Accepted.

## Context
The MIDI transport block reached play, sync, loop and cue-return —
but not the headphone cue (PFL) toggle, the button every DJ
controller puts next to the channel fader. A controller couldn't
drive the ears.

## Decision
Notes 76/77 toggle `toggleCue()` on decks A/B — continuing the
per-deck pair convention past the hot-cue pad range (60-75). The
52-59 block stays free for the pending EQ-kill/FX notes (PR #184).

## Consequences
Full cue workflow from a controller; note map documented in the
header comment.

## Round
Improvement round 280.
