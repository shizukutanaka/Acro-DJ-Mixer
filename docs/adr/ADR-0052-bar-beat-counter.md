# ADR-0052: Bar.beat counter next to the BPM readout

## Status
Accepted (2026-10-04)

## Context
ADR-0048 made bar boundaries *visible* on the waveform, but there was
no numeric readout — "we're at bar 9, the 8-bar outro starts at 13"
still required counting ticks. Phrasing decisions are bar arithmetic,
so the number belongs on the deck.

## Decision
A `.barcount` span beside BPM shows `bar.beat` (e.g. `9.3`), computed
in `tick()` from the same grid math as the loop quantizer: bar 1 starts
at `beatOff`, beats count from 1. `—` before the first downbeat or
without a grid, matching the neighbouring BPM `—` convention.

Pure readout: recomputed every frame, no state, nothing persisted.

## Consequences
- "Start the transition on bar N" becomes a concrete number, paired
  with ADR-0048's visual bar lines.
- Cost: one `Math.floor` per deck per frame — free.
