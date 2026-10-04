# ADR-0005: Three-Band DJ EQ

## Status
Accepted

## Context

The ADR-0001 scope defined the DJ atomic unit as two sources, tempo, gain,
crossfade, cue — but every hardware two-channel mixer also ships a **per-
channel EQ**. It is used in virtually every transition (bass swap, high
sweep), so under the P0–P4 ordering it is P1, ahead of library persistence.

First-principles requirements:

- Three bands, the universal DJ layout: High / Mid / Low.
- Full-cut ("kill") feel at the bottom of travel — DJ EQs are isolators,
  not studio EQs.
- Deterministic, near-zero code: Web Audio `BiquadFilterNode` is a
  designed-for-purpose biquad.

Options:

1. **BiquadFilterNode ×3** — lowshelf + peaking + highshelf. Native,
   constant-time, ~20 lines. Crossover points are a design choice, not a
   tunable.
2. **Two cascaded filters per band** — steeper slopes, more kill depth.
   Doubles nodes and complexity for marginal benefit at ±16 % DJ use.
3. **Isolator FIR via convolver** — true -∞ kill like Rane/E&S isolators.
   Needs an impulse response, adds latency, overkill for the single-file
   stage.

## Decision

One BiquadFilterNode per band, inserted post-fader
(`deckGain → low → mid → high → xfGain`):

- Low: `lowshelf` @ 250 Hz; Mid: `peaking` @ 1 kHz, Q = 0.9; High:
  `highshelf` @ 4 kHz — the classic DJ crossover split (Pioneer DJM-style
  is ~250/4k).
- Slider `-1..+1` → `gain = v·26 dB`: −26 dB at full cut approximates
  isolator kill (audibly near-silent) while +26 dB gives boost headroom.
  `setTargetAtTime` smoothing removes zipper noise.
- Double-click a slider to reset to 0 — the one affordance beginners need
  (and the only added interaction besides dragging).
- Works on both playback engines; filters are context nodes independent
  of the worklet/buffer choice.

## Consequences

- −26 dB is not a true -∞ kill; a faint remnant remains at full cut.
  Accepted: the alternative (convolver isolator) costs latency and an IR
  asset. Can revisit if ears say otherwise.
- Post-fader EQ means EQ moves don't touch meter readings upstream — the
  meter is on the master bus anyway, so post-fader vs pre-fader is
  inaudible in practice.
- No fourth "parametric" control: fixed crossover points keep the
  beginner UX at three sliders.

## Rejected alternatives

- Convolver/isolator FIR: latency + IR asset, unjustified at this stage.
- Parametric mid (sweepable freq): studio-feature complexity, not DJ
  muscle memory.
