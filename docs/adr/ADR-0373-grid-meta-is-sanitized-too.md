# ADR-0373: Grid, key and loop meta are sanitized too

## Context
ADR-0367 sanitized cueIn/cues/mem at the consumer, but the analysis
block kept trusting foreign meta: `meta.bpm` became `grid` unchecked,
so a poisoned or imported record with `bpm <= 0`/NaN handed
NaN/negative beat lengths to `syncTo`, loop bounds math and the
emergency loop; a scalar `meta.loop` threw inside `load()`'s
destructure; a negative loop start armed a negative region;
a scalar `meta.key` fed `effKey()`'s field dereferences.

## Decision
- `meta.bpm` must be finite and `> 0`, else the real estimators run.
- `meta.beatOff` is clamped to `[0, duration]`.
- `meta.key` must be an object, else null.
- `meta.loop` must be an array before it's destructured; its bounds
  must satisfy `ls >= 0` as well as `le - ls > 0.01 && le <= duration`.

## Consequences
Every record field that reaches audio math is now validated at the
load() boundary — the same consumer-sanitize doctrine as cues/mem.
