# ADR-0150: Sampler loop mode

## Context
Pads were one-shot only — a resampled deck loop (ADR-0145) fired
once and died, so the obvious follow-up move "capture the groove,
let it ride under the blend" needed the pad to repeat. SP pads and
every sampler row carry the same one-shot/loop choice.

## Decision
A `Loop` checkbox on the Smpl row sets `src.loop` at fire time.
Everything else is unchanged: choke, alt-stop, gate release, and
the shared `smpGain` bus behave identically — a looped voice still
dies on alt-click, another pad's choke, or gate release, and
untoggling returns new fires to one-shot. The flag is read when the
voice is created, so flipping it mid-ring never desyncs a playing
pad from its mode.

## Consequences
- "Resample a loop → ride it" is now a two-gesture workflow
  (shift+pad, Loop on, fire) entirely inside the page.
- Loop is a fire-time property of the voice, not the slot: pads
  fired before the toggle keep their original mode to the end.
- One checkbox, zero new node types — a BufferSource flag only.
