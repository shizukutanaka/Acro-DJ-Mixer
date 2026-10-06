# ADR-0326: Window blur releases every momentary latch

## Context

Every momentary control — Phones PFL, Slip, FX punch, EQ kills,
deck mute, mic, roll, pitch bend, hot-cue slips, waveform scrub /
jog / cue-drag — ends on `pointerup`/`pointerleave`/`pointercancel`.
A window blur mid-hold steals the pointerup: alt-tab while holding
Phones and the PFL stays open; release the mouse on the other window
and the app never learns. ADR-0325 fixed this for `bendMul` alone;
the rest of the class remained.

## Decision

On `window` `blur`, fan a synthetic `pointercancel` out to every
element that can be mid-hold (`button, canvas, .pad,
input[type=range]`). Each momentary surface already binds
`pointercancel` to its own end handler, so the sweep reuses the
existing teardown paths — unarmed elements simply no-op, no registry
needed. Covers the pointer-capture-loss case uniformly instead of
patching each control.

## Consequences

- No momentary state survives focus loss: nothing stays held, muted,
  killed or scrubbing after the tab comes back.
- ADR-0325's bend reset remains as belt-and-braces inside
  `stopPlayback`; this sweep is the general guarantee.
