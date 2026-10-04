# Acro DJ Mixer

DJ software for the AI era — a minimal, dependency-free two-deck mixer that runs
entirely in your browser. Audio files stay local; nothing is uploaded.

Scope and rationale are defined in [docs/adr/ADR-0001](docs/adr/ADR-0001-first-principles-scope.md):
first-principles analysis says the atomic unit of DJing is two sources, tempo,
gain, a crossfader, and cueing — so that is exactly what ships first, with
AI-era automation (beat-grid, stems, harmonic mixing, recommendations) layered
on top one capability at a time.

## Quickstart

No build step, no install:

```sh
# option 1: just open it
open index.html            # macOS
# or double-click index.html in a file browser

# option 2: serve it
python3 -m http.server 8000
# then open http://localhost:8000
```

Option 1 (`file://`) plays fine, but browsers block `AudioWorklet` module
loads on an opaque origin — so key lock is unavailable and decks fall back
to classic varispeed tempo. Use option 2 for the full feature set.

## Features

- **Two decks** — load audio by click or drag & drop (MP3/WAV/OGG/FLAC/M4A,
  whatever the browser's `decodeAudioData` supports).
- **Transport** — play/pause, cue-to-start, click waveform to seek.
- **Tempo** — ±16% playback-rate slider per deck.
- **Key lock** — preserve pitch while tempo changes (WSOLA time-stretching
  in an `AudioWorklet`, see ADR-0003). Requires http(s); on `file://` the
  button is disabled and tempo stays varispeed.
- **Gain** — per-deck channel fader.
- **3-band EQ** — High/Mid/Low per deck (shelf 250 Hz / peak 1 kHz /
  shelf 4 kHz, ±26 dB isolator-style travel, double-click resets).
  See ADR-0005.
- **Crossfader** — equal-power law for constant loudness through the middle.
- **Waveform overview** with playhead per deck.
- **Auto BPM estimate + beat grid** — energy-flux autocorrelation, 60–180 BPM,
  no dependencies; grid ticks drawn on the waveform (see ADR-0001 / ADR-0002).
- **Key detection** — chromagram + Krumhansl–Schmuckler profiles → Camelot
  code shown next to BPM; green = mixes harmonically with the other deck,
  amber = clash (see ADR-0004).
- **Sync** — one click matches a deck's tempo and beat phase to the other deck
  (tempo limited to the ±16% slider range, like hardware).
- **Loop** — one click captures a beat-grid-quantized 4-beat (one bar)
  loop on either engine; the region highlights on the waveform and
  seeking outside it exits the loop (see ADR-0006); `½`/`2×` halve or
  double the armed loop in place (see ADR-0009).
- **Hot cues** — four pads per deck: click records a marker (amber tick
  on the waveform), click jumps, right-click clears; persisted per track
  in the library (see ADR-0010). `−1b`/`+1b` beside them beat-jump one
  beat of the grid (see ADR-0012).
- **Headphone cue (PFL)** — `Phones` button taps each deck pre-fader onto
  a cue bus; `Cue out` picks the output device (`setSinkId`, Chrome/Edge).
  See ADR-0007.
- **Library** — every loaded track is auto-saved to IndexedDB (audio +
  BPM/key analysis, soft-deletable); `→A`/`→B` reloads instantly with
  cached analysis, survives page reloads. Rows highlight green when the
  track fits a loaded deck (tempo within ±16% sync range + harmonic key)
  — see ADR-0008/0011.
- **Auto mix** — `Auto` button: at 16 beats before the playing deck
  ends, the other deck starts on its first beat, tempo-synced, and the
  crossfader rides across over 8 beats; one click per transition,
  click again to cancel mid-fade (see ADR-0013).
- **Set recording** — `Rec` button captures the master output to a
  `.webm` (opus) download via `MediaRecorder` on a MediaStream tap
  (see ADR-0014).
- **Master level meter** and master gain.
- **Keyboard** — `Q`/`P` toggle deck A/B, `←`/`→` move the crossfader,
  `0` centers it.

## Architecture

Single file (`index.html`), vanilla JS + Web Audio API:

```
WSOLA worklet (keylock) or BufferSource (fallback)
        ┬─> cueSend ──> cue bus ──> <audio setSinkId> (headphone cue)
        └─> deckGain ──> EQ(low→mid→high) ──> xfGain ──> masterGain ──> analyser ──> destination
```

Per deck, instantiated lazily on first play (browser autoplay policy requires a
user gesture before the `AudioContext` starts). The playback engine is chosen
once per deck at first load: `AudioWorklet` when the module can load
(http/https), `AudioBufferSourceNode` otherwise.

## Roadmap (deliberately not built yet)

Ordered by value per the ADR's automation layer:

1. ~~Beat-grid phase alignment + a sync button.~~ Done (ADR-0002).
2. ~~Keylock / master tempo.~~ Done (ADR-0003) — WSOLA in an AudioWorklet.
3. ~~Key detection + harmonic-mixing hints.~~ Done (ADR-0004) — chroma +
   Krumhansl–Schmuckler → Camelot compatibility.
3b. ~~3-band DJ EQ.~~ Done (ADR-0005) — pulled ahead of the library work
   as P1 core mixer functionality.
3c. ~~Beat-grid loop.~~ Done (ADR-0006/0009) — one-bar quantized loop on
   both engines, plus in-place ½/2× length cycling.
3d. ~~Headphone cue.~~ Done (ADR-0007) — pre-fader cue bus via
   MediaStream + `setSinkId`.
4. ~~Track library with persistence.~~ Done (ADR-0008) — IndexedDB,
   `id`/`created_at`/`updated_at`/`deleted_at`/`version` per record.
4b. ~~Hot cues.~~ Done (ADR-0010) — four per deck, persisted in the
   library. Beat-jump added in ADR-0012.
5. Stem separation (ML model, worker pipeline — the only remaining
   roadmap item).
6. ~~Recommendation / auto-mix assistance.~~ Done — harmonic-fit
   highlighting (ADR-0011) + one-click auto transitions (ADR-0013).

## Security

Local files only; no network calls, no telemetry, no secrets. Report
vulnerabilities per [SECURITY.md](SECURITY.md).
