# ADR-0307: Arrow keys pick a filter match before Enter loads it

## Context

The crate-dig keyboard flow stopped halfway: type in the filter,
hit Enter, and the *top* match loads — the second or third row was
reachable only by reaching for the mouse. Rekordbox and Serato both
let you arrow through the filtered crate.

## Decision

`libSel` tracks a keyboard pick over the visible rows.
↑/↓ in the search field moves it (wrapping), the row gets a
`.sel` inset outline in the accent colour and scrolls into view,
and Enter loads the picked row — falling back to row 0 semantics
when nothing was moved. Typing resets the pick to the new top
match. Mouse paths are untouched.

## Consequences

- Full keyboard crate-dig: type, arrow, Enter — the deck is loaded
  without leaving the keyboard.
