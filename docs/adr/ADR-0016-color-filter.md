# ADR-0016: Color Filter Knob

## Status
Accepted

## Context

After EQ (ADR-0005) and kills (ADR-0015), the remaining standard DJM
control is the color filter: one knob, left = low-pass sweep (muffle
into a transition), right = high-pass sweep (thin out before a drop).
It is a *performance* control — big moves, one hand — distinct from EQ,
which shapes a band while the track keeps playing.

## Decision

- One `BiquadFilterNode` per deck, post-EQ pre-crossfader
  (`eq.high → filter → xfGain`), re-purposed by the knob:
  - v < 0 → `lowpass`, cutoff 20 kHz · 10^(2v) → ~200 Hz at −1
  - v > 0 → `highpass`, cutoff 20 · 10^(2.6v) → ~8 kHz at +1
  - |v| < 0.01 → open (low-pass parked at 20 kHz, transparent)
- Exponential mapping — frequency is perceived logarithmically.
- Live readout (`LP 500Hz` / `HP 4.0kHz` / `open`) so the sweep is
  legible; double-click resets, matching every other slider.
- Filter position survives track loads — same "hand position" doctrine
  as the kills (ADR-0015).

## Consequences

- Q = 0.9, no resonance staging — a colored/resonant filter is a
  possible refinement but deliberately out of scope (KISS).
- The knob visibly labels itself, so no new vocabulary for the user.

## Rejected alternatives

- Two filters (one LP, one HP) switched between: the single-node
  re-type approach gives the same sweep with one third the wiring; the
  type flip happens only when crossing zero, where the band is open
  anyway — inaudible.
- Auto filter in auto-mix (ride the filter during the 8-beat fade):
  attractive but coupling two sweeps is a decision for a later round.
