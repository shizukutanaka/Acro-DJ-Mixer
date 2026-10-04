# ADR-0072: Library metadata export/import

## Status
Accepted (2026-10-04)

## Context
Everything valuable the app learns — detected BPM/grid, key, hot
cues, armed loops — lives in IndexedDB on one browser profile. Moving
to another machine or browser means re-analysing and re-cueing every
track. The audio files themselves are user files; only the metadata
needs to travel.

## Decision
`⤓ Export` / `⤒ Import` buttons under the library filter:

- **Export** serializes every live record's `{name,size,type,
  duration,bpm,beatOff,key,cues,loop}` to `acro-dj-library.json`.
- **Import** reads that JSON and `Library.tag`s each entry onto the
  local record matching `name+size` (same dedupe key as
  `addFromFile`); entries without a local track are skipped — there
  is no audio blob to attach them to.

## Consequences
- Metadata is portable; audio deliberately is not (blobs stay local).
- Import is merge-only: it patches analysis fields, never deletes
  records or touches blobs.
- Malformed JSON fails silently — import is best-effort, no blocking
  dialog.
