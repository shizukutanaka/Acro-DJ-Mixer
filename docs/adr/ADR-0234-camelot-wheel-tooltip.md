# ADR-0234: Camelot wheel readout on the key display's tooltip

## Status
Accepted.

## Context
The deck shows its key as e.g. `8A Am` and colours it green/red
against the partner deck, and the library greys rows that don't fit
harmonically — but nowhere does the UI say *which* keys fit. A DJ
who has not memorized the wheel must derive "7A, 9A, 8B" mentally;
the machine already knows the rule (`harmonic()`), it just never
renders it (audit P2: Camelot wheel readout).

## Decision
`camelotCompat(k)` returns the four mixing targets — same code,
±1 hour on the same letter, relative major/minor — and
`refreshKey()` writes them to the key readout's `title`, computed
from the *effective* key so the list stays correct under transpose.
Wheel wraps are handled (`12B` → `11B · 12B · 1B · 12A`). Clearing
the key clears the title.

## Consequences
Hovering the key readout now answers "what can I mix into this?"
with the exact codes to look for in the library — the same rule the
green/red hint and row dimming already apply, expressed in the
wheel's own vocabulary.

## Round
Improvement round 234 (audit P2: Camelot wheel readout).
