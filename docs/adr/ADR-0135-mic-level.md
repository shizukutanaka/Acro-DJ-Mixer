# ADR-0135: Mic level — trim knob on the mic input

## Context
The mic chain (`micGain -> micHp -> monoNode`) ran at a hard-coded
0.9. Mic capsules vary enormously in output and laptop mics sit low;
there was no way to ride the vocal level against the music — a
control every DJM mic section has (LEVEL).

## Decision
A slider next to the Mic button, 0–1.5, default 0.9. The range goes
past unity because built-in mics typically need a boost, not a cut.
`micGain.gain` is seeded from the slider when the mic opens and
follows `input` events live; double-click resets to 0.9 like the
other knobs. The mic level indicator keeps tapping `micGain`'s input
side — the button pulses with the *source* level, unaffected by the
trim, which is what you want to see.

## Consequences
- Mic sits in the mix at a chosen level instead of fixed −0.9 dB.
- Wheel nudge (ADR-0112) applies automatically — it handles every
  range input.
- No new concepts: one slider, one gain, same master chain.
