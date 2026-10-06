# ADR-0256: Sampler pad title names wheel-trim and resample

## Status
Accepted.

## Context
The sampler pad's tooltip already taught click/gate, right-click
preview, alt-stop and shift-clear — but two merged gestures were
invisible there: wheel trims that pad's level (ADR-0167) and
shift-click on an *empty* pad resamples the playing deck's armed
loop (ADR-0145). The shift+empty resample in particular is
undiscoverable anywhere else — the same modifier+click combo on
a loaded pad does something different (clear), so a DJ could
reasonably expect it to do nothing on an empty one.

## Decision
Extend the single pad title string to name both gestures. The
title remains the pad's complete discoverability surface; the
`?` overlay already covers wheel-trim and resampling under the
shared modifier grammar.

## Consequences
Every gesture bound to the pad is now readable from the pad
itself. No behaviour changed.

## Round
Improvement round 256.
