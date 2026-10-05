# ADR-0168: Velocity-sensitive sampler pads

## Context
ADR-0163 mapped pad note-ons but threw the velocity byte away —
every MIDI-fired shot landed at full level, so a controller's pads
felt like on/off switches instead of pads.

## Decision
The sampler note-ons call `fireSmpPad(i, v / 127)`; `firePad(vel)`
multiplies the per-pad gain node's level by `vel`. Velocity-blind
controllers send 127, which multiplies to 1 — nothing changes for
units without pads. Mouse clicks fire at full level as before.

## Consequences
- Hit strength reaches the mix for any controller that reports it.
- One multiplication, no new UI; deck pads stay velocity-agnostic
  (cue jumps have no level to shape).
