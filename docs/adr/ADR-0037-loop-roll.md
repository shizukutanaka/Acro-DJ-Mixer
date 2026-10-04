# ADR-0037: Loop Roll (Slip)

## Status
Accepted

## Context

The loop system (ADR-0006) is toggle-based — great for sections,
useless for the fill effect DJs want *while* a phrase plays: grab a
beat, roll it, and land back on the music as if nothing happened.
That is the SLIP/roll control on hardware players; the loop
machinery already quantizes bounds, only the slip bookkeeping was
missing.

## Decision

- A `Roll` button beside `Loop`: `pointerdown` arms a 1-beat loop
  snapped to the grid at the current position; `pointerup`/leave/
  cancel releases it.
- While held we record `{pos, t}`; on release the deck seeks to
  `pos + elapsed·rate` — where the track would have been had the roll
  not happened.
- An armed loop is restored on release (its saved bounds), so rolling
  inside a loop doesn't lose it.
- Roll only engages while playing on an analyzed track (needs the
  grid and a running clock).

## Consequences

- One-beat fills work with zero learning cost: hold = roll, release =
  resume.
- Verified: hold 1.2 s at pos 0.50 → release lands at ~2.0 s, loop
  disarmed.

## Rejected alternatives

- Roll-length cycling while held: the fixed 1-beat length is the
  right default; the armed loop's ½/2× controls already cover length
  play for deliberate looping.
- Roll while paused: no audible difference from a normal loop —
  engages playing-only to keep the state model one-valued.
