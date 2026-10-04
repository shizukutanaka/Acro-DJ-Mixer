# ADR-0038: Loop Persistence

## Status
Accepted

## Context

Hot cues persist in the library (ADR-0010) but the armed loop did
not — a rehearsed section evaporated on reload, while its cue pads
survived. The loop is the same kind of per-track state as a cue: an
annotation on the recording, not a knob position.

## Decision

- Store `loop: [start, end]` on the library record whenever the loop
  is armed, resized, or released from a roll (`null` when disarmed) —
  same `tagLib` patch mechanism as cues.
- `loadInto` forwards `rec.loop` into load meta; on load the loop is
  re-armed with bounds, engine loop points, and the ½/2× controls.
- Bounds are absolute seconds — restoration does not need the beat
  grid, and is guarded to `le − ls > 0.01 && le <= duration`.

## Consequences

- A rehearsed loop survives reload and page restarts.
- Rolls stay transient: tagging happens on release (roll) or arm
  (toggle), never during the held roll.

## Rejected alternatives

- Persisting loop *state* only on disarm: would lose the loop if the
  app closed while armed — the common case is "armed, reloaded,
  expected to still be there."
