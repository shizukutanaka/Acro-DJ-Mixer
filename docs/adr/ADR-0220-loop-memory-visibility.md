# ADR-0220: Reloop button title shows the saved memory slots

## Context
Two loop memory slots lived behind shift/alt+↺ but their
contents were invisible — recalling meant pressing a button
without knowing which region would arm. A recall you can't see
is a recall into the dark.

## Decision
`_memTitle()` formats each occupied slot's `[start–end]` into the
reloop button's title and runs on every save and on reset —
mirroring the status lines the saves already emit.

## Consequences
- Memory recall is now inspectable before you fire it; the
  button stays a single-click gesture, the title is the
  affordance.
