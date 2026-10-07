# ADR-0378: One upfader path owns the fader-start edge

## Context
The channel upfader's fader-start edge check lived inside the
`input` listener. Two other writers — the double-click reset and
MIDI CC 22/23 — set `faderEl.value` and called `setFader` directly,
so `_faderPrev` kept a stale 0. On a stopped deck the next physical
touch then ghost-fired a start the user never made; and a
controller moving the fader up could never start the deck at all.
`resetChannel` already stamped `_faderPrev` — the contract existed
but only where someone had remembered it.

## Decision
`_faderIn(v)` is the single path every writer takes: drag, reset,
MIDI. It runs the edge check, stamps `_faderPrev`, then applies the
gain. The law is now uniform with the crossfader's (ADR-0358):
whoever pulls an upfader off zero owns the start — double-clicking
the fader back to unity on a stopped deck starts it, and a MIDI
fader works exactly like a finger.

## Consequences
Fader-start can never be phantom-triggered by stale bookkeeping,
and every future writer (session restore, auto-mix) inherits the
semantics by calling `_faderIn`.
