# ADR-0211: Track identity by content hash, not name+size

## Context
Audit P0: library records deduped on name+size — two different
files sharing a filename (a re-encoded `track.mp3`, a fixed
export) silently merged into one record and inherited each
other's cues, loops, keys and play counts. Renamed files went
the other way: same audio, new record, prep lost.

## Decision
`trackHash` computes SHA-256 over size + head 64 KB + tail
64 KB (cheap on hour-long files, catches both failure modes).
`addFromFile` and metadata import compare by hash when both
sides have one, and fall back to name+size only when a side
can't be hashed (legacy records, insecure contexts without
`crypto.subtle`). Export carries `hash` in `LIB_META_KEYS`.

## Consequences
- Renames keep their prep; same-name impostors get their own
  record instead of stealing another track's.
- Cross-machine import survives renames too — hash matching
  precedes the name+size fallback there as well.
