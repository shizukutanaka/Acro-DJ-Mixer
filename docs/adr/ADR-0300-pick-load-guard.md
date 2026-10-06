# ADR-0300: File-pick load shares the playing-deck guard

## Context

ADR-0153 armed a two-gesture confirm for drops onto a playing deck —
loading over a playing deck silences the floor. But the dropzone's
*other* load path — click → file picker — bypassed it entirely:
`change` went straight to `this.load(f)`. One stray click + pick on
a running deck swapped the track mid-set with no guard at all,
exactly the accident class the drop path already defends.

## Decision

The `change` handler runs the same `armConfirm(dz, ...)` check as
`drop`: first pick on a playing deck arms, a second inside the
window loads. `file.value` still resets up front so picking the
same file twice fires `change` both times.

## Consequences

- Every path that loads over a deck — drop, file pick, library row,
  ‹ › steppers, instant doubles — now shares the two-gesture guard.
