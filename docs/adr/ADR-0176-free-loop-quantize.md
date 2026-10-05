# ADR-0176: Free-size loops honour Quantize

## Context
Shift+Loop marks an arbitrary in/out pair — always freehand, even
with Qtz on. Hot cues snap to the grid under Qtz (ADR-0021) and the
armed 4-beat loop snaps its in point, so the manual loop was the one
beat-aware gesture that ignored the toggle the rest of the surface
obeys.

## Decision
Both bounds pass through `this.quantize()` before being stored: Qtz
on snaps in and out to the nearest grid beat, Qtz off keeps the
press points verbatim. A snapped pair shorter than 50 ms still
bails with the existing "Too short" status.

## Consequences
- A grabbed two-phrase loop lands on beats like everything else;
  the toggle's contract ("on = grid, off = freehand") holds for
  every loop-creation path.
