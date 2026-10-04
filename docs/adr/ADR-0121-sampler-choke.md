# ADR-0121: Sampler choke — single voice

## Status
Accepted (2026-10-04)

## Context
Four pads each owned a voice, so one-shots could pile up — a
jingle over a drop over a stab at full level is mud, and there
was no gesture to stop a ringing pad mid-sample.

## Decision
Firing a pad chokes the others: before the new source starts,
every other slot's live source is stopped and its pad unlit —
the DJM sampler's single-voice behaviour. Retriggering the same
pad still just restarts it. Pads stay sample-accurate (the
source stops immediately, no fade).

## Consequences
- One-shot clutter is impossible by construction.
- "Stop everything" is two gestures away (fire any pad, or
  shift-click the ringing one).
