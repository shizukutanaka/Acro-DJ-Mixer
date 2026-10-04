# ADR-0106: Peak-hold tick on the master meter

## Status
Accepted (2026-10-04)

## Context
ADR-0100 gave the channel meters a decaying peak tick, but the
master meter — the one that matters against the limiter — still
showed instantaneous level only, so clipped-sum transients passed
unseen.

## Decision
Same idiom, same decay constant (`max(p, peak − 0.012)`/frame): a
2 px tick inside the master meter marks the recent peak of the
post-limiter analyser tap.

## Consequences
- The loudest moment of a blend stays readable after it passes —
  consistent with hardware master meters.
- Readout only; the audio path is unchanged.
