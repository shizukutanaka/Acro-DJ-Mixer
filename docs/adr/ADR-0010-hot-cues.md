# ADR-0010: Hot Cues

## Status
Accepted

## Context

DJs mark entry/exit points — the drop, the breakdown — and need to hit
them instantly. A waveform click seeks, but it's imprecise and
unrepeatable; a named cue-list (Serato-style panel) is more UI than this
deck needs. Hardware hot-cue pads hit the atom exactly: a small row of
pads where unset = record here, set = jump.

Since ADR-0008 the library persists each track; cues belong to the
track, so they persist there for free.

## Decision

- Four `.pad` buttons per deck under the transport. **Empty pad, click →
  record `pos()`; set pad, click → `seekTo(cue)`** (keeps play state,
  exits the loop when jumping out — the seekTo contract); **right-click
  → clear**. The pad's title carries the recorded time.
- Markers draw as amber ticks on the waveform (loop region is green,
  playhead white — distinct hue at a glance).
- `Library.tag(libId, {cues})` persists the array on every set/clear;
  `loadInto` passes `meta.cues`, restoring pad state on library loads.
  Fresh file loads reset all four.
- No shift/ctrl chords: click/right-click covers set/jump/clear with
  zero modes to learn (KISS; beginners never ask "what does this button
  do?").

## Consequences

- Set-jump granularity is transport-level (sample-accurate seek through
  the existing `seekTo` — the worklet seeks by sample).
- Cues ride the existing `version`/`updated_at` audit fields via `tag`.
- A pad shows no number-vs-time state beyond `.set` styling + title —
  deliberate: the waveform shows where.

## Rejected alternatives

- A dedicated cue-list panel: duplicates what pads + waveform show.
- Quantizing cues to the beat grid (Pioneer does on some models):
  removes user control; a grid-snap toggle belongs with sync options if
  ever requested.
- Auto-playing on pad press (CDJ hot-cue plays from the point): the
  cue-jump keeps play state; starting playback from a stopped deck on
  pad press is a reasonable future toggle but adds a mode now.
