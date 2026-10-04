# ADR-0114: Tab title shows the playing deck

## Status
Accepted (2026-10-04)

## Context
With continuous auto-mix the app is meant to run unattended —
but in a background tab there was no way to glance at what's on
the floor without switching to it.

## Decision
The render loop writes `▶ A: name — Acro DJ Mixer` into
`document.title` while a deck plays, reverting to the static
title when nothing is. The assignment is guarded by an equality
check so the DOM isn't touched every frame.

## Consequences
- Track, deck, and playing state are visible in the tab strip.
- Free for every feature that already flips `playing` — auto-mix
  included.
