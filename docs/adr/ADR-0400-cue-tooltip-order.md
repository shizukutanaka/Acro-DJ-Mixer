# ADR-0400: One Cue-title refresh per write — kill the doubled call

## Status
Accepted

## Context
ADR-0388 made every `cueIn` writer refresh the Cue button tooltip
(`_cueTitle`), because the tooltip names where Cue will land. The
waveform contextmenu handler ended up calling it twice per write —
once right after `tagLib` and again after `drawWave` — an artifact of
the fix landing beside an already-present call.

The duplicate is harmless but wrong on two counts: it runs the same
string formatting twice for no effect, and it breaks the handler's
ordering symmetry with the right-click undo path (write → tagLib →
invalidate → draw → title → status), which is how readers verify the
writer contract by comparison.

## Decision
Keep the single `_cueTitle()` call after `drawWave`, matching the undo
handler's sequence exactly.

## Audit this round (verified clean)
- `sessSave`/`sessRestore` field coverage vs every latched deck/mixer
  control: complete. Channel mute is momentary-only — nothing to
  persist, by design.
- `seekTo` on a stopped deck: `tick` calls `drawWave` every frame and
  the `_drawnPos` check redraws on position change — no stale
  playhead.
- `st` transpose: every write goes through the shared setter, which
  refreshes `keyEl`/`effKey` on both decks.
- Sync leader lifecycle: eject clears `leading` and the `on` class;
  the tick skips absent grids/buffers.
- `deckSnap` (swapWith/instantDouble): carries file, pos, rate, st,
  playing, cues, armed loop, cueIn, loop memory, stem, grid, key,
  libId — channel prefs (gain/fader/EQ/assign/range/keylock/brake/
  remain/slip) correctly stay with the deck, not the track.
- Raw `rate`/`bendMul` writes: all init-time, load-reset, worklet
  echo, or inside their shared setters — no stragglers.
- `cueIn` writers: every path stashes `_prevCueIn` (undo), tagLibs,
  and refreshes the title once — now including this handler.

## Consequences
- The handler and the undo path are line-for-line symmetric — future
  diffs compare cleanly.
- No behavioural change; the tooltip already ended up correct.
