# ADR-0335: Cancelling a fade disarms auto-mix

## Context

Clicking Auto mid-fade cancels the transition — fader rollback, the
incoming deck pauses, filters restore (ADR-0191). But it left
`autoMix.on` armed. The outgoing deck is still playing past its fire
point with a stopped, buffered partner, so the very next `autoMixTick`
evaluates `fireCandidate` true again and calls `fireFade` — the
cancelled fade silently re-fires ~one frame later. Every click of the
button then does the same thing: cancel, refire. There is no way to
stop auto-mix once a fade starts short of ejecting or pausing the
playing deck manually.

## Decision

The cancel path sets `autoMix.on = false` and unlights the button.
Cancelling a transition means Auto is off — re-arming is one click
away, and re-arming while the deck is still past its fire point is a
deliberate gesture, not a trap.

## Consequences

- One click now genuinely cancels a running transition.
- Auto-mix stays armed only while the user hasn't touched it; any
  manual intervention (cancel, eject — which already bails the fade)
  leaves it off.
