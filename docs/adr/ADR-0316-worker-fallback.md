# ADR-0316: A failed analysis worker falls back to inline compute

## Context

`analyzeTrack` had two paths: no `Worker` support → run the
estimators inline; worker spawns → post the buffer and wait. The
third case — a worker that *spawns* but fails mid-run — rejected
the promise, and both readouts died at '—'. But `estimateBpm` and
`estimateKey` are pure functions of the mono buffer; the inline
path computes them fine. The rejection degraded a flaky worker
into a dead readout for no reason.

## Decision

`w.onerror` now resolves with the inline result — same estimators,
same output shape — instead of rejecting. A worker failure costs
main-thread time, not the readouts.

## Consequences

- BPM/key estimates survive worker flakiness (CSP quirks, blob-URL
  issues, OOM) on every engine and context.
