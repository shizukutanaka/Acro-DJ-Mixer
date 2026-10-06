# ADR-0215: MIDI CC 22/23 drive the channel upfaders

## Context
ADR-0214 added channel faders but hardware had no way to reach
them — gain trims are CC 20/21, so a controller's channel fader
moved nothing.

## Decision
CC 22 (deck A) and CC 23 (deck B) drive `faderEl` through the
same `setFader` path as the on-screen control — element and
node stay in sync, session persistence included.

## Consequences
- A controller's channel fader strip now works unmapped: pads,
  trims, tempo, filter, and faders all land on consecutive CCs.
