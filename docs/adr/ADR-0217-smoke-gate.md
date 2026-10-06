# ADR-0217: Committed smoke gate — tests/smoke.mjs

## Context
The audit's top structural weakness: 200+ rounds of verification
were session-local throwaway scripts, so the repo had no
reproducible proof that decode → nodes → play → cue → sync
worked — the core contract a change can silently break.

## Decision
One self-contained `tests/smoke.mjs`: connects to Chrome over
CDP via playwright (the only dev-time dependency — the app
still ships zero-dep), synthesises a WAV in-page, and asserts
nodes, play/pause, crossfader law, hot-cue round-trip, tempo
sync, and zero page errors. Non-zero exit = gate failed.
`tests/README.md` carries the three-line setup.

## Consequences
- Every future round can run the same gate instead of a bespoke
  script; CI can adopt it verbatim when the repo gets a runner.
- Scope stays minimal — a gate, not a suite. Behavioural tests
  still live in ADRs.
