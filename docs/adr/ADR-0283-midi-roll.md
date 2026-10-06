# ADR-0283: MIDI loop roll — notes 80/81, gated

## Status
Accepted.

## Context
Loop roll is the app's only momentary-only verb — a held ROLL pad on
hardware — and the MIDI map had no note for it. 80/81 are free above
the transport block.

## Decision
Note-on 80/81 calls `startRoll(1)` on decks A/B; every note-off
(0x80 or velocity-0 0x90) calls `stopRoll()` — a roll is momentary
by nature, so unlike the sampler pads there's no ≥250 ms latch
threshold. The note-off branch was generalised from its
sampler-pads-only condition.

## Consequences
Roll joins the gated MIDI gestures (sampler pads) with the same
press-and-release feel a controller's ROLL pad has.

## Round
Improvement round 285.
