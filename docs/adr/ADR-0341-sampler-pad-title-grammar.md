# ADR-0341: One sampler-pad title grammar; start trim schedules a save

## Context

Two defects on the sampler pads, one old class + one new miss:

- **Divergent tooltips (ADR-0315's class, again)**: pad title writes
  had forked — `padsRestore`, `loadSmpFile`, and the loop-resample
  path wrote a bare name (no gesture hints at all), while the
  shift-click clear path wrote a *different* empty-pad sentence than
  the canonical one, missing the gate/wheel/resample/choke grammar.
  A pad you loaded from disk or resampled advertised fewer gestures
  than one you had wheel-trimmed — the same silent-feature problem
  ADR-0315 fixed on the hot-cue pads.
- **Unpersisted trim**: shift+wheel's start-offset trim never called
  `padsSaveSoon` — `rec.start` is a persisted field, but trimming
  only the start left nothing to fire the debounce, so the trim was
  lost on reload. The level trim right below it saved correctly.

## Decision

- `SMP_EMPTY_TITLE` and `SMP_GESTURES` become the single source of
  the grammar; `smpPadTitle(name)` builds occupied-pad titles. All
  five divergent writes route through them. The wheel-trim titles
  keep their live-value format (they already name the gestures).
- The start-trim branch calls `padsSaveSoon()` like the level trim.

## Consequences

- Every occupied pad — loaded, restored, or resampled — advertises
  the full gesture set; every empty pad reads identically.
- Start offsets survive reload like gain and the pad assignment.
