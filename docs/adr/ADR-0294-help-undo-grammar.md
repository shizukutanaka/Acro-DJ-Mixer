# ADR-0294: Help overlay documents the right-click undo grammar

## Context

The `?` gesture legend said right-click means only "cue-bus preview
on hot-cue and sampler pads". Since ADR-0212 the same gesture has
grown a second meaning — one-level undo of the destructive prep op
that just happened — and four more surfaces joined it: the Cue
button (ADR-0291), the tempo controls (ADR-0292), the Reloop button
(ADR-0293), on top of the original empty-pad and empty-dropzone
restores. An invisible grammar is a grammar that doesn't exist:
undo that nobody can discover saves nobody's prep.

## Decision

The right-click line now names both halves — audition AND undo —
and lists each undo surface in the same telegraphic style as the
other rows: what was broken, and the control that restores it.

## Consequences

- The legend stays a complete map of the gesture grammar; the next
  undo surface that lands must update this line too.
- No code change — the discoverability gap was documentation, not
  behavior.
