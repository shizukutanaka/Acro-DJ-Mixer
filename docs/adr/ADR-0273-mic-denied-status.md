# ADR-0273: A denied microphone says so

## Status
Accepted.

## Context
`micOpen` swallowed a rejected `getUserMedia` with `catch { return; }` —
clicking Mic with the permission denied lit nothing and said nothing,
the same class of silent failure ADR-0208 removed from the audio path.
The user can't distinguish "denied" from "broken".

## Decision
The catch posts `mic denied` on the deck status line before returning,
matching the import-report precedent (ADR-0230): failures the user
caused are still failures worth surfacing.

## Consequences
A denied mic read is diagnosable at a glance; no behaviour change when
the permission is granted.

## Round
Improvement round 274.
