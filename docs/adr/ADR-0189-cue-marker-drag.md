# ADR-0189: Drag a hot-cue marker on the waveform

## Context
A cue set a hair early or late cost shift-click to clear plus a
re-hit — the waveform showed the colored tick but couldn't fix it.
The scrub gesture and the marker occupied the same surface with no
way to tell them apart.

## Decision
Pointerdown within 8 px of a cue marker captures that pad's cue
instead of scrubbing: the drag writes `cues[i]` live through
`quantize()` (snaps when Qtz is on), clamped inside the buffer, and
the pad title follows. Pointer-up persists via `tagLib` like a
shift-click set. Empty waveform still scrubs.

## Consequences
- Cue placement becomes fix-where-you-see-it — one drag instead of
  clear + re-trigger.
- Hit-testing precedes the scrub branch only when a marker is near,
  so the rest of the strip behaves as before.
