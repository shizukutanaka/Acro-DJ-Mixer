# ADR-0136: On-deck highlight — library rows show which deck holds them

## Context
While digging the library mid-set you can see which track fits
harmonically (ADR-0011) and which carry prep badges (ADR-0071), but
nothing answered the most basic question — *is this track already on
a deck?* Loading the same record on both decks, or hunting for the
row the playing track came from, was guesswork.

## Decision
`renderLibrary` tags each row `onA`/`onB` when its id matches the
corresponding deck's `libId`; a trailing `A` (blue) or `B` (amber)
letter is appended to the row name via CSS — the deck colours match
the on-screen deck accents.

To make the highlight truthful, `eject()` now clears `this.libId`
(it previously kept the stale claim) and re-renders the library; the
async library-save `.then` in `load` also guards on `this.buffer` so
a track ejected mid-analysis cannot re-lit the row afterwards.

## Consequences
- Loaded tracks are visible at a glance in the crate — no guessing
  which row is live.
- Eject and mid-load edge cases stay consistent: the marker follows
  what the deck actually holds, not what it once held.
- No new UI chrome: two CSS rules, one suffix letter.
