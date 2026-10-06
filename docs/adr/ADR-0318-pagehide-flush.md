# ADR-0318: Session snapshot flushes on pagehide

## Context

`sessSave` runs on a 400 ms debounce — any adjustment made in the
last ~400 ms before the tab closed was never written, and the next
load restored a stale surface. Mobile Safari doesn't even fire
`beforeunload`, so that was the common case there.

## Decision

A `pagehide` listener cancels the pending debounce and calls
`sessSave()` synchronously — localStorage writes are safe on the
way out, unlike async work.

## Consequences

- The final state of the mixer survives every close path —
  reload, tab close, swipe-away on mobile.
