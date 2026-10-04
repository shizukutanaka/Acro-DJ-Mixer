# ADR-0122: Mic input high-pass filter

## Status
Accepted (2026-10-04)

## Context
The mic chain went raw into `monoNode` — handling rumble, plosive
"p" pops, and stage-borne low end mixed straight into the master
bus, exactly what a DJM mic section's fixed HPF exists to remove.

## Decision
A fixed `highpass` biquad at 120 Hz, Q 0.7, sits between
`micGain` and `monoNode`. The level tap (`micAn`) still reads
pre-filter input so the indicator shows what the mic actually
hears, not what survives the filter. Node is created and torn
down with the rest of the mic chain.

## Consequences
- Speech stays untouched (~120 Hz is below vocal fundamentals);
  rumble and pops stop reaching the floor and the recording.
- No UI — it's a fixed section, like the limiter.
