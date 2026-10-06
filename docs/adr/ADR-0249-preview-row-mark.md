# ADR-0249: The auditioning row's preview button lights up

## Status
Accepted.

## Context
`▶` on every row looks identical whether or not it's the one
ringing on the cue bus. Mid-crate, auditioning several tracks
means remembering which row you started — or re-clicking rows at
random to find the one that stops the sound (the second-click =
stop idiom only works if you can find the row).

## Decision
`prevMark()` toggles the ▶ button's existing `on` class (green
border — the same "this control is active" affordance used across
the mixer) on the auditioning row, called on every preview state
transition: start, second-click stop, source end, missing record.
`renderLibrary` also carries the class in the row template, so a
re-render mid-audition (tag updates repaint rows constantly)
doesn't drop the mark.

## Consequences
The row that owns the sound is visible at a glance, and the
stop-it-again gesture is findable instead of hunt-and-click.

## Round
Improvement round 249.
