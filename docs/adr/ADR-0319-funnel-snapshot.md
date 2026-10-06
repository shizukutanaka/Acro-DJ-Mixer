# ADR-0319: Snapshot persisted values at the shared mutators

## Context

`sessSave` fires via `sessSoon` on `input`/`change`/`click` events —
but arrow-key fader rides and every MIDI write mutate the control
element and call the mutator without dispatching an event. Keyboard
and controller moves silently bypassed persistence: the next load
restored the last *mouse* position, not the last position.

## Decision

Call `sessSoon()` from the three shared funnels every writer goes
through — `applyCrossfade()`, `setGain()`, `setFilter()` — instead
of touching each writer. The debounce already collapses rapid calls:
a live auto-mix fade or CC stream schedules one save at the end, not
one per frame. Mouse gestures pay one extra timer reset, no cost.

## Consequences

- Crossfader, gains and filters now persist regardless of which
  surface moved them — mouse, keys, MIDI, or auto-mix.
- Any future writer routed through these funnels inherits
  persistence for free.
