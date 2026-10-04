# ADR-0047: Elapsed / remaining time display toggle

## Status
Accepted (2026-10-04)

## Context
The deck readout always showed elapsed / duration. When cueing the
next transition the number a DJ actually watches is *remaining* — how
long until the track runs out. CDJs expose this as the TIME button
that flips the display; combined with ADR-0045's end warning the
remaining view is the natural way to time an outro mix.

## Decision
Clicking the `.time` readout toggles `this.remain`; `tick()` renders
`-rem / dur` instead of `pos / dur`. Pointer cursor + title hint make
the affordance discoverable. Mode is per-deck view state, persists
across loads (hand-position doctrine), and the end-warning flash works
unchanged in both modes since it watches `rem`, not the text.

## Consequences
- One click switches planning mode (remaining) and execution mode
  (elapsed); no extra chrome added to the deck row.
