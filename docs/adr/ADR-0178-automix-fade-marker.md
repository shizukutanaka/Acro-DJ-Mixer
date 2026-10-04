# ADR-0178: Auto-mix fade-start marker on the waveform

## Context
With Auto armed, the only sign of where the outgoing track's
transition starts is the beat countdown on the Auto button — a
number with no place on the timeline. The fire point is already
computed (ADR-0170 bar snap, ADR-0171 effective end); it just
wasn't drawn anywhere.

## Decision
`autoMixTick` stores the pending fire point on the deck as
`_fadeAt` (cleared when the deck can't fade, when the fade fires,
or when Auto is disarmed). `drawWave` paints it as an amber tick
on both the main wave and the mini overview — visible at any zoom.

## Consequences
- "Where does the transition start" is answered by looking at the
  waveform, at any depth of zoom; the countdown button and the
  marker describe the same number from the same source, so they
  can't disagree.
