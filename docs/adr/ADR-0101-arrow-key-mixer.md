# ADR-0101: Arrow keys ride the crossfader and master

## Status
Accepted (2026-10-04)

## Context
The keymap covered pads/sync/loop and ←/→ nudged the crossfader,
but the master had no key and arrows could scroll the page on small
windows.

## Decision
`↑`/`↓` nudge the master slider ±0.05 through its normal `input`
handler (gain + readout stay in sync); all four arrows
`preventDefault` so a laptop set never scrolls. Steps of 0.05 match
the existing ←/→ fader step.

## Consequences
- One hand on the arrows can ride a whole blend: ←/→ across the
  fader, ↑/↓ on the room level, `0` still centers.
- Keys go through the same dispatch paths the UI uses, so no
  parallel state can drift.
