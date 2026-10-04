# ADR-0030: Beat-Grid Nudge (Phase Trim)

## Status
Accepted

## Context

ADR-0025 got detected phase to ~ms accuracy on clean onsets — but
production with pickup notes, swing, or soft attacks still lands the
grid a few ms off where the ear hears the beat. Correcting tempo
(ADR-0028/0029) doesn't help when tempo is right and phase is wrong.

## Decision

- `‹`/`›` buttons on the BPM row: `nudgeGrid(±0.01)` shifts
  `grid.beatOff` by 10 ms per click, re-draws ticks, persists via
  `tagLib` — the waveform shows ticks moving over transients, so
  alignment is a visual task, not guesswork.
- Works only with an existing grid (auto-detected or tap-set).

## Consequences

- Closes the manual-correction trio: tempo (`½`/`2×`, `Tap`), now
  phase — any grid is fixable in place without reloading the track.
- All grid consumers (Sync, quantize, loops, phase meter) follow
  automatically since they derive from `grid.beatOff`.

## Rejected alternatives

- Drag-the-grid on the waveform: fiddly hit-testing on a canvas that
  already owns seek clicks; discrete 10 ms steps are precise enough
  and discoverable.
- Fraction-of-beat steps (e.g. 1/32 beat): couples the trim to tempo
  changes in surprising ways; a fixed ms step is predictable.
