# ADR-0079: Manual BPM entry on the readout

## Status
Accepted (2026-10-04)

## Context
Tempo correction had three tools for three failure modes: tap tempo
for unknown tracks, ½/2× for octave errors, beat shift for phase —
but nothing for "I know it's 118.5, the analyser said 118.2". Typing
the value is the fastest fix and the one DJs ask for on real files.

## Decision
Click the `.bpm` readout: an inline `<input>` takes the current value
selected; Enter or blur commits (30–400 validated), Esc cancels. A
commit writes `grid.bpm`, persists via `tagLib`, re-syncs the echo
delay, and redraws the waveform ticks. Works gridless too — it seeds
`{bpm, beatOff:0}`.

## Consequences
- `keydown` is `stopPropagation`'d so deck hotkeys can't fire while
  typing (the global guard already skips text inputs).
- Correction toolkit complete: estimate → tap → type → octave →
  ms-nudge → beat-shift.
