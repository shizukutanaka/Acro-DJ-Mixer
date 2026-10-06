# ADR-0199: Alt+Eject = full channel reset

## Context
`eject()` unloads the track but deliberately keeps the control
strip (ADR-0084) — tempo, gain, EQ kills/bands, filter and
transpose stay where the last track left them. Handing the
channel over clean — next track, or the next DJ — meant zeroing
half a dozen controls by hand.

## Decision
Alt+⏏ calls `resetChannel()`: `eject()`, then tempo→1, gain→1,
every EQ band→0 with kills off (button classes cleared), filter→0,
transpose→±0 st. Same two-click `armConfirm` guard as plain eject
on a playing deck — alt selects the deeper reset, it doesn't
skip the guard.

## Consequences
- One gesture returns the strip to factory state — no more
  inheriting a fat-fingered −8% tempo or a left-on kill.
- Plain eject unchanged: control-strip persistence stays the
  default (ADR-0084 stands).
