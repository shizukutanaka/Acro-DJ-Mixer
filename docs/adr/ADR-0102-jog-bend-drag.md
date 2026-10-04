# ADR-0102: Shift+waveform drag — jog bend while playing

## Status
Accepted (2026-10-04)

## Context
Dragging the waveform always seeks — fine when stopped, but while a
track plays a DJ expects the jog to bend pitch (finger on the
platter), not jump the playhead.

## Decision
`Shift+pointerdown` on the waveform while playing enters jog mode:
`pointermove` sets `bendMul = clamp(1 + movementX·0.01, 0.7, 1.3)`
and a 40 ms interval pulls it back toward 1 (±0.15 per tick), so a
held finger means "nudge then settle" rather than a permanent bend.
Release restores `bendMul = 1` through the same `setRate` path the
bend buttons use. Plain drag still scrubs, including while playing —
the shift modifier is the discriminator.

## Consequences
- Feels like CDJ vinyl mode: flick right = speed up into the mix,
  flick left = drag it back, let go = tempo.
- No new UI; the bend multiplies engine rate like the −/+ buttons.
