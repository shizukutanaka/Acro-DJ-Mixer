# ADR-0173: MIDI transport block

## Context
MIDI covered play (44/45), pads, and every fader, but the other
transport verbs — sync, loop arm, cue — still required the mouse
or keyboard. A controller's transport cluster sits unused.

## Decision
Note-ons 46/47 call `syncTo`, 48/49 call `toggleLoop`, 50/51 call
`cue` on deck A/B respectively — the same methods the on-screen
buttons invoke, so behaviour (shift variants aside) is identical.

## Consequences
- A controller's transport row now covers play, sync, loop, and
  cue; the whole performance verb set is hardware-reachable.
