# ADR-0044: Auto-cue — skip lead-in silence on load

## Status
Accepted (2026-10-04)

## Context
Every track loads with the playhead at sample 0 — including lead-in
silence. On hardware (CDJ AUTO CUE) the deck finds the first sound for
you: pressing Play drops the beat exactly on the first transient and
Cue always returns to that point, not into dead air.

## Decision
On load, scan channel 0 (mono would change nothing — silence is silent
in every channel) for the first sample above −50 dBFS, at most 30 s in.
That time is stored as `cueIn` and becomes:

- the initial `offset`, so the playhead starts on the first sound;
- the target of the `Cue` button, which now seeks `cueIn` instead of 0.

The worklet is told via the same `seek` message shape already used by
`seekTo`. A status note (`auto-cue +2.0s`) is shown only when the skip
is audible (> 50 ms). No UI, no persistence — `cueIn` is per-load and
recomputed every time, matching hardware.

## Consequences
- First Play lands on the transient regardless of mastering silence.
- A track that is silent for > 30 s still cues at whatever was found
  within the window; a fully silent track cues at 0 — both harmless.
- `cue()` needed a `buffer`-guarded `seek` post identical to `seekTo`'s;
  it already assumed a loaded deck, unchanged.
