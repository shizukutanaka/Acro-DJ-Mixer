# ADR-0130: Sync leader — partner deck follows tempo and phase

## Context
`Sync` (ADR-0002) is a one-shot beat-match: it snaps tempo and phase
once, then lets go. Hardware mixers also ship SYNC MASTER — arm one
deck as leader and the other deck's tempo + phase are *continuously*
driven by it, so riding the leader's pitch keeps the blend glued and
the follower's own fader rides are overridden. We had no such mode.

## Decision
**Alt+Sync** toggles leader mode on a deck (`.on` class on the button;
one leader at a time — arming A disarms B). While armed, the tick loop
re-applies the same beat-match math to the partner every frame:

- **Tempo** — required rate re-computed each frame and applied via
  `setRate` when it drifts > 0.05 %, so leader fader rides propagate.
- **Phase** — wrapped beat-phase drift computed like `syncTo`, but the
  corrective `seekTo` fires only when drift exceeds 0.06 beat: a
  `seekTo` on a playing deck restarts the BufferSource, so per-frame
  correction would re-start it 60×/s. The 1/16-beat hysteresis is
  inaudible and makes corrections rare discrete snaps.

`Eject` clears leader mode. Plain Sync (one-shot) and Shift+Sync
(phase-only) are unchanged.

## Consequences
- A leader deck's pitch rides keep a long blend coherent without
  touching the partner's controls — the classic "ride the master,
  never the slave" workflow.
- The follower's own tempo input still works (the next frame
  overrides it) — matching hardware, where sync owns the slave fader.
- No new UI surface: the Sync button gains a lit state and an alt
  modifier, in line with the existing modifier grammar.
