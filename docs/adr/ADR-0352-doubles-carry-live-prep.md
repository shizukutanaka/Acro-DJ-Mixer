# ADR-0352: Instant doubles carries the live prep, not just the file

## Context
`instantDouble` cloned a deck with a bare `p.load(this._fileObj)` —
no meta. The clone got a fresh analyze and nothing else:

- unsaved hot cues, the armed loop, cue-in, both loop-memory slots
  and the stem mode were silently dropped (a Vocal-only double came
  out Full);
- BPM/key were re-analyzed even though the source deck already knew
  them — slower *and* a different grid could land until the analysis
  finished.

`swapWith` already carried a complete meta snapshot for exactly this
purpose (ADR-0343 completed it: cues/loop/cueIn/mem1/mem2/stem/bpm/
beatOff/key/libId). The same "meta producer must name every field
load() consumes" doctrine applies to the third clone verb.

## Decision
Hoist the snapshot into module-level `deckSnap(d)`; `swapWith` and
`instantDouble` share it. `instantDouble` loads the partner through
`p.load(file, deckSnap(this).meta)` — the clone inherits live prep
and cached analysis, so doubling onto a Vocal stem stays Vocal.

## Consequences
A double is a real clone: same cue map, loop, cue-in, loop memory,
stem, grid and key — and no re-analysis lag.
