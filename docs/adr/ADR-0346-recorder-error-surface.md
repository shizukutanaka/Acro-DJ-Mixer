# ADR-0346: A dead recorder says so, and cleans up after itself

## Status
Accepted (2026-10-07)

## Context
Two uncovered MediaRecorder edges:

1. **No `onerror`.** An encoder fault (driver hiccup, stream reset)
   stops the recorder where it sits. With no handler, the take died
   silently while `recPaint` kept the button ticking `Rec M:SS` — a
   DJ finishes the set trusting a recording that stopped capturing.
   Worse, `recorder` stayed non-null but `inactive`, so the next
   click reached `recorder.stop()` → `InvalidStateError`.
2. **No constructor guard.** `new MediaRecorder(stream)` can throw
   on an unsupported configuration — an uncaught exception mid
   handler with no status.

Per spec an error can still be followed by a `stop` event, so
`onstop` must not assume `recorder` is live — an `onerror` teardown
that nulls `recorder` would crash the trailing `onstop` on
`recorder.mimeType`.

## Decision
- `recorder.onerror`: teardown mirroring `onstop`'s UI tail — drop
  `recorder`/`recChunks`, unlight the button, stop the tick, restore
  the label — plus an honest status (`recording failed — take
  dropped`). Partial chunks are discarded: a take the encoder
  abandoned is not a take the user chose to keep.
- `onstop` returns early when `recorder` is already null — the
  error path owns that take now.
- The constructor is wrapped; an unsupported recorder reports on
  the status line instead of throwing.

## Consequences
- A recorder fault can never again masquerade as a running take,
  and never latches the Rec button or breaks the next click.
- The beforeunload guard (ADR-0327) stays exact: an errored take
  holds nothing worth warning about, and `recorder` is null by
  then anyway.
