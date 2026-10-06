# ADR-0240: Right-click an empty sampler pad undoes the last clear

## Status
Accepted.

## Context
`shift+click` clears a sampler pad instantly — no confirm, no
recovery. One fat-fingered shift-click and the one-shot (which may
be a resampled loop phrase that exists nowhere else) is gone. The
same risk class that ADR-0212 fixed for hot cues applies here; the
sampler was simply left out (audit: undo exists almost nowhere).

## Decision
`smpCleared` stashes `{i, slot, label, title}` when shift-click
clears a loaded pad — the full `AudioBuffer` survives by reference,
not copy. Right-click on an *empty* pad restores it to the pad it
came from (pads keep their identity) — the gesture can't collide
with pad preview because preview only fires on a loaded pad, and a
pad being empty is what makes "put something here" sensible.
One level only: a deeper undo needs a real history model this file
doesn't have.

## Consequences
The most destructive one-click gesture on the pad row is
recoverable. A second clear overwrites the stash (single level,
documented); a restore consumes it, so it can't be replayed onto
two pads.

## Round
Improvement round 240.
