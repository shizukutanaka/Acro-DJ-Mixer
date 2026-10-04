# ADR-0018: Master Limiter

## Status
Accepted

## Context

The master bus could clip: two decks at unity through a centre
crossfader already sum past 0 dBFS, and the EQ offers +26 dB of boost.
Until now nothing protected the output — the first loud transition
would hard-clip `destination`.

## Decision

- `DynamicsCompressorNode` as a limiter, end of chain:
  `masterGain → limiter → analyser → destination`
  (threshold −3 dB, knee 0, ratio 20, attack 1 ms, release 100 ms —
  the standard "safety limiter" recipe).
- The analyser stays *post*-limiter, so the meter reads the true
  output level the listener gets — including whatever the limiter is
  doing. Recording (`recDest`) taps the limiter output for the same
  reason: the recorded set is the heard set.
- `limiter.reduction` surfaces as a small `GR −x.x dB` readout under
  the meter when reduction exceeds 0.5 dB — enough to warn, quiet
  enough not to nag during normal peaks.

## Consequences

- Live sets can no longer hard-clip the master; transient EQ boosts
  and hot crossfade sums land on the limiter instead.
- Compression is deliberately transparent-tuned (fast attack, medium
  release): it rides peaks, not the programme.

## Rejected alternatives

- Post-mix gain staging only (rely on the user): the EQ's +26 dB boost
  makes overs reachable in normal operation — protection must be in
  the signal path.
- Hard `WaveShaperNode` clipper: cheaper but adds audible distortion
  exactly when it's needed most.
