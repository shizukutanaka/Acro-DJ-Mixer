# ADR-0242: Alt+Rec splits the take mid-recording

## Status
Accepted.

## Context
One set = one `.webm`. A two-hour session produces a single huge
file, so marking set boundaries (warm-up / peak / cooldown, or
"that was the good stretch") means post-editing the take in an
external tool. MediaRecorder can't cut mid-stream — the only way
to split is stop + start, which today drops the button state and
costs several gestures during a live moment (audit P3: split
recordings).

## Decision
`alt+Rec` while recording sets `recSplit` and stops the current
recorder; `onstop` saves and files that take exactly as usual —
download plus library row — then immediately calls `beginRec()`
(the start path factored out of the click handler) so a fresh take
rolls with its own timer. The button never leaves `on`.

## Consequences
Set sections become separate files/rows in one click, mid-set,
with no dead air beyond the recorder's own stop/start gap (sub-
second; the tail of the old take flushes from buffer). Splitting
is idempotent — each alt+Rec cuts once; a plain stop still ends
the session normally.

## Round
Improvement round 242.
