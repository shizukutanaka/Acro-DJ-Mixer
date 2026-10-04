# ADR-0118: Four one-shot sampler pads

## Status
Accepted (2026-10-04)

## Context
Every sound had to live on a deck — jingles, drops, and one-shots
cost a whole deck or a queue break. DJM-style samplers give you a
few pads independent of the decks.

## Decision
A `Smpl` row in the mixer: 4 pads, click loads a file, click again
fires it one-shot (retrigger restarts), shift-click clears — one
voice per pad. Output enters `monoNode`, so samples share the
limiter, the mono fold-down, and the recording path exactly like
deck audio.

## Consequences
- FX drops and jingles fire independently of both decks.
- Session-scoped pads — deliberately not persisted (pad content is
  a set choice, not track metadata).
