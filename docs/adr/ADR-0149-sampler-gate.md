# ADR-0149: Sampler gate mode — press-and-hold pads

## Context
Pads were trigger-only: tap fires, the shot rings to its end, and
the only way to shorten it was alt-clicking to stop. SP pads and
DJM samplers offer GATE alongside trigger — the stab that plays
only while your finger is down.

## Decision
Same hold idiom as momentary kills, deck mute, and the FX button
(ADR-0117/0137/0144): `pointerdown` on a loaded pad arms a 250 ms
timer that calls the extracted `firePad()`; `pointerup`/`cancel`
stops the voice and suppresses the trailing click, so a tap still
fires the full one-shot through the existing click path. Guarded to
plain left-press — shift (clear/resample), alt (stop), and
right-click (cue preview) are unaffected.

## Consequences
- Staccato stabs and chopped-shot playing on pads with no mode
  switch — the gesture decides trigger vs gate.
- The fire path is now a named function shared by both gestures;
  no behaviour changed inside it.
- Momentary grammar is now uniform across kills, mute, FX, and
  pads: tap = latch, hold = momentary.
