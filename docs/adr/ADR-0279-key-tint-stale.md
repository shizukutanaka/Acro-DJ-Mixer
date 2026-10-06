# ADR-0279: Key tint dies with the key

## Status
Accepted.

## Context
Two stale-color leaks around a disappearing key: `load()` and
`eject()` null `this.key` but never re-asked the partner to
`refreshKey()`, so the surviving deck's readout kept an ok/clash tint
computed against a key that no longer existed. And `eject()` cleared
its own readout with `classList.remove('good')` — a class
`refreshKey()` never sets — leaving the deck's own `ok`/`clash` class
on a '—' readout.

## Decision
Both sites now call `partner.refreshKey()` after clearing the key
(partner recomputes its tint against `other = null`), and eject resets
its own readout with `className = 'key'` — the same way `load()` does.

## Consequences
Harmonic tint always describes two keys that both exist right now.

## Round
Improvement round 281.
