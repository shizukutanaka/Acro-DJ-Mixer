# ADR-0142: Beat-paced noise sweep

## Context
The noise FX (ADR-0126) set its bandpass centre statically from the
knob — a riser that sits still until your hand moves it. Every other
beat-class effect now breathes in time (echo spaces, trans chops,
flange sweeps), so the noise wash was the last free-running voice.

## Decision
An LFO breathes the bandpass centre around the knob position:
`noiseLfo -> noiseLfoDepth -> noiseFilt.frequency`, paced at
`1/(div*4*beat)` — the same cycle as the flanger. Depth tracks the
centre: `f0*0.6`, so the wash widens as the riser climbs and never
swings into negative frequency. Depth parks at 0 when noise isn't
the selected effect, so switching away silences the modulation
exactly like the wet path does.

## Consequences
- The riser now pulses in rhythm — a build that breathes with the
  grid rather than a static hiss ramp.
- Knob still sets centre + wet; the division select now shapes noise
  too, completing the beat-FX grammar.
- No new UI: one LFO + one depth gain on the existing send path.
