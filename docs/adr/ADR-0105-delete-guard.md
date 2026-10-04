# ADR-0105: Delete guard — two-click confirm on library rows

## Status
Accepted (2026-10-04)

## Context
The row `×` soft-deletes the library record instantly — audio and all
saved analysis hidden — from a tiny button next to the load buttons,
with no undelete UI.

## Decision
`×` arms the same 2 s "sure?" confirm as the load guard before
`Library.remove` runs. The arming logic is factored into
`armConfirm(b, fn)`, which both guards now share: one click warns,
the next confirms, otherwise the label reverts.

## Consequences
- Delete needs a deliberate double-click; accidental strays are
  harmless.
- One confirm idiom for all destructive row actions.
