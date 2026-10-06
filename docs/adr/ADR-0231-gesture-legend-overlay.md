# ADR-0231: `?` shows a gesture-legend help overlay

## Status
Accepted.

## Context
The app speaks one gesture grammar — click to latch, hold for
momentary, double-click to reset, wheel to trim, shift for the
alternate, alt for the expert layer, right-click to audition — but
the grammar is nowhere documented in the product itself. ADR-0001
chose modifier chords over extra buttons; the cost of that choice is
discoverability: a new user sees a dense mixer and cannot know that
shift+wheel trims a pad or that holding Phones is momentary. The
gesture grammar being consistent (a strength the audit counts) is
only worth having if the user can find it.

## Decision
A `#help` overlay toggled by `?` or `/` (both reach the same key on
most layouts), closed by `?`, `Esc`, or clicking the dim backdrop.
The card lists the grammar lines first — the transferable rules —
then the key map. Text inputs and select elements are exempted from
the toggle so typing a `/` in the library filter is safe. The
overlay is a fixed-position div in the same zero-dependency style,
before the script tag so the handler binds at parse time.

## Consequences
The feature map becomes self-documenting. Overlay text names the
conventions, not every binding — new gestures adopting the grammar
stay covered without edits; grammar-free bindings list in the Keys
section and must be added there.

## Round
Improvement round 231 (audit P1: discoverability of the gesture
grammar).
