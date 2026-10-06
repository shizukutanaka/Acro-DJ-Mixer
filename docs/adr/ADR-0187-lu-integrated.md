# ADR-0187: Integrated loudness view on the LU readout

## Context
The LU readout (ADR-0139) showed only the ~400 ms momentary window,
answering "how loud right now" but never "how loud has the set been
overall" — the second readout every real LUFS meter carries for
stream/recording checks.

## Decision
The same K-weighted mean-square taps feed a running sum + count.
Clicking the readout toggles between momentary (`… LU`) and
integrated (`… I`, since page load); double-click resets the
integrated accumulator, the same reset a hardware meter offers.
The −14±1 LU target green applies to whichever view is showing.

## Consequences
- A DJ checking stream loudness sees the programme value, not just
  instantaneous levels.
- The accumulator is two numbers; the momentary ring is untouched.
