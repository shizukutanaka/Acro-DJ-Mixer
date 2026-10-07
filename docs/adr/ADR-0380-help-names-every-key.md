# ADR-0380: The legend must name every bound key

## Context
The `?` help overlay's key line drifted from the keydown map: `e/i`
(deck sync), `r/u` (loop) and `0` (crossfader centre) were bound
but undocumented — a keyboard user could never discover them short
of reading the source. Same class as the tooltips/ARIA audits: an
undocumented affordance is an affordance that doesn't exist.

## Decision
Add the three mappings to the help line, ordered alongside the
deck action they mirror (e/i next to the pads, r/u beside sync,
0 with the crossfader arrows).

## Consequences
Every bound key is now discoverable in-app. Future key additions
should update this line in the same commit — the help overlay is
part of the keyboard contract, not an afterthought.
