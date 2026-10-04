# ADR-0115: Mic level indicator on the Mic button

## Status
Accepted (2026-10-04)

## Context
Turning the mic on lit the button, but "is it actually picking
up?" — dead input, wrong device — was unanswerable without
listening for it on the floor.

## Decision
An `AnalyserNode` taps `micGain` (readout only); the tick loop
reads its peak and pulses the button's brightness with the level.
The tap is disconnected and the filter reset when the mic turns
off.

## Consequences
- The button itself is the input meter — feedback and dead-air
  mics are visible at a glance.
- No new UI elements; same idiom as Rec's timer and the peak
  ticks on the meters.
