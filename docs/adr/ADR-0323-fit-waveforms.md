# ADR-0323: Fit wave canvases to their layout width

## Context

Both wave canvases declared a fixed 640px bitmap while CSS stretches
them to `width: 100%`. On any deck wider than 640 px the browser
upscales the bitmap — the waveform, grid ticks and markers all render
blurry, and `computePeaks` only ever produced 640 buckets of detail
for a ~1000 px display.

## Decision

A `fitWaves()` helper runs once after deck construction and on every
window `resize`: it sets each canvas bitmap width to its
`clientWidth`, rebuilds `peaks` at the new bucket count, and redraws.
The mini overview's hardcoded 640×18 drawing constants now read
`waveMini.width`/`height` so it follows the same fit. Height stays
attribute-declared (fixed CSS height), DPR is left out — logical
pixels only, no coordinate refactor.

## Consequences

- The waveform renders at native sharpness at any window size, and
  peak detail scales with real display width.
- `peaks` rebuilds on resize, so zoom/scrub math (which is
  ratio-based) keeps working unchanged.
