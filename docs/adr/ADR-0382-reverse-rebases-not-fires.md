# ADR-0382: Hamster reverse rebases the edge bookkeeping without firing

## Context
`xfRev` flips `xfPos()`, so toggling the hamster button instantly
moves the parked fader's effective position to the opposite side —
without an input event and without updating `xfPrev`. The next
physical nudge then compared the new side against a stale
`xfPrev` from the other side: it could ghost-fire a fader-start
(the "entry" happened by flipping, not by moving) or swallow a
genuine entry, depending on which way the stale value lied.

## Decision
The rev handler stamps `xfPrev = xfPos()` after re-applying the
crossfade — the bookkeeping reflects the mirrored position, but
deliberately no `xfEdgeCheck()`: a reverse is not a fader move,
and on hardware a hamster flip doesn't fire fader-start.

## Consequences
Three distinct semantics for a parked-extreme writer are now
consistent: `xfEdgeCheck()` for writers that represent a real
fader sweep (arrows, `0`, MIDI, auto-mix ticks, eject park), and
a bare rebase for the reverse toggle, which changes which side
the parked position belongs to without moving the fader.
