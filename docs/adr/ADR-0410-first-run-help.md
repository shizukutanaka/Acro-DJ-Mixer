# ADR-0410: Open the gesture legend once on first visit

## Context

The app grew a dense gesture grammar — clicks, right-clicks, shift/
alt/long-press modifiers, drags on waveform ticks, two-stage guards.
ADR-0231 added a `?` overlay documenting it, and ADR-0255/0294 keep
the card in sync with the real shortcuts — but a first-time user has
no reason to know the overlay exists. The audit's P1 "first-run
onboarding" item is exactly this gap: the documentation exists, it is
just invisible until discovered.

## Decision

On first visit only, open the help overlay at boot:

- After the `helpEl` wiring, a `localStorage` flag
  (`acro-seen-help`) is checked; absent → the flag is written and
  `helpEl.hidden = false`.
- Subsequent visits stay quiet. `?`/click/Escape dismiss as usual —
  no new dismissal path is needed.
- The whole block is try/catch: storage failure (private mode,
  cleared site data) simply means the card appears again next visit —
  harmless, one click closes it.

Deliberately not done: no multi-step tour, no auto-show after an
update, no "don't show again" checkbox — the flag IS the opt-out, and
a first-run card that re-appears would be the annoyance this design
avoids.

## Consequences

- New users see the full gesture grammar before their first click.
- The flag key shares the `acro-` namespace with session/setlog/stats.
- Headless verification: the overlay sits above the deck but the
  smoke gate drives DOM methods and `.click()` directly, so showing
  the card changes no assertion — verified green.
