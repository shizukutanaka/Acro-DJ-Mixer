# ADR-0418: One helper owns track-scoped gesture abandonment; soundBounds is a function

## Status

Accepted (2026-10-14)

## Context

`load()` has grown to ~240 lines and carried two blocks that were
hand-kept duplicates:

- The *gesture abandonment* tail — loop state, slip/roll latches,
  BPM-edit and emergency-loop flags, slice audition, cue-preview,
  the momentary-hold releases on Cue/Slip/FX/EQ-kill buttons, mute
  lamp, waveform-drag abort — existed verbatim in both `load()` and
  `eject()`. Every round of ADR-0253-style "a held gesture must die
  with its track" fixes had to patch both copies; the class keeps
  recurring because the list lives in two places and any new held
  gesture added to one silently survives the other.
- The *silence-bound scan* — first sample above −50 dBFS within a
  30 s lead window, last such sample over the whole buffer — was an
  inline block in `load()` that couldn't be tested in isolation.

## Decision

- `_dropTrackGestures()`: the abandonment block, one private method
  called by both `load()` and `eject()`. Comments live once, on the
  helper.
- `soundBounds(buf, floor = 0.003, leadSec = 30)`: a pure top-level
  function returning `{start, end}` in seconds, with exactly the
  semantics the inline block had — the analogue of Mixxx
  AnalyzerSilence / librosa.effects.trim. `load()` keeps its
  `_prevCueIn`/`_lastClear` resets and assigns from the result.

## Consequences

- Zero behaviour change — same statements, same order, same values.
- The next held-gesture flag gets one place to be abandoned, closing
  the drift class instead of doubling it.
- `soundBounds` is testable pure code; the smoke gate now pins its
  floor, its any-channel rule, and its 30 s lead cap.
