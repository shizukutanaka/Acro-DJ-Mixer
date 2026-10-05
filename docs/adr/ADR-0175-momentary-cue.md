# ADR-0175: Momentary headphone cue

## Context
Phones latches only, so "just a listen" costs two clicks — the
exact interaction every momentary control on the surface already
solves (kills ADR-0117, mute ADR-0137, FX ADR-0144, pads ADR-0149,
mic ADR-0155).

## Decision
The same grammar applied to the Phones button: press-and-hold
≥250 ms while cue is off rings the PFL until release; a tap still
latches. Shift keeps its solo meaning, and the button stays
latch-only while already on (hold then behaves as before — release
leaves it on and the click turns it off is unchanged: the hold
early-returns when `cueOn`).

## Consequences
- Sixth momentary site — the grammar now covers every toggle on
  the deck row; "one finger, one listen" works for cueing.
