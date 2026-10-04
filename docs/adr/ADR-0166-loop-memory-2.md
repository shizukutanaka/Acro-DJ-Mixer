# ADR-0166: Second loop memory slot

## Context
ADR-0116 gave ↺ one memory slot — a DJ often wants two held loops
(a safe 4-bar plus a build loop), which one slot can't express.
CDJ memory banks exist for exactly this.

## Decision
`Alt+↺` owns slot 2 symmetrically: an armed loop saves into it, a
disarmed click recalls it — same modifier grammar as the rest of
the surface. Slot 1 (shift+↺) is untouched. `reloop()` prefers
slot 1, then slot 2, then the auto exit memory, so a plain recall
still finds the best loop. Slot 2 is cleared wherever slot 1 is.

## Consequences
- Two held loops without a second UI element; the modifier itself
  names the bank.
