# ADR-0167: Per-pad sampler level

## Context
All four pads share the single smpGain knob, so a loud one-shot and
a quiet one can't balance against each other — turning the knob to
tame one mutes the rest. Hardware samplers give every pad its own
level trim.

## Decision
A wheel gesture on a loaded pad trims that pad's `slot.gain`
(0.1–1.5, 0.05 steps) — the same wheel-trim grammar the faders
already use. `firePad` inserts a gain node between the voice and
the shared bus (`src → g → smpGain`), kept on `slot.g` so live
voices follow later wheel turns.

## Consequences
- Pads balance individually without new on-screen controls; the pad
  title reports the trimmed level.
