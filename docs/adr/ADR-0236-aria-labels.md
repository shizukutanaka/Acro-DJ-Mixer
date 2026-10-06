# ADR-0236: Mirror titles into aria-labels; status lines go aria-live

## Status
Accepted.

## Context
Every control already carries a descriptive `title` — the
modifier-grammar documentation lives there — but `title` is a
sighted-hover convention: screen readers announce the button's
*text*, so `⏏`, `↺`, `◂`, `½`, `H`, `Mut` read out as glyphs or
nothing. The mixer was unusable without eyes on it (audit P2:
ARIA + focus model).

## Decision
At boot, every `button/select/input` with a `title` gets that text
mirrored into `aria-label` (explicit labels win — nothing is
overwritten), so icon buttons announce their verb: "Eject — unload
the track", not "⏏". A programmatic pass instead of 55 hand-written
attributes keeps the rule self-maintaining — any future control
that follows the title convention is labeled automatically. Deck
`.status` spans get `aria-live="polite"` so status updates
(load guard, sync leader, import results) are announced as they
land. All controls are native focusable elements already, so
keyboard operability needed no change.

## Consequences
The whole surface — 134 controls — now reads as verbs to assistive
tech, and status transitions are spoken. Untitled elements are
untouched, so purely visual affordances stay quiet.

## Round
Improvement round 236 (audit P2: ARIA + focus model).
