# ADR-0304: A pending 'sure?' arm can't resurrect a stale deck name

## Context

`armConfirm` swaps the armed element's text to `sure?` and, if the
second gesture never comes, a 2-second timeout puts the old label
back. On the dropzone that label is the loaded file's name — so a
drop armed on a playing deck, then a load arriving through any
*other* path inside the 2-second window (library row, picker,
‹ ›, instant doubles), got its fresh name overwritten with the old
track's name when the timer fired. Same on eject: `sure?` stayed
armed and the timeout re-stamped the old name over an empty deck.

## Decision

Load and eject now clear `dropzone._arm` at the same place they
rewrite the label — disarming is part of updating the name, not a
new mechanism.

## Consequences

- The deck name always reflects the track actually loaded.
- Two-gesture confirm behaviour is unchanged.
