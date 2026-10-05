# ADR-0154: Mic noise gate

## Context
An open mic pours room tone and hiss onto the master between
phrases — every broadcast desk and DJM runs a gate or a
press-to-talk for exactly this reason. Our chain had EQ but no
expander, so "mic open" meant "noise floor up" for the whole set.

## Decision
A `micGate` gain closes the chain (`micHigh -> micGate -> monoNode`)
and rides the same analyser the button indicator reads — no extra
tap. Snap open above 0.04 peak (5 ms), sink to a −22 dB floor after
~300 ms under threshold (50 ms): the floor breathes rather than
chopping speech tails. The gate builds and tears down with the mic
chain.

## Consequences
- Open mic no longer taxes the master with constant room noise —
  gate opens only while you actually speak.
- Zero new UI: thresholds are fixed like the HPF's 120 Hz, part of
  "the mic section" rather than another knob.
- Indicator still reads pre-gate input, so the button shows what
  the mic hears even while gated down.
