# ADR-0419: A waveform hot-cue drag gets the same one-level undo as every other cue overwrite

## Status

Accepted (2026-11-03)

## Context

The right-click grammar promises "one-level undo on the thing that
was just broken": cleared hot cue on an empty pad (`_lastClear`),
cleared sample on an empty sampler pad, cue point on the Cue button
(`_prevCueIn`), grid write on the tempo controls (`_prevGrid`),
loop-memory overwrite, eject on an empty dropzone. One destructive
cue write stood outside the grammar: dragging a colored hot-cue
tick on the waveform overwrote `cues[i]` and persisted it, with no
way back but shift-clear + re-hit at the right playhead position —
the exact repair cost the drag gesture exists to avoid.

## Decision

- `this._movedCue = { i, t }` stashes the pre-drag position on the
  first pointermove that actually changes it — the grab position
  stays in a gesture-local var (`cueDragFrom`), so a bare click on
  the tick is not an overwrite and can't eat the previous record or
  the pad's right-click preview. Same treatment for the cueIn tick:
  `cueInDragFrom` replaces the grab-time `_prevCueIn` write that had
  the identical defect.
- Right-click on the pad that was just moved restores `t` first —
  consumed on use, then the gesture is cue-bus preview again. Only
  that pad's right-click is captured; previews elsewhere are
  untouched.
- `clearPad(i)` drops a `_movedCue` for the same pad: the clear
  stash takes over the pad's undo, so a stale drag record can't
  resurrect the pre-drag position after a re-set.
- `load()` / `eject()` reset `_movedCue` next to `_lastClear` —
  the undo belongs to the track that was overwritten.

## Consequences

- The audit's open "undo for waveform cue-drag writes" item closes;
  every cue-write path (set, drag, clear) now has its one-level
  restore inside the same right-click grammar.
- Cost: after a drag, one right-click on that pad restores instead
  of previewing — consistent with every other overwrite site.
