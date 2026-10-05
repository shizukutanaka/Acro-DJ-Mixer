# ADR-0170: Phrase-aligned auto-mix

## Context
The auto-mix trigger fires at "2×fade-length beats before the end"
— but the end of a track rarely sits on a bar line, so the fade
starts mid-phrase. A human DJ launches a transition on a downbeat.

## Decision
The raw fire point is unchanged, but with a beat grid the fade now
snaps to the nearest 4-beat bar on that grid (±2 beats). The button
countdown reads beats to the snapped point. Without a grid there
are no bars to align to, so the old remaining-beats threshold is
kept.

## Consequences
- Automated transitions start on downbeats, matching the phrasing a
  DJ would pick by hand; tracks without a grid behave as before.
