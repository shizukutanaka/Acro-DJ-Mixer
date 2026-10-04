# ADR-0078: Shift+nudge — move the grid one beat

## Status
Accepted (2026-10-04)

## Context
Grid nudge (ADR-0030) trims beatOff ±10 ms for eyeballing ticks onto
transients — the right tool when detection is *close*. When the
analyser locks onto the off-beat or misses the first downbeat, the
error is a whole beat: 50 nudges at 120 BPM.

## Decision
Shift+`‹`/`›` moves `beatOff` by ±`60/bpm` instead of ±10 ms. Same
`nudgeGrid` path — persists via `tagLib`, redraws the waveform. No new
controls.

## Consequences
- Coarse (beat) and fine (ms) grid repair on one pair of buttons.
- Gridless decks keep the 10 ms fallback (the shift branch needs a
  `grid` to know the beat length).
