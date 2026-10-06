# ADR-0182: FX off gates the send, not the tail

## Context
Turning the FX button off drove every wet gain to zero — an echo or
reverb tail already in the line was hard-cut. On a DJM, OFF closes
the effect's input and the tail decays naturally; a hard cut makes
the release of a momentary punch (ADR-0144) audible as a click in
the music.

## Decision
`delaySend`/`verbSend` gains now sit on the delay and convolver
inputs; `setEcho` closes them when `fxOn` is false or the selection
is elsewhere, and leaves `delayWet`/`verbWet` parked at the knob's
level — so a stored tail rings out at the wet level the DJ set.
Dry-path effects (trans, crush, noise, flange) take the zeroed copy
as before: their "off" is a bypass, not a send close.

## Consequences
- Releasing FX mid-tail sounds like hardware: the send closes and
  the repeat/verb decays on its own instead of vanishing.
- The momentary punch gesture gains the echo-out behavior for free.
