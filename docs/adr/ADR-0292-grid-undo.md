# ADR-0292: Right-click the tempo controls undoes the last grid write

## Context

Three grid ops overwrite the saved beat grid — tap tempo (bpm +
beatOff), manual BPM entry (bpm), and grid nudge (beatOff) — and
each writes straight through to the library record. A mistimed tap
or a wrong typed tempo destroyed carefully tuned prep with no way
back. ADR-0291 gave the cue point the same treatment; this is the
grid half of the audit's "undo ring (cue/loop/grid ops)".

## Decision

- Every destructive grid write stashes the outgoing `{bpm, beatOff}`
  — or `null` when there was no grid — into `this._prevGrid` first.
- Right-click on `.bpmctl` (the span holding Tap and the ‹ › nudge
  buttons — the controls that change the grid) restores it: grid
  object rebuilt or cleared, library re-tagged, FX timing
  resynced, readout and waveform redrawn. The stash is consumed, so
  the undo stays one level deep like every other right-click undo.
- `_prevGrid` resets on load and eject — the undo belongs to the
  track it was taken from.
- `undefined` means "no undo available"; `null` is a real value
  meaning "restore to no grid".

## Consequences

- All four destructive prep writers (cue point, hot cues, sampler
  pads, grid) now share the one-level right-click undo grammar.
- The gesture is on the controls that cause the damage, not the
  readout — clicking the BPM text still opens the inline editor.
