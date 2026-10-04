# ADR-0002: Beat-grid phase detection + Sync

Status: accepted
Date: 2026-10-04

## Context

ADR-0001 defined the automation layer: tasks that historically needed a human
ear become computable. Beatmatching is the first of those — it has two parts:

1. **Tempo** — solved in round 1 by energy-flux ODF + autocorrelation.
2. **Phase** — where the beats actually land in time. Without this, matching
   BPM still leaves decks a half-beat apart.

This is exactly the decomposition in Ellis, *Beat Tracking with Dynamic
Programming* (2006): estimate a global tempo from an onset-strength signal,
then find beat positions that both sit on strong onsets and respect the
period. His phase search uses dynamic programming to track beats frame by
frame.

## Socratic check

- *"Do we need full beat tracking (DP over the whole track)?"* No. Sync needs
  the grid *now*, at the current position — assuming a constant tempo is what
  every hardware deck does. A single phase offset at the estimated period is
  sufficient and is O(frames), not O(frames × lag).
- *"Does phase need sub-frame precision?"* No. The ODF hop is 128 samples at
  11025 Hz ≈ 11.6 ms — below the ~20 ms threshold where a trained ear notices
  flam on transients. Interpolation would add complexity for inaudible gain.
- *"Should sync adjust phase continuously (like Traktor's beat lock)?"* No —
  hardware sync is a one-shot slip; drift afterwards is corrected by the DJ
  (and our BPM is only an estimate anyway). Continuous chasing would fight the
  tempo slider the user may still be touching.
- *"Should sync exceed the ±16% tempo range?"* No — keep the hardware
  constraint; warn and clamp, because silently time-stretching 30% is how you
  get unusable audio with no keylock yet.

## Decision

`estimateBpm` now returns `{bpm, beatOff}`:

- `beatOff` = the comb phase (0..lag) maximizing summed ODF at that phase —
  the offset of the beat grid in track-time seconds.
- Octave guard: periodic signals correlate at 2×/4× the true beat lag, so the
  chosen period is the *smallest* lag within 92% of the autocorrelation peak —
  the fastest tempo that still explains the onsets (fixes half-tempo reads
  such as 64 on a 128 BPM pulse train).
- `Deck.syncTo(other)`:
  - rate = `other.bpm * other.rate / this.bpm`, clamped to ±16% with a status
    warning when clamped (mirrors the pitch-range limit of real decks).
  - when both decks are playing, slips this deck's position to the nearest
    grid-aligned beat matching the partner's current phase — a ≤ half-beat
    jump, computed in track-time (`pos()` already folds in `playbackRate`).
- Waveform draws faint ticks at `beatOff + k·beatLen` so the grid — and the
  effect of sync — is visible, not just audible.

## Consequences

Sync is correct to ODF-frame precision (~12 ms) under a constant-tempo
assumption; rubato/live tracks may drift, same as on hardware without a
remix-deck beatmap. Grid precision and drift correction are the natural next
improvement — along with keylock, which currently makes large tempo matching
pitch-shift the track.
