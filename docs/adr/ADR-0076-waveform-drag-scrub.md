# ADR-0076: Waveform drag scrub

## Status
Accepted (2026-10-04)

## Context
The waveform sought only on click — each reposition was a discrete
poke. Searching for a cue point by feel, the way a CDJ jog dial or a
needle-drop works, needed a continuous gesture.

## Decision
Pointer events replace the click listener on `canvas.wave`:
`pointerdown` captures the pointer and seeks, `pointermove` keeps
seeking while the button is held, `pointerup`/`pointercancel` ends the
scrub. Same `seekFromEvent` path — view-span aware, zoom correct.

## Consequences
- Click still works (down+up in place = a click).
- Dragging while playing just seeks — no special mode needed.
- Wheel zoom unaffected; both gestures share the canvas.
