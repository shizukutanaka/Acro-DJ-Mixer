# ADR-0289: A hot-cue audition has an off switch

## Status
Accepted

## Context
Right-clicking a hot-cue pad auditions it on the cue bus (ADR-0161) —
`src.start(0, cues[i])` plays from the cue point to the **end of the
track**. Once ringing, the audition had no off switch: the only ways
to silence it were loading/ejecting that deck (`killPadPrev`) or
right-clicking a different pad. Worse, pressing Play left the
audition running over the live deck — a "pre-flight check" that
keeps broadcasting into the phones while its track is on the floor.

## Decision
Two kills, both matching idioms already in the surface:

1. **Second right-click stops.** The pad remembers which element its
   audition belongs to (`padPrevPad`); right-clicking that pad again
   is a stop, not a restart — the same second-click-stops idiom the
   library row `▶` preview uses.
2. **Play kills the audition.** `play()` calls `killPadPrev(this)`
   first — the audition's purpose ends the moment the DJ commits the
   deck to the floor, so it can't ring over the live signal. The
   owner doctrine is unchanged: a deck kills only its own audition,
   never the partner's.

## Consequences
- Cue auditions can always be silenced with the same gesture that
  started them, and can never outlive the transition to live play.
- Pad tooltips unchanged: "right-click previews" still describes the
  gesture; stopping is the same gesture again.
