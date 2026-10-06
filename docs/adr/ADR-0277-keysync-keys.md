# ADR-0277: Key sync on the keyboard

## Status
Accepted.

## Context
Tempo sync has a key (e/i) but its harmonic sibling — the Key button's
one-press Camelot transpose — was mouse-only. Harmonic mixing from the
keyboard stopped at tempo.

## Decision
`t` fires deck A's `keySync()`, `y` deck B's — each under its tempo-sync
key (e→t, i→y), so the sync pair stacks tempo above harmony. On an
un-analyzed deck the button's own status line explains ("need keys on
both decks"). Help overlay updated.

## Consequences
The full sync gesture set (tempo, phase, key) is keyboard-reachable;
t/y were unmapped.

## Round
Improvement round 279.
