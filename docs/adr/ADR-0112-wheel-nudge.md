# ADR-0112: Mouse-wheel nudge on every fader and knob

## Status
Accepted (2026-10-04)

## Context
ADR-0109 proved the wheel for tempo fine trim; the other sliders
(EQ, filter, FX level, gain, master, crossfader) had the same
drag-resolution problem.

## Decision
A delegated wheel listener steps any `input[type=range]` by its
own `step` per notch and dispatches `input`, so every existing
handler — EQ bands, filter, echo send, deck gain, master,
crossfader — just works. The tempo slider is excluded: it keeps
its finer ±0.001 handler.

## Consequences
- Mouse-only precision on the whole mixer surface.
- One listener covers future sliders for free.
