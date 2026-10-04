# ADR-0022: Cue-Bus Level Meter

## Status
Accepted

## Context

Phones (ADR-0007) routes pre-fader audio to a second output, but the
bus was invisible — you couldn't tell at a glance whether anything was
flowing to the headphones, or which level it had. On a hardware mixer
the PFL section always has a meter.

## Decision

- Insert a summing `cueIn` GainNode in front of `cueDest`: decks tap
  `cueSend → cueIn → {cueDest stream, cueAnalyser}`. `cueBus()` now
  returns `cueIn`; call sites unchanged.
- A thin 4 px meter strip under `Cue out` (accent colour, distinct
  from the post-limiter master meter above it) reads `cueAnalyser`
  peaks in the render tick.
- Meter shows the bus *always* — zero when no deck is cued, which is
  itself the signal ("Phones is off / nothing is reaching the cue
  output").

## Consequences

- One more analyser poll per frame — negligible (256-point FFT buffer,
  byte time-domain read, same as the master meter).
- The tap is structurally identical to the ADR-0014 record tap:
  insert a summing node, tee off an analyser.

## Rejected alternatives

- Per-deck cue meters: the bus level is what reaches the phones;
  per-deck granularity adds rows for a check that's binary in practice.
- Metering at `cueDest` (post-stream): impossible — MediaStreamDest
  has no analysis output; the tee has to happen before it.
