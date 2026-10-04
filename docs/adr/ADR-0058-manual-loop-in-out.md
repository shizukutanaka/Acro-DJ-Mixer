# ADR-0058: Free-size loop via Shift+Loop in/out

## Status
Accepted (2026-10-04)

## Context
`Loop` always arms a fixed 4-beat (or 4 s) loop — but sometimes the
loop you want is the exact breakdown between two points you can hear,
not a fixed length from the press point. Hardware's IN/OUT looping is
the second mode every DJ expects.

## Decision
`Shift` + `Loop` switches `toggleLoop` to in/out mode: first press
stores `this._loopIn` and blinks the button (`.armed`, amber), second
press closes the loop `[in, min(pos, duration)]`. Minimum 50 ms guards
double-taps. Plain `Loop` still disarms while looping, so shift is
only consulted when arming; `_loopIn` resets on arm, disarm, and
track load.

Free-size bounds flow through the same `loopStart`/`loopEnd` path, so
½/2×, `moveLoop`, persistence, and waveform shading work unchanged.

## Consequences
- Any-length loops from two presses, no new buttons.
- The armed blink gives the one state cue this mode needs.
