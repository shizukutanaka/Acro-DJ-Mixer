# ADR-0343: Deck swap forwards loop memory slots and stem mode

## Status
Accepted (2026-10-04)

## Context
`swapWith` (Shift+×2) trades deck contents by snapshotting each side
into a `meta` record and re-running `load()` — the same restore path
the library uses, so "every restored field lands exactly as it was."
But the snapshot's meta predated two fields `load()` learned to read:

- `meta.mem1` / `meta.mem2` — persisted loop-memory slots
  (ADR-0221, forwarded by `loadInto` in ADR-0298). Swapping decks
  dropped both memory slots on *both* decks: saved loops a DJ keeps
  in the bank vanished mid-set.
- `meta.stem` — Vocal/Inst split mode (ADR-0222, forwarded by
  `loadInto` in ADR-0339). A swap silently reset each deck's stem
  select to off/full mix — audible immediately.

Same completeness class as ADR-0298/0339/0336: every producer of a
`meta` record must name every field `load()` consumes; `swapWith`
was the last producer still missing them.

## Decision
`snap()` meta gains `mem1: d._loopMem`, `mem2: d._loopMem2`,
`stem: d.stemSel.value` — read from the live deck, just like the
existing `loop`/`cueIn` entries. Still not snapshotted (unchanged, by
design): channel strip state (slip/brake/keylock, FX, fader, assign,
tempo range, loop-length select) stays put — the swap trades *track*
state, not channel wiring (same boundary as `resetChannel`).

## Consequences
- Deck swap preserves loop memory banks and stem splits; the swap
  now lands every field `load()` restores.
- No format change — `load()` already reads these keys.
