# ADR-0111: Auto mix countdown on the Auto button

## Status
Accepted (2026-10-04)

## Context
Armed Auto was a lit button with no information — the fade fired at
a grid-dependent moment the user had to infer from the time
readout, and during the fade only the moving crossfader hinted at
progress.

## Decision
The button becomes the readout: while armed and a fade-eligible
deck is playing, it shows beats until the fade fires
(`Auto 14b`); during the fade it shows progress (`Auto 31%`);
idle, cancelled, or off it reads `Auto`.

## Consequences
- The DJ can plan the next move against a countdown instead of
  guessing when auto mix will take over.
- No extra UI: the button doubles as the status line, like the
  Rec timer (ADR-0082) and the Loop length label (ADR-0110).
