# ADR-0008: Track Library with IndexedDB Persistence

## Status
Accepted

## Context

Every session so far starts empty: reload the page and the decks, the
decoded audio, and the BPM/key analysis are all gone. A DJ's *library* is
the point of persistence — but the first-principles question is "persist
what?" The expensive things are the audio decode and the analysis; both
are recoverable from the file, so the store must keep the file itself,
not just metadata.

Constraints: zero dependencies, no backend, private (files never leave
the machine), works on `file://`.

Options:

1. **IndexedDB with Blob records** — stores the original `File` blob
   plus derived metadata; ~80 lines of wrapper, survives reloads, works
   on `file://`.
2. **File System Access API handles** — store `FileSystemFileHandle`s and
   re-read on next launch. Better UX (no duplication) but requires
   re-permissioning every session and is Chrome-only.
3. **localStorage** — 5 MB cap and string-only; can't hold audio.
4. **Service Worker + Cache API** — correct tool for offline assets but
   adds a second file and registration plumbing for marginal gain.

## Decision

IndexedDB `acro-dj` / `tracks` object store, auto-populated:

- `id` (auto-increment), `name`, `size`, `type`, `blob` (the `File`
  itself), `duration`, `bpm`, `beatOff`, `key`, and the table fields
  `created_at`, `updated_at`, `deleted_at` (soft delete), `version`.
- `addFromFile` runs after every successful deck load — **zero extra
  steps**; dedupe by `name`+`size` refreshes the record rather than
  duplicating.
- `tag(id, patch)` merges analysis results as they land (BPM grid, then
  key) — the library row fills in asynchronously.
- `loadInto(deck, id)` passes `{bpm, beatOff, key}` as `meta` to
  `Deck.load`, which **skips re-analysis entirely** — library load is
  decode-only.
- The UI is one compact section under the decks: name / BPM / Camelot /
  duration / `→A` `→B` / `×` (soft delete). File names are HTML-escaped
  into the list (XSS hygiene — names are attacker-controllable input).
- Failures degrade: IndexedDB errors warn to console and the deck still
  loads; the library section simply stays empty.

## Consequences

- Storing blobs duplicates files on disk (IndexedDB quota is generous —
  hundreds of MB fine). FS Access handles would avoid the copy at the
  cost of per-session permission prompts; acceptable trade for zero
  friction.
- `version` increments on every `tag`/`remove` — keeps the audit trail
  the schema convention asks for.
- Soft-deleted rows are filtered, not purged; a future "clear library"
  can hard-delete.

## Rejected alternatives

- FS Access handles: per-session permission dance, Chrome-only.
- localStorage/sessionStorage: capacity.
- Remote upload: violates the local-only privacy stance.
