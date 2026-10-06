# ADR-0293: Right-click Reloop undoes the last loop-memory overwrite

## Context

Shift+↺ stores the armed loop into memory slot 1, alt+↺ into slot 2 —
both write straight through to the library record. Overwriting a
carefully saved loop memory with a stray keypress destroyed the old
bounds with no way back. This completes the audit's "undo ring": every
destructive prep op (cue point, hot cues, sampler pads, grid, loop
memory) now shares the one-level right-click undo grammar.

## Decision

- Each slot save stashes `{ slot, mem }` — `mem` may be `null`, meaning
  "undo restores an empty slot" — into `this._prevLoopMem`.
- Right-click on the ↺ button restores the stashed slot and re-tags the
  library; the stash is consumed so the undo stays one level deep.
- `_prevLoopMem` resets on load and eject — the undo belongs to the
  track it was taken from. `undefined` means "no undo available".

## Consequences

- Memory-slot recall semantics are unchanged; only overwrite gains a
  safety net. The gesture follows the established pattern: right-click
  on the control that caused the damage.
