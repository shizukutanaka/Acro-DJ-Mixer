# ADR-0219: Effective BPM beside the detected tempo

## Context
The BPM readout showed the analysed tempo — after moving the
tempo fader, the number on screen no longer matched what was
actually playing, and that effective BPM is the value a DJ
actually beat-matches against.

## Decision
`setRate` writes `→<grid.bpm × rate>` into a muted `<i>` next to
the detected BPM whenever |rate−1| > 0.5% — at ±0 the readout
stays clean. Grid arrival and eject keep it consistent.

## Consequences
- Both numbers visible at once: the song's tempo and the deck's
  current tempo — the pair every beat-match is between.
