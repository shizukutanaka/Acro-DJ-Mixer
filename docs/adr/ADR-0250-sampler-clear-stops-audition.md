# ADR-0250: Clearing a sampler pad stops its cue audition

## Status
Accepted.

## Context
Right-click on a pad auditions the one-shot on the headphone cue
bus. `shift+click` clears the pad but left that audition ringing —
a sample the DJ just threw away, still occupying the cue bus
(same leftover-source class as ADR-0246 and ADR-0248).

## Decision
The pad's clear path stops `smpPrev` (the shared audition source)
before dropping the slot. The audition is transient — its only
use was deciding whether to keep or fire the sample, and the pad
no longer has it.

## Consequences
The cue bus never carries a cleared pad's audio. Auditions still
replace each other and end on their own as before.

## Round
Improvement round 250.
