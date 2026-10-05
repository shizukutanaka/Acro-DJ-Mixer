# ADR-0162: Waveform mini overview

## Context
Zooming the waveform (ADR-0043) trades context for detail — deep in
a zoomed scrub you lose "where in the track am I". CDJ answers this
with the phase/overview strip.

## Decision
A 18 px `.wave-mini` canvas under each deck's waveform reuses
`this.peaks` decimated to 640 px: peaks, the loop band, the white
playhead, and — only when `zoom > 1` — a viewport box showing the
slice the main wave is displaying. Drawn inside `drawWave`'s
existing pass; no new timers or state.

## Consequences
- Orientation is free and always on: position, loop coverage, and
  zoom viewport at a glance.
- Single source of truth — same peaks and loop bounds as the main
  wave, so it can never disagree with it.
