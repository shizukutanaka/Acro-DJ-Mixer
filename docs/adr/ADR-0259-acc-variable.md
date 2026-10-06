# ADR-0259: `--acc` is defined — sampler, cue meter, bend states colour again

## Status
Accepted.

## Context
Three rules referenced `var(--acc)` but no stylesheet or script
ever defined it: `.smp.set` (loaded sampler pad border),
`.cuem i` (cue-bus meter fill), `.bend button.on` (pitch-bend
latch state). An unresolved var() makes the declaration invalid —
the pad border and bend latch fell back to `currentColor` and the
cue fill silently kept the `.meter i` gradient. Same CSS class
of dead styling as the orphaned `.chm` declarations (ADR-0258).

## Decision
Define `--acc` on `:root` as `--accent-a`, then scope it per deck:
`.deck.a` / `.deck.b` override it to their own accent. Deck-local
users (`.bend`) get the deck colour automatically; shared-surface
users (sampler pads, cue meter) get the deck-A blue — the
product's single "accent" identity.

## Consequences
All three states render their intended accent colour: verified
`cue fill = rgb(77,163,255)`, deck-B bend `on = rgb(255,122,89)`,
`.smp.set` border blue. No markup or logic changed.

## Round
Improvement round 259.
