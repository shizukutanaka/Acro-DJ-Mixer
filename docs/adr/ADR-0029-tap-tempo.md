# ADR-0029: Tap Tempo

## Status
Accepted

## Context

ADR-0028 fixed octave misreads, but tracks the detector can't read at
all (ambient, rubato, live recordings) still had no path to a grid —
no Sync, no quantize, no loops. Every hardware deck solves this with
a tap button: the human ear is the fallback detector.

## Decision

- `Tap` button on the BPM row. `tapTempo()` records
  `{ms: performance.now(), pos: this.pos()}` per click; after two taps
  it derives `bpm = 60000 / median(inter-tap interval)` (window of 8,
  median kills the odd early/late tap), sets `grid.bpm`, and anchors
  `grid.beatOff` to the track position of the last tap — tempo AND
  phase in one gesture.
- A >2 s gap resets the series (treat as "start over"), and out-of-
  range results (40–400 BPM, same clamp as `scaleBpm`) clear the
  series with a status hint.
- Creates `grid` when none exists — tapping alone unlocks Sync,
  quantize, loops, and ticks on unanalysable files. Persists via
  `tagLib`.

## Consequences

- Manual grid entry for any audio, zero dependencies.
- Accuracy is human (~±1–3 BPM for 4 taps) — enough for Sync and
  quantized loops; the ½/2× buttons (ADR-0028) remain for coarse
  correction.

## Rejected alternatives

- Mean of intervals: one stray early tap skews it; median is the
  standard robust choice.
- Longer windows / exponential smoothing: diminishing returns; the
  user sees drift live via the phase meter (ADR-0023) and re-taps.
