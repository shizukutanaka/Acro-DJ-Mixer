# ADR-0160: Ping-pong echo

## Context
Six FX types but only one stereo identity: the echo stacks its
repeats dead centre. DJM's PING PONG is the space-maker — repeats
hop left/right so the tail wraps around the incoming track instead
of fighting it for the middle.

## Decision
`fxSel` gains `ping` (7th option). Same delay line, same BEAT
division, same knob (v·0.7) — only the feedback loop changes: a
splitter feeds each channel into a merger's *opposite* input, so
each repeat lands on the other side. `setEcho` swaps the loop
direct↔crossed exactly once per selection change (`_pp` flag);
the wiring is built once and the merge just idles when direct.
## Consequences
- The echo family now covers centre-stack (echo) and side-hop
  (ping) with zero extra controls.
- Rewire happens inside `setEcho`, so FX engage/park and session
  restore normalize it like every other wet path.
