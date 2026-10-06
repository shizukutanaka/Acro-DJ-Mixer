# ADR-0180: MIDI EQ kills and FX on/off

## Context
The MIDI map covered pads, transport, sampler, and the fader/knob
CCs — but a controller's kill-letter and beat-FX buttons still
reached nothing; those toggles were mouse/keyboard only.

## Decision
Notes 52/53/54 = deck A high/mid/low kills, 55/56/57 = deck B,
58/59 = deck A/B FX on/off. Each calls the same method the button
runs, so the closure bodies moved onto the Deck (`setKill(band,
on)`, `setFxOn(on)`) and both entry points share one code path.

## Consequences
- The MIDI block now reaches every toggle on the deck row;
  kill-button hardware performs the same stabs as the letters.
