# ADR-0376: Every loop-armer stamps slip time

## Context
ADR-0375 fixed `reloop()` leaving stale `_loopT`/`_loopEnterPos`
behind — a Slip-mode exit then dead-reckoned from the previous
loop's entry and could teleport the deck to the track's end. A
sweep of every `loopOn = true` site found the same omission in the
tick-driven emergency loop: it armed bounds and `loopOn` but left
slip time stale (or null), so a Slip-mode exit either mis-seeked
or silently skipped the true-timeline landing it should compute.

## Decision
The emergency loop stamps `_loopT = ctx.currentTime` and
`_loopEnterPos = pos()` on arm. Remaining armers by design:
`startRoll` nulls the fields (rolls own their own slip bookkeeping),
`stopRoll`'s saved-loop restore stays null (conservative in-place
exit), and `load()`'s `_savedLoop` arm runs after the field reset
(stopped deck — no dead-reckoning needed).

## Consequences
The rule is now enforced everywhere: `loopOn = true` implies
correct slip-entry state; exits never read a stranger's arm time.
