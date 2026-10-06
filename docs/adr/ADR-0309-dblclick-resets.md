# ADR-0309: Double-click resets on the last three knobs

## Context

Every control with a "home" value double-clicks back to it — tempo,
gain, fader, EQ, filter, echo, crossfader, master, sampler pitch,
mic trim — except three: phones volume, cue mix and sampler level.
A knob you can't snap home mid-set costs a drag-and-squint.

## Decision

Same idiom as the rest: `dblclick` sets the default and dispatches
`input` so gain + readout update together — `cuevol` → 1 (100%),
`cuemix` → 0 (cue only), `smp-gain` → 0.8. Titles name it like the
other knobs.

## Consequences

- Reset grammar is complete: every knob snaps home.
