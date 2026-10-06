# ADR-0291: Right-click Cue undoes the last cue-point overwrite

## Context

Shift+Cue rewrites the saved cue point at the playhead — the
rekordbox-style re-cue. It is the only destructive prep op that still
had no undo: a hot-cue clear restores via right-click on the empty
pad, a sampler clear the same, an eject via right-click on the empty
dropzone. A cue point overwritten by a stray shift-click was simply
gone, and the wrong value was already persisted to the library.

## Decision

- Shift+Cue stashes the outgoing value in `this._prevCueIn` before
  writing.
- Right-click on the Cue button restores it: `cueIn` reverts, the
  library record is re-tagged, the waveform marker and button title
  update, and `_prevCueIn` clears so the gesture is one level deep —
  exactly the undo grammar the pads and dropzones already use.
- `_prevCueIn` resets on load and eject: the undo belongs to the
  track it was taken from.
- Undo restores the *data*, not the transport — the playhead stays
  where it is; the next Cue press lands on the restored point.

## Consequences

- Every destructive prep op now has the same one-level, right-click
  undo. Discoverability follows the existing pattern: the gesture
  isn't advertised on the button, matching the pad/dropzone undos.
