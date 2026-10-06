# ADR-0184: MIDI pitch-bend wheel rides the deck bend

## Context
`midiMsg` handled note on/off and CC, but channel pitch bend
(0xE0+) — the message a jog wheel's edge or a pitch wheel sends —
was dropped, so hardware nudges couldn't reach the deck.

## Decision
Channel 1 pitch bend drives deck A, channel 2 deck B (channels ≥3
ignored). The 14-bit value maps proportionally onto the same ±5%
the hold buttons apply (`bendMul`), with a small dead zone around
centre so the wheel's mechanical rest doesn't ride the deck flat.
Returning to centre releases the bend — matching how the wheel
itself springs back.

## Consequences
- A controller wheel bends smoothly by displacement, where the
  ± buttons are all-or-nothing.
- `bendMul` is already the shared multiplier for button and
  waveform-drag bends, so all three inputs compose identically.
