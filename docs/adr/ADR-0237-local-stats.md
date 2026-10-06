# ADR-0237: Telemetry-lite — local-only lifetime counters

## Status
Accepted.

## Context
Nothing about how the mixer actually gets used is visible: how many
tracks have been loaded, loops armed, auto transitions ridden,
takes recorded. Real telemetry is off the table — the app's
doctrine is local files only, nothing uploaded — so the
observability question is how to learn from usage without ever
leaving the machine (audit P3: telemetry-lite local counters).

## Decision
Five counters — `loads`, `plays`, `loops`, `autos`, `recs` — in
`localStorage['acro-stats']`, incremented at five call sites
(decode done, `play()`, both `toggleLoop` arm paths, auto-mix fade
start, recorder stop). The footer tooltip lists them via
`statPaint()`, called on every `stat()` and once after the stats
block initializes (the declaration lives near `sessKey`, so the
paint call must sit after it — a paint call earlier in the file
would hit the `const` in its TDZ).

## Consequences
Lifetime usage is inspectable in-app with zero network and zero
schema change — the same localStorage persistence doctrine as
`acro-session`/`acro-setlog`. Counters are cumulative across
sessions and invisible until hovered; nothing is reported,
exported, or uploaded.

## Round
Improvement round 237 (audit P3: telemetry-lite).
