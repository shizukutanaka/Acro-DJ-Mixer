# ADR-0147: Sampler pad cue preview

## Context
A sampler pad fires straight into the master chain — the first time
you hear a loaded one-shot, so does the floor. Library rows already
solve this with ▶ auditioning on the cue bus (ADR-0080); pads had
no equivalent.

## Decision
Right-click on a loaded pad plays its buffer into `cueBus()` —
the same headphone bus the library preview and PFL use — instead
of `smpGain`. The audition is a separate voice (`smpPrev`), so it
doesn't choke, doesn't light the pad's `on` marker, and doesn't
touch the pad's live voice: you can preview while a shot rings on
the master. A new audition stops the previous one; right-click on
an empty pad is a no-op.

## Consequences
- Pads are auditionable like any other material before it reaches
  the program — one consistent "hear it in headphones first" rule.
- Zero effect on the master path: previewing can't accidentally
  fire, choke, or light anything.
- Occupies the right-click that was previously unused on pads.
