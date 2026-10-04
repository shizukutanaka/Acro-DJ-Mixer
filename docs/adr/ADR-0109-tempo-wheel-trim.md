# ADR-0109: Mouse-wheel fine trim on the tempo slider

## Status
Accepted (2026-10-04)

## Context
At ±50% range the tempo fader's full throw covers 100% of rate —
a pixel of drag is ~0.4%, too coarse for the sub-0.1% trims a
long blend needs.

## Decision
Wheel over the tempo slider steps the rate ±0.001 (±0.1%) per
notch, clamped to the selected range, routed through the same
`setRate` path as dragging. Passive listener disabled so the page
doesn't scroll.

## Consequences
- Fine pitch riding without grabbing the fader.
- Double-click reset and range-select clamping unchanged.
