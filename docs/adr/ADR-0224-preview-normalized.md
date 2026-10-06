# ADR-0224: Library preview plays through the same gated gain

## Context
Deck loads normalize loudness (ADR-0019/0024/0034), but the
library preview played the raw file — a loud track could blast
the cue bus relative to the levelled deck you were mixing.

## Decision
The R128 gated measurement moved into `gatedGain(mono)` — the
deck's `applyAutoGain` now just applies it, and `previewTrack`
routes through a `previewGain` node set from the same function.
Attenuation only, same as the deck (a quiet preview is not
boosted into the limiter).

## Consequences
- The level you audition is the level you'd get on a load.
