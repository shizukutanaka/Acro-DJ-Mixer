# ADR-0296: Second right-click stops a sampler audition

## Context

Right-clicking a loaded sampler pad auditions it on the cue bus —
but the audition ran to the sample's end with no way to cut it off.
Right-clicking the same pad again *replaced* the audition with a
fresh start, which is a restart, not a stop. Hot-cue pads got the
stop switch in ADR-0289 (the library ▶ toggle grammar); sampler
pads still lacked it.

## Decision

Track the auditioning pad with `smpPrevPad`, the owner index that
rides alongside `smpPrev`. A right-click on the owning pad while it
rings is a stop; a right-click on a different pad still replaces —
mirroring the hot-cue behavior. `smpPrevPad` clears everywhere
`smpPrev` does: natural end, the click-clear kill, and the
replace-path kill. The loaded-pad title now notes "(again stops)".

## Consequences

- The three audition surfaces (library rows, hot cues, sampler
  pads) now share one grammar: right-click/▶ toggles audition on,
  same gesture again toggles it off.
