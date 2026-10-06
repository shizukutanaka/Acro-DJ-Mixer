# ADR-0229: Enter in the library filter loads the top match

## Context
The crate-dig flow stopped at the filter — you could narrow the
list but still had to reach for a mouse and hit a 40 px button.
Every track browser treats Enter as "take the top result".

## Decision
A `keydown` handler on the search input loads the first visible
row into the free deck — the stopped deck, A when both are free,
nothing when both are playing (a blind replace is what the load
guard is for). The placeholder advertises the shortcut.

## Consequences
- Type, Enter, it's on a deck — no pointer needed.
