# ADR-0163: Web MIDI controllers

## Context
Every control was keyboard/mouse-only — the biggest gap between a
browser mixer and real DJ software is hardware. Web MIDI lets a
connected controller drive the surface with zero drivers.

## Decision
One `midiMsg` handler bound to every input (plus `onstatechange`
for hot-plug): note-ons 60–67 → deck A pads, 68–75 → deck B pads,
36–39 → sampler pads, 44/45 → play A/B; CC1 → crossfader,
CC7 → master, CC20/21 → channel gain A/B. Those are the pad ranges
and default CC names budget controllers ship with, so most units
work unmapped. `requestMIDIAccess` failure or denial stays silent.

## Consequences
- Pads, play, fader, master, and gains are reachable from hardware
  — the same verbs as the keyboard map, just another source.
- One handler, table-driven mapping; extending it is one `else if`.
- No UI cost: nothing appears or changes without a controller.
