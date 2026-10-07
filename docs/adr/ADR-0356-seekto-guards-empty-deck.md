# ADR-0356: seekTo guards the empty deck

## Context
Same latent crash class as ADR-0355: `seekTo` dereferences
`this.buffer.sampleRate` on the worklet path, and `engine` outlives
`buffer` after eject. Every current caller guards `!this.buffer`
first — but the method itself is the invariant's proper home, so a
future call site can't open the crash again.

## Decision
`if (!this.buffer) return;` at the top of `seekTo`, matching
`play()`/`cue()` — transport verbs are no-ops on an empty deck.

A sweep of every `this.buffer.*` dereference confirms the class is
now closed: `pos`, `play`, `cue`, `seekTo`, `toggleLoop`,
`startRoll`, `beatJump`, `jumpBar`, `padCue`, `quantize`,
`seekFromEvent` all guard `!this.buffer` directly; `drawWave`'s
duration reads sit behind `!this.peaks` (cleared with buffer on
eject); the remaining loop-edit reads sit behind `loopOn`/`grid`,
both cleared on eject.

## Consequences
Seeking an empty deck is a no-op from any entry point — current or
future.
