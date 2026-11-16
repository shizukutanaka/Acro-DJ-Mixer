# ADR-0427: Eject unloads the worklet, not just the deck's fields

## Status

Accepted (2026-11-16)

## Context

`eject()` cleared every JS-side field — buffer, offset, grid, cues —
but never told the worklet. The processor kept the ejected track's
samples and playhead, and because it only reports position while
playing a buffer it holds, the residue stayed invisible until a new
buffer arrived by any path that doesn't post `'load'`: from then on
the engine played and reported the *dead* track's timeline, and
`onMsg('pos')` kept stamping `deck.offset` with it.

ADR-0426 made this reachable in the smoke gate: the demo section
loads both decks through the real `load()` path, plays deck A, then
ejects both and hands them down empty. The phase-meter section
(ADR-0023) equalizes `deckB.offset = deckA.offset` and reads the
live meter after 400 ms of play — by then the resyncs had replaced
the equalized offset with deck B's worklet position (≈0.4 s into the
ejected demo, against the ≈3.4 s the section set up), and the meter
honestly reported the decks out of phase. On main no track ever
reached a worklet, no `'pos'` reports existed, and the same section
was deterministic.

The app-side reading is the same defect in miniature: an ejected
deck's engine retained ~13 MB of samples and a live playhead for a
track the user had thrown away — "unload the track and return the
deck to its empty state" was only true of one half of the deck.

## Decision

- The worklet learns `'unload'`: drop the buffer and synthesis
  state, zero both playheads, stop. `posSamples()` on an unloaded
  engine reports 0 — exactly a never-loaded deck.
- `eject()` posts it alongside the existing loop-off, after
  `stopPlayback()`. `load()` needs no change (`'load'` already
  resets the processor wholesale), and pause semantics keep the
  track: only eject unloads. `resetChannel()` rides along via
  `eject()`, as before.

## Consequences

- An ejected deck is empty in both halves; the next buffer starts
  from the deck's own bookkeeping, not a predecessor's timeline.
- The smoke gate's phase-meter section is deterministic again —
  with no buffer held, an engine emits no `'pos'` reports, so the
  equalized offsets the section sets are the ones the meter reads.
- Eject also frees the ejected track's samples immediately instead
  of whenever the next track happens to load.
