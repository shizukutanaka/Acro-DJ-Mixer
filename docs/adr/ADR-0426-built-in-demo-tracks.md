# ADR-0426: Built-in demo tracks, synthesized in the page

## Status

Accepted (2026-11-16)

## Context

ADR-0425's quickstart bar walks a newcomer to their first mix in
three steps, but step 1 still assumes the visitor already owns an
audio file and can find it. A first-timer with no files hits a wall
at the exact moment the bar promises momentum: two empty decks and
nothing to load. The mixer is complete; the missing piece is a
first track.

Shipping recorded demo songs is not an option. Any existing
recording or sample pack carries licensing weight this project
refuses on principle (the creator holds no rights it cannot state
in one sentence), and binary audio assets would break the
single-file, zero-dependency distribution — the Release is one
`index.html`.

## Decision

Two practice tracks are synthesized sample-by-sample in the page
(`DemoTracks` in index.html) and encoded to 16-bit WAV `File`s at
click time:

- "First Light" — 124 BPM, A minor (Camelot 8A): four-on-the-floor
  kick, offbeat hats, claps, octave bass, pentatonic pluck over
  Am–F–C–G pads.
- "Second Wind" — 128 BPM, C major (Camelot 8B): 16th hats, snare
  backbeat, driving 16th bass, offbeat stabs and a chord-tone arp
  over C–G–Am–F.

Both run 32 bars in the same arrangement shape (intro / groove /
full / break / full), so the pair teaches the core DJ skills:
beatmatching across a real 4 BPM gap, harmonic mixing on a
relative major/minor pair, and phrasing against a break.

- The renderer is deterministic (seeded PRNG noise, fixed pattern
  data), so every visitor hears the identical track and the render
  is testable. Renders are cached per session; the second load is
  just a decode.
- The WAV `File` rides the ordinary `deck.load()` path — decode,
  auto-cue, auto-gain, peaks, waveform — with the analysis it was
  built from (exact BPM, beat offset 0, Camelot key) passed as
  cached meta, the same path a library track takes. Running the
  estimators on a track whose tempo is known by construction would
  only add a chance to be wrong.
- The demos never enter the library: there is no user file to keep,
  and a ~13 MB synthesized blob has no business in IndexedDB.
- Surfaces: a button in the quickstart bar loads both decks at
  once (the bar then retires by its own both-decks rule), and each
  deck carries a "Load the built-in demo track" button under its
  drop zone, so the demos stay reachable after the bar is gone.
  Deck B's button arrives free via the ADR-0424 clone.
- Demo identity is on the file name itself — `DEMO - First Light
  (124 BPM).wav` — so the drop zone, the tab title and the setlist
  all say what is loaded. No separate badge surface to keep honest.

## Consequences

A first-timer with no files reaches "two tracks loaded and
blending" in one click, which is the outcome ADR-0425 named but
could not deliver alone. The cost is ~250 lines of synthesis code
in the single file and one render of CPU time (sub-second to a few
seconds on a slow machine, labelled "Synthesizing…" while it runs).

Honest limits: the tracks are loops with arrangement, not songs —
they exist to practice on, not to release. Long or loud listening
was not part of the bar; the smoke gate asserts load, grid, key,
waveform paint and playback, and the musical content itself is
fixed data the audit can diff.
