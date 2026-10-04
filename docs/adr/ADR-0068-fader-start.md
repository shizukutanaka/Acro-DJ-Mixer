# ADR-0068: Fader start — sweep fully into a deck's side to play it

## Status
Accepted (2026-10-04)

## Context
Hardware mixers ship CH/CROSS FADER START: pushing the crossfader
fully into a stopped deck's channel fires it. It's how scratch DJs
trigger cued sounds and how transitions get attacked without touching
the deck. The app had no equivalent — starting a deck always meant a
button press, a slower gesture than the fader your hand is already on.

## Decision
An `input` listener beside `applyCrossfade()` tracks `xfPrev`; when
the (reverse-aware) position *crosses into* the last 5% toward a side
and that deck has a buffer, is stopped, and isn't past its end, it
`play()`s. Edge-triggered: nudging inside an already-parked side does
nothing, but pulling out and slamming back in re-fires — matching
hardware behavior and enabling rhythmic retriggers.

## Consequences
- Works with `xfRev` (uses `xfPos()`) and both curves.
- Auto-mix is unaffected: the incoming deck is already playing, so the
  stopped-check never misfires mid-fade.
- No settings: always on, like the rest of the house gestures.
