# ADR-0342: Two-click confirms survive a mid-window re-render

## Status
Accepted (2026-10-04)

## Context
`armConfirm` arms a destructive click for 2 s ("sure?"), then a second
click inside the window runs the action (ADR-0104/0105/0131/0300). The
armed state lived on the button element itself (`b._arm`, and the
label it swapped in). Library-row buttons are not stable elements:
`renderLibrary()` rebuilds `#lib-rows` via `innerHTML` on *every*
record write (cue tags, play counts, pad saves, bgScan results,
previews) — writes that land routinely during playback. A re-render
inside the 2 s window discarded the element *and its arm*, so the
confirm click arrived at a fresh button and re-armed instead of firing:
delete/load guards on library rows could never complete while the
library kept writing. The same rebuild also raced the restore callback
(some `sure?` could stick on a detached node — harmless but dead).

## Decision
Keyed arm state, kept in `armStates` (a `Map`), for buttons whose
subtree re-renders. `armConfirm(b, fn, key)`:

- with `key`, the arm timestamp lives in `armStates` — the row can be
  rebuilt any number of times and the second click on the *fresh*
  button still fires `fn`; consumed on fire, expired after 2 s.
- without `key`, behaviour is unchanged — element `_arm` + label swap,
  for controls whose element is never rebuilt (dropzones, eject,
  instant-double, drop-over guards).
- keys are scoped so distinct targets can't collide: `del:<id>`,
  `load:<id>:<a|b>`. A re-render may drop the visible `sure?` text —
  acceptable; the arm is the contract, the label is a hint.

The load/eject disarm added in ADR-0304 stays: it clears element
`_arm` on stable controls; keyed arms for a track are consumed
one-shot so a deleted/reloaded id can't leak a stale arm into a
re-added row (a re-added row shares the id only via the library's own
monotonic ids, which are never reused for different tracks).

## Consequences
- Library delete and load-guard are usable during playback — the
  guard's window is no longer truncated by the app's own writes.
- Non-rebuilt controls keep the simpler element-local state; no
  behavioural change there.
- Memory: bounded — arms live ≤ 2 s.
