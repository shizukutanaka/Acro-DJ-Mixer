# ADR-0396: Every momentary hold dies with the track

## Context
Track swaps abandon in-flight gesture bookkeeping: `_slip`, `_roll`,
`_slice`, the held Phones cue (ADR-0383) and the held Cue-preview
(ADR-0395) are cleared in load and eject. The deck's remaining
momentary latches — Slip, FX punch, the three EQ-kill letters, and
the mute button's `.on` lamp — were missed. Three failure shapes,
one class:

* a pending 250 ms `_momTimer` fires into the *new* track
  (phantom slip/FX/kill on a track the DJ never held them on);
* an already-engaged `_mom` hold stays latched — the momentary
  becomes a permanent toggle the DJ never chose;
* a stale `_suppress` eats the next real click on the button.

## Decision
Both abandonment blocks now clear, per button: `_momTimer`,
`_mom`, `_suppress`, and — when the hold had already engaged —
the state it turned on (`slip`, `setFxOn(false)`, `setKill(band,
false)`), plus the mute lamp's `.on` class. Clearing `_suppress`
deliberately lets the physical release-click act like a fresh press,
the same choice ADR-0383 made for Phones.

## Consequences
A hold interrupted by load/eject leaves no latch, no live timer,
and no swallowed click; every deck button behaves as untouched.
