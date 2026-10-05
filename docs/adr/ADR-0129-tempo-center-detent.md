# ADR-0129: Tempo slider center detent

## Status
Accepted (2026-10-04)

## Context
Returning a deck to original tempo meant watching the readout and
landing ±0.0% — a CDJ fader has a center click so the same job is
done by feel. Our slider had no dead zone; "near unity" and "at
unity" were indistinguishable by touch.

## Decision
Inside ±0.3% of unity the tempo input snaps to exactly `rate=1`
— the center detent. The wheel trim's ±0.1% steps are
unaffected: they land inside the window and still snap, which is
correct (fine trim is for riding, not for parking). Double-click
reset and tempo-range rescale are unchanged.

## Consequences
- Original tempo is recoverable by feel — the hardware behaviour
  DJs' hands expect.
- Sync stays intact when dragging through center: rate only
  clamps on the tiny window, never hysteretically.
