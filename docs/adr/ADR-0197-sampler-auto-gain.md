# ADR-0197: Sampler pads get auto-gain

## Context
Deck tracks normalize on load (ADR-0019) but one-shots played at
raw file loudness — a quiet snare next to a slammed clap meant the
pad row had its own volume lottery, and the per-pad wheel was
fixing levels rather than performing them.

## Decision
On pad load, run the same K-weighted pipeline as deck auto-gain
(`monoResample` → `kWeight` → RMS → `0.18/rms`) minus the R128
gating — a one-shot is all "on" material, no quiet breaks to gate
out. Result lands in `slot.gain`, so the wheel's trim range and
velocity scaling compose on top unchanged. Clamp opens to 1.5
(the wheel's own max) so a genuinely quiet shot can come up,
floored at 0.25.

## Consequences
- Pads load at a consistent stage level — the wheel goes back to
  being a performance control, not a level lottery fix.
- A shot quieter than ~11 dB under target still rides the 1.5
  clamp rather than pumping noise floor — same philosophy as the
  decks' clamp.
