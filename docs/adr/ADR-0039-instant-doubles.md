# ADR-0039: Instant Doubles

## Status
Accepted

## Context

Doubling a track — loading it into the partner deck at the same
position and tempo — is the setup for scratches, back-to-back edits,
and "two copies, filter one" transitions. Doing it by hand meant
re-picking the file, re-seeking, and re-matching tempo.

## Decision

- A `×2` button beside `Sync`: captures the deck's position and rate,
  `load`s its stored file object into the partner, then applies the
  same rate, seeks to the captured position, and plays if the source
  was playing.
- The deck keeps its file object (`_fileObj`) from load — works for
  file-input and library loads alike; the library's name+size dedupe
  means the partner load just refreshes the same record.
- Position is snapshotted at click time; the partner lands on that
  point (hardware doubles behave the same way — the decks then drift
  only by the original tempo error).

## Consequences

- One click replaces file-reload + re-seek + re-sync.
- Library dedupe keeps this free of duplicate rows.

## Rejected alternatives

- Auto-Sync after doubling: keeps the two decks phase-locked forever,
  which defeats the technique — doubles exist so the decks can be
  ridden independently.
