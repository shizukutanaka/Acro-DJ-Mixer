# ADR-0303: Session persistence covers the TIME mode

## Context

Clicking the deck time readout flips elapsed ↔ remaining — a
display *preference* a DJ sets once per deck (rekordbox persists
TIME mode the same way). It was the last unset field in the
session snapshot: every reload silently flipped the readouts back
to elapsed while faders, EQ and stem all came back.

(Waveform zoom is deliberately not persisted — it's a transient
working view, not a preference; landing zoomed on reload would be
the surprise.)

## Decision

`remain` joins the `decks` snapshot — it's a deck field, not a DOM
control, so restore assigns it directly rather than through `setV`.

## Consequences

- The mixer surface persists whole: control values, toggles, and
  the display preference all survive a reload.
