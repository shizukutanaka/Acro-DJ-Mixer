# ADR-0126: Noise FX — swept white noise riser

## Status
Accepted (2026-10-04)

## Context
The FX select had Echo/Flng/Trans — all deck-signal effects. The
DJM's transition staple that isn't one is the noise riser/wash
(SPACE): independent of the track, it sweeps tension under a
handover without borrowing any deck audio.

## Decision
`noise` joins `fxSel` as the fourth option. A looping 2 s white
buffer feeds `noiseFilt` (bandpass, Q 1.2) → `noiseWet` → `xfGain`
(channel out, pre-crossfader like the echo send). The shared
level knob drives both wet level (v·0.6) and the sweep —
`freq = 200·2^(v·5.3)`, 200 Hz → ~8 kHz across the knob throw —
so one gesture is "open the riser". Not a beat effect: the
division select is ignored, same as Flng.

## Consequences
- Riser builds without a third deck or a prepared sample.
- Wet parks at 0 when another FX is selected — the "knob drives
  one effect" rule holds.
