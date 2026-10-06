# ADR-0198: Key readouts and matching use the effective key

## Context
Transpose shifts what a deck sounds, but the key readout still
showed the detected source key — "8A" on screen while Bm plays —
and the harmonic colour compared this deck's effective key
against the partner's *raw* key, so a partner's own transpose
silently broke the match. Key sync targeted the partner's raw key
for the same reason.

## Decision
New `effKey()`: detected key shifted by the current transpose
(+7 Camelot hours per semitone, letter preserved, name root moves
on the chromatic row). The readout displays the effective key so
it always names what's sounding; the ok/clash colour and
`keySync()` both compare against the partner's effective key;
library harmonic-fit re-scores against effective deck keys too.
No key → null everywhere.

## Consequences
- Display, colour, key-sync and library fit all agree about the
  one thing that matters: what's actually playing.
- Two transposed decks can't fool the matcher — e.g. A at 8A+2st
  and B at 10A+2st correctly show clash again.
