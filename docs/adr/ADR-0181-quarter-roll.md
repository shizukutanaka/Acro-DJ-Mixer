# ADR-0181: Quarter-beat roll on Alt

## Context
Roll loops one beat, Shift+Roll halves it (ADR-0103) — the modifier
ladder had no ¼-beat rung, so the fast-stutter roll every DJ uses
for tension fills wasn't reachable.

## Decision
Alt+Roll passes 0.25 to `startRoll`'s existing beats parameter —
the same loop arithmetic, just a shorter window. Plain = 1,
Shift = ½, Alt = ¼: the modifier ladder now reads as powers of two,
same as the loop-length select (2/4/8/16b).

## Consequences
- Three roll rates in one button; no new UI, no new state — the
  ghost playhead and release-snap logic apply unchanged at ¼ beat.
