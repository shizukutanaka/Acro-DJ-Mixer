# ADR-0203: Continuous auto-mix skips already-played tracks

## Context
ADR-0174 greys out played library rows so the DJ sees what's been
spun — but `autoNext` ignored `plays`, so a long continuous
auto-mix could reload a track the set already played. Repeats are
the worst autopilot outcome; a key clash is subtle, a repeat is
glaring.

## Decision
The pick gains a freshness tier: played rows (`t.plays`) are
deferred to last resort. Preference order: unplayed + harmonic
fit > unplayed > played + fit > played. The `taken` exclusion
(both loaded decks) still applies first; played-fallback keeps
the harmonic preference so a forced repeat still mixes.

## Consequences
- Auto-mix walks the library fresh-first, matching what the
  greyed rows already tell the DJ about the set's history.
- When everything available is played, behavior degrades
  gracefully to the old ordering — a repeat, but a fitting one.
