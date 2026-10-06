# ADR-0239: Sampler choke groups — pads 1+2 and 3+4

## Status
Accepted.

## Context
Every fired pad choked every other pad — one global choke group, so
only one one-shot could ever ring. That prevents pile-ups, but it
also prevents the most basic sampler idiom: a kick or drone held
under stabs. MPC-style choke *groups* fix this by letting layers
across groups ring while same-group sounds still mute each other
(the open/closed hi-hat rule).

## Decision
Two fixed groups: pads 1+2 are group A, pads 3+4 are group B —
a new shot chokes only its groupmate. The pairing is physical
adjacency (left pair, right pair), easy to learn and shown in the
pad tooltip. Four pads doesn't justify configurable groups — the
fixed split gives the layering without a UI for assignment.

## Consequences
A pad on group A can ring under hits on group B; pile-ups within a
group are still impossible. Voice accounting, gate mode, loop mode,
MIDI firing and the stop gesture are unchanged — the only edited
rule is who chokes whom.

## Round
Improvement round 239 (audit P3: choke groups).
