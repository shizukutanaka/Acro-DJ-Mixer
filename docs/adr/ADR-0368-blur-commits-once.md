# ADR-0368: The BPM editor commits exactly once

## Context
`done()` ended by clearing `bpmEl.textContent`, which removes the
input — and the removal fires a synchronous `blur` that calls
`done(true)` again, while the node may still report `isConnected`.
Observed effects in a real browser:
- After an Enter commit, the removal blur re-committed and
  overwrote `_prevGrid` with the *new* grid — the grid undo became
  a no-op.
- After Escape, the removal blur *committed the typed value anyway*
  — cancel didn't cancel.

## Decision
Latch the editor: `bpmDone` is set on the first call and every
later `done()` returns at once — first gesture wins, subsequent
blur/Enter are no-ops.

## Consequences
Enter keeps `_prevGrid` at the pre-edit grid (undo restores it),
Escape truly cancels, and a genuine blur-commit still works once.
