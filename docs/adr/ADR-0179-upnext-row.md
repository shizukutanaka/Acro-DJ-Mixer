# ADR-0179: Up-next library row under auto-mix

## Context
The fade marker (ADR-0178) answers "when does the transition fire";
the answer to "what comes in" exists only inside `autoNext`'s head
at fade-completion time. A DJ running continuous auto-mix has no
way to see which track will be loaded until it happens.

## Decision
`renderLibrary` recomputes the pick with the same logic as
`autoNext` — harmonic fit into the still-playing deck preferred,
next-in-line fallback, both on-deck ids excluded — and marks that
row `.upnext`, an amber left edge matching the fade tick's color
vocabulary ("amber = what auto-mix will do"). The highlight lives
in the existing render pass and refreshes on arm/disarm/cancel; a
library filter that hides the row simply shows no edge.

## Consequences
- "When" (tick) and "what" (row edge) read as one system; the
  pick can't diverge from `autoNext`'s because it is the same code
  shape against the same ordering.
