# ADR-0344: Restored loop memory slots refresh the Reloop title

## Status
Accepted (2026-10-07)

## Context
`_memTitle()` bakes the saved memory slots' regions into the Reloop
button's tooltip — `[start–end]` per slot so the DJ can see what's
banked before reaching for it. `load()` restores `_loopMem` /
`_loopMem2` from `meta` (ADR-0221) but never refreshed the title, so
after every load — library, file, eject-undo, deck swap — the
tooltip kept showing the *previous* track's memory regions while
reloop actually recalled the new ones: a lying hint. `eject()`
already calls `_memTitle()` when it clears the slots; load's restore
was the asymmetric half. (Flagged by review on ADR-0343: the same
gap surfaces through `swapWith`'s meta restore.)

## Decision
`this._memTitle()` runs right after the slots are restored in
`load()` — inside the same block where pads get their restored
titles, keeping every "restore a field, refresh its hint" update in
one place. No behaviour change when meta has no slots: the helper
re-derives the whole string, so a slot-less track yields the base
tooltip.

## Consequences
- The Reloop tooltip always names the slots that actually recall —
  load, swap, and eject-undo paths alike.
- One more "restore X ⇒ refresh X's affordance" invariant codified;
  future meta fields get the same treatment at the point of restore.
