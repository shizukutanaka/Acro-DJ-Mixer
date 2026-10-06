# ADR-0238: Cue ticks on the mini overview + free-loop in-point marker

## Status
Accepted.

## Context
Two orientation gaps on the waveforms. First, the mini overview
shows peaks, the loop band, the fade tick and the zoom viewport —
but not hot cues, so zoomed in (where the overview is the only
whole-track view) the pads' positions are invisible. Second,
shift+Loop's free-size loop marks its in-point on the first press,
but that pending mark renders nowhere — the only feedback is the
button's armed class, so placing the out-point is guesswork about
where the in-point landed.

## Decision
Paint the pad-colored hot-cue ticks into the overview strip using
the same `padColors` the main wave uses, and paint the pending
`_loopIn` as a half-height amber tick on the main wave plus a short
tick on the overview — amber because it shares the family with the
auto-mix fade marker (a pending, not-yet-committed zone), distinct
from the green armed loop band.

## Consequences
All pad positions stay visible at any zoom, and a free-size loop's
first press is committed to the timeline it modifies instead of a
button state the eye has to cross-reference. Both markers render
through the existing `drawWave` pass — no new timers, no new state.

## Round
Improvement round 238.
