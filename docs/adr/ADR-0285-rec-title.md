# ADR-0285: Rec button title mentions the library landing

## Status
Accepted.

## Context
Since ADR-0148 a stopped take both downloads *and* lands in the
library as a replayable row, but the Rec button's title still
described only the download — users discovering the library row
couldn't trace where it came from.

## Decision
Title now reads "click again to stop; the take downloads and lands
in the library". (The exact container/extension lives in open
ADR-0271, so the title stays format-agnostic.)

## Consequences
Every control's hover text describes its full visible effect; the
rest of the title audit found no other drift (all double-click
reset values, toggle descriptions, and fader hints verified against
their handlers).

## Round
Improvement round 287.
