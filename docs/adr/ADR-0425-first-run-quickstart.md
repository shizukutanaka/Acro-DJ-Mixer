# ADR-0425: A first-run quickstart bar walks a newcomer to their first mix

## Status

Accepted (2026-11-14)

## Context

The app's essence is one sentence: two tracks, tempo and tone shaped,
blended without a gap. Every control for that exists and is verified —
decks, crossfader, tempo + sync, 3-band EQ, waveform, hot cues, master
+ recording. What a first-time visitor got, though, was the gesture
legend (the `?` card, auto-shown once) and then a wall of expert
controls. The legend teaches the *grammar*; nothing named the *goal*.
AUDIT.md has carried "first-run onboarding still open" (weakness 44/45,
P1) through every round since.

Value-density check: the gap is not a missing feature — it is the
distance between a working mixer and a stranger's first successful
blend. Closing it costs one line of UI; leaving it costs every new
user's first minute.

## Decision

A one-line bar (`#quickstart`) under the header, shown on first run
only: the three steps of a first mix (load each deck → Play both →
slide the crossfader) plus a "Got it" button.

- It retires itself the moment both decks hold a track — the goal,
  reached — checked by a self-clearing 800 ms interval that only
  lives while the bar is visible.
- Retirement persists via `acro-quickstart-done` in localStorage,
  the same doctrine as `acro-seen-help`: write on retire, a denied
  store simply means the bar shows again next visit.
- No new surface beyond the bar: no tour, no modal steps, no account
  or telemetry. The bar does not appear again once retired.

## Consequences

A newcomer can reach "two tracks loaded and blended" by reading one
line — the Done-when for calling this DJ software ("someone new can
load two tracks and connect them without an explanation") is now
walked, not just possible. The smoke gate pins the contract: the bar
is visible on a fresh profile and the button dismisses it.

Deliberately not built: multi-step tours, coach marks on individual
controls, sample tracks. Each adds surface the essence doesn't need;
the dropzones already say "Drop track or click to load", and the
legend remains one `?` away.
