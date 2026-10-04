# ADR-0082: Recording elapsed timer on the Rec button

## Status
Accepted (2026-10-04)

## Context
The Rec button only showed an `on` highlight — no answer to "how long
has this been running?", which is also the catch for a forgotten take
left rolling through a whole set.

## Decision
On `recorder.start()` a 1-second interval writes `Rec M:SS` into the
button label; `onstop` clears the interval and restores `Rec`.

## Consequences
- Zero extra UI: the button is the readout.
- Elapsed time is `performance.now()` based — independent of
  MediaRecorder chunking.
