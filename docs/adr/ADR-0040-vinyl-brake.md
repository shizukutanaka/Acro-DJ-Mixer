# ADR-0040: Vinyl Brake

## Status
Accepted

## Context

Pause is instant — correct, but the turntable gesture "pull the
platter" (spin-down on pause, spin-up on play) is a classic effect
for endings and transitions. It needs only a rate ramp: both engines
already accept live rate changes (pitch bend uses the same path).

## Decision

- A `Brake` toggle in the transport row (hand-position control — its
  state persists across loads like kills and filters).
- `pause()` with brake on ramps `spinMul` 1→~0 over 0.6 s then stops;
  `play()` starts at `spinMul≈0` and ramps to 1 over 0.5 s.
- `spinMul` is a third rate multiplier alongside `bendMul`: the engine
  rate is `rate · bendMul · spinMul` and `pos()` integrates it the
  same way. Each ramp step rebases `offset/startedAt`, so position
  stays exact through the curve.
- Hitting play mid-spin-down cancels the ramp and resumes at 1.

## Consequences

- Turntable-style stops/starts on demand; off by default so pause
  stays instant for cue juggling.
- Verified: play with brake shows slowed uptake (0.93 s of track in
  1.2 s), pause ramps to stop at ~0.6 s, resume continues.

## Rejected alternatives

- Always-on spin-down: cue/preview relies on instant stops; a toggle
  keeps both behaviours.
- AudioParam `setTargetAtTime` ramp: the worklet engine has no
  AudioParam for rate — a stepped `spinMul` works identically on both
  engines.
