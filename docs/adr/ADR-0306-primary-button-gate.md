# ADR-0306: The control surface is primary-button only

## Context

Momentary controls (Roll, Cut, Mic, Bend, EQ kills, FX, Mute) latch
on `pointerdown` and release on `pointerup` — but a right-button
press fires `pointerdown` too, and the context menu it opens can
swallow the `pointerup`, latching a roll, a cut or an open mic
*forever* mid-set. ADR-0293/ADR-0305 gated individual handlers;
~10 sites remained ungated.

## Decision

One capture-phase gate instead of ten site edits:
`pointerdown` with `e.button !== 0` is `stopPropagation`ed at
`document`, so no control — present or future — can fire off a
right or middle press. Right-click *meanings* live on `contextmenu`
handlers (undo ring, previews, tempo-only sync), a different event
that still reaches its targets.

A second listener suppresses the `contextmenu` default except on
`input[type=text]`/`textarea` — the app already gives right-click
its own grammar (undo, previews, sync modes); anywhere else a
browser menu would only cover the deck mid-set. Text fields keep
the native menu for paste.

## Consequences

- Momentary holds can no longer latch from a menu-swallowed release.
- The whole deck surface is primary-button consistent; new controls
  inherit the rule.
- Per-canvas `contextmenu` suppression from ADR-0305 becomes
  redundant but harmless.
