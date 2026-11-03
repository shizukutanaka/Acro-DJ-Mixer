# ADR-0424: Deck B's markup is cloned from Deck A at boot, not written twice

## Status

Accepted (2026-11-03)

## Context

The HTML carried two ~30-line deck sections that differed in exactly
four places: the section's `class`/`id`, the `<h2>` text, and the
dropzone's `data-deck`. Every deck-UI change had to be typed twice —
the kind of lockstep copy that silently drifts (a control added to
deck A and forgotten on deck B ships a half-broken mixer, and the
drift is invisible until someone clicks it).

Value-density check: the second copy carried zero user value and a
standing maintenance tax.

## Decision

`index.html` ships one deck section. At boot, before the `Deck`
constructors run, deck A's section is cloned, re-badged (class `deck
b`, `id="deck-b"`, h2 "Deck B", `data-deck="b"`), and inserted after
the mixer — preserving the original A → mixer → B layout. Everything
downstream is unchanged: `Deck` already does all wiring through
`root.querySelector`, and no element inside the section carries an id
that a clone could duplicate.

## Consequences

- −29 lines of markup and one copy-paste hazard removed; the two
  decks can no longer diverge at the markup level.
- The deck C refactor (P3) now needs one template, not three copies.
- Deck B's DOM is built a tick later than before; nothing reads
  `#deck-b` before this block runs.
