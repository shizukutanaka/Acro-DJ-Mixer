# ADR-0386: Reads ride the write chain

## Context
ADR-0267 serialized every library mutation through `Library._wr` so
read-modify-write patches can't interleave. But readers stayed
unserialized: `loadInto` called `get` directly, so a `tag` that was
queued but not yet applied — a cue set on deck A an instant before
the same row is dragged to deck B — handed the loader the
pre-write record. The just-set prep silently didn't ride along.

## Decision
`loadInto` awaits `this._wr` before its `get`. The chain already
swallows write errors, so awaiting it can only wait, never throw
or deadlock. Display readers (`all`, preview) keep reading
directly — a row a render behind is cosmetic; a deck loaded with
stale prep is lost work.

## Consequences
One-line change; worst case the load waits for one pending
IndexedDB put (milliseconds). The queue's contract is now
complete: writes serialize against writes, reads against writes.
