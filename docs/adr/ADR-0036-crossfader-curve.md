# ADR-0036: Crossfader Curve Select

## Status
Accepted

## Context

The crossfader has always used the equal-power law — right for blends,
wrong for cuts. A scratch-style chop needs the incoming side at full
level within millimetres of travel; with equal power it only reaches
−3 dB at mid-fader. Hardware mixers expose this as a curve switch.

## Decision

- A `Curve` select next to the fader: **Smooth** (existing equal-power)
  and **Cut** (`gA = min(1, (1−x)/0.1)`, `gB = min(1, x/0.1)`) — each
  side reaches unity within 10 % of travel and the middle sums both
  at full.
- Curve applies in `applyCrossfade`, so it also shapes the Auto-mix
  fade if selected mid-set.

## Consequences

- Chops/transforms work; blends keep the smooth default.
- The hotter middle on Cut is inherent to the curve (and the
  limiter, ADR-0018, is already in place for the sum).

## Rejected alternatives

- Continuous curve knob: two modes cover the real techniques; a knob
  adds a control without a third behaviour anyone uses.
- Reverse (hamster) switch: niche, and same effect is achievable by
  just flipping which deck leads.
