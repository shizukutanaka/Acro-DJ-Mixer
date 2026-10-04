# ADR-0043: Waveform zoom — playhead-centred wheel zoom

## Status
Accepted (2026-10-04)

## Context
The overview waveform (ADR-0001) renders the whole track at once: one
pixel column ≈ duration/640 — ~75 ms for a 3-minute track. Beat-grid
nudging (ADR-0030) and cue placement (ADR-0010/0021) need finer visual
resolution to eyeball a tick onto a transient. Serato/CDJ-style zoomed
waveforms are the standard remedy.

## Decision
Scroll over a deck's waveform zooms ×1.5 per wheel step, clamped
[1, 32]; scroll down zooms back out. The view is a playhead-centred
window `_viewSpan() = [pos - dur/2z, pos + dur/2z]` — the window follows
playback so the detail always surrounds the playhead, matching
CDJ/Serato behaviour. Click-to-seek maps through the same window.

No second peaks array: each pixel column samples `peaks[t/dur * n]` for
its time, so zoomed windows reuse the existing array and the cost of a
draw is unchanged. Grid ticks, the loop region, and cue markers render
through the same `xOf(t)` mapping (ticks iterate from the first beat ≥
window start, not from zero).

Zoom is view state only — it persists across loads (hand-position
doctrine) and is not written to the library.

## Consequences
- Nudge/cue/grid work can be done at ~2 ms/pixel precision.
- Beat ticks thin out naturally at zoom — no density clamp needed.
- Wheel is captured only when a track is loaded, so page scroll is
  unaffected otherwise.
