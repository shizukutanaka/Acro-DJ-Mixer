# ADR-0157: Keyboard for hot cues 5–8

## Context
ADR-0140 doubled the pads to eight, but the keyboard map still only
reached pads 1–4 — the new pads were mouse-only, so laptop-only
operation could fire half the cues.

## Decision
The rows above the existing pad rows: `A S D F` = deck A pads 5–8,
`H J K L` = deck B pads 5–8 — same two-row mirrored layout Serato
uses, same `padCue` path as clicks and the 1–4 keys. All eight
letters were unassigned; no remap needed.

## Consequences
- All eight cues fire from the keyboard per deck, hands never
  leaving home position.
- Letter keys stay mnemonic: bottom row = cues 1–4, row above = 5–8.
