# ADR-0097: Trans gate — third beat FX

## Status
Accepted (2026-10-04)

## Context
The FX select had echo and flanger. DJM's third signature effect is
TRANS — a beat-synced square-wave gate chopping the channel.

## Decision
`Trans` joins the FX select. A `gate` GainNode sits on the dry path
(filter → gate → xfGain); a square `gateOsc` drives `gate.gain`
through `gateDepth`. The knob maps to `base = 1 − v·½`,
`depth = v·½`, so v=1 swings 0…1 (full chop), v=0 passes through.
The oscillator runs once per grid beat (`freq = 1/beat` in
`_syncDelay`, same source that keeps the echo musical). The echo and
flanger taps sit upstream of the gate — tails ring through chops,
which is how send-FX behave.

## Consequences
- Shares the level knob and the park-the-other-FX rule like the
  existing pair; switching back to Echo restores a clean gate (1/0).
- Gridless decks chop at the 0.45 s fallback beat.
