# ADR-0364: A resampled pad names the track it came from

## Context
The loop-resample path read `d.name` for the pad's name and title —
the Deck field is `fileName`. Every resampled pad persisted as
`loop@undefined` and advertised `Resampled loop — undefined X.XXs`
in its title; restored pads kept the undefined name forever.

## Decision
Read `d.fileName` — the field every other consumer (setlist, title
bar, tagLib) already uses.

## Consequences
Resampled pads name their source track in the slot record and the
title, and persist that way through `padSave`/`padsRestore`.
