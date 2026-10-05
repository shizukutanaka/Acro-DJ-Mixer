# ADR-0172: MIDI tempo and filter CCs

## Context
ADR-0163 wired faders and gains but left the two controls a DJ
rides hardest — tempo and the colour filter — mouse/keyboard-only.
A controller session shouldn't need to reach for the mouse for the
core performance moves.

## Decision
CC14/15 drive deck A/B tempo, mapping the full CC travel onto each
deck's own range (so a ±8/16/50 select rescales the knob's span
too) with the same ±0.003 centre detent the slider uses. CC16/17
drive the bipolar colour filter −1..1. All four write the element
and call the real setter, so on-screen state can never diverge.

## Consequences
- Pads, play, crossfader, master, gains, tempo, and filters are all
  reachable from hardware — the whole performance surface.
