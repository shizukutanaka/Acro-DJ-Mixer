# ADR-0177: Momentary Slip mode

## Context
Slip latches only, so engaging it for a single one-off pad dab costs
two clicks — the interaction the whole surface's momentary grammar
already solves (kills ADR-0117, mute ADR-0137, FX ADR-0144, pads
ADR-0149, mic ADR-0155, Phones ADR-0175).

## Decision
The same grammar on the Slip button: press-and-hold ≥250 ms while
Slip is off engages it only until release; a tap still latches.
Holding while latched is a no-op — release leaves it on and the
click still toggles. The slip state itself is centralised in
`setSlip(on)` so button class and flag can't drift.

## Consequences
- Seventh momentary site; "hold Slip, dab a pad, let go" — a classic
  finger-slip performance move — works in one gesture.
