# ADR-0073: Auto-mix long fade — Shift+Auto for a 32-beat blend

## Status
Accepted (2026-10-04)

## Context
Auto mix fades over a fixed 8 beats — right for a quick swap, wrong
for ambient/deep transitions where a slow blend is the point. DJs
choose fade length per transition; the app offered only one.

## Decision
`autoMix.len` (8 default, 32 via Shift+click on `Auto`), captured at
arm time so a mid-arm shift doesn't retro-change a running fade. Both
the trigger window and the fade duration scale: trigger at
`2 * len` beats remaining (16 stays for 8, becomes 64 for 32), fade
`dur = len * beat` — the same lead-in proportion as before.

## Consequences
- One gesture, no new UI: shift = long, plain click = classic.
- No defaults changed for existing users.
