# ADR-0107: Peak-hold tick on the cue-bus meter

## Status
Accepted (2026-10-04)

## Context
ADR-0100/0106 put decaying peak ticks on the channel and master
meters; the cue-bus meter — the readout that tells you the
headphone send is about to overload — was left as instantaneous
only.

## Decision
Same idiom, same decay constant: a 2 px tick inside `.cuem` marks
the recent peak of `cueAnalyser`. With that, every meter in the
app behaves like a hardware meter.

## Consequences
- PFL overs stay readable after the transient.
- Readout only; the cue path is unchanged.
