# ADR-0308: The help card is modal — keys don't pass through

## Context

`?` opens the gesture-legend overlay, and Escape/`?`/click closed
it — but every other key kept driving the mixer *behind* the open
card. Reading the legend and pressing `q` to see what it did also
started deck A.

## Decision

While `#help` is visible the keydown handler returns before the
switch — Escape and `?`/`/` are handled earlier, so open, close
and dismiss all still work. One guard, after the close keys.

## Consequences

- The overlay behaves like the modal it looks like; no accidental
  transport while reading the legend.
