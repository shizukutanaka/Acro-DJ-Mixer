# ADR-0091: Mic talkover — duck the deck bus while the mic is open

## Status
Accepted (2026-10-04)

## Context
Mic input (ADR-0067) mixed the voice at unity against the music —
broadcast's answer is talkover/ducking: squeeze the program ~12 dB
while the mic is open so speech stays intelligible, restore when it
closes.

## Decision
A `micDuck` gain between `masterGain` and `monoNode`: mic on ramps it
to 0.25 (~−12 dB) over 150 ms, mic off ramps back to 1. The mic still
injects at `monoNode` — after the duck — so it lands undimmed, and
everything stays inside the shared limiter.

## Consequences
- Duck affects only the music path; PGM cue send taps `masterGain`
  upstream so headphone monitoring is unchanged.
- Toggle is already transient (mic click), so ramp constants can be
  short — 150 ms reads as an intentional dip, not a swell.
