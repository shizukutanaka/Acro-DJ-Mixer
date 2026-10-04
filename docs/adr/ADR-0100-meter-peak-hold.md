# ADR-0100: Peak-hold tick on channel meters

## Status
Accepted (2026-10-04)

## Context
Channel meters showed instantaneous level only — a transient that
clips is gone in 50 ms, so the eye never catches it. Hardware meters
add a peak-hold segment.

## Decision
A `b` marker inside each `.chm` meter tracks a decaying peak:
`chPeak = max(p, chPeak − 0.012)` per frame (~2%/frame, full decay
in ~1.4 s) rendered as a 2 px tick at `left = peak·100%`.

## Consequences
- Reads like the max-hold segment on a DJM channel meter: the tick
  lingers where the level peaked, then falls back.
- Pure view state — `chPeak` resets with the deck; no audio path
  touched.
