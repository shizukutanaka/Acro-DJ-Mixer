# ADR-0041: Beat-Synced Echo

## Status
Accepted

## Context

The mixer had no send effect — the one FX every DJ mixer carries is
a beat-synced delay. The grid already gives an exact beat length, so
a delay locked to it costs a handful of nodes.

## Decision

- Per deck, a feedback delay in parallel with the dry path:
  `filter → DelayNode → fb(0.35) → DelayNode`; wet taps to `xfGain`
  through `delayWet`. The `Echo` slider (0–1) maps to wet 0–0.7 —
  echoes stay under the dry signal.
- Delay time is ¾ beat **in real time**: `0.75·60/bpm/rate`, resynced
  on every grid change (detect, tap tempo, library restore) and every
  tempo-slider move. No grid → 450 ms fallback.
- Double-click resets to dry, like the other sliders; wet level
  persists across loads (hand-position control).

## Consequences

- Dub-style echoes land on the beat automatically; tempo rides keep
  the echo musical (it re-follows the deck rate).
- Verified: 120 BPM grid → 0.374 s delay; 80% knob → 0.56 wet.

## Rejected alternatives

- A shared master send: per-deck sends match how the effect is used
  (echo the outgoing track through a transition).
- Free delay-time knob: unsynced times are a footgun; the whole point
  is beat-sync, and tempo-compensation is already wired.
