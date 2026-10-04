# ADR-0077: Auto-mix bass swap

## Status
Accepted (2026-10-04)

## Context
ADR-0020 sweeps the outgoing deck's filter during an auto-mix fade,
but the *incoming* deck arrived full-range instantly — two kick drums
stack through the middle of the blend, the classic low-end clash DJs
solve by hand with a bass swap (bring the new track's low in only as
the old one leaves).

## Decision
`autoMix.fade` now records `to` too. During the fade, the incoming
deck's low band gain is driven `−26 dB → knob` on the same `k` ramp,
unless that band is killed (then it stays at the floor — a kill is a
deliberate user state). On completion or cancel the band restores via
`setBand('low', slider)`, the same path the knob uses.

## Consequences
- One extra field on `fade`; restore piggybacks existing setBand.
- The swap is per-fade — deck EQ is otherwise untouched.
