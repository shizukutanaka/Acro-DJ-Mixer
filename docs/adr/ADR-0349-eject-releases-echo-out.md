# ADR-0349: Ejecting mid-fade releases the echo-out send too

## Status
Accepted (2026-10-07)

## Context
An auto-mix fade borrows three things from the outgoing deck and
returns all of them on completion or cancel: the filter sweep, the
bass swap, and — in the fade's last 2 beats — the delay send
(`delayWet` lifted to 0.5 for the echo-out tail).

The button-cancel path restored all three. The eject bail-out
(`f.from === this || f.to === this`) restored only filter and
bass: eject during the echo-out window left `delayWet` parked at
0.5. Two leaks followed:

- outgoing deck ejected → next track inherits a phantom 0.5 echo
  send the knob doesn't show;
- incoming deck ejected → the surviving outgoing deck keeps a
  phantom echo send it never asked for.

## Decision
The eject bail-out restores `f.from.setEcho` whenever `f.echoed`
fired — the same line the button-cancel path runs, now applied to
every path that can tear down a fade.

## Consequences
- Every fade-cancel path (button, eject-either-side, completion)
  returns the delay send to the knob position.
- No borrowed FX state can outlive the fade that borrowed it.
