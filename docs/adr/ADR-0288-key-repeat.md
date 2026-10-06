# ADR-0288: Key auto-repeat only rides the arrows

## Status
Accepted.

## Context
The keydown map never checked `e.repeat`: holding `q`/`p`
machine-gunned play/pause, holding `1`–`4` spammed the sampler's
file picker on an empty pad, and `?` flickered the help overlay.
The only keys where auto-repeat is intentional are the arrows —
holding one rides the fader continuously.

## Decision
`if (e.repeat && !e.key.startsWith('Arrow')) return;` at the top of
the keydown listener — toggle/fire verbs fire once per physical
press; the fader ride keeps its hardware feel.

## Consequences
Held keys are safe; the deliberate repeat affordance (arrows) is
untouched.

## Round
Improvement round 290.
