# ADR-0045: Track-end warning — flash the time readout under 30 s

## Status
Accepted (2026-10-04)

## Context
A DJ's worst silent failure is the deck running out while they're
fiddling elsewhere. CDJs blink the time display (and jog ring) during
the last stretch of a track — the universal "bring the next one in"
signal. The app had an auto-mix trigger (ADR-0013) but no visual
warning for manual mixing.

## Decision
In `tick()`, when `0 < remaining < 30 s` the `.time` readout gains an
`urgent` class — red with a 0.8 s `steps(2)` blink, matching the
existing phase/GR warning palette. Thirty seconds is the CDJ default
warning window; the flash runs playing or paused since the information
(time left) is the same either way.

The readout keeps its `pos / duration` text — the warning is a
decoration, not a different display, so it can never lie about the
position.

## Consequences
- A glance at either deck tells you whether a transition is due.
- No state, no audio, no persistence — a pure presentation rule.
