# ADR-0206: Right-click Sync = tempo only

## Context
Sync had three modes — full (tempo + phase), Shift = phase-only
(ADR-0075), Alt = sync leader (ADR-0130) — but no "match the BPM
and leave my position alone". Mid-phrase, a phase re-seek chops
whatever's playing; the DJ wants the rate, not the jump.

## Decision
`syncTo` gains a `tempoOnly` flag (right-click on the Sync
button): it runs the same needRate → clamp → `setRate` path and
skips the phase-align re-seek. Status reports "Tempo-matched" so
the deck tells you which of the three syncs just happened.

## Consequences
- The sync grammar is now complete: tempo+phase / phase-only /
  tempo-only / continuous leader — one button, four intents.
- The phase re-seek is the only skipped step; rate math stays
  identical, so the three modes can't drift apart.
