# ADR-0204: Alt+Auto fires the transition now

## Context
Once Auto is armed, the mix only starts when the countdown
reaches the computed fire point — there's no "do it NOW". A DJ
who hears the moment arrive early (a breakdown, a vocal ending)
still has to drive the crossfader by hand, giving up the synced
start, filter sweep, bass swap and echo-out the auto path
provides.

## Decision
`alt+Auto` fires the fade immediately when a valid pair exists:
the fire condition (one deck playing & loaded, not looping,
partner loaded & stopped) is extracted into `fireCandidate`, and
the fire itself (seek, sync, play, `autoMix.fade` record) into
`fireFade` — shared verbatim by the countdown path. Alt while a
fade runs still cancels; alt with no valid pair falls through to
the normal arm/disarm toggle.

## Consequences
- "Transition now" keeps every auto-mix nicety instead of
  degrading to a manual fader drag.
- The fire path has exactly one implementation — countdown and
  manual-trigger can't drift.
