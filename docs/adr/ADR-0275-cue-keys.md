# ADR-0275: Headphone cue on the keyboard

## Status
Accepted.

## Context
The keymap covers play, pads, sync, loop, fader and master — but
headphone cue, the second-most-hit transport on a real mixer, was
mouse-only. Keyboard-first mixing stopped at the ears.

## Decision
`w` toggles deck A's cue, `o` toggles deck B's — each sits beside its
play key (q→w, p→o) so the pair reads as transport + ears. The help
overlay's Keys line lists them.

## Consequences
Full cue workflow without a pointer; no conflicts (w/o were unmapped).
Momentary-hold and solo-cue stay pointer gestures — the keys cover
the latch, the common case.

## Round
Improvement round 277.
