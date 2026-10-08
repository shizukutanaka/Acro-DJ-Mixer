# ADR-0402: No loads onto a mid-fade deck

## Status
Accepted

## Context
An auto-mix fade is a multi-second handoff: the sweep rewires the
outgoing deck's filter, the incoming deck's low band, an echo-out
send, and the crossfader — all bookkeeping that assumes the same two
tracks stay put for the duration.

Only two paths ever protected that assumption: `swapWith` refuses
("Finish or cancel the fade first.") and `eject` cancels a touching
fade. **Every load path onto a fade participant was unguarded** —
instant doubles, drag-and-drop, file pick, ‹ › deck steppers,
Enter/double-click library loads all funnel through `Deck.load`,
which never looked at `autoMix.fade`. Dropping a track onto `f.to`
mid-fade left the bass-swap/echo/bookkeeping running against content
the transition was never meant for: the new track gets EQ-swept as if
it were the incoming pick, the old one's send-off still rings, and
the final fader park lands on the wrong handoff.

## Decision
`load()` refuses when `autoMix.fade` names the deck, with the same
message `swapWith` uses. One guard at the chokepoint covers every
caller; the continuous auto-mix path is unaffected because
`autoMix.fade` is already `null` when `autoNext` loads the vacated
deck.

Refusal rather than silent cancel: a fade is an 8–16 s window the
user can see counting down on the Auto button; making their load
wait is safer than aborting a transition mid-flight — and matches
the existing `swapWith` contract.

## Consequences
- `instantDouble`, drag-drop, file pick, deck steppers, and library
  loads are all covered by the single guard.
- `eject` keeps its cancel semantics (it already parks the fader on
  the survivor, ADR-0193) — refusal there would trap the user.
