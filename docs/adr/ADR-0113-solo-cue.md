# ADR-0113: Shift+Phones = solo cue

## Status
Accepted (2026-10-04)

## Context
PFL buttons are additive — cue A plus cue B mixes both decks in the
headphones. Isolating one deck takes two clicks: arm yours, find
and disarm the other.

## Decision
Shift+Phones arms solo: it toggles this deck on and drops the
partner's PFL in one click. Shift while already armed just toggles
off (the toggle resolves first — shift modifies arming, not
disarming).

## Consequences
- One-click "only this deck in the cans" — the move you actually
  want when reaching for the second cue button.
- Plain clicks stay additive, matching hardware PFL behavior.
