# ADR-0116: Loop memory — Shift+↺ stores the armed loop

## Status
Accepted (2026-10-04)

## Context
Reloop re-enters the last *exited* loop (`_prevLoop`, written on
every exit) — so a loop you want to keep is lost the moment you
arm and exit a different one. Serato solves this with loop
memory slots: store a loop explicitly, recall it whenever.

## Decision
`Shift+↺` stores the currently armed loop in a dedicated
`_loopMem` slot — separate from `_prevLoop` so routine exits
can't overwrite it. Reloop prefers `_loopMem` when set, else the
last-exited loop as before. Eject clears both.

## Consequences
- Deliberate save, automatic recall — the button covers both the
  hardware EXIT/RELOOP and the memory slot.
- Memory is session-scoped like `_prevLoop`; the armed loop's own
  persistence (ADR-0038) is unchanged.
