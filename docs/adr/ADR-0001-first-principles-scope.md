# ADR-0001: What is DJ software in the AI era? (First-principles + Socratic scoping)

Status: accepted
Date: 2026-10-04

## Method

Two lenses were applied to the question "what should AI-era DJ software be?"

1. **First-principles (Musk method)** — strip every requirement down to physics-level
   truths, delete what cannot be justified, then rebuild only the residue.
2. **Socratic questioning** — interrogate each assumption until it either survives
   as a necessary component or is exposed as convention.

## First principles: the atomic unit of DJing

A DJ set is, at the signal level, exactly this:

- Two or more audio sources playing simultaneously.
- A per-source loudness control and a crossfade between sources.
- Per-source playback-rate control so tempos can be matched.
- A way to locate and restart a position inside a track (cue/seek).
- One summed master output.

Everything else on a modern DJ deck — effects, loops, samplers, library
management, streaming, video — is *derivative*: it either processes that signal,
helps choose what to load, or distributes the result. None of it is required for
the product to be DJ software at all.

## What the AI era actually changes

Socratic check: does "AI-era" change the atomic unit? **No.** The signal graph
above is unchanged. What changes is *which tasks the human must still perform by
ear and by memory*:

| Historically human-only task        | Now computable                          |
|-------------------------------------|------------------------------------------|
| Beatmatching by ear                 | Auto BPM / beat-grid estimation          |
| Harmonic mixing by ear              | Key detection, Camelot suggestions       |
| Mashups needing acapella pressings  | Real-time stem separation                |
| Track selection from memory         | Embedding-based recommendation           |
| Transition timing by feel           | Phrase-aware auto-mix assistance         |

So "AI-era DJ software" = the same minimal signal core, plus an automation layer
that removes the ear-and-memory bottlenecks. The core ships first; the
automation layer is layered onto it one capability at a time.

## Socratic audit of the obvious defaults

- *"DJ software needs a backend."* No. Audio files are user-owned and local; a
  browser can decode and mix them with zero upload, zero server cost, and full
  privacy. A backend is justified only when we add library sync or sharing —
  not before.
- *"We need Electron / a native app."* Not yet. Web Audio API provides the full
  signal graph natively. Native is justified only when we need low-latency
  hardware I/O (DVS, HID controllers, multi-channel audio interfaces).
- *"We need a framework / build step."* No. Two decks and a crossfader do not
  justify a dependency tree. Vanilla JS keeps the artifact a single file that
  runs from `file://`.
- *"We need a database."* No tables exist yet. When library management lands, it
  will follow the repo convention: `id`, `created_at`, `updated_at`,
  `deleted_at`, `version` per table.
- *"We need stems / key detection / auto-mix now."* YAGNI. They are the
  roadmap, not round 1. An auto-BPM estimator *is* included in round 1 because
  it is the cheapest capability that already removes a real human bottleneck
  (manual beatmatching needs a tempo reading first) and it is implementable in
  ~80 lines of energy-flux autocorrelation with no dependencies.

## Decision

Round 1 ships the atomic unit in the cheapest possible form:

- Single-file `index.html`, vanilla JS + Web Audio API, no dependencies,
  no build step, runs from `file://` or any static server.
- Two decks: file load (click or drag&drop), play/pause, cue, gain,
  tempo (±16%), waveform overview with playhead.
- Equal-power crossfader and per-deck channel fader into one master.
- Auto BPM estimate per deck (energy-flux autocorrelation, 60–180 BPM).

## Explicitly rejected for now (roadmap, not scope)

Keylock / master tempo (needs a phase-vocoder or WSOLA — real complexity),
stem separation (needs an ML model + worker pipeline), key detection,
beat-grid phase alignment / sync button, library & playlists, effects,
recording, streaming services, Electron/native shell, backend, database.

## Consequences

The product is usable as DJ software today and every AI-era feature can be
added as an independent layer on top of a stable signal core — matching the
repo's working style of one small, self-contained increment per round.
