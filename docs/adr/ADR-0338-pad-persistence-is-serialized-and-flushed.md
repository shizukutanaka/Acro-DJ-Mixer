# ADR-0338: Pad persistence is serialized and flushed on exit

## Context

`padSave` (ADR-0228) had two defects of the same classes fixed
elsewhere:

- **Racy writer**: it did read-modify-write on the pad record outside
  `Library._mutate`. Two overlapping calls on the same index — a load
  write and a clear write interleaved — raced last-put-wins: the
  older `put` could land after the newer one, resurrecting a cleared
  pad or losing a fresh sample. It also raced `tag`/`remove`, which
  ADR-0267 serialized for exactly this reason. And its blanket
  `catch` swallowed a dead store silently (ADR-0310 class).
- **Lost flush**: `padsSaveSoon` debounces 600 ms with no exit flush.
  A pad edit inside the last 600 ms before the tab closes was lost —
  the exact class ADR-0318/0320 fixed for `sessSave` with pagehide
  and visibilitychange→hidden flushes.

## Decision

- `padSave` runs inside `Library._mutate`, getting write
  serialization and the once-per-session dead-store warning for
  free. A `Library.all()` read failure routes to `Library.fail()`
  like every other read path.
- New `padsFlush()` cancels a pending debounce and writes all four
  pads immediately; both exit hooks (`pagehide`, `hidden`) call it
  alongside `sessSave`. IndexedDB commits still drain during
  pagehide in practice, so the flush is best-effort and cheap.

## Consequences

- Pad edits made in the final 600 ms before closing the tab persist.
- Concurrent pad mutations can no longer resurrect or drop samples.
