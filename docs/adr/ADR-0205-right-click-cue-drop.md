# ADR-0205: Right-click drops the cue point on the waveform

## Context
Moving `cueIn` meant either parking the playhead and hitting
Shift+Cue, or grabbing the cyan tick and dragging (ADR-0190).
The direct gesture — see the transient, drop the cue there —
didn't exist; the waveform's context menu was unused.

## Decision
`contextmenu` on the main waveform maps the click's x to a time
through the same `_viewSpan` math `seekFromEvent` uses, writes
`cueIn`/`offset`, persists via `tagLib`, and redraws — identical
to the Shift+Cue write path. Default browser menu suppressed
only when a buffer is loaded.

## Consequences
- Cue placement is a one-step gesture: look, right-click, done.
- Quantize continues to govern the stored value wherever the
  write path applies it (ADR-0200).
