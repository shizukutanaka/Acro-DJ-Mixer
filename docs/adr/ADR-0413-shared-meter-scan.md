# ADR-0413: one meter scan for all level meters

## Status

Accepted (2026-10-08)

## Context

`tick()` carried four copies of the same analyser scan — channel
meters (per deck), master meter, cue meter, and the mic indicator
each read `getByteTimeDomainData(meterBuf)` then ran an identical
256-sample `max|x|` loop. Four copies of one contract ("the meter
reads the peak of the byte-domain window") meant four places for the
same bug — this file already shipped a cluster of diverged-copies
fixes (ADR-0377..0406) for exactly this pattern.

## Decision

Extract `meterScan(an)`: one readback + peak scan returning the
instantaneous level. Each meter keeps its own paint semantics — the
bars fill from the instantaneous value and decay a peak-hold tick,
the mic button paints brightness and feeds the noise gate from the
same value.

- The scan is a pure function of the analyser; the peak-hold state
  (`chPeak`/`meterPeak`/`cuePeak`) stays owned by each meter, so no
  bookkeeping moves across the deck boundary.
- Mic keeps its own gate/brightness layer — only the shared scan is
  extracted, not the policy on top of it.

## Consequences

- One definition of "what the meters read" — a future change to the
  window or the peak function lands once.
- ~20 lines of copy-paste collapse to one helper + four call sites;
  no behavior change (identical math, identical buffers).
