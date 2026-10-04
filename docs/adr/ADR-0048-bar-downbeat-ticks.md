# ADR-0048: Bar downbeat emphasis on the beat grid

## Status
Accepted (2026-10-04)

## Context
Every beat-grid tick on the waveform looked identical. Mixing decisions
are made on *bars* — "bring it in on the one", "8-bar outro" — but the
downbeat was invisible among 3 other ticks. Software that shows bar
lines (Serato, rekordbox) makes phrase structure readable at a glance.

## Decision
Count beats from `beatOff` while drawing ticks: every 4th beat (n%4==0)
renders 2 px at 70 % alpha instead of 1 px at 35 %. Beat 0 = `beatOff`,
consistent with loop quantization (ADR-0006), which also measures bars
from grid beats — the 4-loop always starts on a drawn downbeat.

No downbeat *detection*: `beatOff` is anchored to the first detected
beat, which is the best bar reference we have; if the analysis anchors
mid-bar the emphasis shifts with the grid — nudge (ADR-0030) shifts it
back, the same knob that fixes tick placement.

## Consequences
- Bar structure is visible free; at high zoom the stronger ticks mark
  the boundaries that matter for loops and phrase mixing.
- Zero new state — pure rendering rule in `drawWave`.
